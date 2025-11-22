'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { 
  Zap, 
  Check, 
  Sparkles, 
  Shield, 
  Mail,
  TrendingUp,
  Users,
  Clock,
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';

const plans = [
  {
    id: 'FREE',
    name: 'Free',
    price: 'R0',
    period: '/month',
    description: 'Perfect for getting started',
    features: [
      '50 emails per month',
      'Basic inbox management',
      'Email search',
      'Spam filtering',
      '30-day email history',
      'Standard support',
    ],
    limit: 50,
    icon: Mail,
    color: 'gray',
    popular: false,
  },
  {
    id: 'PRO',
    name: 'Pro',
    price: 'R99',
    period: '/month',
    description: 'For growing businesses',
    features: [
      '500 emails per month',
      'Advanced inbox features',
      'Priority email search',
      'Enhanced spam protection',
      'Unlimited email history',
      'Email templates',
      'Priority support',
      'Custom email signature',
    ],
    limit: 500,
    icon: TrendingUp,
    color: 'purple',
    popular: true,
  },
  {
    id: 'BUSINESS',
    name: 'Business',
    price: 'R299',
    period: '/month',
    description: 'For established companies',
    features: [
      'Unlimited emails',
      'All Pro features',
      'Team collaboration',
      'Shared inboxes',
      'Advanced analytics',
      'API access',
      'Custom domain support',
      'Dedicated account manager',
      '24/7 priority support',
    ],
    limit: 999999,
    icon: Sparkles,
    color: 'blue',
    popular: false,
  },
];

export default function EmailUpgrade() {
  const { data: session, update: updateSession } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState('');

  const handleUpgrade = async (planId: string, price: number) => {
    if (planId === 'FREE') {
      return; // Already free
    }

    setLoading(planId);
    setError('');

    try {
      // Create Yoco checkout for subscription
      const res = await fetch('/api/yoco/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'email_subscription',
          amount: price,
          metadata: {
            planId,
            userId: session?.user?.id,
          },
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create checkout');
      }

      // Redirect to Yoco payment page
      window.location.href = data.redirectUrl;
    } catch (err: any) {
      console.error('Upgrade error:', err);
      setError(err.message);
      setLoading(null);
    }
  };

  const currentPlan = (session?.user as any)?.emailPlanType || 'FREE';

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <Link
            href="/dashboard/emails"
            className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Inbox
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Email Plan
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Send more emails, unlock powerful features, and grow your business communication
          </p>
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
            <Shield className="w-4 h-4" />
            Current Plan: {currentPlan}
          </div>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-center">
            {error}
          </div>
        )}

        {/* Plans Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {plans.map((plan) => {
            const Icon = plan.icon;
            const isCurrent = currentPlan === plan.id;
            const isDowngrade = 
              (currentPlan === 'BUSINESS' && plan.id !== 'BUSINESS') ||
              (currentPlan === 'PRO' && plan.id === 'FREE');

            return (
              <div
                key={plan.id}
                className={`relative bg-white rounded-2xl shadow-xl border-2 transition-all hover:scale-105 ${
                  plan.popular
                    ? 'border-purple-500'
                    : 'border-gray-200'
                } ${isCurrent ? 'ring-4 ring-green-500' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="px-4 py-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm font-bold rounded-full shadow-lg">
                      MOST POPULAR
                    </span>
                  </div>
                )}

                {isCurrent && (
                  <div className="absolute -top-4 right-4">
                    <span className="px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      Current Plan
                    </span>
                  </div>
                )}

                <div className="p-8">
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-xl bg-${plan.color}-100 flex items-center justify-center mb-4`}>
                    <Icon className={`w-6 h-6 text-${plan.color}-600`} />
                  </div>

                  {/* Plan Name */}
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {plan.name}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 text-sm mb-4">
                    {plan.description}
                  </p>

                  {/* Price */}
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-gray-900">
                      {plan.price}
                    </span>
                    <span className="text-gray-600">{plan.period}</span>
                  </div>

                  {/* Features */}
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <button
                    onClick={() => {
                      if (plan.id === 'FREE') return;
                      const price = plan.id === 'PRO' ? 99 : 299;
                      handleUpgrade(plan.id, price);
                    }}
                    disabled={isCurrent || isDowngrade || loading === plan.id}
                    className={`w-full py-3 px-6 rounded-xl font-medium transition-all ${
                      isCurrent
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : isDowngrade
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : plan.popular
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 shadow-lg'
                        : 'bg-gray-900 text-white hover:bg-gray-800'
                    }`}
                  >
                    {loading === plan.id ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Processing...
                      </div>
                    ) : isCurrent ? (
                      'Current Plan'
                    ) : isDowngrade ? (
                      'Contact Support'
                    ) : plan.id === 'FREE' ? (
                      'Get Started'
                    ) : (
                      'Upgrade Now'
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Features Comparison */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Why Upgrade to Pro or Business?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Send More Emails
              </h3>
              <p className="text-gray-600 text-sm">
                Never hit limits again. Pro gives you 10x more emails, Business gives you unlimited.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Team Collaboration
              </h3>
              <p className="text-gray-600 text-sm">
                Business plan includes shared inboxes and team features for better collaboration.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Priority Support
              </h3>
              <p className="text-gray-600 text-sm">
                Get faster responses and dedicated support to keep your business running smoothly.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-12 text-center text-sm text-gray-600">
          <p>Have questions? <a href="/contact" className="text-purple-600 hover:text-purple-700 font-medium">Contact our team</a></p>
          <p className="mt-2">All plans include secure email delivery, spam protection, and mobile access.</p>
        </div>
      </div>
    </div>
  );
}
