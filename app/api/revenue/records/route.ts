import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/revenue/records
 * Get revenue records for the business
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
      include: { deals: { select: { id: true } } },
    });

    if (!business) {
      return NextResponse.json(
        { error: 'Business not found' },
        { status: 404 }
      );
    }

    const dealIds = business.deals.map((d: any) => d.id);

    const records = await prisma.revenueRecord.findMany({
      where: { dealId: { in: dealIds } },
      select: {
        id: true,
        month: true,
        totalRevenue: true,
        revenueShareAmount: true,
        status: true,
        hasDiscrepancy: true,
        payoutScheduled: true,
        payoutCompletedAt: true,
        sourceType: true,
      },
      orderBy: { month: 'desc' },
      take: 12, // Last 12 months
    });

    return NextResponse.json({ 
      records: records.map((r: any) => ({
        ...r,
        totalRevenue: Number(r.totalRevenue),
        revenueShareAmount: Number(r.revenueShareAmount),
      }))
    });
  } catch (error: any) {
    console.error('Failed to fetch revenue records:', error);
    return NextResponse.json(
      { error: 'Failed to fetch revenue records' },
      { status: 500 }
    );
  }
}
