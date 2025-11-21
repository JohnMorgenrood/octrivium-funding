'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface YocoButtonProps {
  invoiceId: string;
  amount: number; // Amount in ZAR
  invoiceNumber: string;
  customPublicKey?: string | null; // For BUSINESS tier users with their own Yoco
}

export default function YocoButton({ invoiceId, amount, invoiceNumber, customPublicKey }: YocoButtonProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleYocoPayment = async () => {
    try {
      setLoading(true);

      console.log('Creating Yoco checkout for invoice:', invoiceId);
      console.log('Payment amount:', amount, 'ZAR');

      // Create Yoco Checkout session
      // This supports Card, Google Pay, Apple Pay, and Instant EFT
      const response = await fetch('/api/yoco/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          invoiceId: invoiceId,
          amount: amount,
          invoiceNumber: invoiceNumber,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout');
      }

      console.log('Checkout created successfully:', data.checkoutId);

      // Redirect to Yoco's hosted checkout page
      // User can pay with Card, Google Pay, Apple Pay, or Instant EFT
      window.location.href = data.checkoutUrl;
    } catch (error: any) {
      console.error('Payment error:', error);
      toast({
        title: 'Payment Error',
        description: error.message || 'Failed to initialize payment',
        variant: 'destructive',
      });
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleYocoPayment}
      disabled={loading}
      className="w-full bg-black hover:bg-gray-900 text-white font-semibold"
      size="lg"
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Redirecting...
        </>
      ) : (
        <>
          <svg
            className="mr-2 h-5 w-5"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
          </svg>
          Pay with Yoco
        </>
      )}
    </Button>
  );
}