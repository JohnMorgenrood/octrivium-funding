import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/revenue/connections
 * Get all revenue connections for the business
 */
export async function GET(request: NextRequest) {
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
      select: { id: true },
    });

    if (!business) {
      return NextResponse.json(
        { error: 'Business not found' },
        { status: 404 }
      );
    }

    const connections = await prisma.revenueConnection.findMany({
      where: { businessId: business.id },
      select: {
        id: true,
        sourceType: true,
        provider: true,
        accountName: true,
        isConnected: true,
        status: true,
        lastSyncAt: true,
        lastSyncStatus: true,
        connectedAt: true,
        lastError: true,
      },
      orderBy: { createdAt: 'asc' },
    });

    return NextResponse.json({ connections });
  } catch (error: any) {
    console.error('Failed to fetch connections:', error);
    return NextResponse.json(
      { error: 'Failed to fetch connections' },
      { status: 500 }
    );
  }
}
