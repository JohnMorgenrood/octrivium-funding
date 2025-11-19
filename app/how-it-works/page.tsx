'use client';

import { Navigation } from '@/components/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { 
  FileText, 
  Shield, 
  FileCheck, 
  Wallet, 
  Zap, 
  TrendingUp, 
  BarChart3, 
  CheckCircle,
  Building2,
  Users,
  DollarSign,
  Calendar,
  Target,
  Activity,
  AlertCircle,
  Award,
  Briefcase,
  PieChart,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';

export default function HowItWorksPage() {
  const [expandedStep, setExpandedStep] = useState<number | null>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7
      }
    }
  };

  const cardHoverVariants = {
    rest: { scale: 1, y: 0 },
    hover: { 
      scale: 1.02, 
      y: -8
    }
  };

  const steps = [
    {
      icon: FileText,
      title: '1. Businesses Apply',
      description: 'Verified South African businesses submit their application with all required documentation.',
      color: 'from-blue-500 to-indigo-500',
      details: [
        'Company registration documents and KYC verification',
        'Financial statements and revenue history (6-12 months)',
        'Bank statements or API-linked revenue data',
        'Business plan and growth projections',
        'Risk assessment and stability evaluation'
      ]
    },
    {
      icon: Shield,
      title: '2. No Equity Taken',
      description: 'Octrivium does NOT take equity. Businesses keep 100% ownership and control.',
      color: 'from-emerald-500 to-teal-500',
      details: [
        'No ownership or voting rights transferred',
        'Businesses maintain complete control',
        'No board seats or decision-making power given up',
        'Pure revenue-sharing agreement only',
        'Exit when cap is reached, business remains 100% yours'
      ]
    },
    {
      icon: FileCheck,
      title: '3. Deal Terms Are Created',
      description: 'Each campaign has transparent, clearly defined terms tailored to the business risk profile.',
      color: 'from-purple-500 to-pink-500',
      details: [
        'Funding goal: Amount needed for growth',
        'Return multiplier: 1.3×–1.7× based on risk category',
        'Revenue share: 5%–12% of monthly revenue',
        'Capped maximum repayment amount',
        'Target timeline based on current revenue performance'
      ]
    },
    {
      icon: Users,
      title: '4. Investors Invest Any Amount',
      description: 'Community investors contribute small or large amounts and receive proportional returns.',
      color: 'from-orange-500 to-red-500',
      details: [
        'Minimum investment typically R1,000–R5,000',
        'Investors receive proportional share of repayment pool',
        'Example: R10k of R425k raised = 2.35% of all repayments',
        'Track your share and returns in real-time dashboard',
        'Monthly automated distributions to your wallet'
      ]
    },
    {
      icon: Zap,
      title: '5. Capital Transferred Immediately',
      description: 'Once campaign succeeds and agreements are signed, funds go directly to the business.',
      color: 'from-yellow-500 to-amber-500',
      details: [
        'Funds released after campaign closes successfully',
        'All legal agreements digitally signed',
        'Direct transfer to business bank account',
        'Fast access to growth capital (1-3 business days)',
        'Ready to scale operations immediately'
      ]
    },
    {
      icon: TrendingUp,
      title: '6. Monthly Revenue Sharing',
      description: 'Business pays agreed percentage of actual revenue each month to investors.',
      color: 'from-green-500 to-emerald-500',
      details: [
        'Automatic monthly revenue reporting',
        'Agreed percentage deducted (5%–12%)',
        'Payments distributed proportionally to all investors',
        'Continues until each investor hits their cap',
        'Transparent tracking in both dashboards'
      ]
    },
    {
      icon: Activity,
      title: '7. Flexible Repayment Model',
      description: 'Repayments automatically adjust based on actual business performance.',
      color: 'from-cyan-500 to-blue-500',
      details: [
        'Revenue increases → Investors repaid faster',
        'Revenue decreases → Payments slow down proportionally',
        'Zero revenue month → Payments pause (no default)',
        'Business bounces back → Payments resume',
        'Only fraud or misreporting counts as default'
      ]
    },
    {
      icon: BarChart3,
      title: '8. Platform Tracks Everything',
      description: 'Real-time dashboards show every detail of the revenue-sharing relationship.',
      color: 'from-indigo-500 to-purple-500',
      details: [
        'Monthly payout history and remaining balance',
        'Revenue trends and repayment speed analytics',
        'Predicted completion dates based on performance',
        'Automated notifications for all transactions',
        'Downloadable reports for tax purposes'
      ]
    },
    {
      icon: CheckCircle,
      title: '9. Investment Completes at Cap',
      description: 'Once investor reaches their capped return, they stop receiving payments from that deal.',
      color: 'from-pink-500 to-rose-500',
      details: [
        'Example: R10k invested → R17k received (1.7× cap)',
        'Investor earns R7k profit over the period',
        'Their share of that deal completes',
        'Investor can reinvest in new opportunities',
        'Business continues paying remaining investors only'
      ]
    }
  ];

  const businessBenefits = [
    {
      icon: Shield,
      title: 'Keep 100% Ownership',
      description: 'No equity dilution. Your business stays completely yours.'
    },
    {
      icon: Activity,
      title: 'Pay Only When You Earn',
      description: 'Repayments scale with revenue. No fixed monthly burden.'
    },
    {
      icon: Zap,
      title: 'Fast Funding',
      description: 'Get approved and funded quickly once verified.'
    },
    {
      icon: BarChart3,
      title: 'Clear Monthly Reporting',
      description: 'Simple tools to report revenue and track payouts.'
    }
  ];

  const investorBenefits = [
    {
      icon: TrendingUp,
      title: 'Transparent Returns',
      description: 'Clear multiplier caps and monthly payout visibility.'
    },
    {
      icon: DollarSign,
      title: 'Monthly Payouts',
      description: 'Receive revenue-based returns every month.'
    },
    {
      icon: Shield,
      title: 'Verified Businesses',
      description: 'All businesses KYC checked and risk-assessed.'
    },
    {
      icon: PieChart,
      title: 'Easy Dashboard Tracking',
      description: 'Monitor all investments and returns in one place.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950">
      <Navigation />

      {/* Hero Section - Enhanced */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              rotate: [0, -90, 0],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-indigo-400/20 to-pink-400/20 rounded-full blur-3xl"
          />
        </div>

        <div className="container mx-auto max-w-5xl text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 dark:border-blue-400/30 mb-8"
            >
              <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-semibold text-blue-900 dark:text-blue-300">Simple. Transparent. Fair.</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 dark:text-white mb-6 leading-tight"
            >
              How{' '}
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Octrivium
              </span>
              {' '}Works
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed"
            >
              Revenue-based crowdfunding that's fair for everyone. Businesses grow without giving up equity. 
              Investors earn returns from real revenue.
            </motion.p>

            {/* Stats Row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="grid grid-cols-3 gap-4 md:gap-8 mt-12 max-w-3xl mx-auto"
            >
              {[
                { number: '9', label: 'Simple Steps' },
                { number: '0%', label: 'Equity Taken' },
                { number: '100%', label: 'Transparent' }
              ].map((stat, index) => (
                <div key={index} className="backdrop-blur-xl bg-white/60 dark:bg-slate-900/60 rounded-2xl p-4 md:p-6 border border-white/40 dark:border-slate-700/40 shadow-xl">
                  <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-1">{stat.number}</div>
                  <div className="text-sm md:text-base text-slate-600 dark:text-slate-400 font-medium">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Main Steps - Redesigned with Modern Cards */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
              The Complete Journey
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400">
              From application to payout, here's how every deal works
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid gap-8 md:gap-10 max-w-5xl mx-auto"
          >
            {steps.map((step, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                initial="rest"
                whileHover="hover"
                animate={expandedStep === index ? "hover" : "rest"}
                className="group relative"
              >
                {/* Connection Line */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute left-8 top-full w-0.5 h-10 bg-gradient-to-b from-slate-300 to-transparent dark:from-slate-700 z-0" />
                )}

                <motion.div
                  variants={cardHoverVariants}
                  className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl shadow-xl hover:shadow-2xl border border-slate-200/50 dark:border-slate-700/50 p-6 md:p-10 overflow-hidden transition-all duration-300"
                >
                  {/* Gradient Background on Hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-3xl`} />
                  
                  {/* Number Badge */}
                  <div className="absolute top-6 right-6 w-12 h-12 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center text-2xl font-bold text-slate-600 dark:text-slate-300 shadow-inner">
                    {index + 1}
                  </div>

                  <div className="flex flex-col md:flex-row items-start gap-6 md:gap-8 relative z-10">
                    {/* Icon */}
                    <motion.div
                      whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
                      transition={{ duration: 0.5 }}
                      className={`flex-shrink-0 w-20 h-20 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center shadow-2xl group-hover:shadow-3xl transition-shadow duration-300`}
                    >
                      <step.icon className="w-10 h-10 text-white" />
                    </motion.div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all duration-300">
                        {step.title}
                      </h3>
                      <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
                        {step.description}
                      </p>
                      
                      {/* Expandable Details */}
                      <motion.div
                        initial={false}
                        animate={{ height: expandedStep === index ? "auto" : 0 }}
                        className="overflow-hidden"
                      >
                        <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                          <ul className="space-y-3">
                            {step.details.map((detail, idx) => (
                              <motion.li
                                key={idx}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ 
                                  opacity: expandedStep === index ? 1 : 0,
                                  x: expandedStep === index ? 0 : -20
                                }}
                                transition={{ delay: idx * 0.1 }}
                                className="flex items-start gap-3 text-slate-600 dark:text-slate-400"
                              >
                                <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                                <span className="text-base">{detail}</span>
                              </motion.li>
                            ))}
                          </ul>
                        </div>
                      </motion.div>

                      {/* Toggle Button */}
                      <button
                        onClick={() => setExpandedStep(expandedStep === index ? null : index)}
                        className="mt-4 inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold hover:gap-3 transition-all group"
                      >
                        <span>{expandedStep === index ? 'Show Less' : 'Learn More'}</span>
                        <motion.div
                          animate={{ rotate: expandedStep === index ? 90 : 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <ArrowRight className="w-5 h-5" />
                        </motion.div>
                      </button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Benefits Split Section - Redesigned */}
      <section className="py-20 px-4 relative overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-white via-blue-50/50 to-purple-50/50 dark:from-slate-900 dark:via-blue-950/50 dark:to-purple-950/50" />
        
        <div className="container mx-auto max-w-7xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
              Why Choose Octrivium?
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400">
              Built for both sides of the community
            </p>
          </motion.div>
          
          <div className="grid lg:grid-cols-2 gap-8">
            {/* For Businesses */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl blur-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-300" />
              <div className="relative bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-3xl p-8 md:p-10 border-2 border-blue-200 dark:border-blue-800 shadow-2xl hover:shadow-3xl transition-all duration-300">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <Building2 className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-slate-900 dark:text-white">For Businesses</h3>
                </div>
                <div className="space-y-6">
                  {businessBenefits.map((benefit, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1, duration: 0.5 }}
                      className="flex items-start gap-4 p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30 hover:bg-blue-100/50 dark:hover:bg-blue-950/40 transition-colors duration-300"
                    >
                      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                        <benefit.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-lg text-slate-900 dark:text-white mb-2">{benefit.title}</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{benefit.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* For Investors */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-600 rounded-3xl blur-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-300" />
              <div className="relative bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-3xl p-8 md:p-10 border-2 border-purple-200 dark:border-purple-800 shadow-2xl hover:shadow-3xl transition-all duration-300">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-slate-900 dark:text-white">For Investors</h3>
                </div>
                <div className="space-y-6">
                  {investorBenefits.map((benefit, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1, duration: 0.5 }}
                      className="flex items-start gap-4 p-4 rounded-2xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/30 hover:bg-purple-100/50 dark:hover:bg-purple-950/40 transition-colors duration-300"
                    >
                      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                        <benefit.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-lg text-slate-900 dark:text-white mb-2">{benefit.title}</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{benefit.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Example Calculation - Redesigned */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative overflow-hidden rounded-3xl"
          >
            {/* Animated Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 dark:from-emerald-600 dark:via-teal-600 dark:to-cyan-600" />
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00ek0xMCA0YzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30" />
            
            <div className="relative z-10 p-8 md:p-12 lg:p-16">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-white">Real Example</h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  { icon: Target, label: 'Business raises', value: 'R500,000 at 1.5x return cap with 8% revenue share' },
                  { icon: Users, label: 'Investor contributes', value: 'R10,000 (2% of total pool)' },
                  { icon: DollarSign, label: "Investor's cap", value: 'R10,000 x 1.5 = R15,000' },
                  { icon: Calendar, label: 'Monthly revenue', value: 'R150,000 - 8% = R12,000 to investors' },
                  { icon: TrendingUp, label: 'Investor receives monthly', value: 'R12,000 x 2% = R240' },
                  { icon: CheckCircle, label: 'Time to complete', value: '~62 months (faster if revenue grows!)' },
                  { icon: Award, label: 'Total profit', value: 'R5,000 (50% return on investment)' }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                        <item.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-emerald-100 text-sm font-semibold mb-2">{item.label}</p>
                        <p className="text-white text-base md:text-lg font-bold leading-tight">{item.value}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Important Notes */}
      <section className="py-16 px-4 bg-slate-100 dark:bg-slate-900">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-400 dark:border-amber-600 rounded-2xl p-8">
            <div className="flex items-start gap-4 mb-4">
              <AlertCircle className="w-8 h-8 text-amber-600 flex-shrink-0" />
              <div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Important to Understand</h3>
                <ul className="space-y-3 text-slate-700 dark:text-slate-300">
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-amber-600 flex-shrink-0">•</span>
                    <span>This is NOT a loan and NOT equity investment</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-amber-600 flex-shrink-0">•</span>
                    <span>Returns depend entirely on business revenue performance</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-amber-600 flex-shrink-0">•</span>
                    <span>If a business closes permanently, unpaid returns may not be recoverable</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-amber-600 flex-shrink-0">•</span>
                    <span>Octrivium does not guarantee investor returns</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-amber-600 flex-shrink-0">•</span>
                    <span>All users must comply with South African KYC, FICA, and AML requirements</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-amber-600 flex-shrink-0">•</span>
                    <span>Platform may audit suspicious revenue changes</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Redesigned */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 dark:from-blue-900/20 dark:via-purple-900/20 dark:to-pink-900/20" />
        
        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <motion.div
              animate={{
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 mb-8"
            >
              <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-semibold text-blue-900 dark:text-blue-300">Join The Community</span>
            </motion.div>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 mb-12 max-w-2xl mx-auto">
              Join South Africa's fastest-growing revenue-based funding community
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
              <motion.div whileHover={{ scale: 1.05, y: -5 }} whileTap={{ scale: 0.95 }}>
                <Link href="/register?role=business">
                  <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-lg px-10 py-7 shadow-2xl hover:shadow-3xl transition-all duration-300 rounded-xl">
                    <Briefcase className="mr-3 h-6 w-6" />
                    Raise Capital
                    <ArrowRight className="ml-3 h-6 w-6" />
                  </Button>
                </Link>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.05, y: -5 }} whileTap={{ scale: 0.95 }}>
                <Link href="/register?role=investor">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto border-2 border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-lg px-10 py-7 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl">
                    <TrendingUp className="mr-3 h-6 w-6" />
                    Start Investing
                  </Button>
                </Link>
              </motion.div>
            </div>
            
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Have questions?{' '}
              <Link href="/terms" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
                Read our Terms & Conditions
              </Link>
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
