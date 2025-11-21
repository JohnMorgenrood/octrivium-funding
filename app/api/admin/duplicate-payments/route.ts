import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    // Only admin can view duplicate payments
    if (!session?.user?.email || session.user.email !== 'golearnx@gmail.com') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Find all transactions marked as duplicates
    const duplicates = await prisma.transaction.findMany({
      where: {
        metadata: {
          path: ['isDuplicate'],
          equals: true,
        },
      },
      include: {
        wallet: {
          include: {
            user: {
              select: {
                email: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ duplicates });
  } catch (error) {
    console.error('Error fetching duplicate payments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch duplicate payments' },
      { status: 500 }
    );
  }
}
