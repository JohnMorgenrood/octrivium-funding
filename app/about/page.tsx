'use client';

import { Navigation } from '@/components/navigation';
import { Target, TrendingUp, Shield, Users, Building2, CheckCircle } from 'lucide-react';

export default function AboutPage() {
  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">About Octrivium Funding</h1>
            <p className="text-xl md:text-2xl text-blue-100">
              Democratizing investment in South African businesses through revenue-based financing
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        {/* Mission Section */}
        <section className="mb-20">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold mb-6 text-slate-900 dark:text-white text-center">Our Mission</h2>
            <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed mb-6">
              Octrivium Funding bridges the gap between investors seeking stable returns and growing South African businesses 
              needing capital without diluting equity. We believe in the power of revenue-share agreements to align incentives 
              between businesses and their backers.
            </p>
            <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
              Unlike traditional equity investment or debt financing, our model allows businesses to raise capital while maintaining 
              full ownership and control. Investors benefit from a share of monthly revenue until they reach their target return, 
              typically ranging from 1.4x to 1.8x their initial investment.
            </p>
          </div>
        </section>

        {/* How It Works */}
        <section className="mb-20">
          <h2 className="text-4xl font-bold mb-12 text-slate-900 dark:text-white text-center">How Revenue-Share Investing Works</h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-lg border border-slate-200 dark:border-slate-700">
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mb-6">
                <Building2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">1. Business Raises Capital</h3>
              <p className="text-slate-700 dark:text-slate-300">
                Vetted businesses create funding campaigns, specifying their funding goal, revenue share percentage, and target return multiplier.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-lg border border-slate-200 dark:border-slate-700">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-6">
                <Users className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">2. Investors Back Businesses</h3>
              <p className="text-slate-700 dark:text-slate-300">
                Investors review business profiles, financials, and terms, then invest amounts that fit their risk tolerance and return expectations.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-lg border border-slate-200 dark:border-slate-700">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mb-6">
                <TrendingUp className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">3. Returns from Revenue</h3>
              <p className="text-slate-700 dark:text-slate-300">
                Businesses pay investors a fixed percentage of monthly revenue until investors receive their target return (e.g., 1.6x investment).
              </p>
            </div>
          </div>
        </section>

        {/* Multiplier Logic */}
        <section className="mb-20 bg-white dark:bg-slate-800 rounded-2xl p-12 shadow-xl border border-slate-200 dark:border-slate-700">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold mb-8 text-slate-900 dark:text-white text-center">Understanding Return Multipliers</h2>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center">
                  <Target className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">What is a Return Multiplier?</h3>
                  <p className="text-slate-700 dark:text-slate-300">
                    The return multiplier (or repayment cap) defines the maximum amount an investor will receive relative to their investment. 
                    For example, a 1.6x multiplier on a R10,000 investment means the investor will receive R16,000 total (R6,000 profit).
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">How Multipliers Reflect Risk</h3>
                  <p className="text-slate-700 dark:text-slate-300">
                    Lower-risk businesses with proven revenue streams may offer 1.4x-1.5x multipliers, while higher-growth or emerging businesses 
                    might offer 1.7x-1.8x to compensate for additional risk. Each deal is customized based on the business's profile.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">Payment Structure</h3>
                  <p className="text-slate-700 dark:text-slate-300">
                    Investors receive a fixed percentage of the business's monthly revenue (typically 4-7%) until they reach their target return. 
                    Payments are automatic, transparent, and tied to actual business performance.
                  </p>
                </div>
              </div>
            </div>

            {/* Example Calculation */}
            <div className="mt-10 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl p-8 border border-emerald-200 dark:border-emerald-800">
              <h4 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">Example Investment</h4>
              <div className="space-y-3 text-slate-700 dark:text-slate-300">
                <p className="flex justify-between border-b border-emerald-200 dark:border-emerald-800 pb-2">
                  <span className="font-semibold">Investment Amount:</span>
                  <span>R50,000</span>
                </p>
                <p className="flex justify-between border-b border-emerald-200 dark:border-emerald-800 pb-2">
                  <span className="font-semibold">Return Multiplier:</span>
                  <span>1.6x</span>
                </p>
                <p className="flex justify-between border-b border-emerald-200 dark:border-emerald-800 pb-2">
                  <span className="font-semibold">Target Return:</span>
                  <span>R80,000 (R30,000 profit)</span>
                </p>
                <p className="flex justify-between border-b border-emerald-200 dark:border-emerald-800 pb-2">
                  <span className="font-semibold">Revenue Share:</span>
                  <span>5% of monthly revenue</span>
                </p>
                <p className="flex justify-between border-b border-emerald-200 dark:border-emerald-800 pb-2">
                  <span className="font-semibold">Business Monthly Revenue:</span>
                  <span>R850,000</span>
                </p>
                <p className="flex justify-between pt-2">
                  <span className="font-bold text-lg text-slate-900 dark:text-white">Monthly Payment to Investor:</span>
                  <span className="font-bold text-lg text-emerald-600 dark:text-emerald-400">R42,500</span>
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                  At this rate, the investor would reach their R80,000 target return in approximately 1.9 months, though actual 
                  timing depends on the business's revenue performance.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Value Proposition */}
        <section className="mb-20">
          <h2 className="text-4xl font-bold mb-12 text-slate-900 dark:text-white text-center">Why Octrivium Funding?</h2>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-lg border border-slate-200 dark:border-slate-700">
              <h3 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">For Investors</h3>
              <ul className="space-y-3 text-slate-700 dark:text-slate-300">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mr-3 mt-1 flex-shrink-0" />
                  <span>Diversify with revenue-generating South African businesses</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mr-3 mt-1 flex-shrink-0" />
                  <span>Predictable returns tied to real business performance</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mr-3 mt-1 flex-shrink-0" />
                  <span>No equity dilution concerns - you're a revenue partner, not an owner</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mr-3 mt-1 flex-shrink-0" />
                  <span>Transparent reporting and automated monthly payouts</span>
                </li>
              </ul>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-lg border border-slate-200 dark:border-slate-700">
              <h3 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">For Businesses</h3>
              <ul className="space-y-3 text-slate-700 dark:text-slate-300">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-3 mt-1 flex-shrink-0" />
                  <span>Raise capital without giving up equity or board control</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-3 mt-1 flex-shrink-0" />
                  <span>Flexible repayment based on actual revenue performance</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-3 mt-1 flex-shrink-0" />
                  <span>No personal guarantees or collateral requirements</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-3 mt-1 flex-shrink-0" />
                  <span>Access to a community of supporters invested in your success</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Trust & Safety */}
        <section className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-8 text-slate-900 dark:text-white">Built on Trust & Transparency</h2>
          <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed mb-6">
            Every business on Octrivium Funding undergoes thorough vetting, including financial reviews, KYC verification, 
            and business model assessment. We provide complete transparency through real-time dashboards, monthly revenue reports, 
            and automated payout tracking.
          </p>
          <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
            Our platform is designed to protect both investors and businesses, ensuring fair terms, clear communication, 
            and a sustainable path to mutual success.
          </p>
        </section>
      </div>
      </div>
    </>
  );
}
