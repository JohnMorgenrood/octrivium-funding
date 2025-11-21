import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    // Only admins can process refunds
    if (!session?.user?.email || session.user.email !== 'golearnx@gmail.com') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { invoiceId, reason } = await request.json();

    console.log('Processing refund for invoice:', invoiceId);

    // Get the invoice with transaction details
    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            subscriptionTier: true,
            yocoSecretKey: true,
          },
        },
      },
    });

    if (!invoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    if (invoice.status !== 'PAID') {
      return NextResponse.json({ error: 'Invoice is not paid' }, { status: 400 });
    }

    // Get the transaction
    const transaction = await prisma.transaction.findFirst({
      where: {
        reference: `INV-${invoice.invoiceNumber}`,
        type: 'DEPOSIT',
        status: 'COMPLETED',
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!transaction) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }

    // Get Yoco checkout ID from transaction metadata
    const yocoCheckoutId = (transaction.metadata as any)?.yocoCheckoutId;

    if (!yocoCheckoutId) {
      return NextResponse.json({ 
        error: 'Cannot refund - no Yoco checkout ID found',
        message: 'This payment may have been made through a different method. Please contact support.',
      }, { status: 400 });
    }

    // Determine which Yoco secret key to use
    const useCustomYoco = invoice.user.subscriptionTier === 'BUSINESS' && invoice.user.yocoSecretKey;
    const yocoSecretKey = useCustomYoco ? invoice.user.yocoSecretKey : process.env.YOCO_SECRET_KEY;

    if (!yocoSecretKey) {
      return NextResponse.json({ error: 'Yoco configuration error' }, { status: 500 });
    }

    // Process refund with Yoco API
    const refundAmount = Math.round(Number(invoice.amountPaid) * 100); // Convert to cents

    console.log(`Refunding ${refundAmount} cents for checkout ${yocoCheckoutId}`);

    const yocoResponse = await fetch(`https://payments.yoco.com/api/checkouts/${yocoCheckoutId}/refund`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${yocoSecretKey}`,
      },
      body: JSON.stringify({
        amount: refundAmount,
        reason: reason || 'Requested by admin',
      }),
    });

    const yocoData = await yocoResponse.json();

    console.log('Yoco refund response:', yocoData);

    if (!yocoResponse.ok) {
      console.error('Yoco refund error:', yocoData);
      return NextResponse.json(
        {
          error: 'Refund failed',
          details: yocoData.message || yocoData.displayMessage || 'Unknown error',
        },
        { status: yocoResponse.status }
      );
    }

    // Update invoice status
    await prisma.invoice.update({
      where: { id: invoiceId },
      data: {
        status: 'REFUNDED',
        amountPaid: 0,
        amountDue: invoice.total,
      },
    });

    // Update wallet - remove funds
    const wallet = await prisma.wallet.findUnique({
      where: { userId: invoice.userId },
    });

    if (wallet) {
      await prisma.wallet.update({
        where: { id: wallet.id },
        data: {
          balance: { decrement: Number(invoice.amountPaid) },
          lockedBalance: { decrement: Number(invoice.amountPaid) },
        },
      });
    }

    // Create refund transaction record
    await prisma.transaction.create({
      data: {
        walletId: wallet!.id,
        type: 'REFUND',
        status: 'COMPLETED',
        amount: -Number(invoice.amountPaid),
        fee: 0,
        netAmount: -Number(invoice.amountPaid),
        currency: 'ZAR',
        reference: `REFUND-INV-${invoice.invoiceNumber}`,
        description: `Refund for invoice ${invoice.invoiceNumber}: ${reason || 'Admin requested'}`,
        processedAt: new Date(),
        metadata: {
          invoiceId: invoice.id,
          yocoCheckoutId: yocoCheckoutId,
          yocoRefundId: yocoData.id,
          reason: reason,
        },
      },
    });

    console.log('Refund processed successfully');

    return NextResponse.json({
      success: true,
      message: 'Refund processed successfully',
      refundId: yocoData.id,
    });
  } catch (error) {
    console.error('Error processing refund:', error);
    return NextResponse.json(
      { error: 'Failed to process refund', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
