import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { expenses, stats } = await req.json();

    // Generate simple HTML that will be good for printing/PDF
    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Expense Report</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 40px;
      color: #333;
    }
    h1 {
      color: #2563eb;
      margin-bottom: 10px;
    }
    .header {
      border-bottom: 2px solid #2563eb;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    .stats {
      display: flex;
      gap: 20px;
      margin-bottom: 30px;
    }
    .stat-card {
      flex: 1;
      background: #f8fafc;
      padding: 15px;
      border-radius: 8px;
      border: 1px solid #e2e8f0;
    }
    .stat-label {
      font-size: 12px;
      color: #64748b;
      margin-bottom: 5px;
    }
    .stat-value {
      font-size: 24px;
      font-weight: bold;
      color: #1e293b;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
    }
    th {
      background: #2563eb;
      color: white;
      padding: 12px;
      text-align: left;
      font-weight: 600;
    }
    td {
      padding: 10px 12px;
      border-bottom: 1px solid #e2e8f0;
    }
    tr:hover {
      background: #f8fafc;
    }
    .amount {
      text-align: right;
      font-weight: 600;
    }
    .total-row {
      background: #f1f5f9;
      font-weight: bold;
      font-size: 16px;
    }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #e2e8f0;
      text-align: center;
      color: #64748b;
      font-size: 12px;
    }
    @media print {
      body { margin: 20px; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>Expense Report</h1>
    <p>Generated on ${new Date().toLocaleDateString('en-ZA', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })}</p>
  </div>

  <div class="stats">
    <div class="stat-card">
      <div class="stat-label">Total Expenses</div>
      <div class="stat-value">R${stats.totalExpenses.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">This Month</div>
      <div class="stat-value">R${stats.thisMonthExpenses.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Number of Expenses</div>
      <div class="stat-value">${stats.expenseCount}</div>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>Date</th>
        <th>Description</th>
        <th>Category</th>
        <th>Vendor</th>
        <th class="amount">Amount</th>
        <th class="amount">Tax</th>
      </tr>
    </thead>
    <tbody>
      ${expenses.map((exp: any) => `
        <tr>
          <td>${new Date(exp.date).toLocaleDateString('en-ZA')}</td>
          <td>${exp.description}</td>
          <td>${exp.category.split('_').map((w: string) => w.charAt(0) + w.slice(1).toLowerCase()).join(' ')}</td>
          <td>${exp.vendor || '-'}</td>
          <td class="amount">R${Number(exp.amount).toLocaleString('en-ZA', { minimumFractionDigits: 2 })}</td>
          <td class="amount">${exp.taxAmount ? 'R' + Number(exp.taxAmount).toLocaleString('en-ZA', { minimumFractionDigits: 2 }) : '-'}</td>
        </tr>
      `).join('')}
      <tr class="total-row">
        <td colspan="4" style="text-align: right;">TOTAL</td>
        <td class="amount">R${expenses.reduce((sum: number, exp: any) => sum + Number(exp.amount), 0).toLocaleString('en-ZA', { minimumFractionDigits: 2 })}</td>
        <td class="amount">R${expenses.reduce((sum: number, exp: any) => sum + Number(exp.taxAmount || 0), 0).toLocaleString('en-ZA', { minimumFractionDigits: 2 })}</td>
      </tr>
    </tbody>
  </table>

  <div class="footer">
    <p>Octrivium Accounting • www.octrivium.com</p>
    <p>This report is for internal use and should be kept confidential</p>
  </div>

  <script>
    // Auto print when opened
    window.onload = function() {
      window.print();
    };
  </script>
</body>
</html>
    `;

    // Return HTML that can be opened and printed as PDF
    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html',
        'Content-Disposition': `attachment; filename="expenses-${new Date().toISOString().split('T')[0]}.html"`,
      },
    });
  } catch (error) {
    console.error('PDF export error:', error);
    return NextResponse.json({ error: 'Export failed' }, { status: 500 });
  }
}
