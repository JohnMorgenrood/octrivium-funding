'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Calculator, 
  FileText, 
  Users, 
  Package, 
  TrendingUp, 
  Repeat, 
  DollarSign, 
  Check, 
  Crown, 
  Palette,
  Zap,
  Shield,
  ArrowRight,
  Smartphone,
  Printer,
  Mail
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function AccountingSoftwarePage() {
  const features = [
    {
      icon: FileText,
      title: 'Professional Invoices & Quotes',
      description: '10 beautiful templates to choose from. Create, send, and track invoices with ease.',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Palette,
      title: '10 Stunning Templates',
      description: 'Choose from 10 professionally designed invoice templates. 5 free, 5 premium.',
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      icon: Users,
      title: 'Customer Management',
      description: 'Store customer details, track purchase history, and manage relationships.',
      gradient: 'from-green-500 to-emerald-500',
    },
    {
      icon: Package,
      title: 'Product Catalog',
      description: 'Manage your products and services with pricing, costs, and profit tracking.',
      gradient: 'from-orange-500 to-red-500',
    },
    {
      icon: TrendingUp,
      title: 'Expense Tracking',
      description: 'Record and categorize expenses. Track spending by category and vendor.',
      gradient: 'from-indigo-500 to-blue-500',
    },
    {
      icon: Repeat,
      title: 'Recurring Invoices',
      description: 'Set up automatic invoicing for subscription-based services.',
      gradient: 'from-pink-500 to-rose-500',
    },
    {
      icon: DollarSign,
      title: 'Payment Tracking',
      description: 'Accept payments via Yoco, bank transfer, or PayPal. Track payment status.',
      gradient: 'from-yellow-500 to-orange-500',
    },
    {
      icon: Calculator,
      title: 'Financial Reports',
      description: 'Profit & loss, tax summaries, and revenue analytics at your fingertips.',
      gradient: 'from-teal-500 to-cyan-500',
    },
  ];

  const templates = [
    { id: 1, name: 'Classic Professional', free: true, color: 'bg-blue-500' },
    { id: 2, name: 'Modern Minimal', free: true, color: 'bg-purple-500' },
    { id: 3, name: 'Clean & Simple', free: true, color: 'bg-green-500' },
    { id: 4, name: 'Bold Statement', free: true, color: 'bg-orange-500' },
    { id: 5, name: 'Corporate Blue', free: true, color: 'bg-indigo-500' },
    { id: 6, name: 'Creative Dark', free: false, color: 'bg-slate-800' },
    { id: 7, name: 'Elegant Gold', free: false, color: 'bg-amber-600' },
    { id: 8, name: 'Tech Gradient', free: false, color: 'bg-gradient-to-r from-cyan-500 to-blue-500' },
    { id: 9, name: 'Luxury Black', free: false, color: 'bg-black' },
    { id: 10, name: 'Playful Colors', free: false, color: 'bg-gradient-to-r from-pink-500 to-purple-500' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950">
      {/* Header */}
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Octrivium
              </span>
              <span className="text-sm text-slate-600 dark:text-slate-400">Accounting</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/accounting-software/pricing">
                <Button variant="ghost">Pricing</Button>
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
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-5xl mx-auto text-center"
          >
            <Badge className="mb-6 bg-blue-500/10 text-blue-600 border-blue-500/20 px-4 py-2">
              <Zap className="w-4 h-4 mr-2" />
              Professional Invoicing Software
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-slate-900 dark:text-white">
              Beautiful Invoices.
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Effortless Accounting.
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 mb-10 max-w-3xl mx-auto leading-relaxed">
              Create professional invoices with 10 stunning templates, track expenses, manage customers, and get paid faster. All in one simple platform.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link href="/register">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-6 text-lg shadow-xl hover:shadow-2xl transition-all">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/accounting-software/pricing">
                <Button size="lg" variant="outline" className="px-8 py-6 text-lg">
                  View Pricing
                </Button>
              </Link>
            </div>

            <div className="flex items-center justify-center gap-8 text-sm text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500" />
                <span>5 free templates</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500" />
                <span>3 invoices/month free</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Template Showcase */}
      <section className="py-20 bg-white dark:bg-slate-900/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900 dark:text-white">
              10 Professional Templates
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Choose from beautifully designed invoice templates. 5 free forever, 5 premium for power users.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 max-w-6xl mx-auto">
            {templates.map((template, index) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <Card className="relative overflow-hidden border-2 border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 transition-all shadow-lg hover:shadow-xl">
                  <CardContent className="p-0">
                    <div className={`${template.color} h-40 flex items-center justify-center text-white relative`}>
                      <FileText className="w-12 h-12 opacity-50" />
                      {!template.free && (
                        <div className="absolute top-2 right-2">
                          <Crown className="w-6 h-6 text-yellow-400" />
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-sm text-center mb-2">{template.name}</h3>
                      <Badge variant={template.free ? "outline" : "secondary"} className="w-full justify-center">
                        {template.free ? 'Free' : 'Premium'}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900 dark:text-white">
              Everything You Need
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Professional accounting tools designed for South African small businesses and freelancers.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -10 }}
                >
                  <Card className="h-full border-2 border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 transition-all shadow-lg hover:shadow-xl">
                    <CardContent className="p-6">
                      <div className={`w-14 h-14 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center mb-4 shadow-lg`}>
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                      <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">
                        {feature.title}
                      </h3>
                      <p className="text-slate-600 dark:text-slate-300">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Highlight */}
      <section className="py-20 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8 text-center text-white">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <Smartphone className="w-12 h-12 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">Mobile Friendly</h3>
                <p className="text-blue-100">Create and send invoices from any device, anywhere, anytime.</p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
              >
                <Printer className="w-12 h-12 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">Print & PDF Ready</h3>
                <p className="text-blue-100">Perfect A4 print layouts. Download PDFs with one click.</p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <Shield className="w-12 h-12 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">Secure & Reliable</h3>
                <p className="text-blue-100">Bank-level security. Your data is encrypted and backed up daily.</p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-slate-900 dark:text-white">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 mb-10">
              Join thousands of South African businesses using Octrivium Accounting.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-6 text-lg shadow-xl">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/accounting-software/pricing">
                <Button size="lg" variant="outline" className="px-8 py-6 text-lg">
                  View Pricing Plans
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
            <Link href="/" className="inline-flex items-center gap-2 mb-4">
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
