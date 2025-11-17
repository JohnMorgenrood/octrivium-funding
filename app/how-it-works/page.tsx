'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { 
  UserPlus, 
  Search, 
  DollarSign, 
  TrendingUp, 
  CheckCircle, 
  ArrowRight,
  Shield,
  Target,
  BarChart3,
  Repeat,
  Calculator,
  Users
} from 'lucide-react';

export default function HowItWorksPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut'
      }
    }
  };

  const steps = [
    {
      icon: UserPlus,
      title: '1. Create Your Account',
      description: 'Sign up as an investor or business in minutes. Complete a simple KYC verification process to get started.',
      color: 'from-blue-500 to-indigo-500',
      details: [
        'Quick registration process',
        'Secure identity verification',
        'Choose your role (Investor or Business)',
        'Set up your investment preferences'
      ]
    },
    {
      icon: Search,
      title: '2. Browse Verified Deals',
      description: 'Explore carefully vetted South African businesses seeking funding. Filter by industry, risk level, and return targets.',
      color: 'from-purple-500 to-pink-500',
      details: [
        'All businesses are verified',
        'Detailed business profiles',
        'Transparent financials',
        'Real revenue data'
      ]
    },
    {
      icon: DollarSign,
      title: '3. Make Your Investment',
      description: 'Start with as little as R1,000. Invest in businesses you believe in and diversify across multiple deals.',
      color: 'from-emerald-500 to-teal-500',
      details: [
        'Low minimum investments',
        'Secure payment processing',
        'Instant investment confirmation',
        'Digital investment agreements'
      ]
    },
    {
      icon: TrendingUp,
      title: '4. Earn Revenue Returns',
      description: 'Receive monthly returns based on business revenue. Track your investments and returns in real-time.',
      color: 'from-orange-500 to-red-500',
      details: [
        'Monthly revenue-based returns',
        'Transparent payment tracking',
        'Capped returns (1.3x - 1.7x)',
        'Automatic payouts to your wallet'
      ]
    }
  ];

  const forInvestors = [
    {
      icon: Shield,
      title: 'Verified Businesses Only',
      description: 'Every business undergoes rigorous verification including business registration, financial checks, and owner background verification.'
    },
    {
      icon: Target,
      title: 'Diversify Your Portfolio',
      description: 'Spread your investments across multiple businesses and industries to minimize risk and maximize potential returns.'
    },
    {
      icon: BarChart3,
      title: 'Track Performance',
      description: 'Monitor your investments with real-time analytics, revenue reports, and transparent financial data from businesses.'
    }
  ];

  const forBusinesses = [
    {
      icon: Repeat,
      title: 'No Equity Given Up',
      description: 'Raise capital through revenue-sharing without diluting ownership. Your business remains 100% yours.'
    },
    {
      icon: Calculator,
      title: 'Flexible Repayment',
      description: 'Repay investors based on actual revenue. During slow months, payments adjust automatically - no fixed debt burden.'
    },
    {
      icon: Users,
      title: 'Community Support',
      description: 'Gain investors who believe in your vision and want to see you succeed. Build lasting relationships beyond just funding.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 dark:from-slate-950 dark:to-slate-900">
      {/* Header */}
      <section className="relative overflow-hidden py-20 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600">
        <div className="absolute inset-0 bg-black/20" />
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="container mx-auto px-4 relative z-10"
        >
          <div className="max-w-3xl mx-auto text-center">
            <motion.h1 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6"
            >
              How Octrivium Works
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-xl text-white/90 mb-8"
            >
              Connecting South African businesses with investors through transparent, revenue-based funding
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link href="/register?role=investor">
                <Button size="lg" className="bg-white text-indigo-600 hover:bg-slate-100 shadow-xl text-lg px-8">
                  Start Investing
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/register?role=business">
                <Button size="lg" variant="outline" className="bg-transparent text-white border-white/50 hover:bg-white/10 backdrop-blur-sm text-lg px-8">
                  Raise Capital
                </Button>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* The Process */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="max-w-5xl mx-auto"
          >
            <motion.h2 
              variants={itemVariants}
              className="text-3xl md:text-4xl font-bold text-center mb-4 text-slate-900 dark:text-white"
            >
              Simple Process, Powerful Results
            </motion.h2>
            <motion.p 
              variants={itemVariants}
              className="text-center text-slate-600 dark:text-slate-400 mb-16 max-w-2xl mx-auto"
            >
              Whether you're an investor or a business, getting started is straightforward and secure
            </motion.p>

            <div className="space-y-16">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="flex flex-col md:flex-row gap-8 items-start"
                >
                  <div className={`flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-xl`}>
                    <step.icon className="h-8 w-8 md:h-10 md:w-10 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-3 text-slate-900 dark:text-white">
                      {step.title}
                    </h3>
                    <p className="text-lg text-slate-600 dark:text-slate-300 mb-4">
                      {step.description}
                    </p>
                    <ul className="grid sm:grid-cols-2 gap-3">
                      {step.details.map((detail, idx) => (
                        <li key={idx} className="flex items-start space-x-2">
                          <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-slate-600 dark:text-slate-400">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* For Investors */}
      <section className="py-20 bg-slate-100 dark:bg-slate-900/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
          >
            <motion.h2 
              variants={itemVariants}
              className="text-3xl md:text-4xl font-bold text-center mb-4 text-slate-900 dark:text-white"
            >
              For Investors
            </motion.h2>
            <motion.p 
              variants={itemVariants}
              className="text-center text-slate-600 dark:text-slate-400 mb-12 max-w-2xl mx-auto"
            >
              Smart investing made simple with transparent, revenue-based returns
            </motion.p>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {forInvestors.map((item, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-slate-200 dark:border-slate-700"
                >
                  <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4">
                    <item.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">
                    {item.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300">
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* For Businesses */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
          >
            <motion.h2 
              variants={itemVariants}
              className="text-3xl md:text-4xl font-bold text-center mb-4 text-slate-900 dark:text-white"
            >
              For Businesses
            </motion.h2>
            <motion.p 
              variants={itemVariants}
              className="text-center text-slate-600 dark:text-slate-400 mb-12 max-w-2xl mx-auto"
            >
              Grow your business without giving up equity or taking on rigid debt
            </motion.p>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {forBusinesses.map((item, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-slate-200 dark:border-slate-700"
                >
                  <div className="w-12 h-12 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-4">
                    <item.icon className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">
                    {item.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300">
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Revenue-Based Model Explanation */}
      <section className="py-20 bg-gradient-to-br from-indigo-600 to-purple-600 text-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="max-w-4xl mx-auto text-center"
          >
            <motion.h2 
              variants={itemVariants}
              className="text-3xl md:text-4xl font-bold mb-6"
            >
              Understanding Revenue-Based Funding
            </motion.h2>
            <motion.p 
              variants={itemVariants}
              className="text-xl mb-8 text-white/90"
            >
              It's simple: businesses share a percentage of their monthly revenue with investors until a predetermined cap is reached.
            </motion.p>
            
            <motion.div 
              variants={itemVariants}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20"
            >
              <div className="grid md:grid-cols-3 gap-6 text-left">
                <div>
                  <div className="text-4xl font-bold mb-2">5-10%</div>
                  <div className="text-white/80">of monthly revenue shared</div>
                </div>
                <div>
                  <div className="text-4xl font-bold mb-2">1.3x-1.7x</div>
                  <div className="text-white/80">return cap for investors</div>
                </div>
                <div>
                  <div className="text-4xl font-bold mb-2">12-36</div>
                  <div className="text-white/80">months typical duration</div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              variants={itemVariants}
              className="mt-8 text-left max-w-2xl mx-auto space-y-4"
            >
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-6 w-6 text-emerald-400 flex-shrink-0 mt-1" />
                <p className="text-lg text-white/90">
                  <strong>For investors:</strong> Returns are tied to business performance. Successful businesses = higher returns, faster.
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-6 w-6 text-emerald-400 flex-shrink-0 mt-1" />
                <p className="text-lg text-white/90">
                  <strong>For businesses:</strong> Payments adjust with revenue. Slow month? Lower payment. No fixed debt stress.
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-6 w-6 text-emerald-400 flex-shrink-0 mt-1" />
                <p className="text-lg text-white/90">
                  <strong>Win-win model:</strong> Investors and businesses succeed together, creating aligned incentives.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-slate-900 dark:text-white">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 mb-8">
              Join hundreds of investors and businesses already using Octrivium
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register?role=investor">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-xl text-lg px-8">
                  Start Investing Today
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/deals">
                <Button size="lg" variant="outline" className="text-lg px-8">
                  Browse Active Deals
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
