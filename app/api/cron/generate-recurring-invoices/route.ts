import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// This should be called by a cron job daily
export async function POST(req: NextRequest) {
  try {
    // Verify cron secret
    const authHeader = req.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const now = new Date();
    
    // Find all recurring invoices due for generation
    const dueRecurring = await prisma.recurringInvoice.findMany({
      where: {
        active: true,
        nextInvoiceDate: { lte: now },
      },
      include: { customer: true, user: true },
    });

    const results = [];

    for (const recurring of dueRecurring) {
      try {
        // Get next invoice number for this user
        const lastInvoice = await prisma.invoice.findFirst({
          where: { userId: recurring.userId },
          orderBy: { createdAt: 'desc' },
          select: { invoiceNumber: true },
        });

        const nextNumber = lastInvoice
          ? parseInt(lastInvoice.invoiceNumber.split('-')[1] || '0') + 1
          : 1;
        const invoiceNumber = `${recurring.invoicePrefix}-${String(nextNumber).padStart(5, '0')}`;

        // Calculate due date
        const issueDate = new Date();
        const dueDate = new Date(issueDate);
        dueDate.setDate(dueDate.getDate() + recurring.paymentTermsDays);

        // Create the invoice
        const invoice = await prisma.invoice.create({
          data: {
            userId: recurring.userId,
            customerId: recurring.customerId,
            invoiceNumber,
            status: 'SENT',
            issueDate,
            dueDate,
            subtotal: recurring.subtotal,
            taxRate: recurring.taxRate,
            taxAmount: recurring.taxAmount,
            total: recurring.total,
            amountDue: recurring.total,
            notes: recurring.notes,
            terms: recurring.terms,
            items: {
              create: (recurring.items as any[]).map((item: any) => ({
                description: item.description,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                total: item.total,
              })),
            },
          },
        });

        // Calculate next invoice date
        let nextDate = new Date(recurring.nextInvoiceDate);
        
        if (recurring.frequency === 'MONTHLY') {
          nextDate.setMonth(nextDate.getMonth() + recurring.interval);
        } else if (recurring.frequency === 'ANNUALLY') {
          nextDate.setFullYear(nextDate.getFullYear() + recurring.interval);
        }

        // Update recurring invoice
        await prisma.recurringInvoice.update({
          where: { id: recurring.id },
          data: {
            nextInvoiceDate: nextDate,
            lastGeneratedAt: now,
          },
        });

        results.push({
          success: true,
          recurringId: recurring.id,
          invoiceId: invoice.id,
          invoiceNumber: invoice.invoiceNumber,
        });
      } catch (error) {
        console.error(`Error generating invoice for recurring ${recurring.id}:`, error);
        results.push({
          success: false,
          recurringId: recurring.id,
          error: 'Failed to generate invoice',
        });
      }
    }

    return NextResponse.json({
      message: `Processed ${dueRecurring.length} recurring invoices`,
      results,
    });
  } catch (error) {
    console.error('Error in cron job:', error);
    return NextResponse.json({ error: 'Cron job failed' }, { status: 500 });
  }
}
