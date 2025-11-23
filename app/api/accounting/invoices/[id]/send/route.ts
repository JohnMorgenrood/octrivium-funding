import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Resend } from 'resend';

// Initialize Resend client lazily to avoid build-time errors
function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error('RESEND_API_KEY is not configured');
  }
  return new Resend(apiKey);
}

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
            companyEmail: true,
            companyPhone: true,
            companyAddress: true,
            companyCity: true,
            companyPostalCode: true,
            companyCountry: true,
            taxNumber: true,
            registrationNumber: true,
            website: true,
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

    // Build email HTML - Professional template with payment options
    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Invoice ${invoice.invoiceNumber}</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              line-height: 1.6;
              color: #1a1a1a;
              background-color: #f5f5f5;
              padding: 20px;
            }
            .email-container {
              max-width: 650px;
              margin: 0 auto;
              background: white;
              border-radius: 12px;
              overflow: hidden;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            .header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 40px 30px;
              text-align: center;
            }
            .header img {
              max-height: 80px;
              max-width: 220px;
              margin: 0 auto 15px;
              object-fit: contain;
              display: block;
            }
            .header h1 {
              margin: 10px 0;
              font-size: 32px;
              font-weight: 700;
            }
            .header .company-name {
              font-size: 16px;
              opacity: 0.95;
              margin-top: 8px;
            }
            .content {
              padding: 40px 30px;
            }
            .greeting {
              font-size: 18px;
              color: #333;
              margin-bottom: 10px;
            }
            .intro-text {
              color: #666;
              margin-bottom: 30px;
              font-size: 15px;
            }
            .invoice-summary {
              background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
              padding: 20px;
              border-radius: 10px;
              margin: 25px 0;
              border-left: 5px solid #667eea;
            }
            .invoice-summary table {
              width: 100%;
              border-collapse: collapse;
            }
            .invoice-summary td {
              padding: 10px 0;
              border-bottom: 1px solid #dee2e6;
            }
            .invoice-summary td:first-child {
              font-weight: 600;
              color: #495057;
              width: 40%;
            }
            .invoice-summary td:last-child {
              color: #212529;
            }
            .invoice-summary tr:last-child td {
              border-bottom: none;
            }
            .status-badge {
              display: inline-block;
              padding: 6px 12px;
              border-radius: 20px;
              font-size: 13px;
              font-weight: 600;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            .status-paid {
              background: #d4edda;
              color: #155724;
            }
            .status-unpaid {
              background: #fff3cd;
              color: #856404;
            }
            .items-section {
              margin: 30px 0;
            }
            .items-section h3 {
              color: #333;
              margin-bottom: 15px;
              font-size: 20px;
              border-bottom: 2px solid #667eea;
              padding-bottom: 10px;
            }
            .items-table {
              width: 100%;
              border-collapse: collapse;
              margin: 20px 0;
            }
            .items-table thead {
              background: #667eea;
              color: white;
            }
            .items-table th {
              padding: 12px;
              text-align: left;
              font-weight: 600;
              font-size: 14px;
            }
            .items-table th:nth-child(2),
            .items-table th:nth-child(3),
            .items-table th:nth-child(4) {
              text-align: right;
            }
            .items-table td {
              padding: 12px;
              border-bottom: 1px solid #e9ecef;
            }
            .items-table td:nth-child(2),
            .items-table td:nth-child(3),
            .items-table td:nth-child(4) {
              text-align: right;
            }
            .items-table tbody tr:hover {
              background: #f8f9fa;
            }
            .totals-section {
              margin: 30px 0;
              text-align: right;
            }
            .totals-table {
              width: 100%;
              max-width: 300px;
              margin-left: auto;
              border-collapse: collapse;
            }
            .totals-table td {
              padding: 8px 0;
            }
            .totals-table td:first-child {
              text-align: right;
              padding-right: 20px;
              color: #666;
            }
            .totals-table td:last-child {
              text-align: right;
              font-weight: 600;
            }
            .total-row {
              border-top: 2px solid #333;
              margin-top: 8px;
            }
            .total-row td {
              padding-top: 15px !important;
              font-size: 20px;
              font-weight: 700;
              color: #667eea;
            }
            .payment-section {
              background: linear-gradient(135deg, #e7f3ff 0%, #f0f8ff 100%);
              border: 2px solid #0066cc;
              border-radius: 12px;
              padding: 25px;
              margin: 30px 0;
            }
            .payment-section h3 {
              color: #0066cc;
              margin-bottom: 12px;
              font-size: 20px;
              display: flex;
              align-items: center;
              gap: 8px;
            }
            .payment-section p {
              color: #333;
              margin-bottom: 20px;
              font-size: 15px;
            }
            .payment-options {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
              gap: 8px;
              margin: 20px 0;
              padding: 12px;
              background: white;
              border-radius: 8px;
            }
            .payment-method {
              display: flex;
              align-items: center;
              justify-content: center;
              padding: 10px 12px;
              background: #f8f9fa;
              border: 1px solid #dee2e6;
              border-radius: 6px;
              font-size: 13px;
              color: #495057;
              text-align: center;
              font-weight: 500;
            }
            .primary-button {
              display: inline-block;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white !important;
              padding: 16px 40px;
              text-decoration: none;
              border-radius: 8px;
              font-weight: 700;
              text-align: center;
              font-size: 16px;
              box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
              transition: all 0.3s ease;
            }
            .primary-button:hover {
              transform: translateY(-2px);
              box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
            }
            .info-box {
              background: #fff8e1;
              border-left: 4px solid #ffc107;
              padding: 15px;
              margin: 20px 0;
              border-radius: 4px;
              font-size: 14px;
              color: #666;
            }
            .notes-section, .terms-section {
              background: #f8f9fa;
              padding: 20px;
              border-radius: 8px;
              margin: 20px 0;
            }
            .notes-section h4, .terms-section h4 {
              color: #333;
              margin-bottom: 10px;
              font-size: 16px;
            }
            .notes-section p, .terms-section p {
              color: #666;
              line-height: 1.6;
              margin: 0;
            }
            .footer {
              background: #f8f9fa;
              text-align: center;
              color: #6c757d;
              font-size: 13px;
              padding: 30px 20px;
              border-top: 1px solid #dee2e6;
            }
            .footer p {
              margin: 8px 0;
            }
            .contact-info {
              margin: 25px 0;
              padding: 20px;
              background: #f8f9fa;
              border-radius: 8px;
              text-align: center;
            }
            .contact-info p {
              margin: 5px 0;
              color: #666;
            }
            @media only screen and (max-width: 600px) {
              body {
                padding: 10px;
              }
              .content {
                padding: 25px 20px;
              }
              .header {
                padding: 30px 20px;
              }
              .header h1 {
                font-size: 24px;
              }
              .items-table th, .items-table td {
                padding: 8px 5px;
                font-size: 12px;
              }
              .payment-section {
                padding: 20px 15px;
              }
              .payment-options {
                grid-template-columns: repeat(2, 1fr);
                padding: 10px;
                gap: 6px;
              }
              .payment-method {
                padding: 8px 10px;
                font-size: 12px;
              }
              .primary-button {
                display: block;
                width: 100%;
                padding: 14px 20px;
              }
            }
          </style>
        </head>
        <body>
          <div class="email-container">
            <!-- Header -->
            <div class="header">
              ${invoice.user.companyLogo ? `<img src="${invoice.user.companyLogo}" alt="${invoice.user.companyName || 'Octrivium'}" style="max-height: 60px; max-width: 200px; height: auto; width: auto; object-fit: contain;">` : '<h2 style="margin: 0; color: white;">Octrivium</h2>'}
              <h1>Invoice ${invoice.invoiceNumber}</h1>
              ${invoice.user.companyName && !invoice.user.companyLogo ? `<div class="company-name">${invoice.user.companyName}</div>` : ''}
            </div>

            <!-- Content -->
            <div class="content">
              <p class="greeting">Hi ${invoice.customer.name},</p>
              <p class="intro-text">Thank you for your business! Please find your invoice details below.</p>

              <!-- Invoice Summary -->
              <div class="invoice-summary">
                <table>
                  <tr>
                    <td>Invoice Number:</td>
                    <td><strong>${invoice.invoiceNumber}</strong></td>
                  </tr>
                  <tr>
                    <td>Issue Date:</td>
                    <td>${new Date(invoice.issueDate).toLocaleDateString('en-ZA', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
                  </tr>
                  <tr>
                    <td>Due Date:</td>
                    <td>${new Date(invoice.dueDate).toLocaleDateString('en-ZA', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
                  </tr>
                  <tr>
                    <td>Status:</td>
                    <td>
                      <span class="status-badge ${invoice.status === 'PAID' ? 'status-paid' : 'status-unpaid'}">
                        ${invoice.status}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td>Amount Due:</td>
                    <td><strong style="font-size: 18px; color: #667eea;">${formatCurrency(Number(invoice.amountDue))}</strong></td>
                  </tr>
                </table>
              </div>

              <!-- Items -->
              <div class="items-section">
                <h3>Invoice Items</h3>
                <table class="items-table">
                  <thead>
                    <tr>
                      <th>Description</th>
                      <th>Qty</th>
                      <th>Price</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${invoice.items.map((item: any) => `
                      <tr>
                        <td>${item.description}</td>
                        <td>${Number(item.quantity)}</td>
                        <td>${formatCurrency(Number(item.unitPrice))}</td>
                        <td>${formatCurrency(Number(item.total))}</td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>

              <!-- Totals -->
              <div class="totals-section">
                <table class="totals-table">
                  <tr>
                    <td>Subtotal:</td>
                    <td>${formatCurrency(Number(invoice.subtotal))}</td>
                  </tr>
                  ${Number(invoice.taxAmount) > 0 ? `
                  <tr>
                    <td>VAT (${invoice.taxRate}%):</td>
                    <td>${formatCurrency(Number(invoice.taxAmount))}</td>
                  </tr>
                  ` : ''}
                  <tr class="total-row">
                    <td>Total:</td>
                    <td>${formatCurrency(Number(invoice.total))}</td>
                  </tr>
                </table>
              </div>

              <!-- Payment Section -->
              ${paymentLink && invoice.status !== 'PAID' ? `
                <div class="payment-section">
                  <h3>Pay Securely Online</h3>
                  <p>Click the button below to view your invoice and make payment. We accept multiple payment methods for your convenience.</p>
                  
                  <div class="payment-options">
                    <div class="payment-method">Credit/Debit Card</div>
                    <div class="payment-method">Google Pay</div>
                    <div class="payment-method">Apple Pay</div>
                    <div class="payment-method">Instant EFT</div>
                    <div class="payment-method">PayPal (USD)</div>
                  </div>

                  <div style="text-align: center; margin-top: 25px;">
                    <a href="${paymentLink}" class="primary-button" style="color: white; text-decoration: none;">View & Pay Invoice</a>
                  </div>

                  <div class="info-box">
                    <strong>Secure Payment Processing</strong><br>
                    Your payment is processed securely through Yoco (for ZAR) or PayPal (for USD). We never see or store your card details.
                  </div>
                </div>
              ` : invoice.status === 'PAID' ? `
                <div class="info-box" style="background: #d4edda; border-left-color: #28a745;">
                  <strong>Payment Received</strong><br>
                  Thank you! This invoice has been paid in full.
                </div>
              ` : ''}

              <!-- Notes -->
              ${invoice.notes ? `
                <div class="notes-section">
                  <h4>Notes</h4>
                  <p>${invoice.notes}</p>
                </div>
              ` : ''}

              <!-- Terms -->
              ${invoice.terms ? `
                <div class="terms-section">
                  <h4>Terms & Conditions</h4>
                  <p>${invoice.terms}</p>
                </div>
              ` : ''}

              <!-- Contact Info -->
              <div class="contact-info">
                <p style="font-weight: 600; color: #333; margin-bottom: 10px;">Questions about this invoice?</p>
                <p>Contact ${invoice.user.firstName} ${invoice.user.lastName}</p>
                <p><a href="mailto:${invoice.user.companyEmail || invoice.user.email}" style="color: #667eea; text-decoration: none;">${invoice.user.companyEmail || invoice.user.email}</a></p>
                ${invoice.user.companyPhone ? `<p>${invoice.user.companyPhone}</p>` : ''}
              </div>
            </div>

            <!-- Footer -->
            <div class="footer">
              <p style="font-weight: 600; color: #495057;">Thank you for your business!</p>
              <p>This is an automated email. Please do not reply directly to this message.</p>
              ${invoice.user.companyName ? `<p style="margin-top: 15px;">&copy; ${new Date().getFullYear()} ${invoice.user.companyName}. All rights reserved.</p>` : ''}
              ${invoice.user.website ? `<p><a href="${invoice.user.website}" style="color: #667eea; text-decoration: none;">${invoice.user.website}</a></p>` : ''}
            </div>
          </div>
        </body>
      </html>
    `;

    // Send email - Use company email if available
    const fromEmail = invoice.user.companyEmail || process.env.RESEND_FROM_EMAIL || 'support@octrivium.co.za';
    
    const resend = getResendClient();
    const { data, error } = await resend.emails.send({
      from: fromEmail,
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
