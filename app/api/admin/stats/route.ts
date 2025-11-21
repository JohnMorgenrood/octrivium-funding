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

    if (user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get subscription revenue
    const subscriptions = await prisma.subscription.findMany({
      where: {
        status: 'ACTIVE',
      },
      select: {
        amount: true,
        tier: true,
        createdAt: true,
      },
    });

    const monthlyRevenue = subscriptions.reduce((sum, sub) => sum + Number(sub.amount), 0);

    // Get invoice stats
    const invoices = await prisma.invoice.findMany({
      select: {
        status: true,
        total: true,
        createdAt: true,
      },
    });

    const paidInvoices = invoices.filter(inv => inv.status === 'PAID');
    const totalInvoiceValue = paidInvoices.reduce((sum, inv) => sum + Number(inv.total), 0);

    // Get recent subscriptions
    const recentSubscriptions = await prisma.subscription.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({
      revenue: {
        monthly: monthlyRevenue,
        invoiceProcessing: totalInvoiceValue,
      },
      invoices: {
        total: invoices.length,
        paid: paidInvoices.length,
        pending: invoices.filter(inv => inv.status === 'SENT' || inv.status === 'VIEWED' || inv.status === 'OVERDUE').length,
      },
      subscriptions: {
        active: subscriptions.length,
        byTier: {
          starter: subscriptions.filter(s => s.tier === 'STARTER').length,
          business: subscriptions.filter(s => s.tier === 'BUSINESS').length,
        },
        recent: recentSubscriptions,
      },
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
