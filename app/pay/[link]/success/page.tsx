'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Loader2 } from 'lucide-react';

export default function PaymentSuccessPage({ params }: { params: { link: string } }) {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [message, setMessage] = useState('Processing your payment...');

  useEffect(() => {
    const capturePayment = async () => {
      const token = searchParams.get('token');
      
      if (!token) {
        setStatus('error');
        setMessage('Invalid payment token');
        return;
      }

      try {
        // Get invoice by payment link
        const invoiceRes = await fetch(`/api/accounting/invoices/by-link/${params.link}`);
        const invoiceData = await invoiceRes.json();

        if (!invoiceData.id) {
          throw new Error('Invoice not found');
        }

        // Capture the payment
        const res = await fetch('/api/paypal/capture-invoice-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId: token,
            invoiceId: invoiceData.id,
          }),
        });

        if (!res.ok) {
          throw new Error('Payment capture failed');
        }

        setStatus('success');
        setMessage('Payment successful! Funds have been securely received.');
      } catch (error) {
        console.error('Payment error:', error);
        setStatus('error');
        setMessage('Payment processing failed. Please contact support.');
      }
    };

    capturePayment();
  }, [searchParams, params.link]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardContent className="p-8 text-center">
          {status === 'processing' && (
            <>
              <Loader2 className="h-16 w-16 text-blue-600 animate-spin mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Processing Payment</h1>
              <p className="text-gray-600">{message}</p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
              <p className="text-gray-600 mb-6">{message}</p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
                <p className="text-sm text-gray-700">
                  <strong>Note:</strong> The funds will be held securely and made available to the business for withdrawal after a 7-day processing period.
                </p>
              </div>
              <Button 
                onClick={() => window.location.href = '/'}
                className="w-full"
              >
                Done
              </Button>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Failed</h1>
              <p className="text-gray-600 mb-6">{message}</p>
              <Button 
                onClick={() => window.location.href = `/pay/${params.link}`}
                className="w-full"
              >
                Try Again
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
