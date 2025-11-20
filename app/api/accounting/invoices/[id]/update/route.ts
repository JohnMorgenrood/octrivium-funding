import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if invoice exists and belongs to user
    const existingInvoice = await prisma.invoice.findUnique({
      where: { id: params.id },
    });

    if (!existingInvoice || existingInvoice.userId !== session.user.id) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    const body = await req.json();
    const {
      customerId,
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
      requiresSignature,
    } = body;

    // Delete existing items
    await prisma.invoiceItem.deleteMany({
      where: { invoiceId: params.id },
    });

    // Update invoice with new items
    const invoice = await prisma.invoice.update({
      where: { id: params.id },
      data: {
        customerId,
        status,
        issueDate: new Date(issueDate),
        dueDate: new Date(dueDate),
        subtotal,
        taxRate,
        taxAmount,
        total,
        amountDue,
        notes,
        terms,
        requiresSignature: requiresSignature || false,
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
    console.error('Invoice update error:', error);
    return NextResponse.json(
      { error: 'Failed to update invoice' },
      { status: 500 }
    );
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const invoice = await prisma.invoice.findUnique({
      where: { id: params.id },
      include: {
        customer: true,
        items: true,
        user: {
          select: {
            companyName: true,
            companyLogo: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!invoice || invoice.userId !== session.user.id) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    return NextResponse.json(invoice);
  } catch (error) {
    console.error('Invoice fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch invoice' },
      { status: 500 }
    );
  }
}
