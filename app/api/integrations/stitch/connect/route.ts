import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getStitchClient } from '@/lib/integrations/stitch';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

/**
 * GET /api/integrations/stitch/connect
 * Initiate Stitch OAuth flow
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

    // Generate state token for CSRF protection
    const state = crypto.randomBytes(32).toString('hex');

    // Store state in session or database temporarily
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'STITCH_AUTH_INITIATED',
        entity: 'REVENUE_CONNECTION',
        entityId: business.id,
        changes: { state, timestamp: new Date().toISOString() },
      },
    });

    // Get Stitch authorization URL
    const stitchClient = getStitchClient();
    const authUrl = stitchClient.getAuthorizationUrl(state, business.id);

    return NextResponse.json({
      authUrl,
      state,
    });
  } catch (error: any) {
    console.error('Stitch connect error:', error);
    return NextResponse.json(
      { error: 'Failed to initiate bank connection', details: error.message },
      { status: 500 }
    );
  }
}
