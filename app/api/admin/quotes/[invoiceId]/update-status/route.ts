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
    
    // Only admin can manually update quote status
    if (!session?.user?.email || session.user.email !== 'golearnx@gmail.com') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { status, reason } = await request.json();

    // Validate status - Quote specific statuses
    const validStatuses = [
      'DRAFT',           // Quote being prepared
      'SENT',            // Quote sent to customer
      'ACCEPTED',        // Customer accepted quote
      'SIGNED',          // Customer signed quote
      'PENDING_PAYMENT', // Awaiting payment
      'PAID',            // Payment received
      'REJECTED',        // Customer rejected quote
      'CANCELLED',       // Quote cancelled
      'EXPIRED'          // Quote expired
    ];
    
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const quote = await prisma.invoice.findUnique({
      where: { id: params.invoiceId },
      include: {
        user: {
          include: { wallet: true },
        },
      },
    });

    if (!quote) {
      return NextResponse.json({ error: 'Quote not found' }, { status: 404 });
    }

    // Verify it's actually a quote
    if (quote.documentType !== 'QUOTE') {
      return NextResponse.json({ error: 'This is not a quote' }, { status: 400 });
    }

    const oldStatus = quote.status;

    // Handle status transitions
    if (status === 'ACCEPTED' && oldStatus === 'SENT') {
      // Quote accepted by customer
      await prisma.invoice.update({
        where: { id: quote.id },
        data: {
          status: 'ACCEPTED',
          metadata: {
            ...((quote.metadata as any) || {}),
            acceptedAt: new Date().toISOString(),
            acceptedManually: true,
            reason: reason || 'Quote accepted by customer',
          },
        },
      });
    } else if (status === 'SIGNED' && (oldStatus === 'ACCEPTED' || oldStatus === 'SENT')) {
      // Quote signed by customer
      await prisma.invoice.update({
        where: { id: quote.id },
        data: {
          status: 'SIGNED',
          metadata: {
            ...((quote.metadata as any) || {}),
            signedManually: true,
            signedAt: new Date().toISOString(),
            reason: reason || 'Quote signed by customer',
          },
        },
      });
    } else if (status === 'PENDING_PAYMENT' && (oldStatus === 'SIGNED' || oldStatus === 'ACCEPTED')) {
      // Awaiting payment
      await prisma.invoice.update({
        where: { id: quote.id },
        data: {
          status: 'PENDING_PAYMENT',
          metadata: {
            ...((quote.metadata as any) || {}),
            pendingPaymentAt: new Date().toISOString(),
            reason: reason || 'Awaiting payment',
          },
        },
      });
    } else if (status === 'PAID' && oldStatus !== 'PAID') {
      // Quote paid - add funds to wallet
      await prisma.$transaction(async (tx) => {
        // Update quote to paid
        await tx.invoice.update({
          where: { id: quote.id },
          data: {
            status: 'PAID',
            amountPaid: quote.total,
            amountDue: 0,
            paidDate: new Date(),
          },
        });

        // Ensure wallet exists
        let wallet = quote.user.wallet;
        if (!wallet) {
          wallet = await tx.wallet.create({
            data: { userId: quote.user.id },
          });
        }

        // Create wallet transaction
        await tx.transaction.create({
          data: {
            walletId: wallet.id,
            type: 'DEPOSIT',
            amount: quote.total,
            status: 'COMPLETED',
            description: `Payment for quote ${quote.invoiceNumber}`,
            reference: `QUOTE-PAYMENT-${quote.invoiceNumber}`,
            metadata: {
              quoteId: quote.id,
              quoteNumber: quote.invoiceNumber,
              markedPaidManually: true,
              source: 'admin_manual_update',
              reason: reason || 'Manual payment for quote',
              locked: true,
            },
            lockedUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
          },
        });

        // Update wallet balance
        await tx.wallet.update({
          where: { id: wallet.id },
          data: {
            balance: { increment: quote.total },
            lockedBalance: { increment: quote.total },
          },
        });
      });
    } else if (status === 'REJECTED' && (oldStatus === 'SENT' || oldStatus === 'ACCEPTED')) {
      // Quote rejected by customer
      await prisma.invoice.update({
        where: { id: quote.id },
        data: {
          status: 'REJECTED',
          metadata: {
            ...((quote.metadata as any) || {}),
            rejectedAt: new Date().toISOString(),
            rejectedReason: reason || 'Quote rejected by customer',
          },
        },
      });
    } else if (status === 'CANCELLED') {
      // Quote cancelled - handle refund if was paid
      if (oldStatus === 'PAID') {
        await prisma.$transaction(async (tx) => {
          // Update quote
          await tx.invoice.update({
            where: { id: quote.id },
            data: {
              status: 'CANCELLED',
              amountPaid: 0,
              amountDue: quote.total,
              paidDate: null,
            },
          });

          // Remove funds from wallet if they exist
          if (quote.user.wallet) {
            await tx.transaction.create({
              data: {
                walletId: quote.user.wallet.id,
                type: 'REFUND',
                amount: -quote.total,
                status: 'COMPLETED',
                description: `Cancelled quote ${quote.invoiceNumber}`,
                reference: `QUOTE-CANCEL-${quote.invoiceNumber}`,
                metadata: {
                  quoteId: quote.id,
                  quoteNumber: quote.invoiceNumber,
                  cancelledManually: true,
                  reason: reason || 'Quote cancelled',
                },
              },
            });

            await tx.wallet.update({
              where: { id: quote.user.wallet.id },
              data: {
                balance: { decrement: quote.total },
                lockedBalance: { decrement: Math.min(quote.total, quote.user.wallet.lockedBalance) },
              },
            });
          }
        });
      } else {
        // Just cancel without financial impact
        await prisma.invoice.update({
          where: { id: quote.id },
          data: {
            status: 'CANCELLED',
            metadata: {
              ...((quote.metadata as any) || {}),
              cancelledAt: new Date().toISOString(),
              reason: reason || 'Quote cancelled',
            },
          },
        });
      }
    } else {
      // Simple status update without special handling
      await prisma.invoice.update({
        where: { id: quote.id },
        data: {
          status: status as any,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: `Quote ${quote.invoiceNumber} status updated from ${oldStatus} to ${status}`,
    });
  } catch (error) {
    console.error('Error updating quote status:', error);
    return NextResponse.json(
      { error: 'Failed to update quote status' },
      { status: 500 }
    );
  }
}
