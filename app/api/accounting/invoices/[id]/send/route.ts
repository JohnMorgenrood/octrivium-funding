import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch invoice with all details
    const invoice = await prisma.invoice.findUnique({
      where: { id: params.id },
      include: {
        customer: true,
        items: true,
        user: {
          select: {
            email: true,
            firstName: true,
            lastName: true,
            companyName: true,
            companyLogo: true,
          },
        },
      },
    });

    if (!invoice || invoice.userId !== session.user.id) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    if (!invoice.customer?.email) {
      return NextResponse.json({ error: 'Customer email not found' }, { status: 400 });
    }

    // Format currency
    const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat('en-ZA', {
        style: 'currency',
        currency: 'ZAR',
      }).format(amount);
    };

    // Create payment link
    const paymentLink = invoice.paymentLink
      ? `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/pay/${invoice.paymentLink}`
      : null;

    // Build email HTML
    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Invoice ${invoice.invoiceNumber}</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 30px;
              border-radius: 8px 8px 0 0;
              text-align: center;
            }
            .header h1 {
              margin: 0;
              font-size: 28px;
            }
            .content {
              background: #f8f9fa;
              padding: 30px;
              border-radius: 0 0 8px 8px;
            }
            .invoice-details {
              background: white;
              padding: 20px;
              border-radius: 8px;
              margin: 20px 0;
            }
            .invoice-details table {
              width: 100%;
              border-collapse: collapse;
            }
            .invoice-details th {
              text-align: left;
              padding: 8px;
              border-bottom: 2px solid #dee2e6;
            }
            .invoice-details td {
              padding: 8px;
              border-bottom: 1px solid #dee2e6;
            }
            .total-row {
              font-weight: bold;
              font-size: 18px;
              background: #f8f9fa;
            }
            .button {
              display: inline-block;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white !important;
              padding: 14px 28px;
              text-decoration: none;
              border-radius: 6px;
              font-weight: 600;
              text-align: center;
              margin: 20px 0;
            }
            .footer {
              text-align: center;
              color: #6c757d;
              font-size: 14px;
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #dee2e6;
            }
            .info-box {
              background: #e7f3ff;
              border-left: 4px solid #0066cc;
              padding: 15px;
              margin: 20px 0;
              border-radius: 4px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            ${invoice.user.companyLogo ? `<img src="${invoice.user.companyLogo}" alt="Logo" style="max-height: 60px; margin-bottom: 10px;">` : ''}
            <h1>Invoice ${invoice.invoiceNumber}</h1>
            ${invoice.user.companyName ? `<p style="margin: 5px 0 0 0;">${invoice.user.companyName}</p>` : ''}
          </div>

          <div class="content">
            <p>Hi ${invoice.customer.name},</p>
            
            <p>Thank you for your business! Please find your invoice details below.</p>

            <div class="invoice-details">
              <table>
                <tr>
                  <td><strong>Invoice Number:</strong></td>
                  <td>${invoice.invoiceNumber}</td>
                </tr>
                <tr>
                  <td><strong>Issue Date:</strong></td>
                  <td>${new Date(invoice.issueDate).toLocaleDateString()}</td>
                </tr>
                <tr>
                  <td><strong>Due Date:</strong></td>
                  <td>${new Date(invoice.dueDate).toLocaleDateString()}</td>
                </tr>
                <tr>
                  <td><strong>Status:</strong></td>
                  <td><span style="background: ${invoice.status === 'PAID' ? '#d4edda' : '#fff3cd'}; padding: 4px 8px; border-radius: 4px;">${invoice.status}</span></td>
                </tr>
              </table>

              <h3 style="margin-top: 30px;">Items</h3>
              <table>
                <thead>
                  <tr>
                    <th>Description</th>
                    <th style="text-align: right;">Qty</th>
                    <th style="text-align: right;">Price</th>
                    <th style="text-align: right;">Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${invoice.items.map((item: any) => `
                    <tr>
                      <td>${item.description}</td>
                      <td style="text-align: right;">${Number(item.quantity)}</td>
                      <td style="text-align: right;">${formatCurrency(Number(item.unitPrice))}</td>
                      <td style="text-align: right;">${formatCurrency(Number(item.total))}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>

              <table style="margin-top: 20px;">
                <tr>
                  <td style="text-align: right; padding-right: 50px;"><strong>Subtotal:</strong></td>
                  <td style="text-align: right;"><strong>${formatCurrency(Number(invoice.subtotal))}</strong></td>
                </tr>
                ${Number(invoice.taxAmount) > 0 ? `
                <tr>
                  <td style="text-align: right; padding-right: 50px;">VAT (${invoice.taxRate}%):</td>
                  <td style="text-align: right;">${formatCurrency(Number(invoice.taxAmount))}</td>
                </tr>
                ` : ''}
                <tr class="total-row">
                  <td style="text-align: right; padding-right: 50px;">Total:</td>
                  <td style="text-align: right;">${formatCurrency(Number(invoice.total))}</td>
                </tr>
              </table>
            </div>

            ${paymentLink && invoice.status !== 'PAID' ? `
              <div class="info-box">
                <p style="margin: 0;"><strong>💳 Pay Online</strong></p>
                <p style="margin: 5px 0 10px 0;">You can view and pay this invoice securely online:</p>
                <a href="${paymentLink}" class="button">View & Pay Invoice</a>
              </div>
            ` : ''}

            ${invoice.notes ? `
              <div style="margin: 20px 0;">
                <strong>Notes:</strong>
                <p style="margin: 5px 0;">${invoice.notes}</p>
              </div>
            ` : ''}

            ${invoice.terms ? `
              <div style="margin: 20px 0;">
                <strong>Terms:</strong>
                <p style="margin: 5px 0;">${invoice.terms}</p>
              </div>
            ` : ''}

            <p>If you have any questions about this invoice, please don't hesitate to contact us.</p>

            <p>Best regards,<br>
            ${invoice.user.firstName} ${invoice.user.lastName}<br>
            ${invoice.user.email}</p>
          </div>

          <div class="footer">
            <p>This is an automated email. Please do not reply directly to this message.</p>
            ${invoice.user.companyName ? `<p>&copy; ${new Date().getFullYear()} ${invoice.user.companyName}. All rights reserved.</p>` : ''}
          </div>
        </body>
      </html>
    `;

    // Send email
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'invoices@octrivium.com',
      to: [invoice.customer.email],
      subject: `Invoice ${invoice.invoiceNumber} from ${invoice.user.companyName || invoice.user.firstName + ' ' + invoice.user.lastName}`,
      html: emailHtml,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
    }

    // Update invoice status to SENT if it was DRAFT
    if (invoice.status === 'DRAFT') {
      await prisma.invoice.update({
        where: { id: params.id },
        data: { status: 'SENT' },
      });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Invoice sent successfully',
      emailId: data?.id 
    });
  } catch (error) {
    console.error('Email sending error:', error);
    return NextResponse.json(
      { error: 'Failed to send invoice email' },
      { status: 500 }
    );
  }
}
