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
    
    // Only admin can manually update invoice status
    if (!session?.user?.email || session.user.email !== 'golearnx@gmail.com') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { status, reason } = await request.json();

    // Validate status
    const validStatuses = ['DRAFT', 'SENT', 'PAID', 'OVERDUE', 'CANCELLED', 'REFUNDED'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const invoice = await prisma.invoice.findUnique({
      where: { id: params.invoiceId },
      include: {
        user: {
          include: { wallet: true },
        },
      },
    });

    if (!invoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    const oldStatus = invoice.status;

    // Handle status transitions
    if (status === 'PAID' && oldStatus !== 'PAID') {
      // Mark as paid - add funds to wallet
      await prisma.$transaction(async (tx) => {
        // Update invoice
        await tx.invoice.update({
          where: { id: invoice.id },
          data: {
            status: 'PAID',
            amountPaid: invoice.total,
            amountDue: 0,
            paidDate: new Date(),
          },
        });

        // Ensure wallet exists
        let wallet = invoice.user.wallet;
        if (!wallet) {
          wallet = await tx.wallet.create({
            data: { userId: invoice.user.id },
          });
        }

        // Create wallet transaction
        await tx.transaction.create({
          data: {
            walletId: wallet.id,
            type: 'DEPOSIT',
            amount: invoice.total,
            status: 'COMPLETED',
            description: `Manual payment - Invoice ${invoice.invoiceNumber}`,
            reference: `MANUAL-PAYMENT-${invoice.invoiceNumber}`,
            metadata: {
              invoiceId: invoice.id,
              invoiceNumber: invoice.invoiceNumber,
              markedPaidManually: true,
              source: 'admin_manual_update',
              reason: reason || 'Manual status update by admin',
              locked: true,
            },
            lockedUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
          },
        });

        // Update wallet balance
        await tx.wallet.update({
          where: { id: wallet.id },
          data: {
            balance: { increment: invoice.total },
            lockedBalance: { increment: invoice.total },
          },
        });
      });
    } else if (status === 'CANCELLED' && oldStatus === 'PAID') {
      // Cancelled but was paid - need to refund
      await prisma.$transaction(async (tx) => {
        // Update invoice
        await tx.invoice.update({
          where: { id: invoice.id },
          data: {
            status: 'CANCELLED',
            amountPaid: 0,
            amountDue: invoice.total,
            paidDate: null,
          },
        });

        // Remove funds from wallet if they exist
        if (invoice.user.wallet) {
          await tx.transaction.create({
            data: {
              walletId: invoice.user.wallet.id,
              type: 'REFUND',
              amount: -invoice.total,
              status: 'COMPLETED',
              description: `Cancelled - Invoice ${invoice.invoiceNumber}`,
              reference: `CANCEL-REFUND-${invoice.invoiceNumber}`,
              metadata: {
                invoiceId: invoice.id,
                invoiceNumber: invoice.invoiceNumber,
                cancelledManually: true,
                reason: reason || 'Manual cancellation by admin',
              },
            },
          });

          await tx.wallet.update({
            where: { id: invoice.user.wallet.id },
            data: {
              balance: { decrement: invoice.total },
              lockedBalance: { decrement: Math.min(invoice.total, invoice.user.wallet.lockedBalance) },
            },
          });
        }
      });
    } else {
      // Simple status update without financial impact
      await prisma.invoice.update({
        where: { id: invoice.id },
        data: {
          status: status as any,
          ...(status === 'SENT' && { amountDue: invoice.total, amountPaid: 0, paidDate: null }),
          ...(status === 'DRAFT' && { amountDue: invoice.total, amountPaid: 0, paidDate: null }),
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: `Invoice ${invoice.invoiceNumber} status updated from ${oldStatus} to ${status}`,
    });
  } catch (error) {
    console.error('Error updating invoice status:', error);
    return NextResponse.json(
      { error: 'Failed to update invoice status' },
      { status: 500 }
    );
  }
}
