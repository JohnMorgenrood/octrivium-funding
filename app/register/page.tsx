'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, User, Mail, Lock, Building2, TrendingUp } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roleParam = searchParams.get('role');
  
  const [role, setRole] = useState<'INVESTOR' | 'BUSINESS'>(
    roleParam === 'business' ? 'BUSINESS' : 'INVESTOR'
  );
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || data.message || 'Registration failed');
        return;
      }

      router.push('/login?registered=true');
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950 flex items-center justify-center p-4">
      {/* Back Button */}
      <Link
        href="/"
        className="absolute top-4 left-4 flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors dark:text-slate-400 dark:hover:text-blue-400"
      >
        <ArrowLeft className="h-5 w-5" />
        <span className="font-medium">Back to Home</span>
      </Link>

      <div className="w-full max-w-2xl">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex flex-col items-center gap-3">
            <div className="relative w-20 h-20">
              <Image
                src="/assets/logo.png"
                alt="Octrivium Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Octrivium
              </h1>
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 tracking-wider uppercase">
                Funding
              </p>
            </div>
          </Link>
          <p className="text-slate-600 dark:text-slate-400 mt-4">Start investing in South African businesses</p>
        </div>

        {/* Role Selection */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <button
            onClick={() => setRole('INVESTOR')}
            className={`p-6 rounded-2xl border-2 transition-all duration-200 ${
              role === 'INVESTOR'
                ? 'border-blue-500 bg-blue-50 shadow-lg dark:bg-blue-950 dark:border-blue-600'
                : 'border-slate-200 bg-white hover:border-blue-300 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-blue-500'
            }`}
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
              role === 'INVESTOR' ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-700'
            }`}>
              <TrendingUp className={`h-6 w-6 ${role === 'INVESTOR' ? 'text-white' : 'text-slate-600 dark:text-slate-400'}`} />
            </div>
            <h3 className="font-bold text-lg mb-2 dark:text-white">I'm an Investor</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">Invest in businesses and earn revenue-based returns</p>
          </button>

          <button
            onClick={() => setRole('BUSINESS')}
            className={`p-6 rounded-2xl border-2 transition-all duration-200 ${
              role === 'BUSINESS'
                ? 'border-indigo-500 bg-indigo-50 shadow-lg dark:bg-indigo-950 dark:border-indigo-600'
                : 'border-slate-200 bg-white hover:border-indigo-300 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-indigo-500'
            }`}
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
              role === 'BUSINESS' ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-700'
            }`}>
              <Building2 className={`h-6 w-6 ${role === 'BUSINESS' ? 'text-white' : 'text-slate-600 dark:text-slate-400'}`} />
            </div>
            <h3 className="font-bold text-lg mb-2 dark:text-white">I'm a Business</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">Raise capital by sharing future revenue</p>
          </button>
        </div>

        {/* Registration Card */}
        <Card className="shadow-2xl border-0 dark:bg-slate-800 dark:border-slate-700">
          <CardHeader className="bg-gradient-to-br from-slate-50 to-transparent dark:from-slate-800 dark:to-slate-900 pb-6">
            <CardTitle className="text-2xl dark:text-white">Create Your Account</CardTitle>
            <CardDescription className="dark:text-slate-400">
              {role === 'INVESTOR' 
                ? 'Start your investment journey today'
                : 'Get funding for your business growth'
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-4 bg-red-50 border-2 border-red-200 rounded-lg dark:bg-red-900/20 dark:border-red-800">
                  <p className="text-sm text-red-700 font-medium dark:text-red-300">{error}</p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-semibold dark:text-slate-200">
                  {role === 'INVESTOR' ? 'Full Name' : 'Business Name'}
                </Label>
                <div className="relative">
                  {role === 'INVESTOR' ? (
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400 dark:text-slate-500" />
                  ) : (
                    <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400 dark:text-slate-500" />
                  )}
                  <Input
                    id="name"
                    type="text"
                    placeholder={role === 'INVESTOR' ? 'John Doe' : 'Your Business Name'}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold dark:text-slate-200">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400 dark:text-slate-500" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-semibold dark:text-slate-200">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400 dark:text-slate-500" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm font-semibold dark:text-slate-200">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400 dark:text-slate-500" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      required
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  id="terms"
                  required
                  className="w-4 h-4 mt-1 rounded border-slate-300 text-blue-600 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700"
                />
                <label htmlFor="terms" className="text-sm text-slate-600 dark:text-slate-400">
                  I agree to the{' '}
                  <Link href="/terms" className="text-blue-600 hover:text-blue-700 font-medium dark:text-blue-400 dark:hover:text-blue-300">
                    Terms of Service
                  </Link>
                  {' '}and{' '}
                  <Link href="/privacy" className="text-blue-600 hover:text-blue-700 font-medium dark:text-blue-400 dark:hover:text-blue-300">
                    Privacy Policy
                  </Link>
                </label>
              </div>

              <Button
                type="submit"
                size="lg"
                disabled={loading}
                className="w-full text-base"
              >
                {loading ? 'Creating account...' : 'Create Account'}
              </Button>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400">Or continue with</span>
                </div>
              </div>

              {/* Google Sign-Up Button */}
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="w-full text-sm sm:text-base border-2 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-white"
                onClick={() => {
                  // Will be implemented with NextAuth Google provider
                  alert('Google Sign-In will be configured with credentials later');
                }}
              >
                <svg className="w-5 h-5 mr-2 sm:mr-3 shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Sign In Link */}
        <div className="mt-6 text-center">
          <p className="text-slate-600 dark:text-slate-400">
            Already have an account?{' '}
            <Link href="/login" className="font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
              Sign in
            </Link>
          </p>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
          <p>Join {role === 'INVESTOR' ? '10,000+' : '500+'} {role === 'INVESTOR' ? 'investors' : 'businesses'} already on Octrivium</p>
        </div>
      </div>
    </div>
  );
}
