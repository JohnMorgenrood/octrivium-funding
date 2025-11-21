'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const invoiceId = searchParams.get('invoiceId');
  const [verifying, setVerifying] = useState(true);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    // Verify and update payment status
    const verifyPayment = async () => {
      if (!invoiceId) {
        setVerifying(false);
        return;
      }

      try {
        // First check if already paid
        const statusResponse = await fetch(`/api/invoices/${invoiceId}/status`);
        const statusData = await statusResponse.json();
        
        if (statusData.status === 'PAID') {
          setVerified(true);
          setVerifying(false);
          return;
        }

        // If not paid yet, try to mark it as paid (for cases when webhook hasn't fired)
        console.log('Invoice not yet marked as paid, attempting to update...');
        
        const updateResponse = await fetch(`/api/invoices/${invoiceId}/mark-paid`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            paymentMethod: 'yoco',
            source: 'checkout_return',
          }),
        });

        if (updateResponse.ok) {
          setVerified(true);
        } else {
          console.error('Failed to mark invoice as paid');
        }
      } catch (error) {
        console.error('Error verifying payment:', error);
      } finally {
        setVerifying(false);
      }
    };

    verifyPayment();
  }, [invoiceId]);

  if (verifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="text-center">
          <Loader2 className="h-16 w-16 animate-spin text-green-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Verifying Payment</h1>
          <p className="text-gray-600">Please wait while we confirm your payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50 p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8 text-center">
        <CheckCircle className="h-20 w-20 text-green-600 mx-auto mb-6" />
        
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Payment Successful!
        </h1>
        
        <p className="text-gray-600 mb-8">
          {verified 
            ? 'Your payment has been processed successfully. The invoice has been marked as paid.'
            : 'Your payment is being processed. You will receive a confirmation email shortly.'}
        </p>

        <div className="space-y-3">
          <Link href="/dashboard/accounting">
            <Button className="w-full bg-green-600 hover:bg-green-700">
              View Invoices
            </Button>
          </Link>
          
          <Link href="/dashboard">
            <Button variant="outline" className="w-full">
              Go to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
