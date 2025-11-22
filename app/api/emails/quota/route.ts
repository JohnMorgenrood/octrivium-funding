import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        emailPlanType: true,
        emailQuotaLimit: true,
        emailQuotaUsed: true,
        role: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      plan: user.emailPlanType,
      limit: user.emailQuotaLimit,
      used: user.emailQuotaUsed,
      role: user.role,
    });
  } catch (error) {
    console.error('Error fetching quota:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quota' },
      { status: 500 }
    );
  }
}
