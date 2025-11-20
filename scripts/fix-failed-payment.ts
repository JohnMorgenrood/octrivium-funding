// Script to fix invoices marked as paid but PayPal never captured payment
// Run this with: npx tsx scripts/fix-failed-payment.ts <invoice-number>

import { prisma } from '../lib/prisma';

async function fixFailedPayment(invoiceNumber: string) {
  try {
    console.log(`Looking for invoice: ${invoiceNumber}`);
    
    const invoice = await prisma.invoice.findFirst({
      where: { invoiceNumber },
      include: {
        user: {
          include: {
            wallet: true,
          },
        },
      },
    });

    if (!invoice) {
      console.error('Invoice not found!');
      return;
    }

    console.log(`Found invoice: ${invoice.id}`);
    console.log(`Current status: ${invoice.status}`);
    console.log(`Amount Due: ${invoice.amountDue}`);

    if (invoice.status !== 'PAID') {
      console.log('Invoice is not marked as paid, nothing to fix.');
      return;
    }

    // Reset invoice to unpaid
    await prisma.invoice.update({
      where: { id: invoice.id },
      data: {
        status: 'PENDING',
        amountDue: invoice.total,
        amountPaid: 0,
        paidDate: null,
      },
    });

    console.log('✅ Invoice reset to PENDING');

    // If there's a wallet transaction, remove it
    if (invoice.user.wallet) {
      const transactions = await prisma.transaction.findMany({
        where: {
          walletId: invoice.user.wallet.id,
          reference: `INV-${invoice.invoiceNumber}`,
        },
      });

      if (transactions.length > 0) {
        console.log(`Found ${transactions.length} wallet transactions to remove`);
        
        for (const tx of transactions) {
          // Remove from wallet balance
          await prisma.wallet.update({
            where: { id: invoice.user.wallet.id },
            data: {
              balance: { decrement: Number(tx.amount) },
              lockedBalance: { decrement: Number(tx.amount) },
            },
          });

          // Delete transaction
          await prisma.transaction.delete({
            where: { id: tx.id },
          });
        }

        console.log('✅ Wallet transactions removed');
      }
    }

    console.log('✅ Payment fix complete!');
  } catch (error) {
    console.error('Error fixing payment:', error);
  } finally {
    await prisma.$disconnect();
  }
}

const invoiceNumber = process.argv[2];

if (!invoiceNumber) {
  console.error('Usage: npx tsx scripts/fix-failed-payment.ts <invoice-number>');
  console.error('Example: npx tsx scripts/fix-failed-payment.ts INV-00003');
  process.exit(1);
}

fixFailedPayment(invoiceNumber);
