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
    });

    // Only admin can access
    if (user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get all users with their subscription and invoice data
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        subscriptionTier: true,
        subscriptionStatus: true,
        invoiceCount: true,
        createdAt: true,
        subscriptions: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
        invoices: {
          select: {
            id: true,
            status: true,
            total: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Calculate stats
    const stats = {
      totalUsers: users.length,
      freeUsers: users.filter(u => u.subscriptionTier === 'FREE').length,
      starterUsers: users.filter(u => u.subscriptionTier === 'STARTER').length,
      businessUsers: users.filter(u => u.subscriptionTier === 'BUSINESS').length,
      totalRevenue: users.reduce((sum, u) => {
        const latestSub = u.subscriptions[0];
        return sum + (latestSub ? Number(latestSub.amount) : 0);
      }, 0),
      totalInvoices: users.reduce((sum, u) => sum + u.invoices.length, 0),
    };

    return NextResponse.json({ users, stats });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const adminUser = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (adminUser?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { userId, action, tier } = await request.json();

    if (action === 'upgrade') {
      await prisma.user.update({
        where: { id: userId },
        data: {
          subscriptionTier: tier,
          subscriptionStatus: 'ACTIVE',
        },
      });

      return NextResponse.json({ success: true, message: `User upgraded to ${tier}` });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
