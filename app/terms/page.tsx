'use client';

import { Navigation } from '@/components/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  DollarSign,
  CreditCard,
  TrendingUp,
  AlertCircle,
  Shield,
  FileText,
  Award,
  Clock,
  Star,
  Zap
} from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950">
      <Navigation />

      <div className="container mx-auto px-4 py-20 max-w-5xl">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            Terms & Conditions
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300">
            Last updated: November 17, 2025
          </p>
        </div>

        {/* Platform Fees Section */}
        <section className="bg-white dark:bg-slate-800 rounded-2xl p-8 mb-8 shadow-lg border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3 mb-6">
            <DollarSign className="w-8 h-8 text-blue-600" />
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Platform Fees</h2>
          </div>

          <div className="space-y-6">
            {/* Success Fee */}
            <div className="border-l-4 border-blue-500 pl-6">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Success Fee (Platform Fee)</h3>
              <p className="text-slate-600 dark:text-slate-300 mb-3">
                <strong className="text-blue-600">6% of total funds raised</strong>
              </p>
              <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                <li>• Charged only when a campaign successfully closes</li>
                <li>• Deducted from the total amount raised before disbursement</li>
                <li>• Example: R500k raised → R30k platform fee → R470k to business</li>
                <li>• Covers platform maintenance, verification, and support</li>
              </ul>
            </div>

            {/* Transaction Fee */}
            <div className="border-l-4 border-emerald-500 pl-6">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Transaction Fee</h3>
              <p className="text-slate-600 dark:text-slate-300 mb-3">
                <strong className="text-emerald-600">1–2% per transaction</strong>
              </p>
              <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                <li>• Applied to investor deposits and withdrawals</li>
                <li>• Covers payment processor costs (PayPal, card payments, etc.)</li>
                <li>• Exact percentage depends on payment method chosen</li>
                <li>• Transparently displayed before transaction completion</li>
              </ul>
            </div>

            {/* Servicing Fee */}
            <div className="border-l-4 border-purple-500 pl-6">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Monthly Servicing Fee (Optional)</h3>
              <p className="text-slate-600 dark:text-slate-300 mb-3">
                <strong className="text-purple-600">0.5% of active investment value per month</strong>
              </p>
              <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                <li>• Covers revenue reporting management and reconciliation</li>
                <li>• Automated investor payout distribution</li>
                <li>• Dashboard analytics and reporting tools</li>
                <li>• Only charged while deal is active and paying out</li>
              </ul>
            </div>

            {/* Late Reporting Fee */}
            <div className="border-l-4 border-red-500 pl-6">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Late Reporting Fee</h3>
              <p className="text-slate-600 dark:text-slate-300 mb-3">
                <strong className="text-red-600">R500 per month late</strong>
              </p>
              <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                <li>• Charged when business fails to report revenue on time</li>
                <li>• Waived if business provides valid reason (emergency, technical issues)</li>
                <li>• Helps maintain trust and transparency with investors</li>
                <li>• Escalates to audit if pattern of late reporting continues</li>
              </ul>
            </div>

            {/* Processing Fees */}
            <div className="border-l-4 border-orange-500 pl-6">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Payment Processing Fees</h3>
              <p className="text-slate-600 dark:text-slate-300 mb-3">
                <strong className="text-orange-600">Variable based on provider</strong>
              </p>
              <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                <li>• PayPal: ~2.9% + R2 per transaction</li>
                <li>• Credit/Debit Card: ~2.5% per transaction</li>
                <li>• Bank transfer (EFT): R5 flat fee</li>
                <li>• These are third-party fees passed through to users</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Premium Listings Section */}
        <section className="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 rounded-2xl p-8 mb-8 shadow-lg border-2 border-amber-300 dark:border-amber-700">
          <div className="flex items-center gap-3 mb-6">
            <Star className="w-8 h-8 text-amber-600" />
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Premium & Top Listing Features</h2>
          </div>

          <p className="text-lg text-slate-700 dark:text-slate-300 mb-6">
            Businesses can purchase premium features to increase visibility and attract more investors faster.
          </p>

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-amber-200 dark:border-amber-700">
              <div className="flex items-center gap-2 mb-2">
                <Award className="w-5 h-5 text-amber-600" />
                <h4 className="font-bold text-slate-900 dark:text-white">Top of Homepage</h4>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400">R2,500/week - Featured prominently on homepage hero section</p>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-amber-200 dark:border-amber-700">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-5 h-5 text-amber-600" />
                <h4 className="font-bold text-slate-900 dark:text-white">Featured Deal Badge</h4>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400">R1,500/week - "Recommended" badge on deal card</p>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-amber-200 dark:border-amber-700">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-amber-600" />
                <h4 className="font-bold text-slate-900 dark:text-white">Priority Search Placement</h4>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400">R1,000/week - Appear at top of search results</p>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-amber-200 dark:border-amber-700">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-5 h-5 text-amber-600" />
                <h4 className="font-bold text-slate-900 dark:text-white">Newsletter Feature</h4>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400">R3,000/campaign - Featured in investor email newsletter</p>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-amber-200 dark:border-amber-700">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-5 h-5 text-amber-600" />
                <h4 className="font-bold text-slate-900 dark:text-white">Social Media Boost</h4>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400">R2,000/week - Featured on Octrivium social channels</p>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-amber-200 dark:border-amber-700">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-5 h-5 text-amber-600" />
                <h4 className="font-bold text-slate-900 dark:text-white">Priority Review Queue</h4>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400">R1,500 - Fast-track application approval process</p>
            </div>
          </div>

          <div className="bg-amber-100 dark:bg-amber-900/30 rounded-lg p-4 border border-amber-300 dark:border-amber-700">
            <p className="text-sm text-slate-700 dark:text-slate-300">
              <strong>Note:</strong> Premium features can be purchased individually or as packages. Contact our team for custom marketing solutions.
            </p>
          </div>
        </section>

        {/* Legal Framework Section */}
        <section className="bg-white dark:bg-slate-800 rounded-2xl p-8 mb-8 shadow-lg border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-8 h-8 text-blue-600" />
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Legal Framework</h2>
          </div>

          <div className="space-y-4 text-slate-700 dark:text-slate-300">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-6 mb-3">Nature of Investment</h3>
            <ul className="space-y-3 pl-5">
              <li className="flex items-start gap-2">
                <span className="font-bold text-blue-600 flex-shrink-0">•</span>
                <span><strong>Revenue-based investing is NOT a loan</strong> - No fixed repayment schedule or interest rate</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-blue-600 flex-shrink-0">•</span>
                <span><strong>Revenue-based investing is NOT equity</strong> - Investors receive no ownership, voting rights, or board seats</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-blue-600 flex-shrink-0">•</span>
                <span>Investors earn returns only from business revenue performance</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-blue-600 flex-shrink-0">•</span>
                <span>Returns are capped at the agreed multiplier (1.3×–1.7×)</span>
              </li>
            </ul>

            <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-6 mb-3">Risk Disclosure</h3>
            <ul className="space-y-3 pl-5">
              <li className="flex items-start gap-2">
                <span className="font-bold text-red-600 flex-shrink-0">•</span>
                <span><strong>If a business closes permanently</strong>, unpaid returns may not be recoverable</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-red-600 flex-shrink-0">•</span>
                <span><strong>Octrivium does not guarantee investor returns</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-red-600 flex-shrink-0">•</span>
                <span>Investors accept the risk associated with business performance</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-red-600 flex-shrink-0">•</span>
                <span>Revenue fluctuations directly impact repayment speed</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-red-600 flex-shrink-0">•</span>
                <span>Early-stage businesses carry higher risk than established ones</span>
              </li>
            </ul>

            <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-6 mb-3">Business Obligations</h3>
            <ul className="space-y-3 pl-5">
              <li className="flex items-start gap-2">
                <span className="font-bold text-emerald-600 flex-shrink-0">•</span>
                <span>Businesses must provide <strong>monthly revenue reports</strong> with supporting documentation</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-emerald-600 flex-shrink-0">•</span>
                <span>Revenue data must be verified via <strong>bank statements or API-linked data</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-emerald-600 flex-shrink-0">•</span>
                <span><strong>Fraud or hidden revenue triggers legal action</strong> and immediate termination</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-emerald-600 flex-shrink-0">•</span>
                <span>Octrivium may <strong>audit any suspicious revenue changes</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-emerald-600 flex-shrink-0">•</span>
                <span>Continued misreporting results in default status and collection proceedings</span>
              </li>
            </ul>

            <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-6 mb-3">Payment Terms</h3>
            <ul className="space-y-3 pl-5">
              <li className="flex items-start gap-2">
                <span className="font-bold text-purple-600 flex-shrink-0">•</span>
                <span>Payouts to investors continue <strong>only until the capped multiplier is reached</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-purple-600 flex-shrink-0">•</span>
                <span>Zero revenue months result in <strong>paused payments (not default)</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-purple-600 flex-shrink-0">•</span>
                <span>Payments resume automatically when revenue returns</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-purple-600 flex-shrink-0">•</span>
                <span>Revenue increases result in <strong>faster investor repayment</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-purple-600 flex-shrink-0">•</span>
                <span>Proportional distribution ensures fairness to all investors</span>
              </li>
            </ul>

            <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-6 mb-3">Compliance Requirements</h3>
            <ul className="space-y-3 pl-5">
              <li className="flex items-start gap-2">
                <span className="font-bold text-blue-600 flex-shrink-0">•</span>
                <span>All users must comply with <strong>South African KYC (Know Your Customer)</strong> regulations</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-blue-600 flex-shrink-0">•</span>
                <span>Full compliance with <strong>FICA (Financial Intelligence Centre Act)</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-blue-600 flex-shrink-0">•</span>
                <span><strong>AML (Anti-Money Laundering)</strong> procedures apply to all transactions</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-blue-600 flex-shrink-0">•</span>
                <span>Users must provide valid South African ID or company registration</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-blue-600 flex-shrink-0">•</span>
                <span>Suspicious activity will be reported to relevant authorities</span>
              </li>
            </ul>

            <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-6 mb-3">Platform Rights</h3>
            <ul className="space-y-3 pl-5">
              <li className="flex items-start gap-2">
                <span className="font-bold text-slate-600 dark:text-slate-400 flex-shrink-0">•</span>
                <span>Octrivium reserves the right to <strong>reject any application</strong> without providing a reason</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-slate-600 dark:text-slate-400 flex-shrink-0">•</span>
                <span>Platform may <strong>suspend or terminate accounts</strong> violating terms</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-slate-600 dark:text-slate-400 flex-shrink-0">•</span>
                <span>Octrivium can modify fees with <strong>30 days notice</strong> to existing campaigns</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-slate-600 dark:text-slate-400 flex-shrink-0">•</span>
                <span>Platform provides services "as is" without warranty of uninterrupted operation</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Important Notice */}
        <section className="bg-red-50 dark:bg-red-900/20 border-2 border-red-400 dark:border-red-600 rounded-2xl p-8 mb-8">
          <div className="flex items-start gap-4">
            <AlertCircle className="w-8 h-8 text-red-600 flex-shrink-0" />
            <div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Important Notice</h3>
              <p className="text-slate-700 dark:text-slate-300 mb-4">
                <strong>By using Octrivium Funding, you acknowledge that:</strong>
              </p>
              <ul className="space-y-2 text-slate-700 dark:text-slate-300">
                <li>• You have read and understood all terms and conditions</li>
                <li>• You accept the risks associated with revenue-based investing</li>
                <li>• You understand that returns are not guaranteed</li>
                <li>• You will not hold Octrivium liable for business performance</li>
                <li>• You comply with all South African financial regulations</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg border border-slate-200 dark:border-slate-700">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Questions About Our Terms?</h2>
          <p className="text-slate-600 dark:text-slate-300 mb-6">
            If you have any questions or concerns about our terms and conditions, please contact our support team.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/contact">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600">
                Contact Support
              </Button>
            </Link>
            <Link href="/how-it-works">
              <Button size="lg" variant="outline">
                Learn How It Works
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
