/**
 * Revenue Verification Cron Job
 * Runs monthly to fetch revenue, cross-check data, detect fraud, and schedule payouts
 * 
 * Setup: Configure this to run via Vercel Cron or external cron service
 * Schedule: Run on 1st of each month at 2 AM
 */

import { prisma } from '@/lib/prisma';
import { getStitchClient, StitchClient } from '@/lib/integrations/stitch';
import { getAccountingClient, AccountingIntegration } from '@/lib/integrations/accounting';

export interface RevenueVerificationResult {
  dealId: string;
  month: Date;
  bankRevenue: number;
  accountingRevenue: number;
  verifiedRevenue: number;
  hasDiscrepancy: boolean;
  discrepancyAmount: number;
  status: 'VERIFIED' | 'FLAGGED' | 'FAILED';
  revenueShareAmount: number;
}

/**
 * Main cron job entry point
 */
export async function runRevenueVerificationCron() {
  console.log('[CRON] Starting monthly revenue verification...');

  const results: RevenueVerificationResult[] = [];
  const previousMonth = getPreviousMonth();

  try {
    // Get all active deals with revenue connections
    const activeDeals = await prisma.deal.findMany({
      where: {
        status: { in: ['ACTIVE', 'REPAYING'] },
      },
      include: {
        business: {
          include: {
            revenueConnections: {
              where: {
                isConnected: true,
                status: { in: ['VERIFIED', 'PENDING'] },
              },
            },
          },
        },
      },
    });

    console.log(`[CRON] Processing ${activeDeals.length} active deals`);

    for (const deal of activeDeals) {
      try {
        const result = await verifyDealRevenue(deal, previousMonth);
        results.push(result);

        // Create revenue record
        await createRevenueRecord(result);

        // Schedule payout if verified
        if (result.status === 'VERIFIED') {
          await schedulePayoutForDeal(deal.id, result);
        }
      } catch (error: any) {
        console.error(`[CRON] Failed to verify deal ${deal.id}:`, error);
        results.push({
          dealId: deal.id,
          month: previousMonth,
          bankRevenue: 0,
          accountingRevenue: 0,
          verifiedRevenue: 0,
          hasDiscrepancy: true,
          discrepancyAmount: 0,
          status: 'FAILED',
          revenueShareAmount: 0,
        });
      }
    }

    // Generate summary report
    const summary = {
      totalDeals: results.length,
      verified: results.filter(r => r.status === 'VERIFIED').length,
      flagged: results.filter(r => r.status === 'FLAGGED').length,
      failed: results.filter(r => r.status === 'FAILED').length,
      totalRevenueShareAmount: results.reduce((sum, r) => sum + r.revenueShareAmount, 0),
    };

    console.log('[CRON] Revenue verification completed:', summary);

    return { success: true, summary, results };
  } catch (error: any) {
    console.error('[CRON] Revenue verification failed:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Verify revenue for a single deal
 */
async function verifyDealRevenue(deal: any, month: Date): Promise<RevenueVerificationResult> {
  let bankRevenue = 0;
  let accountingRevenue = 0;
  const encryptionKey = process.env.ENCRYPTION_KEY!;

  // Fetch bank feed revenue
  const bankConnection = deal.business.revenueConnections.find(
    (c: any) => c.sourceType === 'BANK_FEED'
  );

  if (bankConnection) {
    try {
      bankRevenue = await fetchBankRevenue(bankConnection, month, encryptionKey);
    } catch (error: any) {
      console.error(`[CRON] Bank fetch failed for deal ${deal.id}:`, error);
      await logVerificationError(bankConnection.id, 'BANK_SYNC', error.message);
    }
  }

  // Fetch accounting software revenue
  const accountingConnection = deal.business.revenueConnections.find(
    (c: any) => c.sourceType === 'ACCOUNTING'
  );

  if (accountingConnection) {
    try {
      accountingRevenue = await fetchAccountingRevenue(accountingConnection, month, encryptionKey);
    } catch (error: any) {
      console.error(`[CRON] Accounting fetch failed for deal ${deal.id}:`, error);
      await logVerificationError(accountingConnection.id, 'ACCOUNTING_SYNC', error.message);
    }
  }

  // Cross-reference and detect discrepancies
  const { verifiedRevenue, hasDiscrepancy, discrepancyAmount, status } = crossReferenceRevenue(
    bankRevenue,
    accountingRevenue
  );

  // Calculate revenue share amount
  const revenueSharePercentage = Number(deal.revenueSharePercentage);
  const revenueShareAmount = (verifiedRevenue * revenueSharePercentage) / 100;

  return {
    dealId: deal.id,
    month,
    bankRevenue,
    accountingRevenue,
    verifiedRevenue,
    hasDiscrepancy,
    discrepancyAmount,
    status,
    revenueShareAmount,
  };
}

/**
 * Fetch revenue from bank feed
 */
async function fetchBankRevenue(
  connection: any,
  month: Date,
  encryptionKey: string
): Promise<number> {
  const stitchClient = getStitchClient();

  // Decrypt access token
  let accessToken = StitchClient.decrypt(connection.accessToken, encryptionKey);

  // Check if token expired and refresh if needed
  if (new Date() >= new Date(connection.tokenExpiresAt)) {
    const refreshToken = StitchClient.decrypt(connection.refreshToken, encryptionKey);
    const newTokens = await stitchClient.refreshAccessToken(refreshToken);

    accessToken = newTokens.accessToken;

    // Update connection with new tokens
    await prisma.revenueConnection.update({
      where: { id: connection.id },
      data: {
        accessToken: StitchClient.encrypt(newTokens.accessToken, encryptionKey),
        refreshToken: StitchClient.encrypt(newTokens.refreshToken, encryptionKey),
        tokenExpiresAt: new Date(Date.now() + newTokens.expiresIn * 1000),
      },
    });
  }

  // Fetch bank accounts
  const bankAccounts = await prisma.bankAccount.findMany({
    where: { connectionId: connection.id, isActive: true },
  });

  let totalRevenue = 0;

  // Fetch transactions for each account
  for (const account of bankAccounts) {
    const startDate = new Date(month.getFullYear(), month.getMonth(), 1);
    const endDate = new Date(month.getFullYear(), month.getMonth() + 1, 0);

    const transactions = await stitchClient.getTransactions(
      accessToken,
      account.accountId,
      startDate.toISOString().split('T')[0],
      endDate.toISOString().split('T')[0]
    );

    // Store transactions
    for (const tx of transactions) {
      await prisma.bankTransaction.upsert({
        where: {
          bankAccountId_transactionId: {
            bankAccountId: account.id,
            transactionId: tx.id,
          },
        },
        create: {
          bankAccountId: account.id,
          transactionId: tx.id,
          date: new Date(tx.date),
          description: tx.description,
          amount: tx.amount,
          balance: tx.balance,
          reference: tx.reference,
          category: tx.category,
          isRevenue: tx.amount > 0 && tx.category === 'Revenue',
        },
        update: {
          amount: tx.amount,
          balance: tx.balance,
          category: tx.category,
        },
      });
    }

    // Calculate revenue
    const monthRevenue = stitchClient.calculateMonthlyRevenue(transactions);
    totalRevenue += monthRevenue;
  }

  // Update connection sync status
  await prisma.revenueConnection.update({
    where: { id: connection.id },
    data: {
      lastSyncAt: new Date(),
      lastSyncStatus: 'SUCCESS',
      errorCount: 0,
      lastError: null,
    },
  });

  // Log successful sync
  await prisma.verificationLog.create({
    data: {
      connectionId: connection.id,
      verificationType: 'BANK_SYNC',
      status: 'SUCCESS',
      message: `Fetched ${bankAccounts.length} bank account(s), calculated R${totalRevenue.toFixed(2)} revenue`,
      recordsProcessed: bankAccounts.length,
      dataFetched: { totalRevenue, month: month.toISOString() },
    },
  });

  return totalRevenue;
}

/**
 * Fetch revenue from accounting software
 */
async function fetchAccountingRevenue(
  connection: any,
  month: Date,
  encryptionKey: string
): Promise<number> {
  const accountingClient = getAccountingClient(connection.provider);

  // Decrypt access token
  let accessToken = AccountingIntegration.decrypt(connection.accessToken, encryptionKey);

  // Refresh token if expired
  if (new Date() >= new Date(connection.tokenExpiresAt)) {
    const refreshToken = AccountingIntegration.decrypt(connection.refreshToken, encryptionKey);
    const newTokens = await accountingClient.refreshAccessToken(refreshToken);

    accessToken = newTokens.accessToken;

    await prisma.revenueConnection.update({
      where: { id: connection.id },
      data: {
        accessToken: AccountingIntegration.encrypt(newTokens.accessToken, encryptionKey),
        refreshToken: AccountingIntegration.encrypt(newTokens.refreshToken, encryptionKey),
        tokenExpiresAt: new Date(Date.now() + newTokens.expiresIn * 1000),
      },
    });
  }

  // Fetch monthly revenue data
  const revenueData = await accountingClient.getMonthlyRevenue(accessToken, month);

  // Update connection
  await prisma.revenueConnection.update({
    where: { id: connection.id },
    data: {
      lastSyncAt: new Date(),
      lastSyncStatus: 'SUCCESS',
      errorCount: 0,
      lastError: null,
    },
  });

  // Log successful sync
  await prisma.verificationLog.create({
    data: {
      connectionId: connection.id,
      verificationType: 'ACCOUNTING_SYNC',
      status: 'SUCCESS',
      message: `Fetched accounting data: R${revenueData.totalRevenue.toFixed(2)} revenue`,
      dataFetched: revenueData,
    },
  });

  return revenueData.totalRevenue;
}

/**
 * Cross-reference bank and accounting revenue
 */
function crossReferenceRevenue(
  bankRevenue: number,
  accountingRevenue: number
): {
  verifiedRevenue: number;
  hasDiscrepancy: boolean;
  discrepancyAmount: number;
  status: 'VERIFIED' | 'FLAGGED';
} {
  const DISCREPANCY_THRESHOLD = 0.1; // 10% tolerance

  // If only one source available, use it
  if (bankRevenue > 0 && accountingRevenue === 0) {
    return {
      verifiedRevenue: bankRevenue,
      hasDiscrepancy: false,
      discrepancyAmount: 0,
      status: 'VERIFIED',
    };
  }

  if (accountingRevenue > 0 && bankRevenue === 0) {
    return {
      verifiedRevenue: accountingRevenue,
      hasDiscrepancy: false,
      discrepancyAmount: 0,
      status: 'VERIFIED',
    };
  }

  // Both sources available - compare
  const discrepancyAmount = Math.abs(bankRevenue - accountingRevenue);
  const averageRevenue = (bankRevenue + accountingRevenue) / 2;
  const discrepancyPercentage = discrepancyAmount / averageRevenue;

  const hasDiscrepancy = discrepancyPercentage > DISCREPANCY_THRESHOLD;

  return {
    verifiedRevenue: hasDiscrepancy ? Math.min(bankRevenue, accountingRevenue) : averageRevenue,
    hasDiscrepancy,
    discrepancyAmount,
    status: hasDiscrepancy ? 'FLAGGED' : 'VERIFIED',
  };
}

/**
 * Create revenue record in database
 */
async function createRevenueRecord(result: RevenueVerificationResult) {
  const deal = await prisma.deal.findUnique({
    where: { id: result.dealId },
    include: {
      business: {
        include: {
          revenueConnections: { where: { isConnected: true } },
        },
      },
    },
  });

  if (!deal) return;

  const primaryConnection = deal.business.revenueConnections[0];
  if (!primaryConnection) return;

  await prisma.revenueRecord.create({
    data: {
      dealId: result.dealId,
      connectionId: primaryConnection.id,
      month: result.month,
      year: result.month.getFullYear(),
      totalRevenue: result.verifiedRevenue,
      verifiedRevenue: result.verifiedRevenue,
      revenueShareAmount: result.revenueShareAmount,
      sourceType: primaryConnection.sourceType,
      sourceData: {
        bankRevenue: result.bankRevenue,
        accountingRevenue: result.accountingRevenue,
      },
      status: result.status === 'VERIFIED' ? 'VERIFIED' : 'FLAGGED',
      hasDiscrepancy: result.hasDiscrepancy,
      discrepancyAmount: result.discrepancyAmount,
      discrepancyNotes: result.hasDiscrepancy
        ? `Discrepancy detected: Bank R${result.bankRevenue.toFixed(2)} vs Accounting R${result.accountingRevenue.toFixed(2)}`
        : null,
      verifiedAt: result.status === 'VERIFIED' ? new Date() : null,
    },
  });
}

/**
 * Schedule payout for verified revenue
 */
async function schedulePayoutForDeal(dealId: string, result: RevenueVerificationResult) {
  const platformFeePercentage = 0.05; // 5% platform fee
  const platformFee = result.revenueShareAmount * platformFeePercentage;
  const netPayoutAmount = result.revenueShareAmount - platformFee;

  const investments = await prisma.investment.findMany({
    where: { dealId, status: 'ACTIVE' },
  });

  await prisma.payoutSchedule.create({
    data: {
      dealId,
      month: result.month,
      totalRevenue: result.verifiedRevenue,
      revenueShareAmount: result.revenueShareAmount,
      platformFee,
      netPayoutAmount,
      status: 'SCHEDULED',
      scheduledDate: new Date(result.month.getFullYear(), result.month.getMonth() + 1, 5), // 5th of next month
      investorCount: investments.length,
      revenueRecordIds: [], // Will be populated later
    },
  });
}

/**
 * Log verification error
 */
async function logVerificationError(connectionId: string, type: string, error: string) {
  await prisma.verificationLog.create({
    data: {
      connectionId,
      verificationType: type,
      status: 'FAILED',
      message: 'Verification failed',
      errorDetails: error,
    },
  });

  await prisma.revenueConnection.update({
    where: { id: connectionId },
    data: {
      lastSyncStatus: 'FAILED',
      lastError: error,
      errorCount: { increment: 1 },
    },
  });
}

/**
 * Get previous month date
 */
function getPreviousMonth(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() - 1, 1);
}
