'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 text-center">
          <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">⚠️</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
            Something went wrong
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            We encountered an unexpected error. Our team has been notified and is working on a fix.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button onClick={reset} className="flex-1">
              Try Again
            </Button>
            <Link href="/" className="flex-1">
              <Button variant="outline" className="w-full">
                Go Home
              </Button>
            </Link>
          </div>
          {process.env.NODE_ENV === 'development' && error.message && (
            <div className="mt-6 p-4 bg-slate-100 dark:bg-slate-900 rounded-lg text-left">
              <p className="text-xs font-mono text-red-600 dark:text-red-400">
                {error.message}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
