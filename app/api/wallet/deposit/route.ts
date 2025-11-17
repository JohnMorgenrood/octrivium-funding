import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { generateReference } from '@/lib/utils';

const depositSchema = z.object({
  amount: z.number().positive(),
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const validated = depositSchema.parse(body);

    const wallet = await prisma.wallet.findUnique({
      where: { userId: session.user.id },
    });

    if (!wallet) {
      return NextResponse.json({ error: 'Wallet not found' }, { status: 404 });
    }

    // In production, this would integrate with PayFast
    // For now, we'll simulate a successful deposit
    const result = await prisma.$transaction(async (tx) => {
      // Update wallet balance
      const updatedWallet = await tx.wallet.update({
        where: { userId: session.user.id },
        data: {
          balance: { increment: validated.amount },
          availableBalance: { increment: validated.amount },
        },
      });

      // Create transaction record
      const transaction = await tx.transaction.create({
        data: {
          walletId: wallet.id,
          type: 'DEPOSIT',
          status: 'COMPLETED',
          amount: validated.amount,
          fee: 0,
          netAmount: validated.amount,
          reference: generateReference('DEP'),
          description: 'Wallet deposit',
        },
      });

      return { wallet: updatedWallet, transaction };
    });

    // Create notification
    await prisma.notification.create({
      data: {
        userId: session.user.id,
        type: 'IN_APP',
        category: 'DEPOSIT',
        title: 'Deposit Successful',
        message: `Your deposit of R${validated.amount} has been credited to your wallet.`,
      },
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input data' }, { status: 400 });
    }

    console.error('Deposit error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
