import { NextRequest, NextResponse } from 'next/server';
import { runRevenueVerificationCron } from '@/lib/cron/revenue-verification';

/**
 * GET/POST /api/cron/verify-revenue
 * Trigger monthly revenue verification
 * 
 * Configure Vercel Cron in vercel.json:
 * {
 *   "crons": [{
 *     "path": "/api/cron/verify-revenue",
 *     "schedule": "0 2 1 * *"
 *   }]
 * }
 */
export async function GET(request: NextRequest) {
  try {
    // Verify cron secret to prevent unauthorized access
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('[API] Revenue verification cron triggered');

    const result = await runRevenueVerificationCron();

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('[API] Revenue verification cron failed:', error);
    return NextResponse.json(
      { error: 'Cron execution failed', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  return GET(request);
}
