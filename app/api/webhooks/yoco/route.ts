import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Yoco Webhook Handler
// Reference: https://developer.yoco.com/api-reference/checkout-api
export async function POST(request: Request) {
  try {
    const payload = await request.json();
    
    console.log('Yoco webhook received:', JSON.stringify(payload, null, 2));

    // Verify webhook signature (if you've set up webhook secret)
    const signature = request.headers.get('x-yoco-signature');
    // TODO: Implement signature verification for security

    const { type, payload: eventPayload } = payload;

    // Handle different event types
    switch (type) {
      case 'payment.succeeded':
      case 'checkout.succeeded':
        await handlePaymentSuccess(eventPayload);
        break;
      
      case 'payment.failed':
      case 'checkout.failed':
        await handlePaymentFailure(eventPayload);
        break;
      
      case 'payment.refunded':
        await handlePaymentRefund(eventPayload);
        break;
      
      default:
        console.log('Unhandled webhook event type:', type);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

async function handlePaymentSuccess(eventPayload: any) {
  try {
    const { metadata, amount, id: checkoutId } = eventPayload;
    const { invoiceId, type, userId } = metadata || {};

    // Handle wallet deposits
    if (type === 'wallet_deposit') {
      console.log('Processing wallet deposit for user:', userId);

      if (!userId) {
        console.error('No userId in wallet deposit metadata');
        return;
      }

      const depositAmount = amount / 100; // Convert from cents

      // Get or create wallet
      let wallet = await prisma.wallet.findUnique({
        where: { userId },
      });

      if (!wallet) {
        wallet = await prisma.wallet.create({
          data: {
            userId,
            balance: 0,
            availableBalance: 0,
            lockedBalance: 0,
          },
        });
      }

      // Check for duplicate transaction
      const existingTransaction = await prisma.transaction.findFirst({
        where: {
          walletId: wallet.id,
          reference: `DEPOSIT-${checkoutId}`,
          status: 'COMPLETED',
        },
      });

      if (existingTransaction) {
        console.log('Duplicate wallet deposit detected:', checkoutId);
        return;
      }

      // Add funds to wallet
      await prisma.$transaction([
        prisma.wallet.update({
          where: { id: wallet.id },
          data: {
            balance: { increment: depositAmount },
            availableBalance: { increment: depositAmount },
          },
        }),
        prisma.transaction.create({
          data: {
            walletId: wallet.id,
            type: 'DEPOSIT',
            status: 'COMPLETED',
            amount: depositAmount,
            netAmount: depositAmount, // No fees for deposits
            reference: `DEPOSIT-${checkoutId}`,
            description: `Wallet deposit via Yoco`,
            metadata: {
              checkoutId,
              paymentMethod: 'yoco',
              ...metadata,
            },
          },
        }),
      ]);

      console.log(`✅ Wallet deposit successful: R${depositAmount} added to user ${userId}`);
      return;
    }

    // Handle invoice payments (existing code)
    if (!invoiceId) {
      console.error('No invoiceId in webhook metadata');
      return;
    }

    console.log('Processing successful payment for invoice:', invoiceId);

    // Get the invoice
    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!invoice) {
      console.error('Invoice not found:', invoiceId);
      return;
    }

    if (invoice.status === 'PAID') {
      console.log('Invoice already marked as paid - possible duplicate payment');
      
      // Check if this is a duplicate checkout attempt
      const existingTransaction = await prisma.transaction.findFirst({
        where: {
          reference: `INV-${invoice.invoiceNumber}`,
          status: 'COMPLETED',
        },
      });

      if (existingTransaction) {
        console.log('Duplicate payment detected! Existing transaction:', existingTransaction.id);
        // TODO: Automatically trigger refund for the duplicate payment
        // For now, log it for admin review
        await prisma.transaction.create({
          data: {
            walletId: (existingTransaction as any).walletId,
            type: 'REFUND',
            status: 'PENDING',
            amount: -Number(invoice.amountPaid),
            fee: 0,
            netAmount: -Number(invoice.amountPaid),
            currency: 'ZAR',
            reference: `DUPLICATE-PAYMENT-INV-${invoice.invoiceNumber}`,
            description: `DUPLICATE PAYMENT DETECTED for invoice ${invoice.invoiceNumber} - Requires manual refund`,
            metadata: {
              invoiceId: invoice.id,
              yocoCheckoutId: checkoutId,
              isDuplicate: true,
              requiresRefund: true,
            },
          },
        });
        
        console.error('⚠️ DUPLICATE PAYMENT - Manual refund required for invoice:', invoice.invoiceNumber);
      }
      
      return;
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
        description: `Payment for invoice ${invoice.invoiceNumber} via Yoco`,
        processedAt: new Date(),
        metadata: {
          invoiceId: invoice.id,
          yocoCheckoutId: checkoutId,
          locked: true,
          releaseDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      },
    });

    console.log('Payment processed successfully via webhook');
  } catch (error) {
    console.error('Error handling payment success webhook:', error);
    throw error;
  }
}

async function handlePaymentFailure(eventPayload: any) {
  console.log('Payment failed:', eventPayload);
  // Optionally log failed payments or notify user
}

async function handlePaymentRefund(eventPayload: any) {
  console.log('Payment refunded:', eventPayload);
  // Implement refund logic if needed
}
