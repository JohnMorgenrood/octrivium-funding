import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import InvoicePayment from '@/components/accounting/InvoicePayment';

export default async function PaymentPage({ params }: { params: { link: string } }) {
  const invoice = await prisma.invoice.findUnique({
    where: { paymentLink: params.link },
    include: {
      customer: true,
      items: true,
      user: {
        select: {
          firstName: true,
          lastName: true,
          email: true,
          companyName: true,
          companyLogo: true,
        },
      },
    },
  });

  if (!invoice) {
    notFound();
  }

  // Check if already paid
  if (invoice.status === 'PAID') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Already Paid</h1>
          <p className="text-gray-600">
            This invoice has been paid on {new Date(invoice.paidDate!).toLocaleDateString()}
          </p>
        </div>
      </div>
    );
  }

  return (
    <InvoicePayment
      invoice={{
        ...invoice,
        subtotal: Number(invoice.subtotal),
        taxRate: Number(invoice.taxRate),
        taxAmount: Number(invoice.taxAmount),
        total: Number(invoice.total),
        amountDue: Number(invoice.amountDue),
        items: invoice.items.map(item => ({
          ...item,
          quantity: Number(item.quantity),
          unitPrice: Number(item.unitPrice),
          total: Number(item.total),
        })),
      }}
    />
  );
}
