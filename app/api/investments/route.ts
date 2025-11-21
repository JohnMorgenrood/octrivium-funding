import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const investmentSchema = z.object({
  dealId: z.union([z.string().uuid(), z.number()]), // Accept UUID or number for fake deals
  amount: z.number().positive(),
  paymentMethod: z.enum(['yoco', 'paypal', 'wallet']).optional(),
  paymentToken: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const validated = investmentSchema.parse(body);

    // Handle fake deals (demo mode) - dealId is a number
    if (typeof validated.dealId === 'number') {
      // For demo purposes, just return success
      // In production, you would verify the payment token with Yoco/PayPal
      if (validated.paymentMethod === 'yoco' && validated.paymentToken) {
        // TODO: Verify Yoco payment token with their API
        return NextResponse.json({ 
          success: true, 
          message: 'Demo investment successful',
          investment: {
            id: 'demo-' + Date.now(),
            amount: validated.amount,
            dealId: validated.dealId,
            paymentMethod: validated.paymentMethod,
          }
        }, { status: 201 });
      }
      return NextResponse.json({ success: true }, { status: 201 });
    }

    // Handle real deals (database mode) - dealId is a UUID string
    if (session.user.kycStatus !== 'APPROVED') {
      return NextResponse.json({ error: 'KYC verification required' }, { status: 403 });
    }

    // Check deal exists and is active
    const deal = await prisma.deal.findUnique({
      where: { id: validated.dealId as string },
    });

    if (!deal) {
      return NextResponse.json({ error: 'Deal not found' }, { status: 404 });
    }

    if (deal.status !== 'ACTIVE') {
      return NextResponse.json({ error: 'Deal is not accepting investments' }, { status: 400 });
    }

    // Validate investment amount
    if (validated.amount < Number(deal.minInvestment)) {
      return NextResponse.json(
        { error: `Minimum investment is ${deal.minInvestment}` },
        { status: 400 }
      );
    }

    if (deal.maxInvestment && validated.amount > Number(deal.maxInvestment)) {
      return NextResponse.json(
        { error: `Maximum investment is ${deal.maxInvestment}` },
        { status: 400 }
      );
    }

    // Check if deal is fully funded
    const remainingAmount = Number(deal.fundingGoal) - Number(deal.currentFunding);
    if (validated.amount > remainingAmount) {
      return NextResponse.json(
        { error: `Only ${remainingAmount} remaining to fund this deal` },
        { status: 400 }
      );
    }

    // Check wallet balance
    const wallet = await prisma.wallet.findUnique({
      where: { userId: session.user.id },
    });

    if (!wallet || Number(wallet.balance) < validated.amount) {
      return NextResponse.json({ error: 'Insufficient wallet balance' }, { status: 400 });
    }

    // Create investment in a transaction
    const result = await prisma.$transaction(async (tx: any) => {
      // Create investment
      const investment = await tx.investment.create({
        data: {
          userId: session.user.id,
          dealId: validated.dealId as string,
          amount: validated.amount,
          sharePercentage: 0, // Will be calculated after deal is fully funded
          expectedReturn: validated.amount * Number(deal.repaymentCap),
        },
      });

      // Update wallet balance
      await tx.wallet.update({
        where: { userId: session.user.id },
        data: {
          balance: { decrement: validated.amount },
          lockedBalance: { increment: validated.amount },
        },
      });

      // Create transaction record
      await tx.transaction.create({
        data: {
          walletId: wallet.id,
          type: 'INVESTMENT',
          status: 'COMPLETED',
          amount: validated.amount,
          fee: 0,
          netAmount: validated.amount,
          investmentId: investment.id,
          description: `Investment in ${deal.title}`,
        },
      });

      // Update deal funding
      const newFunding = Number(deal.currentFunding) + validated.amount;
      const updatedDeal = await tx.deal.update({
        where: { id: validated.dealId as string },
        data: {
          currentFunding: newFunding,
          investorCount: { increment: 1 },
          status: newFunding >= Number(deal.fundingGoal) ? 'FUNDED' : 'ACTIVE',
        },
      });

      // If deal is now fully funded, calculate share percentages
      if (updatedDeal.status === 'FUNDED') {
        const allInvestments = await tx.investment.findMany({
          where: { dealId: validated.dealId as string },
        });

        const totalFunding = allInvestments.reduce((sum: number, inv: any) => sum + Number(inv.amount), 0);

        for (const inv of allInvestments) {
          await tx.investment.update({
            where: { id: inv.id },
            data: {
              sharePercentage: (Number(inv.amount) / totalFunding) * 100,
            },
          });
        }
      }

      return investment;
    });

    // Create notification
    await prisma.notification.create({
      data: {
        userId: session.user.id,
        type: 'IN_APP',
        category: 'INVESTMENT',
        title: 'Investment Successful',
        message: `You have successfully invested ${validated.amount} in ${deal.title}`,
      },
    });

    return NextResponse.json({ investment: result }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input data' }, { status: 400 });
    }

    console.error('Investment error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const investments = await prisma.investment.findMany({
      where: { userId: session.user.id },
      include: {
        deal: {
          include: {
            business: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ investments });
  } catch (error) {
    console.error('Error fetching investments:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
