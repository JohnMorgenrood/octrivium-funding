import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const deal = await prisma.deal.findUnique({
      where: { id: params.id },
      include: {
        business: true,
        _count: {
          select: { investments: true },
        },
      },
    });

    if (!deal) {
      return NextResponse.json({ error: 'Deal not found' }, { status: 404 });
    }

    return NextResponse.json({
      ...deal,
      currentFunding: Number(deal.currentFunding),
      fundingGoal: Number(deal.fundingGoal),
      minInvestment: Number(deal.minInvestment),
      maxInvestment: deal.maxInvestment ? Number(deal.maxInvestment) : null,
      revenueSharePercentage: Number(deal.revenueSharePercentage),
      repaymentCap: Number(deal.repaymentCap),
      totalRepaid: Number(deal.totalRepaid),
    });
  } catch (error) {
    console.error('Error fetching deal:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
