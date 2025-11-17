'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Mail, Lock, CheckCircle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const registered = searchParams.get('registered');
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid email or password');
        return;
      }

      router.push('/dashboard');
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

      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-lg mb-4">
            <span className="text-white font-bold text-2xl">O</span>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Welcome Back
          </h1>
          <p className="text-slate-600 mt-2">Sign in to your Octrivium account</p>
        </div>

        {/* Success Message */}
        {registered === 'true' && (
          <div className="mb-6 p-4 bg-green-50 border-2 border-green-200 rounded-xl flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
            <div>
              <p className="font-semibold text-green-900">Registration successful!</p>
              <p className="text-sm text-green-700">You can now sign in with your credentials.</p>
            </div>
          </div>
        )}

        {/* Login Card */}
        <Card className="shadow-2xl border-0">
          <CardHeader className="bg-gradient-to-br from-slate-50 to-transparent pb-6">
            <CardTitle className="text-2xl">Sign In</CardTitle>
            <CardDescription>Enter your credentials to access your account</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-4 bg-red-50 border-2 border-red-200 rounded-lg">
                  <p className="text-sm text-red-700 font-medium">{error}</p>
                </div>
              )}

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

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="password" className="text-sm font-semibold">Password</Label>
                  <Link href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                    Forgot?
                  </Link>
                </div>
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

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="remember"
                  className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="remember" className="text-sm text-slate-600">
                  Remember me for 30 days
                </label>
              </div>

              <Button
                type="submit"
                size="lg"
                disabled={loading}
                className="w-full text-base"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Sign Up Link */}
        <div className="mt-6 text-center">
          <p className="text-slate-600">
            Don't have an account?{' '}
            <Link href="/register" className="font-semibold text-blue-600 hover:text-blue-700">
              Sign up for free
            </Link>
          </p>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-slate-500">
          <p>Protected by industry-leading security</p>
          <div className="flex items-center justify-center gap-4 mt-2">
            <span>🔒 256-bit SSL</span>
            <span>•</span>
            <span>🛡️ POPIA Compliant</span>
          </div>
        </div>
      </div>
    </div>
  );
}
