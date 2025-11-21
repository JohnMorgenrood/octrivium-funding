'use client';

import { Navigation } from '@/components/navigation';
import { AlertTriangle, TrendingDown, Shield, DollarSign, FileText, Clock, XCircle } from 'lucide-react';

export default function RiskDisclosurePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50 to-orange-50 dark:from-slate-950 dark:via-red-950 dark:to-orange-950">
      <Navigation />

      <div className="container mx-auto px-4 py-20 max-w-5xl">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            Risk Disclosure Statement
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300">
            Last updated: November 21, 2025
          </p>
        </div>

        {/* Important Warning */}
        <section className="bg-red-50 dark:bg-red-900/20 border-2 border-red-500 rounded-2xl p-8 mb-8">
          <div className="flex items-start gap-4">
            <AlertTriangle className="w-10 h-10 text-red-600 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-2xl font-bold text-red-900 dark:text-red-300 mb-3">
                INVESTMENT WARNING
              </h2>
              <p className="text-slate-700 dark:text-slate-300 font-medium mb-3">
                Investing in businesses through revenue-based financing involves significant risk. You could lose all of your invested capital. Only invest money you can afford to lose. Past performance does not guarantee future results.
              </p>
              <p className="text-slate-700 dark:text-slate-300 font-medium">
                <strong>This is NOT a savings account or guaranteed investment.</strong> Returns are dependent on business performance and are never guaranteed.
              </p>
            </div>
          </div>
        </section>

        {/* Key Risks */}
        <section className="bg-white dark:bg-slate-800 rounded-2xl p-8 mb-8 shadow-lg border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3 mb-6">
            <TrendingDown className="w-8 h-8 text-red-600" />
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Key Investment Risks</h2>
          </div>

          <div className="space-y-6">
            <div className="border-l-4 border-red-500 pl-6">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Business Failure Risk</h3>
              <p className="text-slate-600 dark:text-slate-300">
                Businesses can fail or become insolvent. If a business you invest in fails, you may lose your entire investment. There is no government guarantee or deposit insurance protecting your investment.
              </p>
            </div>

            <div className="border-l-4 border-orange-500 pl-6">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Revenue Volatility</h3>
              <p className="text-slate-600 dark:text-slate-300">
                Revenue-based repayments fluctuate with business performance. During slow months, you may receive little to no returns. Economic downturns, market changes, or operational issues can significantly impact repayments.
              </p>
            </div>

            <div className="border-l-4 border-yellow-500 pl-6">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Illiquidity Risk</h3>
              <p className="text-slate-600 dark:text-slate-300">
                Investments are illiquid. You cannot sell or withdraw your investment early. Your capital is locked in until the business fully repays according to the repayment schedule (typically 3-5 years).
              </p>
            </div>

            <div className="border-l-4 border-purple-500 pl-6">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Default Risk</h3>
              <p className="text-slate-600 dark:text-slate-300">
                Businesses may default on repayment obligations. While we conduct due diligence and require monthly revenue reporting, there is no guarantee businesses will honor repayment commitments.
              </p>
            </div>

            <div className="border-l-4 border-blue-500 pl-6">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Platform Risk</h3>
              <p className="text-slate-600 dark:text-slate-300">
                Octrivium is a technology platform. While we implement security measures, technical failures, cyber attacks, or platform discontinuation could affect your investments. We are not a registered financial services provider or bank.
              </p>
            </div>

            <div className="border-l-4 border-indigo-500 pl-6">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Fraud Risk</h3>
              <p className="text-slate-600 dark:text-slate-300">
                Despite FICA verification and due diligence, businesses may provide false information, misrepresent revenue, or commit fraud. We cannot guarantee 100% accuracy of all business information.
              </p>
            </div>
          </div>
        </section>

        {/* Fund Disbursement */}
        <section className="bg-white dark:bg-slate-800 rounded-2xl p-8 mb-8 shadow-lg border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3 mb-6">
            <DollarSign className="w-8 h-8 text-green-600" />
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Fund Disbursement Policy</h2>
          </div>

          <div className="space-y-4">
            <p className="text-slate-600 dark:text-slate-300">
              <strong className="text-slate-900 dark:text-white">Investor funds are held securely until all verification requirements are met.</strong>
            </p>

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 space-y-4">
              <h4 className="font-bold text-slate-900 dark:text-white">Before funds are released to businesses:</h4>
              <ul className="space-y-2 text-slate-700 dark:text-slate-300 list-disc pl-6">
                <li>Full FICA/KYC verification completed (ID, proof of residence, business registration)</li>
                <li>CIPC company registration verified (for businesses)</li>
                <li>Tax clearance certificate reviewed</li>
                <li>Bank account ownership verified</li>
                <li>Revenue reports authenticated (via accounting software integration or bank statements)</li>
                <li>Business documentation meets our standards (financial statements, business plan, etc.)</li>
              </ul>

              <div className="mt-4 pt-4 border-t border-blue-300 dark:border-blue-700">
                <p className="text-slate-700 dark:text-slate-300 font-medium">
                  <strong>If documentation does not meet standards:</strong> All investor funds will be refunded minus a 1% administrative fee (to cover payment processing costs, verification expenses, and platform resources).
                </p>
              </div>

              <div className="mt-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-300 dark:border-orange-800 rounded p-4">
                <p className="text-sm text-slate-700 dark:text-slate-300">
                  <strong>Processing Time:</strong> Verification typically takes 3-5 business days. Funds are held in a segregated escrow account during this period and are not accessible to Octrivium for operational purposes.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Accounting Software Disclaimer */}
        <section className="bg-white dark:bg-slate-800 rounded-2xl p-8 mb-8 shadow-lg border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3 mb-6">
            <FileText className="w-8 h-8 text-purple-600" />
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Accounting Software Disclaimer</h2>
          </div>

          <p className="text-slate-600 dark:text-slate-300 mb-4">
            Our integrated accounting software is provided as a convenience tool for business management. Important limitations:
          </p>

          <ul className="space-y-3 text-slate-600 dark:text-slate-400 list-disc pl-6 mb-6">
            <li><strong>Not Professional Advice:</strong> The software does not constitute professional accounting, tax, or financial advice</li>
            <li><strong>Accuracy:</strong> While we strive for accuracy, we do not guarantee error-free calculations or compliance with all tax regulations</li>
            <li><strong>User Responsibility:</strong> Users are responsible for verifying all financial data and ensuring compliance with SARS and other authorities</li>
            <li><strong>Professional Review:</strong> We strongly recommend consulting with a qualified accountant or tax professional</li>
            <li><strong>No Liability:</strong> Octrivium is not liable for financial losses, penalties, or tax issues arising from use of the accounting software</li>
            <li><strong>Data Backup:</strong> Users should maintain their own records and backups of financial data</li>
          </ul>

          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-300 dark:border-yellow-800 rounded-lg p-4">
            <p className="text-sm text-slate-700 dark:text-slate-300">
              <strong>VAT Compliance:</strong> While our system calculates 15% VAT, businesses must ensure compliance with SARS regulations. Octrivium does not file VAT returns on your behalf.
            </p>
          </div>
        </section>

        {/* No Guarantees */}
        <section className="bg-white dark:bg-slate-800 rounded-2xl p-8 mb-8 shadow-lg border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3 mb-6">
            <XCircle className="w-8 h-8 text-red-600" />
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">What We Do NOT Guarantee</h2>
          </div>

          <ul className="space-y-3 text-slate-600 dark:text-slate-400 list-disc pl-6">
            <li>Any specific return on investment or repayment timeline</li>
            <li>That businesses will successfully repay investors</li>
            <li>Protection against business failure or economic downturns</li>
            <li>Complete accuracy of business-provided information</li>
            <li>That all deals will reach full funding</li>
            <li>Recovery of capital in case of business insolvency</li>
            <li>Tax-free returns or specific tax treatment</li>
            <li>Compliance of accounting data with SARS requirements</li>
          </ul>
        </section>

        {/* Due Diligence */}
        <section className="bg-white dark:bg-slate-800 rounded-2xl p-8 mb-8 shadow-lg border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-8 h-8 text-blue-600" />
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Investor Responsibility</h2>
          </div>

          <p className="text-slate-600 dark:text-slate-300 mb-4">
            <strong>You are responsible for your own investment decisions.</strong>
          </p>

          <ul className="space-y-3 text-slate-600 dark:text-slate-400 list-disc pl-6">
            <li>Conduct your own research on businesses before investing</li>
            <li>Review financial statements, business plans, and revenue reports carefully</li>
            <li>Understand that past performance does not indicate future results</li>
            <li>Diversify investments across multiple businesses to reduce risk</li>
            <li>Only invest amounts you can afford to lose completely</li>
            <li>Consult with a financial advisor if unsure about investment decisions</li>
            <li>Read all deal documentation thoroughly before committing funds</li>
          </ul>
        </section>

        {/* Regulatory Status */}
        <section className="bg-white dark:bg-slate-800 rounded-2xl p-8 mb-8 shadow-lg border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3 mb-6">
            <FileText className="w-8 h-8 text-indigo-600" />
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Regulatory Status</h2>
          </div>

          <p className="text-slate-600 dark:text-slate-300 mb-4">
            Octrivium is a technology platform facilitating revenue-based financing. We are:
          </p>

          <ul className="space-y-3 text-slate-600 dark:text-slate-400 list-disc pl-6">
            <li><strong>NOT</strong> a registered Financial Services Provider (FSP) under the FAIS Act</li>
            <li><strong>NOT</strong> a bank or deposit-taking institution</li>
            <li><strong>NOT</strong> regulated by the Financial Sector Conduct Authority (FSCA)</li>
            <li><strong>Compliant</strong> with FICA requirements for identity verification</li>
            <li><strong>Subject to</strong> POPIA for data protection</li>
          </ul>

          <div className="mt-6 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg p-4">
            <p className="text-sm text-slate-700 dark:text-slate-300">
              <strong>Tax Implications:</strong> Investment returns may be subject to income tax. Consult with a tax professional regarding your specific tax obligations. Octrivium does not provide tax advice.
            </p>
          </div>
        </section>

        {/* Contact */}
        <section className="bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl p-8 text-white">
          <h2 className="text-2xl font-bold mb-4">Questions or Concerns?</h2>
          <p className="mb-4">
            If you have questions about investment risks, contact our team at support@octrivium.co.za
          </p>
          <p className="text-sm opacity-90">
            By using this platform, you acknowledge that you have read, understood, and accept all risks disclosed in this statement.
          </p>
        </section>
      </div>
    </div>
  );
}
