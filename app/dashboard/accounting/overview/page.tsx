import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import AccountingOverview from '@/components/accounting/AccountingOverview';

export default async function AccountingOverviewPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/login');
  }

  const userId = session.user.id;

  // Initialize with empty data
  let invoices: any[] = [];
  let expenses: any[] = [];
  let recentTransactions: any[] = [];
  let stats = {
    totalIncome: 0,
    totalExpenses: 0,
    profit: 0,
    overdueInvoices: 0,
    totalInvoices: 0,
    paidInvoices: 0,
    unpaidAmount: 0,
  };

  try {
    // Fetch invoices and expenses
    const invoicesData = await prisma.invoice.findMany({
      where: { userId },
      include: { 
        customer: true, 
        items: true 
      },
      orderBy: { issueDate: 'desc' },
      take: 5,
    });
    invoices = invoicesData;

    const expensesData = await prisma.expense.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
      take: 5,
    });
    expenses = expensesData;

    // Calculate stats from invoices
    const allInvoices = await prisma.invoice.findMany({
      where: { userId },
      select: { 
        status: true, 
        total: true, 
        amountPaid: true, 
        amountDue: true,
        paidDate: true,
        dueDate: true,
      },
    });

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    // Calculate monthly income from paid invoices
    const monthlyIncome = allInvoices
      .filter(inv => 
        inv.status === 'PAID' && 
        inv.paidDate && 
        inv.paidDate >= startOfMonth && 
        inv.paidDate <= endOfMonth
      )
      .reduce((sum, inv) => sum + Number(inv.total || 0), 0);

    // Get monthly expenses
    const monthlyExpensesData = await prisma.expense.findMany({
      where: {
        userId,
        date: { gte: startOfMonth, lte: endOfMonth },
      },
      select: { amount: true },
    });

    const monthlyExpenses = monthlyExpensesData.reduce(
      (sum, exp) => sum + Number(exp.amount || 0), 
      0
    );

    // Count overdue invoices
    const overdueInvoices = allInvoices.filter(
      inv => 
        ['SENT', 'OVERDUE', 'PARTIAL'].includes(inv.status) && 
        inv.dueDate && 
        inv.dueDate < now
    ).length;

    stats = {
      totalIncome: monthlyIncome,
      totalExpenses: monthlyExpenses,
      profit: monthlyIncome - monthlyExpenses,
      overdueInvoices,
      totalInvoices: allInvoices.length,
      paidInvoices: allInvoices.filter(i => i.status === 'PAID').length,
      unpaidAmount: allInvoices.reduce((sum, i) => sum + Number(i.amountDue || 0), 0),
    };

  } catch (error) {
    console.error('Error loading accounting data:', error);
    // Continue with empty data
  }

  return (
    <AccountingOverview
      stats={stats}
      invoices={invoices}
      expenses={expenses}
      transactions={recentTransactions}
    />
  );
}
