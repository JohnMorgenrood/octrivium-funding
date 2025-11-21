'use client';

import { useSearchParams } from 'next/navigation';
import { XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function PaymentFailedPage() {
  const searchParams = useSearchParams();
  const invoiceId = searchParams.get('invoiceId');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8 text-center">
        <XCircle className="h-20 w-20 text-red-600 mx-auto mb-6" />
        
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Payment Failed
        </h1>
        
        <p className="text-gray-600 mb-8">
          We couldn't process your payment. This could be due to insufficient funds, 
          incorrect card details, or a network issue. Please try again.
        </p>

        <div className="space-y-3">
          {invoiceId && (
            <Link href={`/invoices/${invoiceId}`}>
              <Button className="w-full bg-red-600 hover:bg-red-700">
                Try Again
              </Button>
            </Link>
          )}
          
          <Link href="/dashboard/accounting">
            <Button variant="outline" className="w-full">
              View Invoices
            </Button>
          </Link>
        </div>

        <div className="mt-8 p-4 bg-gray-50 rounded-lg text-left">
          <h3 className="font-semibold text-gray-900 mb-2">Need Help?</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Check your card has sufficient funds</li>
            <li>• Verify your card details are correct</li>
            <li>• Contact your bank if the issue persists</li>
            <li>• Email us: support@octrivium.co.za</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
