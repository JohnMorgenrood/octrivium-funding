import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { generateReference } from '@/lib/utils';

const withdrawSchema = z.object({
  amount: z.number().positive(),
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const validated = withdrawSchema.parse(body);

    const wallet = await prisma.wallet.findUnique({
      where: { userId: session.user.id },
    });

    if (!wallet) {
      return NextResponse.json({ error: 'Wallet not found' }, { status: 404 });
    }

    if (Number(wallet.availableBalance) < validated.amount) {
      return NextResponse.json({ error: 'Insufficient available balance' }, { status: 400 });
    }

    // In production, this would integrate with PayFast for payouts
    // For now, we'll simulate a pending withdrawal
    const result = await prisma.$transaction(async (tx) => {
      // Update wallet balance
      const updatedWallet = await tx.wallet.update({
        where: { userId: session.user.id },
        data: {
          balance: { decrement: validated.amount },
          availableBalance: { decrement: validated.amount },
        },
      });

      // Create transaction record
      const transaction = await tx.transaction.create({
        data: {
          walletId: wallet.id,
          type: 'WITHDRAWAL',
          status: 'PROCESSING',
          amount: validated.amount,
          fee: 0,
          netAmount: validated.amount,
          reference: generateReference('WTH'),
          description: 'Wallet withdrawal',
        },
      });

      return { wallet: updatedWallet, transaction };
    });

    // Create notification
    await prisma.notification.create({
      data: {
        userId: session.user.id,
        type: 'IN_APP',
        category: 'WITHDRAWAL',
        title: 'Withdrawal Initiated',
        message: `Your withdrawal request for R${validated.amount} is being processed. Funds will be transferred within 1-3 business days.`,
      },
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input data' }, { status: 400 });
    }

    console.error('Withdrawal error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
