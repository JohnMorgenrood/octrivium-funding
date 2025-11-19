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

    const { bankName, cardHolderName, cardNumber, expiryMonth, expiryYear, cardType, isDefault } = await req.json();

    // Validate required fields
    if (!bankName || !cardHolderName || !cardNumber || !expiryMonth || !expiryYear || !cardType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Store only last 4 digits for security
    const last4Digits = cardNumber.replace(/\s/g, '').slice(-4);

    // If this card should be default, unset any existing default
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

    const card = await prisma.bankCard.create({
      data: {
        userId: session.user.id,
        bankName,
        cardHolderName,
        cardNumber: last4Digits,
        expiryMonth,
        expiryYear,
        cardType,
        isDefault: isDefault || false,
      },
    });

    return NextResponse.json(card);
  } catch (error) {
    console.error('Bank card creation error:', error);
    return NextResponse.json(
      { error: 'Failed to add bank card' },
      { status: 500 }
    );
  }
}
