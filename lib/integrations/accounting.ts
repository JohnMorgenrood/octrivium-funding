/**
 * Accounting Software Integration Layer
 * Supports: Sage Business Cloud, Xero, QuickBooks Online, Zoho Books
 */

import crypto from 'crypto';

export type AccountingProvider = 'SAGE_BUSINESS_CLOUD' | 'XERO' | 'QUICKBOOKS_ONLINE' | 'ZOHO_BOOKS';

export interface AccountingConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  scopes: string[];
}

export interface RevenueData {
  month: Date;
  totalRevenue: number;
  totalExpenses: number;
  netIncome: number;
  invoicesCount: number;
  invoicesPaid: number;
  invoicesUnpaid: number;
  cashFlow: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  date: Date;
  dueDate: Date;
  customer: string;
  amount: number;
  status: 'PAID' | 'UNPAID' | 'OVERDUE' | 'DRAFT';
  paidDate?: Date;
}

export abstract class AccountingIntegration {
  protected provider: AccountingProvider;
  protected config: AccountingConfig;
  protected baseUrl: string;

  constructor(provider: AccountingProvider, config: AccountingConfig, baseUrl: string) {
    this.provider = provider;
    this.config = config;
    this.baseUrl = baseUrl;
  }

  abstract getAuthorizationUrl(state: string, businessId: string): string;
  abstract exchangeCodeForToken(code: string): Promise<{
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  }>;
  abstract refreshAccessToken(refreshToken: string): Promise<{
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  }>;
  abstract getOrganizationInfo(accessToken: string): Promise<{
    id: string;
    name: string;
    currency: string;
  }>;
  abstract getMonthlyRevenue(accessToken: string, month: Date): Promise<RevenueData>;
  abstract getInvoices(accessToken: string, fromDate: Date, toDate: Date): Promise<Invoice[]>;

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
 * Xero Integration
 * Docs: https://developer.xero.com/documentation/
 */
export class XeroIntegration extends AccountingIntegration {
  constructor(config: AccountingConfig) {
    super('XERO', config, 'https://api.xero.com/api.xro/2.0');
  }

  getAuthorizationUrl(state: string, businessId: string): string {
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUri,
      scope: this.config.scopes.join(' '),
      state: `${state}:${businessId}:XERO`,
    });

