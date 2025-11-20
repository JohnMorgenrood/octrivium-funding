'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface YocoButtonProps {
  invoiceId: string;
  amount: number; // Amount in ZAR cents (e.g., R100.00 = 10000)
  paymentLink: string;
  description: string;
}

export default function YocoButton({ invoiceId, amount, paymentLink, description }: YocoButtonProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleYocoPayment = async () => {
    try {
      setLoading(true);

      // Load Yoco SDK if not already loaded
      if (!(window as any).YocoSDK) {
        const script = document.createElement('script');
        script.src = 'https://js.yoco.com/sdk/v1/yoco-sdk-web.js';
        script.async = true;
        document.body.appendChild(script);

        await new Promise((resolve) => {
          script.onload = resolve;
        });
      }

      const publicKey = process.env.NEXT_PUBLIC_YOCO_PUBLIC_KEY;

      if (!publicKey) {
        throw new Error('Yoco public key not configured');
      }

      // Initialize Yoco SDK
      const yoco = new (window as any).YocoSDK({
        publicKey: publicKey,
      });

      // Create inline payment
      yoco.showPopup({
        amountInCents: amount,
        currency: 'ZAR',
        name: 'Invoice Payment',
        description: description,
        callback: async (result: any) => {
          if (result.error) {
            console.error('Yoco payment error:', result.error);
            toast({
              title: 'Payment Failed',
              description: result.error.message || 'Payment was unsuccessful',
              variant: 'destructive',
            });
            setLoading(false);
            return;
          }

          // Process the payment on the server
          try {
            const response = await fetch('/api/yoco/process-payment', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                token: result.id,
                invoiceId: invoiceId,
                amount: amount,
              }),
            });

            const data = await response.json();

            if (!response.ok) {
              throw new Error(data.error || 'Payment processing failed');
            }

            toast({
              title: 'Payment Successful!',
              description: 'Your payment has been processed.',
            });

            // Redirect to success page
            router.push(`/pay/${paymentLink}/success`);
          } catch (error: any) {
            console.error('Error processing payment:', error);
            toast({
              title: 'Error',
              description: error.message || 'Failed to process payment',
              variant: 'destructive',
            });
          } finally {
            setLoading(false);
          }
        },
      });
    } catch (error: any) {
      console.error('Error initializing Yoco:', error);
      toast({
        title: 'Error',
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
      className="w-full bg-[#00A859] hover:bg-[#008f4a] text-white"
      size="lg"
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Processing...
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
          Pay with Card (Yoco)
        </>
      )}
    </Button>
  );
}
