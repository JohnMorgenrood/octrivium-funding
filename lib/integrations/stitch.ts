/**
 * Stitch Bank Integration for South African Open Banking
 * Official Docs: https://stitch.money/docs
 */

import crypto from 'crypto';

export interface StitchConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  environment: 'sandbox' | 'production';
}

export interface StitchBankAccount {
  id: string;
  accountNumber: string;
  accountType: string;
  bankName: string;
  currency: string;
  currentBalance: number;
  availableBalance: number;
}

export interface StitchTransaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  balance: number;
  reference?: string;
  category?: string;
}

export class StitchClient {
  private config: StitchConfig;
  private baseUrl: string;

  constructor(config: StitchConfig) {
    this.config = config;
    this.baseUrl = config.environment === 'production' 
      ? 'https://api.stitch.money'
      : 'https://api.sandbox.stitch.money';
  }

  /**
   * Generate OAuth authorization URL
   */
  getAuthorizationUrl(state: string, businessId: string): string {
    const params = new URLSearchParams({
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUri,
      response_type: 'code',
      scope: 'accounts transactions balances',
      state: `${state}:${businessId}`, // Include businessId in state
    });

    return `${this.baseUrl}/connect/authorize?${params.toString()}`;
  }

  /**
   * Exchange authorization code for access token
   */
  async exchangeCodeForToken(code: string): Promise<{
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  }> {
    const response = await fetch(`${this.baseUrl}/connect/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(
          `${this.config.clientId}:${this.config.clientSecret}`
        ).toString('base64')}`,
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: this.config.redirectUri,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Stitch token exchange failed: ${error}`);
    }

    const data = await response.json();
    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresIn: data.expires_in,
    };
  }

  /**
   * Refresh access token
   */
  async refreshAccessToken(refreshToken: string): Promise<{
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  }> {
    const response = await fetch(`${this.baseUrl}/connect/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(
          `${this.config.clientId}:${this.config.clientSecret}`
        ).toString('base64')}`,
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Stitch token refresh failed: ${error}`);
    }

    const data = await response.json();
    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresIn: data.expires_in,
    };
  }

  /**
   * Get list of linked bank accounts
   */
  async getBankAccounts(accessToken: string): Promise<StitchBankAccount[]> {
    const response = await fetch(`${this.baseUrl}/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        query: `
          query GetBankAccounts {
            user {
              bankAccounts {
                id
                accountNumber
                accountType
                bankId
                name
                currency
                currentBalance
                availableBalance
              }
            }
          }
        `,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to fetch bank accounts: ${error}`);
    }

    const data = await response.json();
    
    if (data.errors) {
      throw new Error(`GraphQL errors: ${JSON.stringify(data.errors)}`);
    }

    return data.data.user.bankAccounts.map((account: any) => ({
      id: account.id,
      accountNumber: account.accountNumber,
      accountType: account.accountType,
      bankName: this.getBankName(account.bankId),
      currency: account.currency,
      currentBalance: account.currentBalance,
      availableBalance: account.availableBalance,
    }));
  }

  /**
   * Get transactions for a specific account
   */
  async getTransactions(
    accessToken: string,
    accountId: string,
    fromDate: string,
    toDate: string
  ): Promise<StitchTransaction[]> {
    const response = await fetch(`${this.baseUrl}/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        query: `
          query GetTransactions($accountId: ID!, $fromDate: Date!, $toDate: Date!) {
            user {
              bankAccount(id: $accountId) {
                transactions(from: $fromDate, to: $toDate) {
                  nodes {
                    id
                    date
                    description
                    amount
                    runningBalance
                    reference
                  }
                }
              }
            }
          }
        `,
        variables: {
          accountId,
          fromDate,
          toDate,
        },
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to fetch transactions: ${error}`);
    }

    const data = await response.json();
    
    if (data.errors) {
      throw new Error(`GraphQL errors: ${JSON.stringify(data.errors)}`);
    }

    return data.data.user.bankAccount.transactions.nodes.map((tx: any) => ({
      id: tx.id,
      date: tx.date,
      description: tx.description,
      amount: tx.amount,
      balance: tx.runningBalance,
      reference: tx.reference,
      category: this.categorizeTransaction(tx.description, tx.amount),
    }));
  }

  /**
   * Calculate monthly revenue from transactions
   */
  calculateMonthlyRevenue(transactions: StitchTransaction[]): number {
    return transactions
      .filter(tx => tx.amount > 0 && this.isRevenueTransaction(tx))
      .reduce((sum, tx) => sum + tx.amount, 0);
  }

  /**
   * Determine if transaction is revenue (credit/deposit)
   */
  private isRevenueTransaction(transaction: StitchTransaction): boolean {
    const description = transaction.description.toLowerCase();
    
    // Filter out internal transfers, refunds, loans
    const excludePatterns = [
      'transfer',
      'loan',
      'credit card',
      'refund',
      'reversal',
      'atm',
      'withdrawal',
    ];

    for (const pattern of excludePatterns) {
      if (description.includes(pattern)) {
        return false;
      }
    }

    // Must be positive amount (credit)
    return transaction.amount > 0;
  }

  /**
   * Categorize transaction based on description
   */
  private categorizeTransaction(description: string, amount: number): string {
    const desc = description.toLowerCase();

    if (amount > 0) {
      if (desc.includes('payment') || desc.includes('deposit')) return 'Revenue';
      if (desc.includes('transfer')) return 'Transfer In';
      if (desc.includes('refund')) return 'Refund';
      return 'Other Income';
    } else {
      if (desc.includes('salary') || desc.includes('payroll')) return 'Payroll';
      if (desc.includes('rent')) return 'Rent';
      if (desc.includes('utility') || desc.includes('electricity')) return 'Utilities';
      if (desc.includes('supplier') || desc.includes('purchase')) return 'Supplies';
      return 'Other Expense';
    }
  }

  /**
   * Map bank ID to bank name
   */
  private getBankName(bankId: string): string {
    const bankMap: Record<string, string> = {
      'absa': 'ABSA Bank',
      'capitec': 'Capitec Bank',
      'fnb': 'First National Bank',
      'nedbank': 'Nedbank',
      'standard_bank': 'Standard Bank',
      'investec': 'Investec',
      'discovery': 'Discovery Bank',
      'tymebank': 'TymeBank',
      'bidvest': 'Bidvest Bank',
    };

    return bankMap[bankId] || bankId;
  }

  /**
   * Encrypt sensitive data
   */
  static encrypt(text: string, key: string): string {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(
      'aes-256-gcm',
      Buffer.from(key, 'hex'),
      iv
    );
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const authTag = cipher.getAuthTag();
    
    return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
  }

  /**
   * Decrypt sensitive data
   */
  static decrypt(encryptedText: string, key: string): string {
    const parts = encryptedText.split(':');
    const iv = Buffer.from(parts[0], 'hex');
    const authTag = Buffer.from(parts[1], 'hex');
    const encrypted = parts[2];
    
    const decipher = crypto.createDecipheriv(
      'aes-256-gcm',
      Buffer.from(key, 'hex'),
      iv
    );
    decipher.setAuthTag(authTag);
    
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  }
}

/**
 * Get configured Stitch client
 */
export function getStitchClient(): StitchClient {
  const config: StitchConfig = {
    clientId: process.env.STITCH_CLIENT_ID!,
    clientSecret: process.env.STITCH_CLIENT_SECRET!,
    redirectUri: process.env.STITCH_REDIRECT_URI || `${process.env.NEXTAUTH_URL}/api/integrations/stitch/callback`,
    environment: process.env.STITCH_ENVIRONMENT as 'sandbox' | 'production' || 'sandbox',
  };

  if (!config.clientId || !config.clientSecret) {
    throw new Error('Stitch API credentials not configured');
  }

  return new StitchClient(config);
}
