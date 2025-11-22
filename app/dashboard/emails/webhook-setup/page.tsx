'use client';

import { useState } from 'react';
import { ArrowLeft, CheckCircle, Copy, ExternalLink, Mail, Webhook } from 'lucide-react';
import Link from 'next/link';

export default function EmailWebhookSetup() {
  const [copied, setCopied] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);
  const [testing, setTesting] = useState(false);

  const webhookUrl = 'https://octrivium.co.za/api/webhooks/resend';

  const copyToClipboard = () => {
    navigator.clipboard.writeText(webhookUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const testWebhook = async () => {
    setTesting(true);
    try {
      const res = await fetch('/api/webhooks/resend/test');
      const data = await res.json();
      setTestResult(data);
    } catch (error) {
      setTestResult({ error: 'Failed to test webhook' });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-gray-950 dark:via-purple-950/20 dark:to-blue-950/20 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/dashboard/emails/settings"
          className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Email Settings
        </Link>

        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6">
            <div className="flex items-center gap-3 text-white">
              <Webhook className="w-8 h-8" />
              <div>
                <h1 className="text-2xl font-bold">Email Webhook Setup</h1>
                <p className="text-purple-100 text-sm mt-1">Configure Resend to receive incoming emails</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Status */}
            <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-amber-900 dark:text-amber-100">Webhook Not Configured</h3>
                  <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                    Follow the steps below to enable receiving emails
                  </p>
                </div>
              </div>
            </div>

            {/* Webhook URL */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Webhook URL
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={webhookUrl}
                  readOnly
                  className="flex-1 px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 font-mono text-sm"
                />
                <button
                  onClick={copyToClipboard}
                  className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition-all flex items-center gap-2"
                >
                  {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>

            {/* Setup Steps */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Setup Instructions</h2>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold">
                    1
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Open Resend Dashboard</h3>
                    <a
                      href="https://resend.com/webhooks"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 dark:bg-gray-800 text-white rounded-lg hover:bg-gray-800 dark:hover:bg-gray-700 transition-all text-sm font-medium"
                    >
                      Go to Resend Webhooks
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold">
                    2
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Add Webhook</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">Click the "Add Webhook" button</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold">
                    3
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Configure Webhook</h3>
                    <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      <li>• <strong>Name:</strong> Octrivium Email Receiver</li>
                      <li>• <strong>URL:</strong> <code className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded font-mono text-xs">{webhookUrl}</code></li>
                      <li>• <strong>Events:</strong> Select "email.received"</li>
                    </ul>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold">
                    4
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Save & Test</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                      Click "Add Webhook" to save
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-bold">
                    ✓
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Test It</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                      Send an email to <strong>noreply@octrivium.co.za</strong> or any custom address you've set up
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Test Webhook */}
            <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Test Webhook Endpoint</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Verify that the webhook endpoint is accessible
              </p>
              <button
                onClick={testWebhook}
                disabled={testing}
                className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl transition-all disabled:opacity-50 font-semibold shadow-lg"
              >
                {testing ? 'Testing...' : 'Test Endpoint'}
              </button>

              {testResult && (
                <div className={`mt-4 p-4 rounded-xl ${testResult.error ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800' : 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'}`}>
                  <pre className="text-xs overflow-x-auto">
                    {JSON.stringify(testResult, null, 2)}
                  </pre>
                </div>
              )}
            </div>

            {/* Important Notes */}
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
              <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Important Notes</h3>
              <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                <li>• The webhook must be configured for incoming emails to work</li>
                <li>• Make sure to select "email.received" event type</li>
                <li>• Resend will send a test event to verify the webhook</li>
                <li>• Emails will appear in your inbox within seconds</li>
                <li>• Check Resend dashboard logs if emails aren't received</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
