import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import ExpenseList from '@/components/accounting/ExpenseList';

export default async function ExpensesPage() {
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

  // Fetch all expenses with stats
  const expenses = await prisma.expense.findMany({
    where: { userId: user.id },
    orderBy: { date: 'desc' },
  });

  // Calculate stats
  const totalExpenses = expenses.reduce((sum, exp) => sum + Number(exp.amount), 0);
  const thisMonthExpenses = expenses.filter(exp => {
    const expenseDate = new Date(exp.date);
    const now = new Date();
    return expenseDate.getMonth() === now.getMonth() && 
           expenseDate.getFullYear() === now.getFullYear();
  }).reduce((sum, exp) => sum + Number(exp.amount), 0);

  const categoryTotals = expenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + Number(exp.amount);
    return acc;
  }, {} as Record<string, number>);

  return (
    <ExpenseList
      expenses={expenses.map(exp => ({
        ...exp,
        amount: Number(exp.amount),
        taxAmount: exp.taxAmount ? Number(exp.taxAmount) : null,
      }))}
      stats={{
        totalExpenses,
        thisMonthExpenses,
        categoryTotals,
        expenseCount: expenses.length,
      }}
    />
  );
}
