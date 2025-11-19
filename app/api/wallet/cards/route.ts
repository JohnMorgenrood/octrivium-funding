import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const cards = await prisma.bankCard.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: [
        { isDefault: 'desc' },
        { createdAt: 'desc' },
      ],
    });

    return NextResponse.json(cards);
  } catch (error) {
    console.error('Bank cards fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bank cards' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { bankName, accountHolder, accountNumber, accountType, branchCode, branchName, isDefault } = await req.json();

    // Validate required fields
    if (!bankName || !accountHolder || !accountNumber || !accountType || !branchCode) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // If this account should be default, unset any existing default
    if (isDefault) {
      await prisma.bankCard.updateMany({
        where: {
          userId: session.user.id,
          isDefault: true,
        },
        data: {
          isDefault: false,
        },
      });
    }

    const account = await prisma.bankCard.create({
      data: {
        userId: session.user.id,
        bankName,
        accountHolder,
        accountNumber,
        accountType,
        branchCode,
        branchName: branchName || null,
        isDefault: isDefault || false,
      },
    });

    return NextResponse.json(account);
  } catch (error) {
    console.error('Bank account creation error:', error);
    return NextResponse.json(
      { error: 'Failed to add bank account' },
      { status: 500 }
    );
  }
}
