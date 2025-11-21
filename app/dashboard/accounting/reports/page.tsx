import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import FinancialReports from '@/components/accounting/FinancialReports';

export default async function ReportsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/login');
  }

  // Fetch all financial data
  const [invoices, expenses] = await Promise.all([
    prisma.invoice.findMany({
      where: { userId: session.user.id },
      select: {
        id: true,
        total: true,
        status: true,
        dueDate: true,
        createdAt: true,
        paidDate: true,
      },
    }),
    prisma.expense.findMany({
      where: { userId: session.user.id },
      select: {
        id: true,
        amount: true,
        category: true,
        date: true,
        taxAmount: true,
      },
    }),
  ]);

  return (
    <div className="container mx-auto p-4 sm:p-6">
      <FinancialReports invoices={invoices} expenses={expenses} />
    </div>
  );
}
