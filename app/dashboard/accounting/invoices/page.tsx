import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import InvoiceList from '@/components/accounting/InvoiceList';

export default async function InvoicesPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/login');
  }

  const userId = session.user.id;

  const invoices = await prisma.invoice.findMany({
    where: { userId },
    include: { customer: true, items: true },
    orderBy: { issueDate: 'desc' },
  });

  const stats = {
    total: invoices.length,
    draft: invoices.filter((i) => i.status === 'DRAFT').length,
    sent: invoices.filter((i) => i.status === 'SENT').length,
    paid: invoices.filter((i) => i.status === 'PAID').length,
    overdue: invoices.filter((i) => i.status === 'OVERDUE').length,
    totalAmount: invoices.reduce((sum, i) => sum + Number(i.total), 0),
    paidAmount: invoices.reduce((sum, i) => sum + Number(i.amountPaid), 0),
    unpaidAmount: invoices.reduce((sum, i) => sum + Number(i.amountDue), 0),
  };

  return <InvoiceList invoices={invoices} stats={stats} />;
}
