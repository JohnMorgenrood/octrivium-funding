import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET(request: Request) {
  try {
    // Verify cron secret to prevent unauthorized access
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Find all overdue unpaid invoices
    const overdueInvoices = await prisma.invoice.findMany({
      where: {
        status: 'SENT',
        dueDate: {
          lt: new Date(),
        },
        customer: {
          email: {
            not: null,
          },
        },
      },
      include: {
        customer: true,
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            companyName: true,
            companyEmail: true,
          },
        },
      },
    });

    console.log(`Found ${overdueInvoices.length} overdue invoices to process`);

    const results = {
      total: overdueInvoices.length,
      sent: 0,
      failed: 0,
      errors: [] as any[],
    };

    for (const invoice of overdueInvoices) {
      try {
        const paymentUrl = `${process.env.NEXTAUTH_URL || 'https://octrivium.co.za'}/pay/${invoice.paymentLink}`;
        const daysOverdue = Math.floor((new Date().getTime() - new Date(invoice.dueDate).getTime()) / (1000 * 60 * 60 * 24));
        
        const companyEmail = invoice.user.companyEmail || invoice.user.email;
        const companyName = invoice.user.companyName || `${invoice.user.firstName} ${invoice.user.lastName}`;

        // Only send if we haven't sent a reminder in the last 3 days
        const recentReminder = await prisma.notification.findFirst({
          where: {
            userId: invoice.userId,
            type: 'EMAIL',
            category: 'PAYMENT_REMINDER',
            message: {
              contains: invoice.invoiceNumber,
            },
            createdAt: {
              gte: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
            },
          },
        });

        if (recentReminder) {
          console.log(`Skipping invoice ${invoice.invoiceNumber} - reminder sent recently`);
          continue;
        }

        // Send reminder email
        await resend.emails.send({
          from: `${companyName} <noreply@octrivium.co.za>`,
          to: invoice.customer!.email!,
          reply_to: companyEmail,
          subject: `Payment Overdue: Invoice ${invoice.invoiceNumber}`,
          html: `
            <!DOCTYPE html>
            <html>
              <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                  body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                  .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                  .header { background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                  .content { background: #fff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; }
                  .warning { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; }
                  .button { background: #ef4444; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0; font-weight: bold; }
                  .button:hover { background: #dc2626; }
                  .details { background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0; }
                  .details-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
                  .details-row:last-child { border-bottom: none; }
                  .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }
                </style>
              </head>
              <body>
                <div class="container">
                  <div class="header">
                    <h1 style="margin: 0; font-size: 28px;">⚠️ Payment Overdue</h1>
                    <p style="margin: 10px 0 0 0; opacity: 0.9;">Invoice ${invoice.invoiceNumber}</p>
                  </div>
                  <div class="content">
                    <p>Dear ${invoice.customer!.name},</p>
                    
                    <div class="warning">
                      <strong>⚠️ Overdue Notice</strong><br>
                      This invoice is ${daysOverdue} day${daysOverdue > 1 ? 's' : ''} overdue. Please arrange payment immediately to avoid any disruption to services.
                    </div>

                    <div class="details">
                      <div class="details-row">
                        <span><strong>Invoice Number:</strong></span>
                        <span>${invoice.invoiceNumber}</span>
                      </div>
                      <div class="details-row">
                        <span><strong>Amount Due:</strong></span>
                        <span style="color: #dc2626; font-size: 18px; font-weight: bold;">R${Number(invoice.amountDue).toFixed(2)}</span>
                      </div>
                      <div class="details-row">
                        <span><strong>Due Date:</strong></span>
                        <span>${new Date(invoice.dueDate).toLocaleDateString()}</span>
                      </div>
                      <div class="details-row">
                        <span><strong>Days Overdue:</strong></span>
                        <span style="color: #dc2626; font-weight: bold;">${daysOverdue} day${daysOverdue > 1 ? 's' : ''}</span>
                      </div>
                    </div>

                    <center>
                      <a href="${paymentUrl}" class="button">Pay Now</a>
                    </center>

                    <p style="margin-top: 30px;">Please pay this invoice as soon as possible. You can pay online via credit card, instant EFT, or bank transfer.</p>
                    
                    <p style="font-size: 14px; color: #6b7280; margin-top: 30px;">If you have already made this payment, please disregard this reminder. If you have any questions or need to discuss payment arrangements, please contact us immediately.</p>

                    <p style="margin-top: 30px;">
                      Best regards,<br>
                      <strong>${companyName}</strong><br>
                      ${companyEmail}
                    </p>
                  </div>
                  <div class="footer">
                    <p>This is an automated reminder from ${companyName}</p>
                    <p>You can view your invoice anytime at: <a href="${paymentUrl}" style="color: #ef4444;">${paymentUrl}</a></p>
                  </div>
                </div>
              </body>
            </html>
          `,
        });

        // Create notification record
        await prisma.notification.create({
          data: {
            userId: invoice.userId,
            type: 'EMAIL',
            category: 'PAYMENT_REMINDER',
            title: `Reminder sent for ${invoice.invoiceNumber}`,
            message: `Automated overdue reminder sent to ${invoice.customer!.name} (${daysOverdue} days overdue)`,
            read: true, // Mark as read since it's automatic
          },
        });

        results.sent++;
        console.log(`Sent reminder for invoice ${invoice.invoiceNumber} to ${invoice.customer!.email}`);
      } catch (error) {
        results.failed++;
        results.errors.push({
          invoiceId: invoice.id,
          invoiceNumber: invoice.invoiceNumber,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
        console.error(`Failed to send reminder for invoice ${invoice.invoiceNumber}:`, error);
      }
    }

    return NextResponse.json({
      success: true,
      results,
      message: `Processed ${results.total} overdue invoices: ${results.sent} sent, ${results.failed} failed`,
    });
  } catch (error) {
    console.error('Error in automated reminders cron:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
