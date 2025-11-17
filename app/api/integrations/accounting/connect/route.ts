import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getAccountingClient, AccountingProvider } from '@/lib/integrations/accounting';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

/**
 * GET /api/integrations/accounting/connect?provider=XERO
 * Initiate accounting software OAuth flow
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== 'BUSINESS') {
      return NextResponse.json(
        { error: 'Unauthorized. Business account required.' },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const provider = searchParams.get('provider') as AccountingProvider;

    if (!provider || !['XERO', 'SAGE_BUSINESS_CLOUD', 'QUICKBOOKS_ONLINE', 'ZOHO_BOOKS'].includes(provider)) {
      return NextResponse.json(
        { error: 'Invalid or missing provider' },
        { status: 400 }
      );
    }

    // Get business ID
    const business = await prisma.business.findFirst({
      where: { userId: session.user.id },
      select: { id: true },
    });

    if (!business) {
      return NextResponse.json(
        { error: 'Business profile not found' },
        { status: 404 }
      );
    }

    // Generate state token
    const state = crypto.randomBytes(32).toString('hex');

    // Store state
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'ACCOUNTING_AUTH_INITIATED',
        entity: 'REVENUE_CONNECTION',
        entityId: business.id,
        changes: { state, provider, timestamp: new Date().toISOString() },
      },
    });

    // Get authorization URL
    const accountingClient = getAccountingClient(provider);
    const authUrl = accountingClient.getAuthorizationUrl(state, business.id);

    return NextResponse.json({
      authUrl,
      state,
      provider,
    });
  } catch (error: any) {
    console.error('Accounting connect error:', error);
    return NextResponse.json(
      { error: 'Failed to initiate accounting connection', details: error.message },
      { status: 500 }
    );
  }
}
