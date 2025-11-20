import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import SARSTools from '@/components/accounting/SARSTools';

export default async function SARSToolsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect('/login');
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    redirect('/login');
  }

  // Fetch all invoices
  const invoices = await prisma.invoice.findMany({
    where: { userId: user.id },
    include: { items: true },
  });

  // Fetch all expenses
  const expenses = await prisma.expense.findMany({
    where: { userId: user.id },
  });

  // Calculate totals
  const totalInvoiced = invoices.reduce((sum, inv) => sum + Number(inv.total), 0);
  const totalPaid = invoices
    .filter(inv => inv.status === 'PAID')
    .reduce((sum, inv) => sum + Number(inv.total), 0);
  const totalOutstanding = invoices
    .filter(inv => inv.status !== 'PAID')
    .reduce((sum, inv) => sum + Number(inv.amountDue), 0);

  // Calculate VAT
  const vatCollected = invoices
    .filter(inv => inv.status === 'PAID')
    .reduce((sum, inv) => sum + Number(inv.taxAmount), 0);
  const vatPaid = expenses
    .filter(exp => exp.taxDeductible)
    .reduce((sum, exp) => sum + Number(exp.taxAmount || 0), 0);

  // Calculate expenses
  const totalExpenses = expenses.reduce((sum, exp) => sum + Number(exp.amount), 0);

  // Calculate profit (including unpaid invoices as revenue)
  const totalRevenue = invoices.reduce((sum, inv) => sum + Number(inv.subtotal), 0);
  const profit = totalRevenue - totalExpenses;
  const profitMargin = totalRevenue > 0 ? (profit / totalRevenue) * 100 : 0;

  // Taxable income (paid revenue minus deductible expenses)
  const taxableIncome = totalPaid - vatCollected - totalExpenses;

  return (
    <SARSTools
      data={{
        totalRevenue,
        totalExpenses,
        profit,
        profitMargin,
        totalInvoiced,
        totalPaid,
        totalOutstanding,
        vatCollected,
        vatPaid,
        taxableIncome: taxableIncome > 0 ? taxableIncome : 0,
      }}
    />
  );
}
