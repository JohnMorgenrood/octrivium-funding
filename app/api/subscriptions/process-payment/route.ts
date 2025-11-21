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

    const { token, tier } = await request.json();

    if (!tier || !['STARTER', 'BUSINESS'].includes(tier)) {
      return NextResponse.json({ error: 'Invalid tier' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Determine pricing and limits based on tier
    const tierConfig = {
      STARTER: {
        amount: 5000, // R50 in cents
        maxInvoices: 15,
        maxTeamMembers: 1,
      },
      BUSINESS: {
        amount: 10000, // R100 in cents
        maxInvoices: null, // unlimited
        maxTeamMembers: 4,
      },
    };

    const config = tierConfig[tier as 'STARTER' | 'BUSINESS'];

    // Process payment with Yoco
    const yocoResponse = await fetch('https://online.yoco.com/v1/charges/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.YOCO_SECRET_KEY}`,
      },
      body: JSON.stringify({
        token: token,
        amountInCents: config.amount,
        currency: 'ZAR',
        metadata: {
          userId: user.id,
          type: 'subscription',
          tier: tier,
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

    // Update user to selected tier
    await prisma.user.update({
      where: { id: user.id },
      data: {
        subscriptionTier: tier,
        subscriptionStatus: 'ACTIVE',
        subscriptionStartDate: startDate,
        subscriptionEndDate: endDate,
        invoiceCount: 0, // Reset count
        teamMemberCount: 1, // Reset to 1 (just the owner)
      },
    });

    // Create subscription record
    await prisma.subscription.create({
      data: {
        userId: user.id,
        tier: tier,
        status: 'ACTIVE',
        amount: config.amount / 100, // Convert cents to Rands
        currency: 'ZAR',
        startDate,
        endDate,
        maxInvoices: config.maxInvoices,
        maxTeamMembers: config.maxTeamMembers,
        yocoChargeId: yocoData.id,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Successfully upgraded to ${tier}!`,
      subscription: {
        tier: tier,
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
