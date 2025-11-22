'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Mail, Check, AlertCircle, ArrowLeft, Sparkles, Building2 } from 'lucide-react';
import Link from 'next/link';

export default function EmailSettings() {
  const { data: session } = useSession();
  const router = useRouter();
  const [customEmail, setCustomEmail] = useState('');
  const [subdomain, setSubdomain] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [userSettings, setUserSettings] = useState<any>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/emails/settings');
      const data = await res.json();
      setUserSettings(data);
      setCustomEmail(data.customEmailAddress || '');
      setSubdomain(data.companySubdomain || '');
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    }
  };

  const handleSaveCustomEmail = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/emails/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customEmailAddress: customEmail }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to save');
      }

      setSuccess('Custom email address saved! You can now receive emails at this address.');
      fetchSettings();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSubdomain = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/emails/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companySubdomain: subdomain }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to save');
      }

      setSuccess(`Subdomain saved! You can now use email@${subdomain}.octrivium.co.za`);
      fetchSettings();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!userSettings) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  const isPro = userSettings.emailPlanType === 'PRO';
  const isBusiness = userSettings.emailPlanType === 'BUSINESS';
  const canUseCustomEmail = isPro || isBusiness;
  const canUseSubdomain = isBusiness;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard/emails"
            className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Inbox
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Email Settings</h1>
              <p className="text-gray-600">Configure your custom email addresses</p>
            </div>
            {canUseCustomEmail && (
              <Link
                href="/dashboard/emails/aliases"
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg transition-all shadow-lg hover:scale-105 font-semibold text-sm"
              >
                Manage Aliases
              </Link>
            )}
          </div>
        </div>

        {/* Status Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3 text-green-700">
            <Check className="w-5 h-5 flex-shrink-0" />
            <p>{success}</p>
          </div>
        )}

        {/* Current Plan */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-1">Current Plan</h2>
              <p className="text-sm text-gray-600">
                You're on the <span className="font-bold text-purple-600">{userSettings.emailPlanType}</span> plan
              </p>
            </div>
            {!isBusiness && (
              <Link
                href="/dashboard/emails/upgrade"
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all text-sm font-medium"
              >
                Upgrade Plan
              </Link>
            )}
          </div>
        </div>

        {/* Custom Email Address (PRO & BUSINESS) */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-start gap-3 mb-4">
            <Mail className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h2 className="text-lg font-bold text-gray-900 mb-1">
                Custom Email Address
                {isPro && <span className="ml-2 text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">PRO</span>}
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                Get your own @octrivium.co.za email address (e.g., john@octrivium.co.za)
              </p>

              {!canUseCustomEmail ? (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-sm text-amber-800 mb-3">
                    Custom email addresses are available on PRO and BUSINESS plans.
                  </p>
                  <Link
                    href="/dashboard/emails/upgrade"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
                  >
                    <Sparkles className="w-4 h-4" />
                    Upgrade to PRO
                  </Link>
                </div>
              ) : (
                <>
                  {userSettings.customEmailAddress && (
                    <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-green-700">
                        Active: <span className="font-bold">{userSettings.customEmailAddress}</span>
                      </span>
                    </div>
                  )}

                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={customEmail}
                        onChange={(e) => setCustomEmail(e.target.value.toLowerCase().replace(/[^a-z0-9.-]/g, ''))}
                        placeholder="yourname"
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                      <span className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium">
                        @octrivium.co.za
                      </span>
                    </div>

                    <button
                      onClick={handleSaveCustomEmail}
                      disabled={loading || !customEmail}
                      className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                    >
                      {loading ? 'Saving...' : 'Save Email Address'}
                    </button>

                    <p className="text-xs text-gray-500">
                      Choose your email username. Only letters, numbers, dots, and hyphens allowed.
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Company Subdomain (BUSINESS ONLY) */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-start gap-3">
            <Building2 className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h2 className="text-lg font-bold text-gray-900 mb-1">
                Company Subdomain
                <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">BUSINESS</span>
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                Get branded email addresses for your company (e.g., support@yourcompany.octrivium.co.za)
              </p>

              {!canUseSubdomain ? (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-sm text-amber-800 mb-3">
                    Company subdomains are available on BUSINESS plan only.
                  </p>
                  <Link
                    href="/dashboard/emails/upgrade"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    <Sparkles className="w-4 h-4" />
                    Upgrade to BUSINESS
                  </Link>
                </div>
              ) : (
                <>
                  {userSettings.companySubdomain && (
                    <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-green-700">
                        Active: <span className="font-bold">*@{userSettings.companySubdomain}.octrivium.co.za</span>
                      </span>
                    </div>
                  )}

                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={subdomain}
                        onChange={(e) => setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                        placeholder="yourcompany"
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <span className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium">
                        .octrivium.co.za
                      </span>
                    </div>

                    <button
                      onClick={handleSaveSubdomain}
                      disabled={loading || !subdomain}
                      className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                    >
                      {loading ? 'Saving...' : 'Save Subdomain'}
                    </button>

                    <p className="text-xs text-gray-500">
                      After saving, all emails sent to *@yourcompany.octrivium.co.za will arrive in your inbox.
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-xl">
          <h3 className="text-lg font-bold text-blue-900 mb-2">How it works</h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li>• <strong>Custom Email:</strong> Get one personal email address like john@octrivium.co.za</li>
            <li>• <strong>Company Subdomain:</strong> Get unlimited emails under your company name like support@acme.octrivium.co.za, sales@acme.octrivium.co.za</li>
            <li>• <strong>Receive emails:</strong> All incoming emails are stored in your inbox automatically</li>
            <li>• <strong>Send emails:</strong> When you compose, it shows from your custom address</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
