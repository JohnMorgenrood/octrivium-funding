import { NextRequest, NextResponse } from 'next/server';
import { getStitchClient, StitchClient } from '@/lib/integrations/stitch';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/integrations/stitch/callback
 * OAuth callback from Stitch
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    // Handle OAuth errors
    if (error) {
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/dashboard/revenue?error=${error}`
      );
    }

    if (!code || !state) {
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/dashboard/revenue?error=missing_params`
      );
    }

    // Extract businessId from state
    const [stateToken, businessId] = state.split(':');

    if (!businessId) {
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/dashboard/revenue?error=invalid_state`
      );
    }

    // Verify state token exists in audit logs (within last 10 minutes)
    const auditLog = await prisma.auditLog.findFirst({
      where: {
        action: 'STITCH_AUTH_INITIATED',
        entityId: businessId,
        createdAt: {
          gte: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes ago
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!auditLog || (auditLog.changes as any)?.state !== stateToken) {
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/dashboard/revenue?error=invalid_state`
      );
    }

    // Exchange code for tokens
    const stitchClient = getStitchClient();
    const tokenData = await stitchClient.exchangeCodeForToken(code);

    // Encrypt tokens
    const encryptionKey = process.env.ENCRYPTION_KEY!;
    const encryptedAccessToken = StitchClient.encrypt(
      tokenData.accessToken,
      encryptionKey
    );
    const encryptedRefreshToken = StitchClient.encrypt(
      tokenData.refreshToken,
      encryptionKey
    );

    // Fetch bank accounts
    const bankAccounts = await stitchClient.getBankAccounts(tokenData.accessToken);

    // Create or update revenue connection
    const connection = await prisma.revenueConnection.upsert({
      where: {
        businessId_sourceType: {
          businessId,
          sourceType: 'BANK_FEED',
        },
      },
      create: {
        businessId,
        sourceType: 'BANK_FEED',
        isConnected: true,
        status: 'VERIFIED',
        accessToken: encryptedAccessToken,
        refreshToken: encryptedRefreshToken,
        tokenExpiresAt: new Date(Date.now() + tokenData.expiresIn * 1000),
        accountName: bankAccounts[0]?.bankName || 'Bank Account',
        connectedAt: new Date(),
        lastSyncAt: new Date(),
        lastSyncStatus: 'SUCCESS',
      },
      update: {
        isConnected: true,
        status: 'VERIFIED',
        accessToken: encryptedAccessToken,
        refreshToken: encryptedRefreshToken,
        tokenExpiresAt: new Date(Date.now() + tokenData.expiresIn * 1000),
        accountName: bankAccounts[0]?.bankName || 'Bank Account',
        connectedAt: new Date(),
        lastSyncAt: new Date(),
        lastSyncStatus: 'SUCCESS',
        errorCount: 0,
        lastError: null,
      },
    });

    // Create bank account records
    for (const account of bankAccounts) {
      await prisma.bankAccount.upsert({
        where: {
          connectionId_accountId: {
            connectionId: connection.id,
            accountId: account.id,
          },
        },
        create: {
          connectionId: connection.id,
          accountId: account.id,
          accountName: account.bankName,
          accountNumber: account.accountNumber,
          accountType: account.accountType,
          bankName: account.bankName,
          currency: account.currency,
          currentBalance: account.currentBalance,
          availableBalance: account.availableBalance,
          isActive: true,
        },
        update: {
          accountName: account.bankName,
          accountNumber: account.accountNumber,
          accountType: account.accountType,
          bankName: account.bankName,
          currentBalance: account.currentBalance,
          availableBalance: account.availableBalance,
          isActive: true,
        },
      });
    }

    // Log verification
    await prisma.verificationLog.create({
      data: {
        connectionId: connection.id,
        verificationType: 'BANK_SYNC',
        status: 'SUCCESS',
        message: `Successfully connected ${bankAccounts.length} bank account(s)`,
        recordsProcessed: bankAccounts.length,
      },
    });

    // Redirect to dashboard with success
    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/dashboard/revenue?success=bank_connected`
    );
  } catch (error: any) {
    console.error('Stitch callback error:', error);
    
    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/dashboard/revenue?error=connection_failed`
    );
  }
}
