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

    const recurring = await prisma.recurringInvoice.findMany({
      where: { userId: session.user.id },
      include: { customer: true },
      orderBy: { nextInvoiceDate: 'asc' },
    });

    return NextResponse.json(recurring);
  } catch (error) {
    console.error('Error fetching recurring invoices:', error);
    return NextResponse.json({ error: 'Failed to fetch recurring invoices' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.json();

    const recurring = await prisma.recurringInvoice.create({
      data: {
        userId: session.user.id,
        customerId: data.customerId,
        invoicePrefix: data.invoicePrefix || 'INV',
        frequency: data.frequency,
        interval: data.interval || 1,
        dayOfMonth: data.dayOfMonth,
        startDate: new Date(data.startDate),
        endDate: data.endDate ? new Date(data.endDate) : null,
        nextInvoiceDate: new Date(data.nextInvoiceDate),
        items: data.items,
        subtotal: data.subtotal,
        taxRate: data.taxRate || 15,
        taxAmount: data.taxAmount,
        total: data.total,
        paymentTermsDays: data.paymentTermsDays || 30,
        notes: data.notes,
        terms: data.terms,
        active: true,
      },
    });

    return NextResponse.json(recurring, { status: 201 });
  } catch (error) {
    console.error('Error creating recurring invoice:', error);
    return NextResponse.json({ error: 'Failed to create recurring invoice' }, { status: 500 });
  }
}
