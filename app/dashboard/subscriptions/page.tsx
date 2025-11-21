'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Zap, CreditCard } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

export default function SubscriptionsPage() {
  const { data: session } = useSession();
  const { toast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const res = await fetch('/api/user/subscription');
      if (res.ok) {
        const data = await res.json();
        setUserData(data);
      }
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    }
  };

  const handleUpgrade = async () => {
    setLoading(true);
    try {
      // Load Yoco SDK if not already loaded
      if (!(window as any).YocoSDK) {
        const script = document.createElement('script');
        script.src = 'https://js.yoco.com/sdk/v1/yoco-sdk-web.js';
        script.async = true;
        document.body.appendChild(script);

        await new Promise((resolve, reject) => {
          script.onload = resolve;
          script.onerror = reject;
        });
      }

      const publicKey = process.env.NEXT_PUBLIC_YOCO_PUBLIC_KEY;
      if (!publicKey) {
        throw new Error('Yoco not configured');
      }

      const yoco = new (window as any).YocoSDK({
        publicKey: publicKey,
      });

      yoco.showPopup({
        amountInCents: 5000, // R50.00
        currency: 'ZAR',
        name: 'Premium Subscription',
        description: 'Monthly Premium Plan - Unlimited Invoices',
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

          // Process the payment
          try {
            const response = await fetch('/api/subscriptions/process-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ token: result.id }),
            });

            const data = await response.json();

            if (!response.ok) {
              throw new Error(data.error || 'Payment processing failed');
            }

            toast({
              title: 'Success!',
              description: 'You are now a Premium member!',
            });

            // Refresh page to show new status
            window.location.reload();
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
      console.error('Error initializing payment:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to initialize payment',
        variant: 'destructive',
      });
      setLoading(false);
    }
  };

  const currentTier = userData?.subscriptionTier || 'FREE';
  const invoiceCount = userData?.invoiceCount || 0;
  const isActive = userData?.subscriptionStatus === 'ACTIVE';

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Subscription Plans</h1>
        <p className="text-muted-foreground">Choose the plan that works best for your business</p>
      </div>

      {/* Current Plan Status */}
      {userData && (
        <Card className="border-blue-200 bg-blue-50/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Current Plan</p>
                <h3 className="text-2xl font-bold">
                  {currentTier === 'FREE' ? 'Free' : 'Premium'}
                </h3>
                {currentTier === 'FREE' && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {invoiceCount} of 3 invoices used this month
                  </p>
                )}
              </div>
              {currentTier === 'PREMIUM' && userData?.subscriptionEndDate && (
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Renews on</p>
                  <p className="font-medium">
                    {new Date(userData.subscriptionEndDate).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Free Plan */}
        <Card className={currentTier === 'FREE' ? 'border-blue-500 border-2' : ''}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Free</CardTitle>
              {currentTier === 'FREE' && (
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                  Current Plan
                </span>
              )}
            </div>
            <div className="mt-4">
              <span className="text-4xl font-bold">R0</span>
              <span className="text-muted-foreground">/month</span>
            </div>
            <CardDescription>Perfect for trying out the platform</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-sm">Up to 3 invoices per month</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-sm">Yoco payment processing</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-sm">Customer management</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-sm">Basic reporting</span>
              </div>
              <div className="flex items-start gap-2 opacity-50">
                <span className="text-sm">❌ Bank EFT payment option</span>
              </div>
              <div className="flex items-start gap-2 opacity-50">
                <span className="text-sm">❌ Unlimited invoices</span>
              </div>
            </div>
            {currentTier !== 'FREE' && (
              <Button variant="outline" className="w-full" disabled>
                Downgrade to Free
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Premium Plan */}
        <Card className={currentTier === 'PREMIUM' ? 'border-purple-500 border-2 relative' : 'border-purple-200 relative'}>
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
              <Zap className="h-3 w-3" />
              RECOMMENDED
            </span>
          </div>
          <CardHeader className="pt-8">
            <div className="flex items-center justify-between">
              <CardTitle>Premium</CardTitle>
              {currentTier === 'PREMIUM' && (
                <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                  Current Plan
                </span>
              )}
            </div>
            <div className="mt-4">
              <span className="text-4xl font-bold">R50</span>
              <span className="text-muted-foreground">/month</span>
            </div>
            <CardDescription>For growing businesses</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-sm font-medium">Unlimited invoices</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-sm font-medium">Bank EFT payment option</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-sm">Yoco payment processing</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-sm">Customer management</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-sm">Advanced reporting</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-sm">Priority support</span>
              </div>
            </div>
            {currentTier === 'FREE' ? (
              <Button 
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                onClick={handleUpgrade}
                disabled={loading}
              >
                <CreditCard className="h-4 w-4 mr-2" />
                {loading ? 'Processing...' : 'Upgrade to Premium'}
              </Button>
            ) : (
              <Button variant="outline" className="w-full" disabled>
                Current Plan
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Features Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Why Upgrade to Premium?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
                <Check className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">Unlimited Invoices</h3>
              <p className="text-sm text-muted-foreground">
                Create as many invoices as you need without any restrictions. Perfect for growing businesses.
              </p>
            </div>
            <div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                <CreditCard className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">Bank Transfer Option</h3>
              <p className="text-sm text-muted-foreground">
                Add your bank details to invoices so customers can pay via EFT. Great for corporate clients.
              </p>
            </div>
            <div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mb-3">
                <Zap className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">Priority Support</h3>
              <p className="text-sm text-muted-foreground">
                Get faster responses and dedicated support to help your business succeed.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* FAQ */}
      <Card>
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold mb-1">How does billing work?</h4>
            <p className="text-sm text-muted-foreground">
              Premium subscription is billed monthly at R50/month. Payment is processed securely through Yoco.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-1">Can I cancel anytime?</h4>
            <p className="text-sm text-muted-foreground">
              Yes! You can cancel your subscription at any time. You'll continue to have access until the end of your billing period.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-1">What happens if I reach the 3 invoice limit?</h4>
            <p className="text-sm text-muted-foreground">
              You'll need to upgrade to Premium to create more invoices. Your existing invoices will remain accessible.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-1">Do I earn from Yoco payments on Free plan?</h4>
            <p className="text-sm text-muted-foreground">
              Yes! All Yoco payments process through your business account. The platform fee helps us keep the service running.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
