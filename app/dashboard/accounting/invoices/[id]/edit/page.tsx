import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect, notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import EditInvoiceForm from '@/components/accounting/EditInvoiceForm';

export default async function EditInvoicePage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/login');
  }

  // Fetch invoice to edit
  const invoice = await prisma.invoice.findUnique({
    where: { id: params.id },
    include: {
      customer: true,
      items: true,
    },
  });

  if (!invoice || invoice.userId !== session.user.id) {
    notFound();
  }

  // Fetch customers for dropdown
  const customers = await prisma.customer.findMany({
    where: { userId: session.user.id },
    orderBy: { name: 'asc' },
  });

  // Fetch active products for quick add
  const products = await prisma.product.findMany({
    where: { 
      userId: session.user.id,
      active: true,
    },
    orderBy: { name: 'asc' },
  });

  return (
    <div className="max-w-5xl mx-auto">
      <EditInvoiceForm 
        invoice={invoice}
        customers={customers}
        products={products}
      />
    </div>
  );
}
