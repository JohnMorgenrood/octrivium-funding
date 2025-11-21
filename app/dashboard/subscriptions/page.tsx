'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, X, Zap, Building2, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

export default function SubscriptionsPage() {
  const { data: session } = useSession();
  const { toast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedTier, setSelectedTier] = useState<'STARTER' | 'BUSINESS' | null>(null);
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

  const handleUpgrade = async (tier: 'STARTER' | 'BUSINESS') => {
    setLoading(true);
    setSelectedTier(tier);
    
    const amount = tier === 'STARTER' ? 9900 : 19900; // R99 or R199 in cents
    const tierName = tier === 'STARTER' ? 'Starter' : 'Business';

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
        amountInCents: amount,
        currency: 'ZAR',
        name: `${tierName} Subscription`,
        description: `Monthly ${tierName} Plan`,
        callback: async (result: any) => {
          if (result.error) {
            console.error('Yoco payment error:', result.error);
            toast({
              title: 'Payment Failed',
              description: result.error.message || 'Payment was unsuccessful',
              variant: 'destructive',
            });
            setLoading(false);
            setSelectedTier(null);
            return;
          }

          // Process the payment
          try {
            const response = await fetch('/api/subscriptions/process-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ token: result.id, tier }),
            });

            const data = await response.json();

            if (!response.ok) {
              throw new Error(data.error || 'Payment processing failed');
            }

            toast({
              title: 'Success!',
              description: `You are now on the ${tierName} plan!`,
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
            setSelectedTier(null);
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
      setSelectedTier(null);
    }
  };

  const currentTier = userData?.subscriptionTier || 'FREE';
  const invoiceCount = userData?.invoiceCount || 0;

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-2">Choose Your Plan</h1>
        <p className="text-muted-foreground text-lg">
          Scale your business with the right tools and features
        </p>
      </div>

      {/* Current Plan Status */}
      {userData && (
        <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Current Plan</p>
                <h3 className="text-2xl font-bold">
                  {currentTier === 'FREE' ? 'Free Tier' : currentTier === 'STARTER' ? 'Starter Plan' : 'Business Plan'}
                </h3>
                {currentTier === 'FREE' && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {invoiceCount} of 3 invoices used this month
                  </p>
                )}
                {currentTier === 'STARTER' && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {invoiceCount} of 15 invoices used this month
                  </p>
                )}
                {currentTier === 'BUSINESS' && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Unlimited invoices
                  </p>
                )}
              </div>
              {(currentTier === 'STARTER' || currentTier === 'BUSINESS') && userData?.subscriptionEndDate && (
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
      <div className="grid md:grid-cols-3 gap-6">
        {/* FREE PLAN */}
        <Card className={currentTier === 'FREE' ? 'border-blue-500 border-2 relative' : 'relative'}>
          {currentTier === 'FREE' && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
              Current Plan
            </div>
          )}
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Free
            </CardTitle>
            <div className="mt-4">
              <span className="text-4xl font-bold">R0</span>
              <span className="text-muted-foreground">/month</span>
            </div>
            <CardDescription>Perfect for getting started</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-sm"><strong>3 invoices</strong> per month</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-sm"><strong>1 user</strong> only</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-sm">Yoco payments (platform processes)</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-sm">Customer management</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-sm">Basic reporting</span>
              </div>
              
              <div className="pt-3 border-t">
                <p className="text-xs text-muted-foreground italic">
                  ⚠️ Payments go through platform Yoco account
                </p>
              </div>

              <div className="flex items-start gap-2 opacity-50">
                <X className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm">No bank EFT details</span>
              </div>
              <div className="flex items-start gap-2 opacity-50">
                <X className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm">No team members</span>
              </div>
              <div className="flex items-start gap-2 opacity-50">
                <X className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm">No custom Yoco account</span>
              </div>
            </div>

            <Button disabled className="w-full" variant="outline">
              Current Plan
            </Button>
          </CardContent>
        </Card>

        {/* STARTER PLAN */}
        <Card className={currentTier === 'STARTER' ? 'border-purple-500 border-2 relative' : 'relative border-purple-200'}>
          {currentTier === 'STARTER' && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-500 text-white px-4 py-1 rounded-full text-sm font-medium">
              Current Plan
            </div>
          )}
          <div className="absolute -top-3 right-4 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold">
            POPULAR
          </div>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Starter
            </CardTitle>
            <div className="mt-4">
              <span className="text-4xl font-bold">R99</span>
              <span className="text-muted-foreground">/month</span>
            </div>
            <CardDescription>Great for small businesses</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-sm"><strong>15 invoices</strong> per month</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-sm"><strong>1 user</strong> only</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-sm">Yoco payments (platform processes)</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-sm"><strong>Add your bank EFT details</strong></span>
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
                <span className="text-sm">Priority email support</span>
              </div>

              <div className="pt-3 border-t">
                <p className="text-xs text-muted-foreground italic">
                  ⚠️ Yoco payments still go through platform account
                </p>
              </div>

              <div className="flex items-start gap-2 opacity-50">
                <X className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm">No team members</span>
              </div>
              <div className="flex items-start gap-2 opacity-50">
                <X className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm">No custom Yoco account</span>
              </div>
            </div>

            <Button 
              onClick={() => handleUpgrade('STARTER')}
              disabled={loading || currentTier === 'STARTER' || currentTier === 'BUSINESS'}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              {loading && selectedTier === 'STARTER' ? 'Processing...' : currentTier === 'STARTER' ? 'Current Plan' : currentTier === 'BUSINESS' ? 'Downgrade Not Available' : 'Upgrade to Starter'}
            </Button>
          </CardContent>
        </Card>

        {/* BUSINESS PLAN */}
        <Card className={currentTier === 'BUSINESS' ? 'border-green-500 border-2 relative' : 'relative border-green-200 bg-gradient-to-br from-green-50 to-emerald-50'}>
          {currentTier === 'BUSINESS' && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-500 text-white px-4 py-1 rounded-full text-sm font-medium">
              Current Plan
            </div>
          )}
          <div className="absolute -top-3 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
            BEST VALUE
          </div>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Business
            </CardTitle>
            <div className="mt-4">
              <span className="text-4xl font-bold">R199</span>
              <span className="text-muted-foreground">/month</span>
            </div>
            <CardDescription>For growing teams</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-sm"><strong>Unlimited invoices</strong></span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-sm"><strong>Up to 4 team members</strong></span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-sm"><strong>Use your own Yoco account</strong></span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-sm"><strong>Add your bank EFT details</strong></span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-sm">Customer management</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-sm">Advanced reporting & analytics</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-sm">Priority support</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-sm">Custom branding</span>
              </div>

              <div className="pt-3 border-t">
                <p className="text-xs text-green-700 font-medium">
                  ✓ You receive payments directly to YOUR Yoco account
                </p>
              </div>
            </div>

            <Button 
              onClick={() => handleUpgrade('BUSINESS')}
              disabled={loading || currentTier === 'BUSINESS'}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              {loading && selectedTier === 'BUSINESS' ? 'Processing...' : currentTier === 'BUSINESS' ? 'Current Plan' : 'Upgrade to Business'}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* FAQ Section */}
      <Card>
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold mb-1">How do payment processing work on each tier?</h4>
            <p className="text-sm text-muted-foreground">
              <strong>FREE & STARTER:</strong> When your customers pay via Yoco, payments are processed through the platform's Yoco account. The platform earns a small fee, and you receive the balance.<br/>
              <strong>BUSINESS:</strong> You can add your own Yoco API keys. Payments go directly to YOUR Yoco account - you keep 100% of your revenue (minus Yoco's standard fees).
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-1">What about bank EFT payments?</h4>
            <p className="text-sm text-muted-foreground">
              STARTER and BUSINESS tiers can add their bank account details to invoices. Your customers can then pay you directly via EFT/bank transfer.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-1">Can I upgrade or downgrade anytime?</h4>
            <p className="text-sm text-muted-foreground">
              Yes! You can upgrade at any time. The new plan takes effect immediately. Downgrades will take effect at the end of your current billing period.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-1">How does team member access work?</h4>
            <p className="text-sm text-muted-foreground">
              BUSINESS plan allows up to 4 team members to access and share the same accounting software, invoices, and customer data. Perfect for small teams who need to collaborate.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
