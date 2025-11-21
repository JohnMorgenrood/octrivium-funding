'use client';

import { Navigation } from '@/components/navigation';
import { Shield, Lock, Eye, FileText, Database, Users } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950">
      <Navigation />

      <div className="container mx-auto px-4 py-20 max-w-5xl">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            Privacy Policy
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300">
            Last updated: November 21, 2025
          </p>
        </div>

        {/* Introduction */}
        <section className="bg-white dark:bg-slate-800 rounded-2xl p-8 mb-8 shadow-lg border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-8 h-8 text-blue-600" />
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Our Commitment</h2>
          </div>
          <p className="text-slate-600 dark:text-slate-300 mb-4">
            Octrivium ("we", "us", "our") is committed to protecting your privacy and complying with South African data protection laws, including the Protection of Personal Information Act (POPIA). This Privacy Policy explains how we collect, use, store, and protect your personal information.
          </p>
        </section>

        {/* Information We Collect */}
        <section className="bg-white dark:bg-slate-800 rounded-2xl p-8 mb-8 shadow-lg border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3 mb-6">
            <Database className="w-8 h-8 text-purple-600" />
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Information We Collect</h2>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Personal Information</h3>
              <ul className="space-y-2 text-slate-600 dark:text-slate-400 list-disc pl-6">
                <li>Name, email address, phone number</li>
                <li>ID number, proof of residence (for FICA compliance)</li>
                <li>Business registration documents (CIPC, tax clearance)</li>
                <li>Bank account details for payouts</li>
                <li>IP address, device information, browser type</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Financial Information</h3>
              <ul className="space-y-2 text-slate-600 dark:text-slate-400 list-disc pl-6">
                <li>Revenue reports and accounting data (via accounting software integration)</li>
                <li>Payment processing information (handled securely by Yoco and PayPal)</li>
                <li>Investment transaction history</li>
                <li>Credit card information (never stored by us - processed by payment providers)</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Usage Data</h3>
              <ul className="space-y-2 text-slate-600 dark:text-slate-400 list-disc pl-6">
                <li>Pages visited, features used, time spent on platform</li>
                <li>Login frequency and session duration</li>
                <li>Error logs and technical diagnostics</li>
              </ul>
            </div>
          </div>
        </section>

        {/* How We Use Your Information */}
        <section className="bg-white dark:bg-slate-800 rounded-2xl p-8 mb-8 shadow-lg border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3 mb-6">
            <Eye className="w-8 h-8 text-emerald-600" />
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">How We Use Your Information</h2>
          </div>

          <ul className="space-y-3 text-slate-600 dark:text-slate-400 list-disc pl-6">
            <li><strong>FICA Compliance:</strong> To verify your identity and comply with South African Financial Intelligence Centre Act requirements</li>
            <li><strong>Platform Services:</strong> To provide funding, investment, and accounting software services</li>
            <li><strong>Transaction Processing:</strong> To facilitate payments between investors and businesses</li>
            <li><strong>Communication:</strong> To send service updates, notifications, and important platform announcements</li>
            <li><strong>Fraud Prevention:</strong> To detect and prevent fraudulent activities and unauthorized access</li>
            <li><strong>Legal Compliance:</strong> To comply with regulatory requirements and legal obligations</li>
            <li><strong>Service Improvement:</strong> To analyze usage patterns and improve platform features</li>
          </ul>
        </section>

        {/* FICA Compliance */}
        <section className="bg-white dark:bg-slate-800 rounded-2xl p-8 mb-8 shadow-lg border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3 mb-6">
            <FileText className="w-8 h-8 text-orange-600" />
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">FICA & KYC Requirements</h2>
          </div>

          <p className="text-slate-600 dark:text-slate-300 mb-4">
            As a South African financial services platform, we are required to comply with FICA (Financial Intelligence Centre Act). This means we must:
          </p>

          <ul className="space-y-3 text-slate-600 dark:text-slate-400 list-disc pl-6 mb-6">
            <li>Verify the identity of all users before allowing transactions</li>
            <li>Maintain records of verification documents for at least 5 years</li>
            <li>Report suspicious transactions to the Financial Intelligence Centre (FIC)</li>
            <li>Conduct enhanced due diligence for high-risk transactions</li>
            <li>Monitor transactions for money laundering and terrorist financing</li>
          </ul>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <p className="text-sm text-slate-700 dark:text-slate-300">
              <strong>Required Documents:</strong> Valid South African ID/passport, proof of residence (utility bill/bank statement), business registration (CIPC certificate for businesses), and bank account verification.
            </p>
          </div>
        </section>

        {/* Data Security */}
        <section className="bg-white dark:bg-slate-800 rounded-2xl p-8 mb-8 shadow-lg border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3 mb-6">
            <Lock className="w-8 h-8 text-red-600" />
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Data Security</h2>
          </div>

          <p className="text-slate-600 dark:text-slate-300 mb-4">
            We implement industry-standard security measures to protect your data:
          </p>

          <ul className="space-y-3 text-slate-600 dark:text-slate-400 list-disc pl-6">
            <li><strong>Encryption:</strong> All data transmitted is encrypted using SSL/TLS protocols</li>
            <li><strong>Secure Storage:</strong> Data at rest is encrypted in secure databases</li>
            <li><strong>Payment Security:</strong> Payment processing handled by PCI-DSS compliant providers (Yoco, PayPal)</li>
            <li><strong>Access Controls:</strong> Strict role-based access to sensitive information</li>
            <li><strong>Regular Audits:</strong> Periodic security audits and vulnerability assessments</li>
            <li><strong>Backup Systems:</strong> Regular encrypted backups stored securely</li>
          </ul>
        </section>

        {/* Data Sharing */}
        <section className="bg-white dark:bg-slate-800 rounded-2xl p-8 mb-8 shadow-lg border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3 mb-6">
            <Users className="w-8 h-8 text-indigo-600" />
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Data Sharing</h2>
          </div>

          <p className="text-slate-600 dark:text-slate-300 mb-4">
            We do not sell your personal information. We may share data with:
          </p>

          <ul className="space-y-3 text-slate-600 dark:text-slate-400 list-disc pl-6">
            <li><strong>Payment Processors:</strong> Yoco and PayPal for transaction processing</li>
            <li><strong>Regulatory Bodies:</strong> FIC, SARS, and other authorities as required by law</li>
            <li><strong>Service Providers:</strong> Cloud hosting, email services, analytics (under strict confidentiality agreements)</li>
            <li><strong>Legal Obligations:</strong> When required by court order or legal process</li>
          </ul>
        </section>

        {/* Your Rights */}
        <section className="bg-white dark:bg-slate-800 rounded-2xl p-8 mb-8 shadow-lg border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-8 h-8 text-green-600" />
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Your Rights (POPIA)</h2>
          </div>

          <p className="text-slate-600 dark:text-slate-300 mb-4">
            Under POPIA, you have the right to:
          </p>

          <ul className="space-y-3 text-slate-600 dark:text-slate-400 list-disc pl-6">
            <li><strong>Access:</strong> Request a copy of your personal information we hold</li>
            <li><strong>Correction:</strong> Request corrections to inaccurate or incomplete data</li>
            <li><strong>Deletion:</strong> Request deletion of your data (subject to legal retention requirements)</li>
            <li><strong>Objection:</strong> Object to processing of your data for certain purposes</li>
            <li><strong>Portability:</strong> Request your data in a machine-readable format</li>
            <li><strong>Complaint:</strong> Lodge a complaint with the Information Regulator</li>
          </ul>

          <div className="mt-6 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg p-4">
            <p className="text-sm text-slate-700 dark:text-slate-300">
              <strong>To exercise your rights:</strong> Email us at privacy@octrivium.co.za or contact support@octrivium.co.za
            </p>
          </div>
        </section>

        {/* Cookies */}
        <section className="bg-white dark:bg-slate-800 rounded-2xl p-8 mb-8 shadow-lg border border-slate-200 dark:border-slate-700">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Cookies & Tracking</h2>
          <p className="text-slate-600 dark:text-slate-300 mb-4">
            We use cookies and similar technologies to improve your experience. You can control cookies through your browser settings. Essential cookies required for platform functionality cannot be disabled.
          </p>
        </section>

        {/* Contact */}
        <section className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white">
          <h2 className="text-2xl font-bold mb-4">Questions About Privacy?</h2>
          <p className="mb-4">
            Contact our Data Protection Officer at privacy@octrivium.co.za
          </p>
          <p className="text-sm opacity-90">
            Information Regulator (South Africa): <a href="https://inforegulator.org.za" className="underline hover:text-blue-200">inforegulator.org.za</a>
          </p>
        </section>
      </div>
    </div>
  );
}
