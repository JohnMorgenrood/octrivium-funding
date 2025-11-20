import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { orderId, invoiceId } = await request.json();

    // Capture the PayPal payment
    const auth = Buffer.from(
      `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
    ).toString('base64');

    const response = await fetch(
      `${process.env.PAYPAL_API_URL}/v2/checkout/orders/${orderId}/capture`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${auth}`,
        },
      }
    );

    const captureData = await response.json();

    if (!response.ok || captureData.status !== 'COMPLETED') {
      console.error('PayPal capture error:', captureData);
      return NextResponse.json(
        { error: 'Failed to capture payment' },
        { status: 500 }
      );
    }

    // Get invoice first to get amount
    const existingInvoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
      select: { amountDue: true },
    });

    if (!existingInvoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    const paymentAmount = Number(existingInvoice.amountDue);

    // Update invoice
    const invoice = await prisma.invoice.update({
      where: { id: invoiceId },
      data: {
        status: 'PAID',
        amountPaid: { increment: paymentAmount },
        amountDue: 0,
        paidDate: new Date(),
      },
      include: {
        user: {
          include: {
            wallet: true,
          },
        },
      },
    });

    // Create or get wallet
    let wallet = invoice.user.wallet;
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

    // Lock funds in wallet (will be available after processing period)
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
        description: `Payment for invoice ${invoice.invoiceNumber}`,
        processedAt: new Date(),
        metadata: {
          invoiceId: invoice.id,
          paypalOrderId: orderId,
          locked: true,
          releaseDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Payment processed successfully',
    });
  } catch (error) {
    console.error('Error capturing payment:', error);
    return NextResponse.json(
      { error: 'Failed to process payment' },
      { status: 500 }
    );
  }
}
