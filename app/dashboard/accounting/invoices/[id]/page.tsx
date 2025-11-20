import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect, notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import InvoiceDetail from '@/components/accounting/InvoiceDetail';

export default async function InvoiceDetailPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/login');
  }

  const invoice = await prisma.invoice.findUnique({
    where: { id: params.id },
    include: {
      customer: true,
      items: true,
      user: {
        select: {
          companyName: true,
          companyLogo: true,
          email: true,
          firstName: true,
          lastName: true,
        },
      },
    },
  });

  if (!invoice || invoice.userId !== session.user.id) {
    notFound();
  }

  return <InvoiceDetail invoice={invoice} />;
}
