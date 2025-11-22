'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Mail, Plus, Trash2, Star, Check, X, AlertCircle, ArrowLeft, Shield } from 'lucide-react';
import Link from 'next/link';

interface EmailAlias {
  id: string;
  aliasEmail: string;
  displayName: string;
  isPrimary: boolean;
  isActive: boolean;
  createdAt: string;
}

export default function EmailAliasesPage() {
  const { data: session } = useSession();
  const [aliases, setAliases] = useState<EmailAlias[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAlias, setNewAlias] = useState('');
  const [newDisplayName, setNewDisplayName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [userPlan, setUserPlan] = useState('FREE');
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    fetchAliases();
    fetchUserPlan();
  }, []);

  const fetchUserPlan = async () => {
    try {
      const res = await fetch('/api/emails/quota');
      const data = await res.json();
      setUserPlan(data.plan);
      setUserRole(data.role);
    } catch (error) {
      console.error('Failed to fetch user plan:', error);
    }
  };

  const fetchAliases = async () => {
    try {
      const res = await fetch('/api/emails/aliases');
      const data = await res.json();
      setAliases(data.aliases || []);
    } catch (error) {
      console.error('Failed to fetch aliases:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAlias = async () => {
    if (!newAlias) {
      setError('Please enter an email alias');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/emails/aliases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          aliasEmail: newAlias.includes('@') ? newAlias : `${newAlias}@octrivium.co.za`,
          displayName: newDisplayName || newAlias,
          isPrimary: aliases.length === 0
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to add alias');
      }

      setSuccess('Email alias added successfully!');
      setNewAlias('');
      setNewDisplayName('');
      setShowAddForm(false);
      fetchAliases();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSetPrimary = async (aliasId: string) => {
    try {
      await fetch(`/api/emails/aliases/${aliasId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPrimary: true }),
      });
      fetchAliases();
    } catch (error) {
      console.error('Failed to set primary:', error);
    }
  };

  const handleToggleActive = async (aliasId: string, currentState: boolean) => {
    try {
      await fetch(`/api/emails/aliases/${aliasId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentState }),
      });
      fetchAliases();
    } catch (error) {
      console.error('Failed to toggle active:', error);
    }
  };

  const handleDelete = async (aliasId: string) => {
    if (!confirm('Are you sure you want to delete this email alias?')) return;

    try {
      await fetch(`/api/emails/aliases/${aliasId}`, {
        method: 'DELETE',
      });
      setSuccess('Email alias deleted');
      fetchAliases();
    } catch (error) {
      console.error('Failed to delete:', error);
      setError('Failed to delete email alias');
    }
  };

  const isAdmin = userRole === 'ADMIN';
  const maxAliases = isAdmin ? 999 : (userPlan === 'PRO' ? 3 : userPlan === 'BUSINESS' ? 999 : 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-gray-950 dark:via-purple-950/20 dark:to-blue-950/20 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/dashboard/emails/settings"
            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Email Settings
          </Link>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent">
                Email Aliases
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Manage multiple email addresses for your account
              </p>
            </div>
            
            {(userPlan !== 'FREE' || isAdmin) && aliases.length < maxAliases && (
              <button
                onClick={() => setShowAddForm(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl transition-all shadow-lg hover:scale-105 font-semibold"
              >
                <Plus className="w-4 h-4" />
                Add Alias
              </button>
            )}
          </div>
        </div>

        {/* Plan Notice */}
        {userPlan === 'FREE' && !isAdmin && (
          <div className="mb-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5" />
              <div>
                <h3 className="font-semibold text-amber-900 dark:text-amber-100">Upgrade Required</h3>
                <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                  Email aliases are available on PRO and BUSINESS plans.
                </p>
                <Link
                  href="/dashboard/emails/upgrade"
                  className="inline-flex items-center gap-2 mt-3 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg transition-all text-sm font-semibold"
                >
                  Upgrade Plan
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Add Alias Form */}
        {showAddForm && (userPlan !== 'FREE' || isAdmin) && (
          <div className="mb-6 bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Add New Email Alias</h2>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setError('');
                  setNewAlias('');
                  setNewDisplayName('');
                }}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-2 text-red-700 dark:text-red-400 text-sm">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Email Address
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newAlias}
                    onChange={(e) => setNewAlias(e.target.value.toLowerCase())}
                    placeholder="support"
                    className="flex-1 px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 dark:text-gray-100"
                  />
                  <span className="text-gray-600 dark:text-gray-400">@octrivium.co.za</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Examples: support, info, sales, hello
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Display Name (Optional)
                </label>
                <input
                  type="text"
                  value={newDisplayName}
                  onChange={(e) => setNewDisplayName(e.target.value)}
                  placeholder="Support Team"
                  className="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 dark:text-gray-100"
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddAlias}
                  disabled={loading}
                  className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl transition-all disabled:opacity-50 font-semibold shadow-lg"
                >
                  {loading ? 'Adding...' : 'Add Alias'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl flex items-center gap-2 text-green-700 dark:text-green-400">
            <Check className="w-5 h-5" />
            {success}
          </div>
        )}

        {/* Aliases List */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Your Email Aliases</h2>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {aliases.length} / {maxAliases === 999 ? '∞' : maxAliases}
              </span>
            </div>
          </div>

          {loading ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
              Loading aliases...
            </div>
          ) : aliases.length === 0 ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              <Mail className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="font-medium">No email aliases yet</p>
              <p className="text-sm mt-2">Add your first email alias to get started</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-800">
              {aliases.map((alias) => (
                <div
                  key={alias.id}
                  className="p-6 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg">
                          <Mail className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-gray-900 dark:text-gray-100">
                              {alias.aliasEmail}
                            </span>
                            {alias.isPrimary && (
                              <span className="flex items-center gap-1 px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 text-xs font-semibold rounded-full">
                                <Star className="w-3 h-3 fill-current" />
                                Primary
                              </span>
                            )}
                            {!alias.isActive && (
                              <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs font-semibold rounded-full">
                                Inactive
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {alias.displayName}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                            Added {new Date(alias.createdAt).toLocaleDateString('en-ZA')}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {!alias.isPrimary && (
                        <button
                          onClick={() => handleSetPrimary(alias.id)}
                          className="px-3 py-1.5 text-sm text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-all font-medium"
                          title="Set as primary"
                        >
                          Set Primary
                        </button>
                      )}
                      <button
                        onClick={() => handleToggleActive(alias.id, alias.isActive)}
                        className="px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all font-medium"
                      >
                        {alias.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        onClick={() => handleDelete(alias.id)}
                        className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                        title="Delete alias"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info Box */}
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
          <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">How Email Aliases Work</h3>
          <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
            <li>• All emails sent to your aliases will appear in your inbox</li>
            <li>• You can send emails from your primary alias</li>
            <li>• {userPlan === 'PRO' ? 'PRO plan: 3 aliases max' : 'BUSINESS plan: Unlimited aliases'}</li>
            <li>• Common aliases: support@, info@, sales@, hello@, team@</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
