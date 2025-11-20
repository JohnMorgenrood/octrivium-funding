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
