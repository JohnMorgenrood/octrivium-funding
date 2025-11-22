'use client';

import { useState } from 'react';
import { ArrowLeft, RefreshCw, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function EmailDiagnostics() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);

  const runDiagnostics = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/emails/diagnostics');
      const data = await res.json();
      setResults(data);
    } catch (error) {
      console.error('Failed to run diagnostics:', error);
      setResults({ error: 'Failed to run diagnostics' });
    } finally {
      setLoading(false);
    }
  };

  const StatusIcon = ({ status }: { status: 'ok' | 'warning' | 'error' }) => {
    if (status === 'ok') return <CheckCircle className="w-5 h-5 text-green-500" />;
    if (status === 'warning') return <AlertCircle className="w-5 h-5 text-amber-500" />;
    return <XCircle className="w-5 h-5 text-red-500" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-gray-950 dark:via-purple-950/20 dark:to-blue-950/20 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/dashboard/emails"
            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Emails
          </Link>
          
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent">
            Email Diagnostics
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Check your email configuration and receiving setup
          </p>
        </div>

        {/* Run Diagnostics Button */}
        <div className="mb-6">
          <button
            onClick={runDiagnostics}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl transition-all shadow-lg hover:scale-105 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Running Diagnostics...' : 'Run Diagnostics'}
          </button>
        </div>

        {/* Results */}
        {results && (
          <div className="space-y-4">
            {/* Configuration */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Configuration</h2>
              <div className="space-y-3">
                {results.config && Object.entries(results.config).map(([key, value]: [string, any]) => (
                  <div key={key} className="flex items-start gap-3">
                    <StatusIcon status={value.status} />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 dark:text-gray-100">{value.label}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{value.message}</div>
                      {value.value && (
                        <div className="mt-1 px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded text-sm font-mono">
                          {value.value}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* User Settings */}
            {results.user && (
              <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Your Email Settings</h2>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Email:</span>
                    <span className="font-mono text-gray-900 dark:text-gray-100">{results.user.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Plan:</span>
                    <span className="font-semibold text-purple-600 dark:text-purple-400">{results.user.emailPlanType}</span>
                  </div>
                  {results.user.role === 'ADMIN' && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Role:</span>
                      <span className="font-semibold text-green-600 dark:text-green-400">ADMIN (Unlimited)</span>
                    </div>
                  )}
                  {results.user.customEmailAddress && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Custom Email:</span>
                      <span className="font-mono text-gray-900 dark:text-gray-100">{results.user.customEmailAddress}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Email Aliases */}
            {results.aliases && results.aliases.length > 0 && (
              <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                  Email Aliases ({results.aliases.length})
                </h2>
                <div className="space-y-2">
                  {results.aliases.map((alias: any) => (
                    <div key={alias.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <StatusIcon status={alias.isActive ? 'ok' : 'warning'} />
                      <div className="flex-1">
                        <div className="font-mono text-gray-900 dark:text-gray-100">{alias.aliasEmail}</div>
                        {alias.displayName && (
                          <div className="text-sm text-gray-600 dark:text-gray-400">{alias.displayName}</div>
                        )}
                      </div>
                      {alias.isPrimary && (
                        <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 text-xs font-semibold rounded">
                          Primary
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Webhook Status */}
            {results.webhook && (
              <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Webhook Status</h2>
                <div className="flex items-start gap-3">
                  <StatusIcon status={results.webhook.status} />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 dark:text-gray-100">{results.webhook.label}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{results.webhook.message}</div>
                    <div className="mt-2 px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded text-sm font-mono">
                      {results.webhook.url}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Recent Emails */}
            {results.recentEmails && (
              <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                  Recent Received Emails ({results.recentEmails.count})
                </h2>
                {results.recentEmails.count > 0 ? (
                  <div className="space-y-2">
                    {results.recentEmails.emails.map((email: any) => (
                      <div key={email.id} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium text-gray-900 dark:text-gray-100">{email.subject}</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">From: {email.fromEmail}</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">To: {email.toEmail}</div>
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(email.receivedAt).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    No emails received yet. Try sending a test email to your configured addresses.
                  </div>
                )}
              </div>
            )}

            {/* Recommendations */}
            {results.recommendations && results.recommendations.length > 0 && (
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-6">
                <h2 className="text-xl font-bold text-amber-900 dark:text-amber-100 mb-4">Recommendations</h2>
                <ul className="space-y-2">
                  {results.recommendations.map((rec: string, index: number) => (
                    <li key={index} className="flex items-start gap-2 text-amber-800 dark:text-amber-200">
                      <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
