import { NextRequest, NextResponse } from 'next/server';
import checkoutNodeJssdk from '@paypal/checkout-server-sdk';
import { client } from '@/lib/paypal';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { orderId, dealId, amount } = await req.json();

    if (!orderId || !dealId || !amount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Capture the PayPal order
    const request = new checkoutNodeJssdk.orders.OrdersCaptureRequest(orderId);
    request.requestBody({});

    const capture = await client().execute(request);

    if (capture.result.status !== 'COMPLETED') {
      return NextResponse.json(
        { error: 'Payment not completed' },
        { status: 400 }
      );
    }

    // Get the deal to calculate expected return and share percentage
    const deal = await prisma.deal.findUnique({
      where: { id: dealId },
      select: { 
        repaymentCap: true,
        fundingGoal: true,
        currentFunding: true,
      },
    });

    if (!deal) {
      return NextResponse.json(
        { error: 'Deal not found' },
        { status: 404 }
      );
    }

    // Calculate share percentage based on investment amount and funding goal
    const investmentAmount = parseFloat(amount);
    const sharePercentage = (investmentAmount / Number(deal.fundingGoal)) * 100;

    // Create investment record in database
    const investment = await prisma.investment.create({
      data: {
        userId: session.user.id,
        dealId: dealId,
        amount: investmentAmount,
        sharePercentage: sharePercentage,
        expectedReturn: investmentAmount * Number(deal.repaymentCap),
        status: 'ACTIVE',
      },
    });

    // Create a transaction record for the PayPal payment
    // First, ensure the user has a wallet
    let wallet = await prisma.wallet.findUnique({
      where: { userId: session.user.id },
    });

    if (!wallet) {
      wallet = await prisma.wallet.create({
        data: {
          userId: session.user.id,
          balance: 0,
          availableBalance: 0,
          lockedBalance: 0,
        },
      });
    }

    // Create transaction record with PayPal reference
    await prisma.transaction.create({
      data: {
        walletId: wallet.id,
        investmentId: investment.id,
        type: 'INVESTMENT',
        status: 'COMPLETED',
        amount: parseFloat(amount),
        fee: 0,
        netAmount: parseFloat(amount),
        currency: 'ZAR',
        reference: orderId,
        description: `PayPal payment for investment ${investment.id}`,
      },
    });

    // Update deal funded amount
    await prisma.deal.update({
      where: { id: dealId },
      data: {
        currentFunding: {
          increment: parseFloat(amount),
        },
      },
    });

    return NextResponse.json({
      success: true,
      investment: {
        id: investment.id,
        amount: investment.amount,
        expectedReturn: investment.expectedReturn,
      },
    });
  } catch (error: any) {
    console.error('PayPal capture error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to capture payment' },
      { status: 500 }
    );
  }
}
