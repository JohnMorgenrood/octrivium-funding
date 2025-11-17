import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/revenue/payouts
 * Get payout schedules for the business
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

    const payouts = await prisma.payoutSchedule.findMany({
      where: { dealId: { in: dealIds } },
      select: {
        id: true,
        month: true,
        totalRevenue: true,
        revenueShareAmount: true,
        platformFee: true,
        netPayoutAmount: true,
        status: true,
        scheduledDate: true,
        processedDate: true,
        investorCount: true,
      },
      orderBy: { month: 'desc' },
      take: 12,
    });

    return NextResponse.json({ 
      payouts: payouts.map((p: any) => ({
        ...p,
        totalRevenue: Number(p.totalRevenue),
        revenueShareAmount: Number(p.revenueShareAmount),
        platformFee: Number(p.platformFee),
        netPayoutAmount: Number(p.netPayoutAmount),
      }))
    });
  } catch (error: any) {
    console.error('Failed to fetch payouts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch payouts' },
      { status: 500 }
    );
  }
}
