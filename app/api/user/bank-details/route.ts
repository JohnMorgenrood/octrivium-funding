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
        bankName: true,
        bankAccountName: true,
        bankAccountNumber: true,
        bankBranchCode: true,
        bankAccountType: true,
        subscriptionTier: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error fetching bank details:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { bankName, bankAccountName, bankAccountNumber, bankBranchCode, bankAccountType } = await request.json();

    if (!bankName || !bankAccountName || !bankAccountNumber || !bankBranchCode || !bankAccountType) {
      return NextResponse.json({ error: 'All bank details are required' }, { status: 400 });
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

    // Only STARTER/BUSINESS tier can add bank details
    if (user.subscriptionTier === 'FREE') {
      return NextResponse.json({ error: 'Bank details require STARTER or BUSINESS subscription' }, { status: 403 });
    }

    // Update user with bank details
    await prisma.user.update({
      where: { id: user.id },
      data: {
        bankName,
        bankAccountName,
        bankAccountNumber,
        bankBranchCode,
        bankAccountType,
      },
    });

    return NextResponse.json({ success: true, message: 'Bank details saved successfully' });
  } catch (error) {
    console.error('Error saving bank details:', error);
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

    // Remove bank details
    await prisma.user.update({
      where: { id: user.id },
      data: {
        bankName: null,
        bankAccountName: null,
        bankAccountNumber: null,
        bankBranchCode: null,
        bankAccountType: null,
      },
    });

    return NextResponse.json({ success: true, message: 'Bank details removed' });
  } catch (error) {
    console.error('Error removing bank details:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
