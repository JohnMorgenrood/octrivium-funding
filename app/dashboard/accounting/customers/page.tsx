import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import CustomerList from '@/components/accounting/CustomerList';

export default async function CustomersPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/login');
  }

  const customers = await prisma.customer.findMany({
    where: { userId: session.user.id },
    include: {
      invoices: {
        select: {
          id: true,
          total: true,
          status: true,
        },
      },
    },
    orderBy: { name: 'asc' },
  });

  const customersWithStats = customers.map((customer) => ({
    ...customer,
    totalInvoices: customer.invoices.length,
    totalRevenue: customer.invoices.reduce((sum, inv) => sum + Number(inv.total), 0),
    unpaidInvoices: customer.invoices.filter((inv) => inv.status !== 'PAID').length,
  }));

  return <CustomerList customers={customersWithStats} />;
}
