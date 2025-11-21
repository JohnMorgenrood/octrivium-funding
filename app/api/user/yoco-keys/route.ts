import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        yocoPublicKey: true,
        yocoSecretKey: true,
        subscriptionTier: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Return only public key and tier, mask secret key
    return NextResponse.json({
      yocoPublicKey: user.yocoPublicKey,
      hasSecretKey: !!user.yocoSecretKey,
      subscriptionTier: user.subscriptionTier,
    });
  } catch (error) {
    console.error('Error fetching Yoco keys:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { yocoPublicKey, yocoSecretKey } = await request.json();

    if (!yocoPublicKey || !yocoSecretKey) {
      return NextResponse.json({ error: 'Both public and secret keys are required' }, { status: 400 });
    }

    // Validate key format
    if (!yocoPublicKey.startsWith('pk_live_') && !yocoPublicKey.startsWith('pk_test_')) {
      return NextResponse.json({ error: 'Invalid public key format' }, { status: 400 });
    }

    if (!yocoSecretKey.startsWith('sk_live_') && !yocoSecretKey.startsWith('sk_test_')) {
      return NextResponse.json({ error: 'Invalid secret key format' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        subscriptionTier: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Only BUSINESS tier can use custom Yoco keys
    if (user.subscriptionTier !== 'BUSINESS') {
      return NextResponse.json({ error: 'Custom Yoco keys require BUSINESS subscription' }, { status: 403 });
    }

    // Test the keys by making a test API call to Yoco
    try {
      const testResponse = await fetch('https://online.yoco.com/v1/charges', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${yocoSecretKey}`,
        },
      });

      if (!testResponse.ok) {
        return NextResponse.json({ error: 'Invalid Yoco API keys. Please check and try again.' }, { status: 400 });
      }
    } catch (error) {
      return NextResponse.json({ error: 'Failed to validate Yoco API keys' }, { status: 400 });
    }

    // Update user with new keys
    await prisma.user.update({
      where: { id: user.id },
      data: {
        yocoPublicKey,
        yocoSecretKey,
      },
    });

    return NextResponse.json({ success: true, message: 'Yoco API keys saved successfully' });
  } catch (error) {
    console.error('Error saving Yoco keys:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE() {
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

    // Remove Yoco keys
    await prisma.user.update({
      where: { id: user.id },
      data: {
        yocoPublicKey: null,
        yocoSecretKey: null,
      },
    });

    return NextResponse.json({ success: true, message: 'Yoco API keys removed' });
  } catch (error) {
    console.error('Error removing Yoco keys:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
