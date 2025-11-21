import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import RecurringInvoiceList from '@/components/accounting/RecurringInvoiceList';

export default async function RecurringInvoicesPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/login');
  }

  const recurring = await prisma.recurringInvoice.findMany({
    where: { userId: session.user.id },
    include: { customer: true },
    orderBy: { nextInvoiceDate: 'asc' },
  });

  const customers = await prisma.customer.findMany({
    where: { userId: session.user.id },
    orderBy: { name: 'asc' },
  });

  return <RecurringInvoiceList recurring={recurring} customers={customers} />;
}
