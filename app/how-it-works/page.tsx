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
  PieChart
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function HowItWorksPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6
      }
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

      {/* Hero Section */}
      <section className="pt-20 pb-12 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6">
              How <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">Octrivium Funding</span> Works
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Revenue-based crowdfunding that's fair for everyone. Businesses grow without giving up equity. 
              Investors earn returns from real revenue. Simple, transparent, and built for South Africa.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Steps */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            {steps.map((step, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 md:p-8 border border-slate-200 dark:border-slate-700 hover:shadow-2xl transition-shadow"
              >
                <div className="flex items-start gap-6">
                  <div className={`flex-shrink-0 w-16 h-16 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center shadow-lg`}>
                    <step.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                      {step.title}
                    </h3>
                    <p className="text-lg text-slate-600 dark:text-slate-300 mb-4">
                      {step.description}
                    </p>
                    <ul className="space-y-2">
                      {step.details.map((detail, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-slate-600 dark:text-slate-400">
                          <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Benefits Split Section */}
      <section className="py-16 px-4 bg-white dark:bg-slate-900">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-900 dark:text-white mb-12">
            Why Choose Octrivium?
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* For Businesses */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-900 rounded-2xl p-8 border-2 border-blue-200 dark:border-blue-800"
            >
              <div className="flex items-center gap-3 mb-6">
                <Building2 className="w-8 h-8 text-blue-600" />
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">For Businesses</h3>
              </div>
              <div className="space-y-4">
                {businessBenefits.map((benefit, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                      <benefit.icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 dark:text-white mb-1">{benefit.title}</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* For Investors */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-slate-800 dark:to-slate-900 rounded-2xl p-8 border-2 border-purple-200 dark:border-purple-800"
            >
              <div className="flex items-center gap-3 mb-6">
                <Users className="w-8 h-8 text-purple-600" />
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">For Investors</h3>
              </div>
              <div className="space-y-4">
                {investorBenefits.map((benefit, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                      <benefit.icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 dark:text-white mb-1">{benefit.title}</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Example Calculation */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl p-8 md:p-12 text-white shadow-2xl"
          >
            <h2 className="text-3xl font-bold mb-6">Real Example</h2>
            <div className="space-y-4 text-lg">
              <div className="flex items-start gap-3">
                <Target className="w-6 h-6 flex-shrink-0 mt-1" />
                <p><strong>Business raises:</strong> R500,000 at 1.5× return cap with 8% revenue share</p>
              </div>
              <div className="flex items-start gap-3">
                <Users className="w-6 h-6 flex-shrink-0 mt-1" />
                <p><strong>Investor contributes:</strong> R10,000 (2% of total pool)</p>
              </div>
              <div className="flex items-start gap-3">
                <DollarSign className="w-6 h-6 flex-shrink-0 mt-1" />
                <p><strong>Investor's cap:</strong> R10,000 × 1.5 = R15,000</p>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="w-6 h-6 flex-shrink-0 mt-1" />
                <p><strong>Monthly business revenue:</strong> R150,000 → 8% = R12,000 to investors</p>
              </div>
              <div className="flex items-start gap-3">
                <TrendingUp className="w-6 h-6 flex-shrink-0 mt-1" />
                <p><strong>Investor receives monthly:</strong> R12,000 × 2% = R240</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 flex-shrink-0 mt-1" />
                <p><strong>Time to complete:</strong> R15,000 ÷ R240 = ~62 months (or faster if revenue grows!)</p>
              </div>
              <div className="flex items-start gap-3">
                <Award className="w-6 h-6 flex-shrink-0 mt-1" />
                <p><strong>Total profit:</strong> R5,000 (50% return on investment)</p>
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

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-300 mb-8">
            Join South Africa's fastest-growing revenue-based funding community
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register?role=business">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-lg px-8">
                <Briefcase className="mr-2 h-5 w-5" />
                Raise Capital
              </Button>
            </Link>
            <Link href="/register?role=investor">
              <Button size="lg" variant="outline" className="text-lg px-8 border-2">
                <TrendingUp className="mr-2 h-5 w-5" />
                Start Investing
              </Button>
            </Link>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-6">
            Have questions? <Link href="/terms" className="text-blue-600 hover:underline">Read our Terms & Conditions</Link>
          </p>
        </div>
      </section>
    </div>
  );
}
