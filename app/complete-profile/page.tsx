'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building2, TrendingUp, Calculator, Loader2 } from 'lucide-react';

export default function CompleteProfilePage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    if (status === 'authenticated') {
      // Check if role is already set (not new user)
      if (session?.user?.role && session.user.role !== 'INVESTOR') {
        router.push('/dashboard');
        return;
      }

      // Get pending role from sessionStorage
      const pendingRole = sessionStorage.getItem('pendingRole');
      if (pendingRole) {
        setSelectedRole(pendingRole);
      }
    }
  }, [status, session, router]);

  const handleRoleSelection = async (role: 'INVESTOR' | 'BUSINESS') => {
    setLoading(true);
    setSelectedRole(role);

    try {
      const response = await fetch('/api/user/update-role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role }),
      });

      if (!response.ok) throw new Error('Failed to update role');

      // Clear pending role
      sessionStorage.removeItem('pendingRole');

      // Update session
      await update();

      // Redirect based on role
      if (role === 'BUSINESS') {
        router.push('/dashboard/kyc');
      } else {
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Failed to update role:', error);
      setLoading(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
            Complete Your Profile
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300">
            Choose how you want to use Octrivium
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Investor */}
          <Card className={`cursor-pointer transition-all hover:scale-105 ${
            selectedRole === 'INVESTOR' ? 'ring-4 ring-blue-500' : ''
          }`}>
            <CardHeader>
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4">
                <TrendingUp className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <CardTitle className="text-2xl">Investor</CardTitle>
              <CardDescription>Invest in South African businesses</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400 mb-6">
                <li>• Browse investment opportunities</li>
                <li>• Earn revenue-based returns</li>
                <li>• Track your portfolio</li>
                <li>• Monthly passive income</li>
              </ul>
              <Button
                onClick={() => handleRoleSelection('INVESTOR')}
                disabled={loading}
                className="w-full"
                variant={selectedRole === 'INVESTOR' ? 'default' : 'outline'}
              >
                {loading && selectedRole === 'INVESTOR' ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                Continue as Investor
              </Button>
            </CardContent>
          </Card>

          {/* Business */}
          <Card className={`cursor-pointer transition-all hover:scale-105 ${
            selectedRole === 'BUSINESS' ? 'ring-4 ring-indigo-500' : ''
          }`}>
            <CardHeader>
              <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mb-4">
                <Building2 className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
              </div>
              <CardTitle className="text-2xl">Business</CardTitle>
              <CardDescription>Raise capital & manage finances</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400 mb-6">
                <li>• Revenue-based funding</li>
                <li>• No equity dilution</li>
                <li>• Accounting software included</li>
                <li>• Investor reporting tools</li>
              </ul>
              <Button
                onClick={() => handleRoleSelection('BUSINESS')}
                disabled={loading}
                className="w-full"
                variant={selectedRole === 'BUSINESS' ? 'default' : 'outline'}
              >
                {loading && selectedRole === 'BUSINESS' ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                Continue as Business
              </Button>
            </CardContent>
          </Card>

          {/* Accounting Only */}
          <Card className={`cursor-pointer transition-all hover:scale-105 ${
            selectedRole === 'ACCOUNTANT' ? 'ring-4 ring-emerald-500' : ''
          }`}>
            <CardHeader>
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mb-4">
                <Calculator className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
              </div>
              <CardTitle className="text-2xl">Accounting</CardTitle>
              <CardDescription>Just use our accounting software</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400 mb-6">
                <li>• Invoicing & quotes</li>
                <li>• Expense tracking</li>
                <li>• Financial reports (P&L)</li>
                <li>• VAT calculations (15%)</li>
              </ul>
              <Button
                onClick={() => handleRoleSelection('BUSINESS')}
                disabled={loading}
                className="w-full"
                variant={selectedRole === 'ACCOUNTANT' ? 'default' : 'outline'}
              >
                {loading && selectedRole === 'ACCOUNTANT' ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                Continue with Accounting
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            You can always change your account type later in settings
          </p>
        </div>
      </div>
    </div>
  );
}
