import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { invoiceId } = await request.json();

    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: {
        customer: true,
        user: true,
      },
    });

    if (!invoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    // Verify ownership
    if (invoice.userId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    if (invoice.status === 'PAID') {
      return NextResponse.json({ error: 'Invoice already paid' }, { status: 400 });
    }

    if (!invoice.customer?.email) {
      return NextResponse.json({ error: 'Customer has no email address' }, { status: 400 });
    }

    const paymentUrl = `${process.env.NEXTAUTH_URL || 'https://octrivium.co.za'}/pay/${invoice.paymentLink}`;
    const daysOverdue = Math.floor((new Date().getTime() - new Date(invoice.dueDate).getTime()) / (1000 * 60 * 60 * 24));
    const isOverdue = daysOverdue > 0;
    
    const companyEmail = invoice.user.companyEmail || invoice.user.email;
    const companyName = invoice.user.companyName || `${invoice.user.firstName} ${invoice.user.lastName}`;

    // Send reminder email via Resend
    try {
      await resend.emails.send({
        from: `${companyName} <noreply@octrivium.co.za>`,
        to: invoice.customer.email,
        replyTo: companyEmail,
        subject: `Payment Reminder: Invoice ${invoice.invoiceNumber}`,
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                .content { background: #fff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; }
                .warning { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; }
                .info { background: #dbeafe; border-left: 4px solid #3b82f6; padding: 15px; margin: 20px 0; }
                .button { background: #3b82f6; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0; font-weight: bold; }
                .button:hover { background: #2563eb; }
                .details { background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0; }
                .details-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
                .details-row:last-child { border-bottom: none; }
                .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1 style="margin: 0; font-size: 28px;">Payment Reminder</h1>
                  <p style="margin: 10px 0 0 0; opacity: 0.9;">Invoice ${invoice.invoiceNumber}</p>
                </div>
                <div class="content">
                  <p>Dear ${invoice.customer.name},</p>
                  
                  ${isOverdue ? `
                    <div class="warning">
                      <strong>⚠️ Overdue Notice</strong><br>
                      This invoice is ${daysOverdue} day${daysOverdue > 1 ? 's' : ''} overdue. Please arrange payment as soon as possible.
                    </div>
                  ` : `
                    <div class="info">
                      <strong>📋 Payment Reminder</strong><br>
                      This is a friendly reminder that payment for this invoice is due soon.
                    </div>
                  `}

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
                    ${isOverdue ? `
                      <div class="details-row">
                        <span><strong>Days Overdue:</strong></span>
                        <span style="color: #dc2626; font-weight: bold;">${daysOverdue} day${daysOverdue > 1 ? 's' : ''}</span>
                      </div>
                    ` : ''}
                  </div>

                  <center>
                    <a href="${paymentUrl}" class="button">Pay Now</a>
                  </center>

                  <p style="margin-top: 30px;">You can pay online via credit card, instant EFT, or bank transfer. Click the button above to view payment options.</p>
                  
                  <p style="font-size: 14px; color: #6b7280; margin-top: 30px;">If you have already made this payment, please disregard this reminder. If you have any questions, please don't hesitate to contact us.</p>

                  <p style="margin-top: 30px;">
                    Best regards,<br>
                    <strong>${companyName}</strong><br>
                    ${companyEmail}
                  </p>
                </div>
                <div class="footer">
                  <p>This is an automated reminder from ${companyName}</p>
                  <p>You can view your invoice anytime at: <a href="${paymentUrl}" style="color: #3b82f6;">${paymentUrl}</a></p>
                </div>
              </div>
            </body>
          </html>
        `,
      });

      console.log('Reminder email sent successfully:', {
        to: invoice.customer.email,
        invoiceNumber: invoice.invoiceNumber,
        daysOverdue: isOverdue ? daysOverdue : 0,
      });

      return NextResponse.json({ 
        success: true, 
        message: 'Reminder sent successfully',
        details: {
          to: invoice.customer.email,
          invoiceNumber: invoice.invoiceNumber,
        }
      });
    } catch (emailError) {
      console.error('Error sending reminder email:', emailError);
      return NextResponse.json({ error: 'Failed to send reminder email' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error sending reminder:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
