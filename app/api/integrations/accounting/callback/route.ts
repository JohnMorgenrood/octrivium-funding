import { NextRequest, NextResponse } from 'next/server';
import { getAccountingClient, AccountingIntegration } from '@/lib/integrations/accounting';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/integrations/accounting/callback
 * OAuth callback for accounting software
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

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

    // Extract businessId and provider from state
    const [stateToken, businessId, provider] = state.split(':');

    if (!businessId || !provider) {
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/dashboard/revenue?error=invalid_state`
      );
    }

    // Verify state token
    const auditLog = await prisma.auditLog.findFirst({
      where: {
        action: 'ACCOUNTING_AUTH_INITIATED',
        entityId: businessId,
        createdAt: {
          gte: new Date(Date.now() - 10 * 60 * 1000),
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
    const accountingClient = getAccountingClient(provider as any);
    const tokenData = await accountingClient.exchangeCodeForToken(code);

    // Get organization info
    const orgInfo = await accountingClient.getOrganizationInfo(tokenData.accessToken);

    // Encrypt tokens
    const encryptionKey = process.env.ENCRYPTION_KEY!;
    const encryptedAccessToken = AccountingIntegration.encrypt(
      tokenData.accessToken,
      encryptionKey
    );
    const encryptedRefreshToken = AccountingIntegration.encrypt(
      tokenData.refreshToken,
      encryptionKey
    );

    // Create or update revenue connection
    const connection = await prisma.revenueConnection.upsert({
      where: {
        businessId_sourceType: {
          businessId,
          sourceType: 'ACCOUNTING',
        },
      },
      create: {
        businessId,
        sourceType: 'ACCOUNTING',
        provider: provider as any,
        isConnected: true,
        status: 'VERIFIED',
        accessToken: encryptedAccessToken,
        refreshToken: encryptedRefreshToken,
        tokenExpiresAt: new Date(Date.now() + tokenData.expiresIn * 1000),
        accountId: orgInfo.id,
        accountName: orgInfo.name,
        metadata: { currency: orgInfo.currency },
        connectedAt: new Date(),
        lastSyncAt: new Date(),
        lastSyncStatus: 'SUCCESS',
      },
      update: {
        provider: provider as any,
        isConnected: true,
        status: 'VERIFIED',
        accessToken: encryptedAccessToken,
        refreshToken: encryptedRefreshToken,
        tokenExpiresAt: new Date(Date.now() + tokenData.expiresIn * 1000),
        accountId: orgInfo.id,
        accountName: orgInfo.name,
        metadata: { currency: orgInfo.currency },
        connectedAt: new Date(),
        lastSyncAt: new Date(),
        lastSyncStatus: 'SUCCESS',
        errorCount: 0,
        lastError: null,
      },
    });

    // Log verification
    await prisma.verificationLog.create({
      data: {
        connectionId: connection.id,
        verificationType: 'ACCOUNTING_SYNC',
        status: 'SUCCESS',
        message: `Successfully connected ${provider}: ${orgInfo.name}`,
        dataFetched: { organizationId: orgInfo.id, organizationName: orgInfo.name },
      },
    });

    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/dashboard/revenue?success=accounting_connected&provider=${provider}`
    );
  } catch (error: any) {
    console.error('Accounting callback error:', error);
    
    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/dashboard/revenue?error=connection_failed`
    );
  }
}
