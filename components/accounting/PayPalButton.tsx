'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

interface PayPalButtonProps {
  invoiceId: string;
  amount: number;
  paymentLink: string;
}

declare global {
  interface Window {
    paypal?: any;
  }
}

export default function PayPalButton({ invoiceId, amount, paymentLink }: PayPalButtonProps) {
  const paypalRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load PayPal SDK
    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}&currency=USD&disable-funding=venmo`;
    script.async = true;
    
    script.onload = () => {
      if (window.paypal && paypalRef.current) {
        window.paypal
          .Buttons({
            style: {
              layout: 'vertical',
              color: 'gold',
              shape: 'rect',
              label: 'paypal',
            },
            createOrder: async () => {
              try {
                const response = await fetch('/api/paypal/create-invoice-payment', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ invoiceId }),
                });

                const data = await response.json();

                if (!response.ok) {
                  throw new Error(data.error || 'Failed to create order');
                }

                return data.orderId;
              } catch (error) {
                console.error('Error creating order:', error);
                toast({
                  title: 'Error',
                  description: 'Failed to initialize payment',
                  variant: 'destructive',
                });
                throw error;
              }
            },
            onApprove: async (data: any) => {
              try {
                const response = await fetch('/api/paypal/capture-invoice-payment', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    orderId: data.orderID,
                    invoiceId,
                  }),
                });

                const result = await response.json();

                if (!response.ok) {
                  throw new Error(result.error || 'Failed to capture payment');
                }

                toast({
                  title: 'Payment Successful!',
                  description: 'Your payment has been processed.',
                });

                // Redirect to success page
                router.push(`/pay/${paymentLink}/success`);
              } catch (error) {
                console.error('Error capturing payment:', error);
                toast({
                  title: 'Error',
                  description: 'Failed to process payment',
                  variant: 'destructive',
                });
              }
            },
            onError: (err: any) => {
              console.error('PayPal error:', err);
              toast({
                title: 'Payment Error',
                description: 'An error occurred with PayPal. Please try again.',
                variant: 'destructive',
              });
            },
            onCancel: () => {
              toast({
                title: 'Payment Cancelled',
                description: 'You cancelled the payment.',
              });
            },
          })
          .render(paypalRef.current)
          .then(() => {
            setLoading(false);
          })
          .catch((err: any) => {
            console.error('Failed to render PayPal buttons:', err);
            setError('Failed to load PayPal. Please refresh the page.');
            setLoading(false);
          });
      }
    };

    script.onerror = () => {
      setError('Failed to load PayPal. Please check your internet connection.');
      setLoading(false);
    };

    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [invoiceId, amount, router, toast, paymentLink]);

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-center">
        <p className="text-sm text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {loading && (
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}
      <div ref={paypalRef} className={loading ? 'opacity-0' : 'opacity-100'} />
    </div>
  );
}
