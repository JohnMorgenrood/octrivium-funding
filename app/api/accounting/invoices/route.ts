import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user subscription data
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        subscriptionTier: true,
        subscriptionStatus: true,
        invoiceCount: true,
        lastInvoiceReset: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if we need to reset invoice count (monthly reset for FREE tier)
    const now = new Date();
    const lastReset = user.lastInvoiceReset ? new Date(user.lastInvoiceReset) : null;
    const shouldReset = !lastReset || (now.getMonth() !== lastReset.getMonth() || now.getFullYear() !== lastReset.getFullYear());

    if (user.subscriptionTier === 'FREE' && shouldReset) {
      await prisma.user.update({
        where: { id: session.user.id },
        data: {
          invoiceCount: 0,
          lastInvoiceReset: now,
        },
      });
    }

    // Check invoice limit for FREE tier
    if (user.subscriptionTier === 'FREE' && user.subscriptionStatus === 'ACTIVE') {
      const currentCount = shouldReset ? 0 : user.invoiceCount;
      if (currentCount >= 3) {
        return NextResponse.json(
          { 
            error: 'Invoice limit reached',
            message: 'You have reached your monthly limit of 3 invoices. Upgrade to Premium for unlimited invoices.',
            limit: true,
          },
          { status: 403 }
        );
      }
    }

    const body = await req.json();
    const {
      customerId,
      invoiceNumber,
      status,
      issueDate,
      dueDate,
      subtotal,
      taxRate,
      taxAmount,
      total,
      amountDue,
      notes,
      terms,
      items,
    } = body;

    // Generate unique payment link
    const paymentLink = `inv-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Create invoice with items
    const invoice = await prisma.invoice.create({
      data: {
        userId: session.user.id,
        customerId,
        invoiceNumber,
        status,
        issueDate: new Date(issueDate),
        dueDate: new Date(dueDate),
        subtotal,
        taxRate,
        taxAmount,
        total,
        amountPaid: 0,
        amountDue,
        notes,
        terms,
        paymentLink,
        items: {
          create: items,
        },
      },
      include: {
        customer: true,
        items: true,
      },
    });

    // Increment invoice count for FREE tier users
    if (user.subscriptionTier === 'FREE') {
      await prisma.user.update({
        where: { id: session.user.id },
        data: {
          invoiceCount: { increment: 1 },
        },
      });
    }

    return NextResponse.json(invoice);
  } catch (error) {
    console.error('Invoice creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create invoice' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const invoices = await prisma.invoice.findMany({
      where: { userId: session.user.id },
      include: { customer: true, items: true },
      orderBy: { issueDate: 'desc' },
    });

    return NextResponse.json(invoices);
  } catch (error) {
    console.error('Invoice fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch invoices' },
      { status: 500 }
    );
  }
}
