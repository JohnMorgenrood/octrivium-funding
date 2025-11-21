import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { token, invoiceId, amount } = await request.json();

    console.log('Processing Yoco payment for invoice:', invoiceId);
    console.log('Amount (cents):', amount);

    // Get the invoice with user details
    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: {
        customer: true,
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            subscriptionTier: true,
            yocoSecretKey: true, // For BUSINESS tier custom Yoco
          },
        },
      },
    });

    if (!invoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    if (invoice.status === 'PAID') {
      return NextResponse.json({ error: 'Invoice already paid' }, { status: 400 });
    }

    // Determine which Yoco secret key to use
    // BUSINESS tier with custom keys: use their key (payment goes directly to them)
    // FREE/STARTER tier: use platform key (payment comes to platform, platform earns fee)
    const useCustomYoco = invoice.user.subscriptionTier === 'BUSINESS' && invoice.user.yocoSecretKey;
    const yocoSecretKey = useCustomYoco ? invoice.user.yocoSecretKey : process.env.YOCO_SECRET_KEY;

    if (!yocoSecretKey) {
      console.error('No Yoco secret key available');
      return NextResponse.json({ error: 'Payment system not configured' }, { status: 500 });
    }

    console.log(`Processing payment via ${useCustomYoco ? 'merchant' : 'platform'} Yoco account`);

    // Process payment with Yoco API
    const yocoResponse = await fetch('https://online.yoco.com/v1/charges/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${yocoSecretKey}`,
      },
      body: JSON.stringify({
        token: token,
        amountInCents: amount,
        currency: 'ZAR',
        metadata: {
          invoiceId: invoice.id,
          invoiceNumber: invoice.invoiceNumber,
        },
      }),
    });

    const yocoData = await yocoResponse.json();

    console.log('Yoco response:', JSON.stringify(yocoData, null, 2));

    if (!yocoResponse.ok) {
      console.error('Yoco API error:', yocoData);
      return NextResponse.json(
        {
          error: 'Payment failed',
          details: yocoData.message || 'Unknown error',
        },
        { status: yocoResponse.status }
      );
    }

    // Verify the payment was successful
    if (yocoData.status !== 'successful') {
      console.error('Yoco payment not successful. Status:', yocoData.status);
      return NextResponse.json(
        {
          error: `Payment not completed. Status: ${yocoData.status}`,
          details: yocoData,
        },
        { status: 400 }
      );
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

    // Add funds to wallet (locked for processing period)
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
        description: `Payment for invoice ${invoice.invoiceNumber} via Yoco`,
        processedAt: new Date(),
        metadata: {
          invoiceId: invoice.id,
          yocoChargeId: yocoData.id,
          locked: true,
          releaseDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        },
      },
    });

    console.log('Payment processed successfully');

    return NextResponse.json({
      success: true,
      message: 'Payment processed successfully',
      chargeId: yocoData.id,
    });
  } catch (error) {
    console.error('Error processing Yoco payment:', error);
    return NextResponse.json(
      { error: 'Failed to process payment', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
