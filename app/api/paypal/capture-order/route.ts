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

    // Get the deal to calculate expected return
    const deal = await prisma.deal.findUnique({
      where: { id: dealId },
      select: { repaymentCap: true },
    });

    if (!deal) {
      return NextResponse.json(
        { error: 'Deal not found' },
        { status: 404 }
      );
    }

    // Create investment record in database
    const investment = await prisma.investment.create({
      data: {
        userId: session.user.id,
        dealId: dealId,
        amount: parseFloat(amount),
        expectedReturn: parseFloat(amount) * Number(deal.repaymentCap),
        paymentMethod: 'PAYPAL',
        paymentReference: orderId,
        status: 'COMPLETED',
      },
    });

    // Update deal funded amount
    await prisma.deal.update({
      where: { id: dealId },
      data: {
        currentAmount: {
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
