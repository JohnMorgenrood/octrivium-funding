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

  // Fetch accounting data
  const [invoices, expenses, recentTransactions] = await Promise.all([
    prisma.invoice.findMany({
      where: { userId },
      include: { customer: true, items: true },
      orderBy: { issueDate: 'desc' },
      take: 5,
    }),
    prisma.expense.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
      take: 5,
    }),
    prisma.accountingTransaction.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
      take: 10,
    }),
  ]);

  // Calculate totals for current month
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const [monthlyIncome, monthlyExpenses, overdueInvoices] = await Promise.all([
    prisma.invoice.aggregate({
      where: {
        userId,
        status: 'PAID',
        paidDate: { gte: startOfMonth, lte: endOfMonth },
      },
      _sum: { total: true },
    }),
    prisma.expense.aggregate({
      where: {
        userId,
        date: { gte: startOfMonth, lte: endOfMonth },
      },
      _sum: { amount: true },
    }),
    prisma.invoice.count({
      where: {
        userId,
        status: { in: ['SENT', 'OVERDUE', 'PARTIAL'] },
        dueDate: { lt: now },
      },
    }),
  ]);

  // All invoices for stats
  const allInvoices = await prisma.invoice.findMany({
    where: { userId },
    select: { status: true, total: true, amountPaid: true, amountDue: true },
  });

  const stats = {
    totalIncome: Number(monthlyIncome._sum.total || 0),
    totalExpenses: Number(monthlyExpenses._sum.amount || 0),
    profit: Number(monthlyIncome._sum.total || 0) - Number(monthlyExpenses._sum.amount || 0),
    overdueInvoices,
    totalInvoices: allInvoices.length,
    paidInvoices: allInvoices.filter((i) => i.status === 'PAID').length,
    unpaidAmount: allInvoices.reduce((sum, i) => sum + Number(i.amountDue), 0),
  };

  return (
    <AccountingOverview
      stats={stats}
      invoices={invoices}
      expenses={expenses}
      transactions={recentTransactions}
    />
  );
}
