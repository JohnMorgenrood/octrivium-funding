'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

interface PayPalButtonProps {
  invoiceId: string;
  amount: number;
  paymentLink: string;
}

export default function PayPalButton({ invoiceId, amount, paymentLink }: PayPalButtonProps) {
  const paypalRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if PayPal client ID is configured
    const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
    
    if (!clientId) {
      console.error('PayPal Client ID not configured');
      setError('PayPal is not configured. Please contact support.');
      setLoading(false);
      return;
    }

    console.log('Loading PayPal SDK with client ID:', clientId.substring(0, 10) + '...');

    const renderPayPalButtons = () => {
      if (!(window as any).paypal) {
        console.error('PayPal SDK not loaded');
        setError('PayPal SDK failed to load. Please refresh the page.');
        setLoading(false);
        return;
      }

      if (!paypalRef.current) {
        console.error('PayPal container ref not ready');
        return;
      }

      console.log('Rendering PayPal buttons...');
      
      (window as any).paypal
        .Buttons({
          style: {
            layout: 'vertical',
            color: 'gold',
            shape: 'rect',
            label: 'paypal',
          },
          createOrder: async () => {
            try {
              console.log('Creating PayPal order for invoice:', invoiceId);
              const response = await fetch('/api/paypal/create-invoice-payment', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ invoiceId }),
              });

              const data = await response.json();
              console.log('Create order response:', data);

              if (!response.ok) {
                throw new Error(data.error || 'Failed to create order');
              }

              console.log('Order created with ID:', data.orderId);
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
              console.log('Payment approved, capturing order:', data.orderID);
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
              console.log('Capture response:', result);

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
            console.error('PayPal button error:', err);
            toast({
              title: 'Payment Error',
              description: 'An error occurred with PayPal. Please try again.',
              variant: 'destructive',
            });
          },
          onCancel: () => {
            console.log('Payment cancelled by user');
            toast({
              title: 'Payment Cancelled',
              description: 'You cancelled the payment.',
            });
          },
        })
        .render(paypalRef.current)
        .then(() => {
          console.log('PayPal buttons rendered successfully');
          setLoading(false);
        })
        .catch((err: any) => {
          console.error('Failed to render PayPal buttons:', err);
          setError('Failed to load PayPal buttons. Please refresh the page.');
          setLoading(false);
        });
    };

    // Check if PayPal SDK is already loaded
    if ((window as any).paypal) {
      console.log('PayPal SDK already loaded, rendering buttons');
      renderPayPalButtons();
      return;
    }

    // Load PayPal SDK
    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=ZAR&disable-funding=venmo`;
    script.async = true;
    
    script.onload = () => {
      console.log('PayPal SDK script loaded successfully');
      renderPayPalButtons();
    };

    script.onerror = () => {
      console.error('Failed to load PayPal SDK script');
      setError('Failed to load PayPal. Please check your internet connection.');
      setLoading(false);
    };

    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [invoiceId, router, toast, paymentLink]);  if (error) {
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
