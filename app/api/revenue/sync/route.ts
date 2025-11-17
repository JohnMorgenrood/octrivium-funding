import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getStitchClient, StitchClient } from '@/lib/integrations/stitch';
import { getAccountingClient, AccountingIntegration } from '@/lib/integrations/accounting';

/**
 * POST /api/revenue/sync
 * Manually trigger revenue sync for current business
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== 'BUSINESS') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const business = await prisma.business.findFirst({
      where: { userId: session.user.id },
      include: {
        revenueConnections: {
          where: { isConnected: true },
        },
        deals: {
          where: { status: { in: ['ACTIVE', 'REPAYING'] } },
          select: { id: true, revenueSharePercentage: true },
        },
      },
    });

    if (!business) {
      return NextResponse.json(
        { error: 'Business not found' },
        { status: 404 }
      );
    }

    if (business.revenueConnections.length === 0) {
      return NextResponse.json(
        { error: 'No revenue connections configured' },
        { status: 400 }
      );
    }

    const encryptionKey = process.env.ENCRYPTION_KEY!;
    const currentMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const results: any[] = [];

    // Sync each connection
    for (const connection of business.revenueConnections) {
      try {
        let revenue = 0;

        if (connection.sourceType === 'BANK_FEED') {
          revenue = await syncBankFeed(connection, currentMonth, encryptionKey);
        } else if (connection.sourceType === 'ACCOUNTING') {
          revenue = await syncAccounting(connection, currentMonth, encryptionKey);
        }

        results.push({
          sourceType: connection.sourceType,
          revenue,
          status: 'SUCCESS',
        });

        await prisma.revenueConnection.update({
          where: { id: connection.id },
          data: {
            lastSyncAt: new Date(),
            lastSyncStatus: 'SUCCESS',
            errorCount: 0,
            lastError: null,
          },
        });
      } catch (error: any) {
        console.error(`Sync failed for ${connection.sourceType}:`, error);
        
        results.push({
          sourceType: connection.sourceType,
          status: 'FAILED',
          error: error.message,
        });

        await prisma.revenueConnection.update({
          where: { id: connection.id },
          data: {
            lastSyncStatus: 'FAILED',
            lastError: error.message,
            errorCount: { increment: 1 },
          },
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Sync completed',
      results,
    });
  } catch (error: any) {
    console.error('Sync failed:', error);
    return NextResponse.json(
      { error: 'Sync failed', details: error.message },
      { status: 500 }
    );
  }
}

async function syncBankFeed(connection: any, month: Date, encryptionKey: string): Promise<number> {
  const stitchClient = getStitchClient();
  let accessToken = StitchClient.decrypt(connection.accessToken, encryptionKey);

  // Refresh token if expired
  if (new Date() >= new Date(connection.tokenExpiresAt)) {
    const refreshToken = StitchClient.decrypt(connection.refreshToken, encryptionKey);
    const newTokens = await stitchClient.refreshAccessToken(refreshToken);
    accessToken = newTokens.accessToken;

    await prisma.revenueConnection.update({
      where: { id: connection.id },
      data: {
        accessToken: StitchClient.encrypt(newTokens.accessToken, encryptionKey),
        refreshToken: StitchClient.encrypt(newTokens.refreshToken, encryptionKey),
        tokenExpiresAt: new Date(Date.now() + newTokens.expiresIn * 1000),
      },
    });
  }

  const bankAccounts = await prisma.bankAccount.findMany({
    where: { connectionId: connection.id, isActive: true },
  });

  let totalRevenue = 0;

  for (const account of bankAccounts) {
    const startDate = new Date(month.getFullYear(), month.getMonth(), 1);
    const endDate = new Date(month.getFullYear(), month.getMonth() + 1, 0);

    const transactions = await stitchClient.getTransactions(
      accessToken,
      account.accountId,
      startDate.toISOString().split('T')[0],
      endDate.toISOString().split('T')[0]
    );

    totalRevenue += stitchClient.calculateMonthlyRevenue(transactions);
  }

  return totalRevenue;
}

async function syncAccounting(connection: any, month: Date, encryptionKey: string): Promise<number> {
  const accountingClient = getAccountingClient(connection.provider);
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

  const revenueData = await accountingClient.getMonthlyRevenue(accessToken, month);
  return revenueData.totalRevenue;
}
