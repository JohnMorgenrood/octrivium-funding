import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
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

    // Format currency
    const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat('en-ZA', {
        style: 'currency',
        currency: 'ZAR',
      }).format(amount);
    };

    // Get template styles based on templateId
    const getTemplateStyles = (templateId: number) => {
      const styles: Record<number, { primary: string; secondary: string; accent: string }> = {
        1: { primary: '#1e40af', secondary: '#3b82f6', accent: '#dbeafe' }, // Classic Blue
        2: { primary: '#7c3aed', secondary: '#8b5cf6', accent: '#ede9fe' }, // Modern Purple
        3: { primary: '#0f172a', secondary: '#334155', accent: '#f1f5f9' }, // Minimal Gray
        4: { primary: '#dc2626', secondary: '#ef4444', accent: '#fee2e2' }, // Bold Red
        5: { primary: '#0369a1', secondary: '#0284c7', accent: '#e0f2fe' }, // Corporate Cyan
        6: { primary: '#ea580c', secondary: '#f97316', accent: '#ffedd5' }, // Creative Orange
        7: { primary: '#4c1d95', secondary: '#6d28d9', accent: '#f3e8ff' }, // Elegant Purple
        8: { primary: '#065f46', secondary: '#059669', accent: '#d1fae5' }, // Tech Green
        9: { primary: '#831843', secondary: '#9f1239', accent: '#fce7f3' }, // Luxury Rose
        10: { primary: '#be123c', secondary: '#e11d48', accent: '#ffe4e6' }, // Playful Pink
      };
      return styles[templateId] || styles[1];
    };

    const colors = getTemplateStyles(invoice.templateId || 1);

    // Generate HTML for PDF
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Invoice ${invoice.invoiceNumber}</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            @page {
              size: A4;
              margin: 0;
            }
            
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              line-height: 1.6;
              color: #1f2937;
              background: white;
            }
            
            .page {
              width: 210mm;
              min-height: 297mm;
              padding: 20mm;
              margin: 0 auto;
              background: white;
            }
            
            .header {
              display: flex;
              justify-content: space-between;
              align-items: start;
              margin-bottom: 40px;
              padding-bottom: 20px;
              border-bottom: 3px solid ${colors.primary};
            }
            
            .company-info {
              flex: 1;
            }
            
            .company-logo {
              max-width: 150px;
              max-height: 80px;
              margin-bottom: 10px;
            }
            
            .company-name {
              font-size: 24px;
              font-weight: 700;
              color: ${colors.primary};
              margin-bottom: 5px;
            }
            
            .company-details {
              font-size: 11px;
              color: #6b7280;
              line-height: 1.5;
            }
            
            .invoice-title {
              text-align: right;
              flex: 1;
            }
            
            .invoice-title h1 {
              font-size: 36px;
              font-weight: 700;
              color: ${colors.primary};
              margin-bottom: 5px;
            }
            
            .invoice-number {
              font-size: 14px;
              color: #6b7280;
            }
            
            .info-section {
              display: flex;
              justify-content: space-between;
              margin-bottom: 40px;
            }
            
            .info-box {
              flex: 1;
            }
            
            .info-box h3 {
              font-size: 12px;
              font-weight: 600;
              color: #6b7280;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              margin-bottom: 10px;
            }
            
            .info-box p {
              font-size: 13px;
              margin-bottom: 3px;
            }
            
            .customer-name {
              font-size: 16px;
              font-weight: 600;
              color: #111827;
              margin-bottom: 5px;
            }
            
            .dates-table {
              background: ${colors.accent};
              padding: 15px;
              border-radius: 8px;
            }
            
            .dates-table table {
              width: 100%;
              border-collapse: collapse;
            }
            
            .dates-table td {
              padding: 5px 0;
              font-size: 13px;
            }
            
            .dates-table td:first-child {
              font-weight: 600;
              color: #4b5563;
            }
            
            .dates-table td:last-child {
              text-align: right;
            }
            
            .items-table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 30px;
            }
            
            .items-table thead {
              background: ${colors.primary};
              color: white;
            }
            
            .items-table th {
              padding: 12px;
              text-align: left;
              font-size: 12px;
              font-weight: 600;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            
            .items-table th:nth-child(2),
            .items-table th:nth-child(3),
            .items-table th:nth-child(4) {
              text-align: right;
            }
            
            .items-table td {
              padding: 12px;
              border-bottom: 1px solid #e5e7eb;
              font-size: 13px;
            }
            
            .items-table td:nth-child(2),
            .items-table td:nth-child(3),
            .items-table td:nth-child(4) {
              text-align: right;
            }
            
            .items-table tbody tr:hover {
              background: #f9fafb;
            }
            
            .totals {
              margin-left: auto;
              width: 300px;
            }
            
            .totals table {
              width: 100%;
              border-collapse: collapse;
            }
            
            .totals td {
              padding: 8px 12px;
              font-size: 13px;
            }
            
            .totals td:first-child {
              text-align: right;
              color: #6b7280;
            }
            
            .totals td:last-child {
              text-align: right;
              font-weight: 600;
            }
            
            .totals .subtotal-row {
              border-top: 1px solid #e5e7eb;
            }
            
            .totals .tax-row {
              color: #6b7280;
            }
            
            .totals .total-row {
              background: ${colors.accent};
              border-top: 2px solid ${colors.primary};
              font-size: 16px;
            }
            
            .totals .total-row td {
              padding: 12px;
              font-weight: 700;
              color: ${colors.primary};
            }
            
            .notes-section {
              margin-top: 40px;
              padding-top: 20px;
              border-top: 1px solid #e5e7eb;
            }
            
            .notes-section h3 {
              font-size: 14px;
              font-weight: 600;
              color: #111827;
              margin-bottom: 10px;
            }
            
            .notes-section p {
              font-size: 12px;
              color: #6b7280;
              line-height: 1.6;
              white-space: pre-wrap;
            }
            
            .footer {
              margin-top: 60px;
              padding-top: 20px;
              border-top: 1px solid #e5e7eb;
              text-align: center;
              font-size: 11px;
              color: #9ca3af;
            }
            
            .status-badge {
              display: inline-block;
              padding: 4px 12px;
              border-radius: 4px;
              font-size: 11px;
              font-weight: 600;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            
            .status-paid {
              background: #d1fae5;
              color: #065f46;
            }
            
            .status-sent {
              background: #dbeafe;
              color: #1e40af;
            }
            
            .status-overdue {
              background: #fee2e2;
              color: #991b1b;
            }
            
            .status-draft {
              background: #f3f4f6;
              color: #374151;
            }
            
            @media print {
              .page {
                margin: 0;
                border: none;
                box-shadow: none;
              }
            }
          </style>
        </head>
        <body>
          <div class="page">
            <div class="header">
              <div class="company-info">
                ${invoice.user.companyLogo ? `<img src="${invoice.user.companyLogo}" alt="Logo" class="company-logo">` : ''}
                <div class="company-name">${invoice.user.companyName || `${invoice.user.firstName} ${invoice.user.lastName}`}</div>
                <div class="company-details">
                  ${invoice.user.companyEmail || invoice.user.email}<br>
                  ${invoice.user.companyPhone ? `${invoice.user.companyPhone}<br>` : ''}
                  ${invoice.user.companyAddress ? `${invoice.user.companyAddress}<br>` : ''}
                  ${invoice.user.companyCity || invoice.user.companyPostalCode || invoice.user.companyCountry ? 
                    `${[invoice.user.companyCity, invoice.user.companyPostalCode, invoice.user.companyCountry].filter(Boolean).join(', ')}<br>` 
                    : ''}
                  ${invoice.user.website ? `${invoice.user.website}<br>` : ''}
                  ${invoice.user.registrationNumber ? `Reg: ${invoice.user.registrationNumber}<br>` : ''}
                  ${invoice.user.taxNumber ? `VAT: ${invoice.user.taxNumber}` : ''}
                </div>
              </div>
              <div class="invoice-title">
                <h1>${invoice.documentType === 'QUOTE' ? 'QUOTE' : 'INVOICE'}</h1>
                <div class="invoice-number">${invoice.invoiceNumber}</div>
                <div style="margin-top: 10px;">
                  <span class="status-badge status-${invoice.status.toLowerCase()}">${invoice.status}</span>
                </div>
              </div>
            </div>

            <div class="info-section">
              <div class="info-box">
                <h3>Bill To</h3>
                <div class="customer-name">${invoice.customer?.name || 'N/A'}</div>
                ${invoice.customer?.email ? `<p>${invoice.customer.email}</p>` : ''}
                ${invoice.customer?.phone ? `<p>${invoice.customer.phone}</p>` : ''}
                ${invoice.customer?.addressLine1 ? `<p>${invoice.customer.addressLine1}</p>` : ''}
                ${invoice.customer?.city ? `<p>${invoice.customer.city}</p>` : ''}
              </div>
              
              <div class="info-box">
                <div class="dates-table">
                  <table>
                    <tr>
                      <td>Issue Date:</td>
                      <td>${new Date(invoice.issueDate).toLocaleDateString('en-ZA')}</td>
                    </tr>
                    <tr>
                      <td>Due Date:</td>
                      <td>${new Date(invoice.dueDate).toLocaleDateString('en-ZA')}</td>
                    </tr>
                    ${invoice.paidDate ? `
                    <tr>
                      <td>Paid Date:</td>
                      <td>${new Date(invoice.paidDate).toLocaleDateString('en-ZA')}</td>
                    </tr>
                    ` : ''}
                  </table>
                </div>
              </div>
            </div>

            <table class="items-table">
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Quantity</th>
                  <th>Rate</th>
                  <th>Amount</th>
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

            <div class="totals">
              <table>
                <tr class="subtotal-row">
                  <td>Subtotal:</td>
                  <td>${formatCurrency(Number(invoice.subtotal))}</td>
                </tr>
                ${Number(invoice.taxAmount) > 0 ? `
                <tr class="tax-row">
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

            ${invoice.notes || invoice.terms ? `
            <div class="notes-section">
              ${invoice.notes ? `
                <div style="margin-bottom: 20px;">
                  <h3>Notes</h3>
                  <p>${invoice.notes}</p>
                </div>
              ` : ''}
              ${invoice.terms ? `
                <div>
                  <h3>Terms & Conditions</h3>
                  <p>${invoice.terms}</p>
                </div>
              ` : ''}
            </div>
            ` : ''}

            <div class="footer">
              <p>Generated on ${new Date().toLocaleDateString('en-ZA')} at ${new Date().toLocaleTimeString('en-ZA')}</p>
              ${invoice.paymentLink ? `<p style="margin-top: 5px;">Payment link: ${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/pay/${invoice.paymentLink}</p>` : ''}
            </div>
          </div>
        </body>
      </html>
    `;

    // Return HTML with proper headers for PDF generation
    return new NextResponse(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html',
        'Content-Disposition': `inline; filename="invoice-${invoice.invoiceNumber}.html"`,
      },
    });
  } catch (error) {
    console.error('PDF generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    );
  }
}
