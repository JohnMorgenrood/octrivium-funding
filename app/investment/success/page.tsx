'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function InvestmentSuccessPage() {
  const searchParams = useSearchParams();
  const dealId = searchParams.get('dealId');
  const amount = searchParams.get('amount');
  const [processing, setProcessing] = useState(true);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Create the investment record after successful payment
    const createInvestment = async () => {
      if (!dealId || !amount) {
        setProcessing(false);
        return;
      }

      try {
        const response = await fetch('/api/investments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            dealId: parseInt(dealId),
            amount: parseFloat(amount),
            paymentMethod: 'yoco',
            paymentToken: 'yoco_checkout_completed',
          }),
        });

        if (response.ok) {
          setSuccess(true);
        }
      } catch (error) {
        console.error('Error creating investment:', error);
      } finally {
        setProcessing(false);
      }
    };

    createInvestment();
  }, [dealId, amount]);

  if (processing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="text-center">
          <Loader2 className="h-16 w-16 animate-spin text-green-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Processing Investment</h1>
          <p className="text-gray-600">Please wait while we confirm your investment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50 p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8 text-center">
        <CheckCircle className="h-20 w-20 text-green-600 mx-auto mb-6" />
        
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Investment Successful!
        </h1>
        
        <p className="text-gray-600 mb-2">
          You've successfully invested {amount && `R${parseFloat(amount).toLocaleString()}`}
        </p>
        
        <p className="text-sm text-gray-500 mb-8">
          Your investment has been processed and you'll receive a confirmation email shortly.
        </p>

        <div className="space-y-3">
          <Link href="/dashboard/portfolio">
            <Button className="w-full bg-green-600 hover:bg-green-700">
              View Portfolio
            </Button>
          </Link>
          
          <Link href="/deals">
            <Button variant="outline" className="w-full">
              Browse More Deals
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