    return `https://login.xero.com/identity/connect/authorize?${params.toString()}`;
  }

  async exchangeCodeForToken(code: string) {
    const response = await fetch('https://identity.xero.com/connect/token', {
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
      throw new Error(`Xero token exchange failed: ${await response.text()}`);
    }

    const data = await response.json();
    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresIn: data.expires_in,
    };
  }

  async refreshAccessToken(refreshToken: string) {
    const response = await fetch('https://identity.xero.com/connect/token', {
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
      throw new Error(`Xero token refresh failed: ${await response.text()}`);
    }

    const data = await response.json();
    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresIn: data.expires_in,
    };
  }

  async getOrganizationInfo(accessToken: string) {
    const connectionsResponse = await fetch('https://api.xero.com/connections', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!connectionsResponse.ok) {
      throw new Error('Failed to get Xero connections');
    }

    const connections = await connectionsResponse.json();
    const tenantId = connections[0]?.tenantId;

    if (!tenantId) {
      throw new Error('No Xero tenant found');
    }

    const orgResponse = await fetch(`${this.baseUrl}/Organisation`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Xero-tenant-id': tenantId,
      },
    });

    if (!orgResponse.ok) {
      throw new Error('Failed to get organization info');
    }

    const orgData = await orgResponse.json();
    const org = orgData.Organisations[0];

    return {
      id: tenantId,
      name: org.Name,
      currency: org.BaseCurrency,
    };
  }

  async getMonthlyRevenue(accessToken: string, month: Date): Promise<RevenueData> {
    const connections = await (await fetch('https://api.xero.com/connections', {
      headers: { 'Authorization': `Bearer ${accessToken}` },
    })).json();

    const tenantId = connections[0]?.tenantId;

    const startDate = new Date(month.getFullYear(), month.getMonth(), 1);
    const endDate = new Date(month.getFullYear(), month.getMonth() + 1, 0);

    // Get profit & loss report
    const plResponse = await fetch(
      `${this.baseUrl}/Reports/ProfitAndLoss?fromDate=${startDate.toISOString().split('T')[0]}&toDate=${endDate.toISOString().split('T')[0]}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Xero-tenant-id': tenantId,
        },
      }
    );

    if (!plResponse.ok) {
      throw new Error('Failed to fetch P&L report');
    }

    const plData = await plResponse.json();
    const report = plData.Reports[0];

    // Parse revenue and expenses from report
    let totalRevenue = 0;
    let totalExpenses = 0;

    for (const row of report.Rows) {
      if (row.RowType === 'Row' && row.Cells) {
        const title = row.Cells[0]?.Value?.toLowerCase() || '';
        const value = parseFloat(row.Cells[1]?.Value || '0');

        if (title.includes('income') || title.includes('revenue') || title.includes('sales')) {
          totalRevenue += value;
        } else if (title.includes('expense') || title.includes('cost')) {
          totalExpenses += value;
        }
      }
    }

    // Get invoices for the month
    const invoicesResponse = await fetch(
      `${this.baseUrl}/Invoices?where=Type=="ACCREC"AND Date>=${startDate.toISOString().split('T')[0]}AND Date<=${endDate.toISOString().split('T')[0]}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Xero-tenant-id': tenantId,
        },
      }
    );

    const invoicesData = await invoicesResponse.json();
    const invoices = invoicesData.Invoices || [];

    return {
      month,
      totalRevenue,
      totalExpenses,
      netIncome: totalRevenue - totalExpenses,
      invoicesCount: invoices.length,
      invoicesPaid: invoices.filter((i: any) => i.Status === 'PAID').length,
      invoicesUnpaid: invoices.filter((i: any) => i.Status !== 'PAID').length,
      cashFlow: totalRevenue - totalExpenses,
    };
  }

  async getInvoices(accessToken: string, fromDate: Date, toDate: Date): Promise<Invoice[]> {
    const connections = await (await fetch('https://api.xero.com/connections', {
      headers: { 'Authorization': `Bearer ${accessToken}` },
    })).json();

    const tenantId = connections[0]?.tenantId;

    const response = await fetch(
      `${this.baseUrl}/Invoices?where=Type=="ACCREC"AND Date>=${fromDate.toISOString().split('T')[0]}AND Date<=${toDate.toISOString().split('T')[0]}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Xero-tenant-id': tenantId,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch invoices');
    }

    const data = await response.json();

    return data.Invoices.map((invoice: any) => ({
      id: invoice.InvoiceID,
      invoiceNumber: invoice.InvoiceNumber,
      date: new Date(invoice.Date),
      dueDate: new Date(invoice.DueDate),
      customer: invoice.Contact.Name,
      amount: invoice.Total,
      status: invoice.Status,
      paidDate: invoice.FullyPaidOnDate ? new Date(invoice.FullyPaidOnDate) : undefined,
    }));
  }
}

/**
 * Get accounting integration client
 */
export function getAccountingClient(provider: AccountingProvider): AccountingIntegration {
  const configs: Record<AccountingProvider, AccountingConfig> = {
    XERO: {
      clientId: process.env.XERO_CLIENT_ID!,
      clientSecret: process.env.XERO_CLIENT_SECRET!,
      redirectUri: `${process.env.NEXTAUTH_URL}/api/integrations/accounting/callback`,
      scopes: ['accounting.transactions', 'accounting.reports.read', 'accounting.contacts'],
    },
    SAGE_BUSINESS_CLOUD: {
      clientId: process.env.SAGE_CLIENT_ID!,
      clientSecret: process.env.SAGE_CLIENT_SECRET!,
      redirectUri: `${process.env.NEXTAUTH_URL}/api/integrations/accounting/callback`,
      scopes: ['full_access'],
    },
    QUICKBOOKS_ONLINE: {
      clientId: process.env.QUICKBOOKS_CLIENT_ID!,
      clientSecret: process.env.QUICKBOOKS_CLIENT_SECRET!,
      redirectUri: `${process.env.NEXTAUTH_URL}/api/integrations/accounting/callback`,
      scopes: ['com.intuit.quickbooks.accounting'],
    },
    ZOHO_BOOKS: {
      clientId: process.env.ZOHO_CLIENT_ID!,
      clientSecret: process.env.ZOHO_CLIENT_SECRET!,
      redirectUri: `${process.env.NEXTAUTH_URL}/api/integrations/accounting/callback`,
      scopes: ['ZohoBooks.fullaccess.all'],
    },
  };

  const config = configs[provider];

  if (!config.clientId || !config.clientSecret) {
    throw new Error(`${provider} credentials not configured`);
  }

  // For now, only Xero is fully implemented
  if (provider === 'XERO') {
    return new XeroIntegration(config);
  }

  // TODO: Implement other providers
  throw new Error(`${provider} integration not yet implemented`);
}
