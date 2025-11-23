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

    // Build email HTML - Professional template matching email dashboard design
    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Invoice ${invoice.invoiceNumber}</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f9fafb;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; padding: 40px 20px;">
            <tr>
              <td align="center">
                <table width="650" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">
                  <!-- Header with Logo -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #9333ea 0%, #3b82f6 100%); padding: 40px 40px 30px; text-align: center;">
                      ${invoice.user.companyLogo ? `
                        <img src="${invoice.user.companyLogo}" alt="${invoice.user.companyName || 'Company Logo'}" style="height: 60px; max-width: 240px; margin: 0 auto 20px; display: block;">
                      ` : `
                        <div style="font-size: 28px; font-weight: 700; color: #ffffff; margin-bottom: 10px;">${invoice.user.companyName || 'Octrivium'}</div>
                      `}
                      <div style="color: #ffffff; font-size: 36px; font-weight: 700; margin: 10px 0;">Invoice ${invoice.invoiceNumber}</div>
                      <div style="color: #ffffff; font-size: 15px; opacity: 0.9; margin-top: 8px;">
                        ${invoice.user.companyName || `${invoice.user.firstName} ${invoice.user.lastName}`}
                      </div>
                    </td>
                  </tr>
                  
                  <!-- Main Content -->
                  <tr>
                    <td style="padding: 40px;">
                      <div style="color: #111827; font-size: 18px; font-weight: 600; margin-bottom: 10px;">Hi ${invoice.customer.name},</div>
                      <div style="color: #6b7280; font-size: 15px; line-height: 1.6; margin-bottom: 30px;">Thank you for your business! Please find your invoice details below.</div>
                      <div style="color: #111827; font-size: 18px; font-weight: 600; margin-bottom: 10px;">Hi ${invoice.customer.name},</div>
                      <div style="color: #6b7280; font-size: 15px; line-height: 1.6; margin-bottom: 30px;">Thank you for your business! Please find your invoice details below.</div>

                      <!-- Invoice Summary Box -->
                      <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); border-radius: 12px; overflow: hidden; margin-bottom: 30px; border-left: 5px solid #9333ea;">
                        <tr>
                          <td style="padding: 25px;">
                            <table width="100%" cellpadding="0" cellspacing="0">
                              <tr>
                                <td style="padding: 10px 0; color: #495057; font-weight: 600; font-size: 14px;">Invoice Number:</td>
                                <td style="padding: 10px 0; color: #212529; font-weight: 600; text-align: right;">${invoice.invoiceNumber}</td>
                              </tr>
                              <tr>
                                <td style="padding: 10px 0; color: #495057; font-weight: 600; font-size: 14px; border-top: 1px solid #dee2e6;">Issue Date:</td>
                                <td style="padding: 10px 0; color: #212529; text-align: right; border-top: 1px solid #dee2e6;">${new Date(invoice.issueDate).toLocaleDateString('en-ZA', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
                              </tr>
                              <tr>
                                <td style="padding: 10px 0; color: #495057; font-weight: 600; font-size: 14px; border-top: 1px solid #dee2e6;">Due Date:</td>
                                <td style="padding: 10px 0; color: #212529; text-align: right; border-top: 1px solid #dee2e6;">${new Date(invoice.dueDate).toLocaleDateString('en-ZA', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
                              </tr>
                              <tr>
                                <td style="padding: 10px 0; color: #495057; font-weight: 600; font-size: 14px; border-top: 1px solid #dee2e6;">Status:</td>
                                <td style="padding: 10px 0; text-align: right; border-top: 1px solid #dee2e6;">
                                  <span style="display: inline-block; padding: 6px 12px; border-radius: 20px; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; ${invoice.status === 'PAID' ? 'background: #d4edda; color: #155724;' : 'background: #fff3cd; color: #856404;'}">${invoice.status}</span>
                                </td>
                              </tr>
                              <tr>
                                <td style="padding: 15px 0 10px; color: #495057; font-weight: 700; font-size: 16px; border-top: 2px solid #9333ea;">Amount Due:</td>
                                <td style="padding: 15px 0 10px; color: #9333ea; font-weight: 700; font-size: 20px; text-align: right; border-top: 2px solid #9333ea;">${formatCurrency(Number(invoice.amountDue))}</td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>

                      <!-- Items Table -->
                      <div style="margin: 30px 0;">
                        <div style="color: #111827; font-size: 20px; font-weight: 700; margin-bottom: 15px; padding-bottom: 10px; border-bottom: 2px solid #9333ea;">Invoice Items</div>
                        <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse; margin: 20px 0;">
                          <thead>
                            <tr style="background: linear-gradient(135deg, #9333ea 0%, #3b82f6 100%);">
                              <th style="padding: 12px; text-align: left; color: #ffffff; font-weight: 600; font-size: 14px;">Description</th>
                              <th style="padding: 12px; text-align: right; color: #ffffff; font-weight: 600; font-size: 14px;">Qty</th>
                              <th style="padding: 12px; text-align: right; color: #ffffff; font-weight: 600; font-size: 14px;">Price</th>
                              <th style="padding: 12px; text-align: right; color: #ffffff; font-weight: 600; font-size: 14px;">Total</th>
                            </tr>
                          </thead>
                          <tbody>
                            ${invoice.items.map((item: any) => `
                              <tr style="border-bottom: 1px solid #e9ecef;">
                                <td style="padding: 12px; color: #212529;">${item.description}</td>
                                <td style="padding: 12px; text-align: right; color: #212529;">${Number(item.quantity)}</td>
                                <td style="padding: 12px; text-align: right; color: #212529;">${formatCurrency(Number(item.unitPrice))}</td>
                                <td style="padding: 12px; text-align: right; color: #212529; font-weight: 600;">${formatCurrency(Number(item.total))}</td>
                              </tr>
                            `).join('')}
                          </tbody>
                        </table>
                      </div>

                      <!-- Totals -->
                      <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                        <tr>
                          <td width="60%"></td>
                          <td width="40%">
                            <table width="100%" cellpadding="0" cellspacing="0">
                              <tr>
                                <td style="padding: 8px 0; color: #6b7280; text-align: right; padding-right: 20px;">Subtotal:</td>
                                <td style="padding: 8px 0; color: #111827; font-weight: 600; text-align: right;">${formatCurrency(Number(invoice.subtotal))}</td>
                              </tr>
                              ${Number(invoice.taxAmount) > 0 ? `
                              <tr>
                                <td style="padding: 8px 0; color: #6b7280; text-align: right; padding-right: 20px;">VAT (${invoice.taxRate}%):</td>
                                <td style="padding: 8px 0; color: #111827; font-weight: 600; text-align: right;">${formatCurrency(Number(invoice.taxAmount))}</td>
                              </tr>
                              ` : ''}
                              <tr>
                                <td style="padding: 15px 0 8px; color: #111827; font-weight: 700; font-size: 18px; text-align: right; padding-right: 20px; border-top: 2px solid #111827;">Total:</td>
                                <td style="padding: 15px 0 8px; color: #9333ea; font-weight: 700; font-size: 22px; text-align: right; border-top: 2px solid #111827;">${formatCurrency(Number(invoice.total))}</td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>

                      </table>

                      <!-- Payment Section -->
                      ${paymentLink && invoice.status !== 'PAID' ? `
                        <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                          <tr>
                            <td style="background: linear-gradient(135deg, #e0e7ff 0%, #dbeafe 100%); border: 2px solid #3b82f6; border-radius: 12px; padding: 25px;">
                              <div style="color: #1e40af; font-size: 20px; font-weight: 700; margin-bottom: 12px;">💳 Pay Securely Online</div>
                              <div style="color: #374151; font-size: 15px; line-height: 1.6; margin-bottom: 20px;">Click the button below to view your invoice and make payment. We accept multiple payment methods for your convenience.</div>
                              
                              <!-- Payment Methods -->
                              <table width="100%" cellpadding="0" cellspacing="0" style="background: #ffffff; border-radius: 8px; padding: 15px; margin: 20px 0;">
                                <tr>
                                  <td align="center" style="padding: 8px;">
                                    <div style="display: inline-block; padding: 8px 12px; background: #f3f4f6; border: 1px solid #d1d5db; border-radius: 6px; font-size: 13px; color: #4b5563; font-weight: 600; margin: 5px;">💳 Credit/Debit Card</div>
                                    <div style="display: inline-block; padding: 8px 12px; background: #f3f4f6; border: 1px solid #d1d5db; border-radius: 6px; font-size: 13px; color: #4b5563; font-weight: 600; margin: 5px;">🔵 Google Pay</div>
                                    <div style="display: inline-block; padding: 8px 12px; background: #f3f4f6; border: 1px solid #d1d5db; border-radius: 6px; font-size: 13px; color: #4b5563; font-weight: 600; margin: 5px;">🍎 Apple Pay</div>
                                  </td>
                                </tr>
                                <tr>
                                  <td align="center" style="padding: 8px;">
                                    <div style="display: inline-block; padding: 8px 12px; background: #f3f4f6; border: 1px solid #d1d5db; border-radius: 6px; font-size: 13px; color: #4b5563; font-weight: 600; margin: 5px;">⚡ Instant EFT</div>
                                    <div style="display: inline-block; padding: 8px 12px; background: #f3f4f6; border: 1px solid #d1d5db; border-radius: 6px; font-size: 13px; color: #4b5563; font-weight: 600; margin: 5px;">🌐 PayPal (USD)</div>
                                  </td>
                                </tr>
                              </table>

                              <!-- Payment Button -->
                              <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 25px;">
                                <tr>
                                  <td align="center">
                                    <a href="${paymentLink}" style="display: inline-block; background: linear-gradient(135deg, #9333ea 0%, #3b82f6 100%); color: #ffffff; padding: 16px 40px; text-decoration: none; border-radius: 10px; font-weight: 700; font-size: 16px; box-shadow: 0 4px 15px rgba(147, 51, 234, 0.4);">
                                      View & Pay Invoice →
                                    </a>
                                  </td>
                                </tr>
                              </table>

                              <!-- Security Notice -->
                              <table width="100%" cellpadding="0" cellspacing="0" style="background: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 6px; margin-top: 20px;">
                                <tr>
                                  <td style="padding: 15px;">
                                    <div style="color: #92400e; font-size: 14px; line-height: 1.6;">
                                      <strong>🔒 Secure Payment Processing</strong><br>
                                      Your payment is processed securely through Yoco (for ZAR) or PayPal (for USD). We never see or store your card details.
                                    </div>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>
                      ` : invoice.status === 'PAID' ? `
                        <table width="100%" cellpadding="0" cellspacing="0" style="margin: 20px 0;">
                          <tr>
                            <td style="background: #d1fae5; border-left: 4px solid #10b981; border-radius: 6px; padding: 15px;">
                              <div style="color: #065f46; font-size: 14px; line-height: 1.6;">
                                <strong>✅ Payment Received</strong><br>
                                Thank you! This invoice has been paid in full.
                              </div>
                            </td>
                          </tr>
                        </table>
                      ` : ''}

                      <!-- Notes & Terms -->
                      ${invoice.notes ? `
                        <table width="100%" cellpadding="0" cellspacing="0" style="background: #f9fafb; border-radius: 8px; margin: 20px 0;">
                          <tr>
                            <td style="padding: 20px;">
                              <div style="color: #111827; font-weight: 600; font-size: 16px; margin-bottom: 10px;">📝 Notes</div>
                              <div style="color: #6b7280; font-size: 14px; line-height: 1.6;">${invoice.notes}</div>
                            </td>
                          </tr>
                        </table>
                      ` : ''}

                      ${invoice.terms ? `
                        <table width="100%" cellpadding="0" cellspacing="0" style="background: #f9fafb; border-radius: 8px; margin: 20px 0;">
                          <tr>
                            <td style="padding: 20px;">
                              <div style="color: #111827; font-weight: 600; font-size: 16px; margin-bottom: 10px;">📋 Terms & Conditions</div>
                              <div style="color: #6b7280; font-size: 14px; line-height: 1.6;">${invoice.terms}</div>
                            </td>
                          </tr>
                        </table>
                      ` : ''}

                      <!-- Contact Info -->
                      <table width="100%" cellpadding="0" cellspacing="0" style="background: #f9fafb; border-radius: 8px; margin: 25px 0;">
                        <tr>
                          <td style="padding: 20px; text-align: center;">
                            <div style="color: #111827; font-weight: 600; font-size: 15px; margin-bottom: 10px;">Questions about this invoice?</div>
                            <div style="color: #6b7280; font-size: 14px; margin: 5px 0;">Contact ${invoice.user.firstName} ${invoice.user.lastName}</div>
                            <div style="margin: 5px 0;">
                              <a href="mailto:${invoice.user.companyEmail || invoice.user.email}" style="color: #9333ea; text-decoration: none; font-weight: 600;">${invoice.user.companyEmail || invoice.user.email}</a>
                            </div>
                            ${invoice.user.companyPhone ? `<div style="color: #6b7280; font-size: 14px; margin: 5px 0;">${invoice.user.companyPhone}</div>` : ''}
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="background-color: #f9fafb; padding: 30px 40px; text-align: center; border-top: 1px solid #e5e7eb;">
                      <div style="color: #111827; font-weight: 600; font-size: 15px; margin-bottom: 8px;">Thank you for your business! 🙏</div>
                      <div style="color: #9ca3af; font-size: 13px; margin: 8px 0;">This is an automated email. Please do not reply directly to this message.</div>
                      ${invoice.user.companyName ? `<div style="color: #6b7280; font-size: 13px; margin-top: 15px;">&copy; ${new Date().getFullYear()} ${invoice.user.companyName}. All rights reserved.</div>` : ''}
                      ${invoice.user.website ? `
                        <div style="margin-top: 10px;">
                          <a href="${invoice.user.website}" style="color: #9333ea; text-decoration: none; font-weight: 600; font-size: 13px;">${invoice.user.website}</a>
                        </div>
                      ` : ''}
                      <div style="color: #9ca3af; font-size: 12px; margin-top: 15px;">
                        Powered by <a href="https://octrivium.co.za" style="color: #9333ea; text-decoration: none; font-weight: 600;">Octrivium</a>
                      </div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `;

    // Send email - Use company email if available, otherwise use verified Resend domain
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'invoices@octrivium.co.za';
    const replyToEmail = invoice.user.companyEmail || invoice.user.email;
    
    const resend = getResendClient();
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: [invoice.customer.email],
      reply_to: replyToEmail,
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
