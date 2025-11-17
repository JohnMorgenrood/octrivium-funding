'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
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
        setError(data.message || 'Registration failed');
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
      {/* Back Button */}
      <Link
        href="/"
        className="absolute top-4 left-4 flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors"
      >
        <ArrowLeft className="h-5 w-5" />
        <span className="font-medium">Back to Home</span>
      </Link>

      <div className="w-full max-w-2xl">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-lg mb-4">
            <span className="text-white font-bold text-2xl">O</span>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Join Octrivium
          </h1>
          <p className="text-slate-600 mt-2">Start investing in South African businesses</p>
        </div>

        {/* Role Selection */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <button
            onClick={() => setRole('INVESTOR')}
            className={`p-6 rounded-2xl border-2 transition-all duration-200 ${
              role === 'INVESTOR'
                ? 'border-blue-500 bg-blue-50 shadow-lg'
                : 'border-slate-200 bg-white hover:border-blue-300'
            }`}
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
              role === 'INVESTOR' ? 'bg-blue-600' : 'bg-slate-200'
            }`}>
              <TrendingUp className={`h-6 w-6 ${role === 'INVESTOR' ? 'text-white' : 'text-slate-600'}`} />
            </div>
            <h3 className="font-bold text-lg mb-2">I'm an Investor</h3>
            <p className="text-sm text-slate-600">Invest in businesses and earn revenue-based returns</p>
          </button>

          <button
            onClick={() => setRole('BUSINESS')}
            className={`p-6 rounded-2xl border-2 transition-all duration-200 ${
              role === 'BUSINESS'
                ? 'border-indigo-500 bg-indigo-50 shadow-lg'
                : 'border-slate-200 bg-white hover:border-indigo-300'
            }`}
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
              role === 'BUSINESS' ? 'bg-indigo-600' : 'bg-slate-200'
            }`}>
              <Building2 className={`h-6 w-6 ${role === 'BUSINESS' ? 'text-white' : 'text-slate-600'}`} />
            </div>
            <h3 className="font-bold text-lg mb-2">I'm a Business</h3>
            <p className="text-sm text-slate-600">Raise capital by sharing future revenue</p>
          </button>
        </div>

        {/* Registration Card */}
        <Card className="shadow-2xl border-0">
          <CardHeader className="bg-gradient-to-br from-slate-50 to-transparent pb-6">
            <CardTitle className="text-2xl">Create Your Account</CardTitle>
            <CardDescription>
              {role === 'INVESTOR' 
                ? 'Start your investment journey today'
                : 'Get funding for your business growth'
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-4 bg-red-50 border-2 border-red-200 rounded-lg">
                  <p className="text-sm text-red-700 font-medium">{error}</p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-semibold">
                  {role === 'INVESTOR' ? 'Full Name' : 'Business Name'}
                </Label>
                <div className="relative">
                  {role === 'INVESTOR' ? (
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                  ) : (
                    <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
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
                <Label htmlFor="email" className="text-sm font-semibold">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
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
                  <Label htmlFor="password" className="text-sm font-semibold">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
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
                  <Label htmlFor="confirmPassword" className="text-sm font-semibold">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
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
                  className="w-4 h-4 mt-1 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="terms" className="text-sm text-slate-600">
                  I agree to the{' '}
                  <Link href="/terms" className="text-blue-600 hover:text-blue-700 font-medium">
                    Terms of Service
                  </Link>
                  {' '}and{' '}
                  <Link href="/privacy" className="text-blue-600 hover:text-blue-700 font-medium">
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
            </form>
          </CardContent>
        </Card>

        {/* Sign In Link */}
        <div className="mt-6 text-center">
          <p className="text-slate-600">
            Already have an account?{' '}
            <Link href="/login" className="font-semibold text-blue-600 hover:text-blue-700">
              Sign in
            </Link>
          </p>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-slate-500">
          <p>Join {role === 'INVESTOR' ? '10,000+' : '500+'} {role === 'INVESTOR' ? 'investors' : 'businesses'} already on Octrivium</p>
        </div>
      </div>
    </div>
  );
}
