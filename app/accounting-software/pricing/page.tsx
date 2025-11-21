'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, X, Crown, Zap, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AccountingPricingPage() {
  const plans = [
    {
      name: 'Free',
      price: 'R0',
      period: 'forever',
      description: 'Perfect for getting started',
      features: [
        { text: '3 invoices per month', included: true },
        { text: '5 free invoice templates', included: true },
        { text: 'Customer management', included: true },
        { text: 'Product catalog', included: true },
        { text: 'Basic expense tracking', included: true },
        { text: 'Payment tracking', included: true },
        { text: 'Mobile app access', included: true },
        { text: '5 premium templates', included: false },
        { text: 'Unlimited invoices', included: false },
        { text: 'Priority support', included: false },
        { text: 'Team members', included: false },
        { text: 'Custom branding', included: false },
      ],
      cta: 'Get Started Free',
      popular: false,
      gradient: 'from-slate-500 to-slate-600',
    },
    {
      name: 'Starter',
      price: 'R99',
      period: 'per month',
      description: 'For growing businesses',
      features: [
        { text: '15 invoices per month', included: true },
        { text: 'All 10 invoice templates', included: true },
        { text: 'Customer management', included: true },
        { text: 'Product catalog', included: true },
        { text: 'Advanced expense tracking', included: true },
        { text: 'Payment tracking', included: true },
        { text: 'Mobile app access', included: true },
        { text: 'Bank details on invoices', included: true },
        { text: 'Recurring invoices', included: true },
        { text: 'Email support', included: true },
        { text: 'Team members', included: false },
        { text: 'Custom Yoco integration', included: false },
      ],
      cta: 'Start 14-Day Trial',
      popular: true,
      gradient: 'from-blue-500 to-indigo-600',
    },
    {
      name: 'Business',
      price: 'R199',
      period: 'per month',
      description: 'For established businesses',
      features: [
        { text: 'Unlimited invoices', included: true },
        { text: 'All 10 invoice templates', included: true },
        { text: 'Customer management', included: true },
        { text: 'Product catalog', included: true },
        { text: 'Advanced expense tracking', included: true },
        { text: 'Payment tracking', included: true },
        { text: 'Mobile app access', included: true },
        { text: 'Bank details on invoices', included: true },
        { text: 'Recurring invoices', included: true },
        { text: 'Priority support', included: true },
        { text: 'Up to 5 team members', included: true },
        { text: 'Custom Yoco keys', included: true },
        { text: 'Custom branding', included: true },
        { text: 'Advanced reporting', included: true },
      ],
      cta: 'Start 14-Day Trial',
      popular: false,
      gradient: 'from-purple-500 to-pink-600',
    },
  ];

  const comparisonFeatures = [
    {
      category: 'Invoicing',
      features: [
        { name: 'Monthly invoice limit', free: '3', starter: '15', business: 'Unlimited' },
        { name: 'Free templates (1-5)', free: true, starter: true, business: true },
        { name: 'Premium templates (6-10)', free: false, starter: true, business: true },
        { name: 'Quotes/Estimates', free: true, starter: true, business: true },
        { name: 'Recurring invoices', free: false, starter: true, business: true },
        { name: 'Payment tracking', free: true, starter: true, business: true },
        { name: 'Payment reminders', free: false, starter: true, business: true },
        { name: 'E-signatures', free: true, starter: true, business: true },
      ],
    },
    {
      category: 'Payments',
      features: [
        { name: 'Platform Yoco payments', free: true, starter: true, business: true },
        { name: 'Bank transfer details', free: false, starter: true, business: true },
        { name: 'PayPal integration', free: true, starter: true, business: true },
        { name: 'Custom Yoco keys', free: false, starter: false, business: true },
        { name: 'Payment analytics', free: false, starter: true, business: true },
      ],
    },
    {
      category: 'Management',
      features: [
        { name: 'Customer management', free: true, starter: true, business: true },
        { name: 'Product catalog', free: true, starter: true, business: true },
        { name: 'Expense tracking', free: 'Basic', starter: 'Advanced', business: 'Advanced' },
        { name: 'Financial reports', free: 'Basic', starter: 'Standard', business: 'Advanced' },
        { name: 'SARS tax tools', free: false, starter: true, business: true },
      ],
    },
    {
      category: 'Team & Branding',
      features: [
        { name: 'Team members', free: '1', starter: '1', business: '5' },
        { name: 'Custom company logo', free: true, starter: true, business: true },
        { name: 'Custom branding', free: false, starter: false, business: true },
        { name: 'Multiple businesses', free: false, starter: false, business: true },
      ],
    },
    {
      category: 'Support',
      features: [
        { name: 'Email support', free: 'Community', starter: 'Standard', business: 'Priority' },
        { name: 'Response time', free: '48h', starter: '24h', business: '4h' },
        { name: 'Phone support', free: false, starter: false, business: true },
        { name: 'Dedicated account manager', free: false, starter: false, business: true },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950">
      {/* Header */}
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/accounting-software" className="flex items-center gap-2">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Octrivium
              </span>
              <span className="text-sm text-slate-600 dark:text-slate-400">Accounting</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/accounting-software">
                <Button variant="ghost">Features</Button>
              </Link>
              <Link href="/login">
                <Button variant="outline">Sign In</Button>
              </Link>
              <Link href="/register">
                <Button className="bg-gradient-to-r from-blue-600 to-indigo-600">
                  Get Started Free
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <Badge className="mb-6 bg-blue-500/10 text-blue-600 border-blue-500/20 px-4 py-2">
              <Zap className="w-4 h-4 mr-2" />
              Simple, Transparent Pricing
            </Badge>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-slate-900 dark:text-white">
              Choose Your Plan
            </h1>
            
            <p className="text-xl text-slate-600 dark:text-slate-300 mb-8">
              Start free, upgrade as you grow. No hidden fees, cancel anytime.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className={plan.popular ? 'md:scale-105' : ''}
              >
                <Card className={`relative h-full border-2 ${plan.popular ? 'border-blue-500 shadow-2xl' : 'border-slate-200 dark:border-slate-700'} transition-all`}>
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <Badge className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-1">
                        <Crown className="w-3 h-3 mr-1" />
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  
                  <CardHeader className="text-center pb-8">
                    <div className={`w-16 h-16 bg-gradient-to-br ${plan.gradient} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                      <span className="text-2xl font-bold text-white">{plan.name[0]}</span>
                    </div>
                    
                    <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                    <p className="text-slate-600 dark:text-slate-400 text-sm mb-6">
                      {plan.description}
                    </p>
                    
                    <div className="mb-4">
                      <span className="text-5xl font-bold text-slate-900 dark:text-white">
                        {plan.price}
                      </span>
                      <span className="text-slate-600 dark:text-slate-400 ml-2">
                        /{plan.period}
                      </span>
                    </div>

                    <Link href="/register">
                      <Button 
                        className={`w-full ${plan.popular ? 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700' : ''}`}
                        variant={plan.popular ? 'default' : 'outline'}
                        size="lg"
                      >
                        {plan.cta}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardHeader>

                  <CardContent>
                    <ul className="space-y-3">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          {feature.included ? (
                            <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                          ) : (
                            <X className="w-5 h-5 text-slate-300 dark:text-slate-600 flex-shrink-0 mt-0.5" />
                          )}
                          <span className={feature.included ? 'text-slate-700 dark:text-slate-300' : 'text-slate-400 dark:text-slate-600'}>
                            {feature.text}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Detailed Comparison Table */}
      <section className="py-20 bg-white dark:bg-slate-900/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900 dark:text-white">
              Detailed Comparison
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300">
              Everything you need to know about each plan
            </p>
          </motion.div>

          <div className="max-w-6xl mx-auto overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2 border-slate-200 dark:border-slate-700">
                  <th className="text-left py-4 px-6 font-bold text-slate-900 dark:text-white">Feature</th>
                  <th className="text-center py-4 px-6 font-bold text-slate-900 dark:text-white">Free</th>
                  <th className="text-center py-4 px-6 font-bold bg-blue-50 dark:bg-blue-950/20">
                    <div className="flex items-center justify-center gap-2">
                      <Crown className="w-4 h-4 text-blue-600" />
                      <span className="text-blue-600">Starter</span>
                    </div>
                  </th>
                  <th className="text-center py-4 px-6 font-bold text-slate-900 dark:text-white">Business</th>
                </tr>
              </thead>
              <tbody>
                {comparisonFeatures.map((category, catIdx) => (
                  <>
                    <tr key={`cat-${catIdx}`} className="bg-slate-100 dark:bg-slate-800/50">
                      <td colSpan={4} className="py-3 px-6 font-bold text-slate-900 dark:text-white">
                        {category.category}
                      </td>
                    </tr>
                    {category.features.map((feature, idx) => (
                      <tr key={`${catIdx}-${idx}`} className="border-b border-slate-100 dark:border-slate-800">
                        <td className="py-4 px-6 text-slate-700 dark:text-slate-300">{feature.name}</td>
                        <td className="text-center py-4 px-6">
                          {typeof feature.free === 'boolean' ? (
                            feature.free ? <Check className="w-5 h-5 text-green-500 mx-auto" /> : <X className="w-5 h-5 text-slate-300 dark:text-slate-600 mx-auto" />
                          ) : (
                            <span className="text-slate-700 dark:text-slate-300">{feature.free}</span>
                          )}
                        </td>
                        <td className="text-center py-4 px-6 bg-blue-50/50 dark:bg-blue-950/10">
                          {typeof feature.starter === 'boolean' ? (
                            feature.starter ? <Check className="w-5 h-5 text-green-500 mx-auto" /> : <X className="w-5 h-5 text-slate-300 dark:text-slate-600 mx-auto" />
                          ) : (
                            <span className="text-slate-700 dark:text-slate-300">{feature.starter}</span>
                          )}
                        </td>
                        <td className="text-center py-4 px-6">
                          {typeof feature.business === 'boolean' ? (
                            feature.business ? <Check className="w-5 h-5 text-green-500 mx-auto" /> : <X className="w-5 h-5 text-slate-300 dark:text-slate-600 mx-auto" />
                          ) : (
                            <span className="text-slate-700 dark:text-slate-300">{feature.business}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-4xl font-bold mb-12 text-center text-slate-900 dark:text-white">
              Frequently Asked Questions
            </h2>
            
            <div className="space-y-6">
              {[
                {
                  q: 'Can I start with the free plan and upgrade later?',
                  a: 'Absolutely! Start with the free plan and upgrade anytime as your business grows. Your data stays with you.',
                },
                {
                  q: 'What happens if I exceed my invoice limit?',
                  a: 'You\'ll receive a notification when you\'re close to your limit. You can upgrade your plan anytime to continue creating invoices.',
                },
                {
                  q: 'Are the premium templates worth it?',
                  a: 'Premium templates (6-10) offer unique designs perfect for creative businesses, luxury brands, and tech companies. Try the free templates first!',
                },
                {
                  q: 'Can I cancel anytime?',
                  a: 'Yes! Cancel your subscription anytime. You\'ll keep access until the end of your billing period.',
                },
                {
                  q: 'Do you offer annual billing?',
                  a: 'Yes! Save 20% with annual billing. Contact us for annual pricing options.',
                },
              ].map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-bold mb-2 text-slate-900 dark:text-white">{faq.q}</h3>
                      <p className="text-slate-600 dark:text-slate-300">{faq.a}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center text-white"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl mb-10 text-blue-100">
              Start with our free plan. No credit card required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
                  Start Free Today
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/accounting-software">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6 bg-transparent text-white border-white hover:bg-white hover:text-blue-600">
                  Learn More
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-12 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <Link href="/accounting-software" className="inline-flex items-center gap-2 mb-4">
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Octrivium Accounting
              </span>
            </Link>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Professional invoicing and accounting software for South African businesses.
            </p>
            <div className="flex items-center justify-center gap-6 text-sm">
              <Link href="/terms" className="text-slate-600 dark:text-slate-400 hover:text-blue-600">Terms</Link>
              <Link href="/privacy" className="text-slate-600 dark:text-slate-400 hover:text-blue-600">Privacy</Link>
              <Link href="/" className="text-slate-600 dark:text-slate-400 hover:text-blue-600">Back to Main Site</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
