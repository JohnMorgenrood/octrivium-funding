import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: Request,
  { params }: { params: { invoiceId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { invoiceId } = params;
    const { paymentMethod, source } = await request.json();

    console.log(`Marking invoice ${invoiceId} as paid via ${paymentMethod} from ${source}`);

    // Get the invoice
    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });

    if (!invoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    // Check if user owns this invoice
    if (invoice.user.email !== session.user.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Check if already paid
    if (invoice.status === 'PAID') {
      console.log('Invoice already paid');
      return NextResponse.json({ 
        message: 'Invoice already marked as paid',
        status: 'PAID',
      });
    }

    // Update invoice to PAID
    const paymentAmount = Number(invoice.amountDue);

    await prisma.invoice.update({
      where: { id: invoiceId },
      data: {
        status: 'PAID',
        amountPaid: { increment: paymentAmount },
        amountDue: 0,
        paidDate: new Date(),
      },
    });

    // Get or create wallet
    let wallet = await prisma.wallet.findUnique({
      where: { userId: invoice.userId },
    });

    if (!wallet) {
      wallet = await prisma.wallet.create({
        data: {
          userId: invoice.userId,
          balance: 0,
          availableBalance: 0,
          lockedBalance: 0,
        },
      });
    }

    // Add funds to wallet (locked for 7 days)
    await prisma.wallet.update({
      where: { id: wallet.id },
      data: {
        balance: { increment: paymentAmount },
        lockedBalance: { increment: paymentAmount },
      },
    });

    // Create transaction record
    await prisma.transaction.create({
      data: {
        walletId: wallet.id,
        type: 'DEPOSIT',
        status: 'COMPLETED',
        amount: paymentAmount,
        fee: 0,
        netAmount: paymentAmount,
        currency: 'ZAR',
        reference: `INV-${invoice.invoiceNumber}`,
        description: `Payment for invoice ${invoice.invoiceNumber} via ${paymentMethod}`,
        processedAt: new Date(),
        metadata: {
          invoiceId: invoice.id,
          paymentMethod: paymentMethod,
          source: source,
          markedPaidManually: true,
          locked: true,
          releaseDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      },
    });

    console.log('Invoice marked as paid successfully');

    return NextResponse.json({
      success: true,
      message: 'Invoice marked as paid',
      status: 'PAID',
    });
  } catch (error) {
    console.error('Error marking invoice as paid:', error);
    return NextResponse.json(
      { error: 'Failed to mark invoice as paid', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
