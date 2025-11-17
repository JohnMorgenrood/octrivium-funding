import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const wallet = await prisma.wallet.findUnique({
      where: { userId: session.user.id },
    });

    if (!wallet) {
      // Create wallet if it doesn't exist
      const newWallet = await prisma.wallet.create({
        data: { userId: session.user.id },
      });
      return NextResponse.json({ wallet: newWallet });
    }

    return NextResponse.json({
      wallet: {
        ...wallet,
        balance: Number(wallet.balance),
        availableBalance: Number(wallet.availableBalance),
        lockedBalance: Number(wallet.lockedBalance),
      },
    });
  } catch (error) {
    console.error('Error fetching wallet:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
