import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import CreateInvoiceForm from '@/components/accounting/CreateInvoiceForm';
import { prisma } from '@/lib/prisma';

export default async function CreateInvoicePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/login');
  }

  // Fetch customers for dropdown
  const customers = await prisma.customer.findMany({
    where: { userId: session.user.id },
    orderBy: { name: 'asc' },
  });

  // Get next invoice number
  const lastInvoice = await prisma.invoice.findFirst({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
    select: { invoiceNumber: true },
  });

  const nextNumber = lastInvoice
    ? parseInt(lastInvoice.invoiceNumber.split('-')[1] || '0') + 1
    : 1;
  const invoiceNumber = `INV-${String(nextNumber).padStart(5, '0')}`;

  return (
    <div className="max-w-5xl mx-auto">
      <CreateInvoiceForm 
        customers={customers} 
        invoiceNumber={invoiceNumber}
      />
    </div>
  );
}
