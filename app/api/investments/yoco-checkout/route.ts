import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { dealId, amount, dealName } = await request.json();

    console.log('Creating Yoco checkout for investment:', { dealId, amount });

    const yocoSecretKey = process.env.YOCO_SECRET_KEY;

    if (!yocoSecretKey) {
      console.error('No Yoco secret key available');
      return NextResponse.json({ error: 'Payment system not configured' }, { status: 500 });
    }

    // Convert amount to cents
    const amountInCents = Math.round(amount * 100);

    // Create Yoco Checkout session
    const baseUrl = process.env.NEXTAUTH_URL || 'https://octrivium.co.za';
    
    const yocoResponse = await fetch('https://payments.yoco.com/api/checkouts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${yocoSecretKey}`,
      },
      body: JSON.stringify({
        amount: amountInCents,
        currency: 'ZAR',
        successUrl: `${baseUrl}/investment/success?dealId=${dealId}&amount=${amount}`,
        cancelUrl: `${baseUrl}/deals/${dealId}`,
        failureUrl: `${baseUrl}/investment/failed?dealId=${dealId}`,
        metadata: {
          dealId: dealId.toString(),
          dealName: dealName,
          investorEmail: session.user.email,
          type: 'investment',
        },
      }),
    });

    const yocoData = await yocoResponse.json();

    console.log('Yoco checkout response:', yocoData);

    if (!yocoResponse.ok) {
      console.error('Yoco API error:', yocoData);
      return NextResponse.json(
        {
          error: 'Failed to create checkout',
          details: yocoData.message || yocoData.displayMessage || 'Unknown error',
        },
        { status: yocoResponse.status }
      );
    }

    // Return the checkout URL for redirect
    return NextResponse.json({
      success: true,
      checkoutUrl: yocoData.redirectUrl,
      checkoutId: yocoData.id,
    });
  } catch (error) {
    console.error('Error creating Yoco checkout:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
