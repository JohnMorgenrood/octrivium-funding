import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { token } = await request.json();

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Process payment with Yoco
    const yocoResponse = await fetch('https://online.yoco.com/v1/charges/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.YOCO_SECRET_KEY}`,
      },
      body: JSON.stringify({
        token: token,
        amountInCents: 5000, // R50.00
        currency: 'ZAR',
        metadata: {
          userId: user.id,
          type: 'subscription',
          tier: 'PREMIUM',
        },
      }),
    });

    const yocoData = await yocoResponse.json();

    if (!yocoResponse.ok || yocoData.status !== 'successful') {
      console.error('Yoco payment failed:', yocoData);
      return NextResponse.json(
        { error: 'Payment failed', details: yocoData },
        { status: 400 }
      );
    }

    // Calculate subscription dates (1 month from now)
    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1);

    // Update user to PREMIUM
    await prisma.user.update({
      where: { id: user.id },
      data: {
        subscriptionTier: 'PREMIUM',
        subscriptionStatus: 'ACTIVE',
        subscriptionStartDate: startDate,
        subscriptionEndDate: endDate,
        invoiceCount: 0, // Reset count
      },
    });

    // Create subscription record
    await prisma.subscription.create({
      data: {
        userId: user.id,
        tier: 'PREMIUM',
        status: 'ACTIVE',
        amount: 50.00,
        currency: 'ZAR',
        startDate,
        endDate,
        yocoChargeId: yocoData.id,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Successfully upgraded to Premium!',
      subscription: {
        tier: 'PREMIUM',
        endDate,
      },
    });
  } catch (error) {
    console.error('Error processing subscription payment:', error);
    return NextResponse.json(
      { error: 'Failed to process payment', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
