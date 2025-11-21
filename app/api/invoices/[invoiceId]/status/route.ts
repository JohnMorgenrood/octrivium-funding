import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { invoiceId: string } }
) {
  try {
    const { invoiceId } = params;

    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
      select: {
        id: true,
        status: true,
        invoiceNumber: true,
        amountPaid: true,
        amountDue: true,
        paidDate: true,
      },
    });

    if (!invoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    return NextResponse.json(invoice);
  } catch (error) {
    console.error('Error fetching invoice status:', error);
    return NextResponse.json(
      { error: 'Failed to fetch invoice status' },
      { status: 500 }
    );
  }
}
