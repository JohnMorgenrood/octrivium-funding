import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if already subscribed
    if ((user.subscriptionTier === 'STARTER' || user.subscriptionTier === 'BUSINESS') && user.subscriptionStatus === 'ACTIVE') {
      return NextResponse.json({ error: 'Already subscribed' }, { status: 400 });
    }

    // Create Yoco checkout for R50 subscription
    // For now, return a mock response - we'll integrate Yoco properly
    const amount = 5000; // R50.00 in cents

    // In production, you would create a Yoco checkout session here
    // For now, we'll use the inline Yoco payment

    return NextResponse.json({
      amount,
      currency: 'ZAR',
      description: 'Premium Subscription - Monthly',
    });
  } catch (error) {
    console.error('Error creating subscription payment:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
