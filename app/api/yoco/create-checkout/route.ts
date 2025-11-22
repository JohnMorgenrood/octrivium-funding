import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { invoiceId, amount, invoiceNumber, type, metadata } = body;

    // Handle email subscription upgrades
    if (type === 'email_subscription') {
      console.log('Creating Yoco checkout for email subscription:', metadata?.planId);

      if (!amount || amount < 99) {
        return NextResponse.json({ error: 'Invalid subscription amount' }, { status: 400 });
      }

      const yocoSecretKey = process.env.YOCO_SECRET_KEY;

      if (!yocoSecretKey) {
        console.error('No Yoco secret key available');
        return NextResponse.json({ error: 'Payment system not configured' }, { status: 500 });
      }

      // Convert amount to cents
      const amountInCents = Math.round(amount * 100);

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
          successUrl: `${baseUrl}/dashboard/emails?upgrade=success&plan=${metadata?.planId}`,
          cancelUrl: `${baseUrl}/dashboard/emails/upgrade`,
          failureUrl: `${baseUrl}/dashboard/emails/upgrade?error=payment_failed`,
          metadata: {
            type: 'email_subscription',
            userId: session.user.id,
            userEmail: session.user.email,
            planId: metadata?.planId,
            amount: amount,
          },
        }),
      });

      const yocoData = await yocoResponse.json();

      console.log('Yoco email subscription checkout response:', yocoData);

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

      return NextResponse.json({
        success: true,
        redirectUrl: yocoData.redirectUrl,
        checkoutId: yocoData.id,
      });
    }

    // Handle wallet deposits
    if (type === 'wallet_deposit') {
      console.log('Creating Yoco checkout for wallet deposit:', amount);

      if (!amount || amount < 100) {
        return NextResponse.json({ error: 'Minimum deposit is R100' }, { status: 400 });
      }

      const yocoSecretKey = process.env.YOCO_SECRET_KEY;

      if (!yocoSecretKey) {
        console.error('No Yoco secret key available');
        return NextResponse.json({ error: 'Payment system not configured' }, { status: 500 });
      }

      // Convert amount to cents
      const amountInCents = Math.round(amount * 100);

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
          successUrl: `${baseUrl}/dashboard/wallet?deposit=success&amount=${amount}`,
          cancelUrl: `${baseUrl}/dashboard/wallet`,
          failureUrl: `${baseUrl}/dashboard/wallet?deposit=failed`,
          metadata: {
            type: 'wallet_deposit',
            userId: session.user.id,
            userEmail: session.user.email,
            amount: amount,
            ...metadata,
          },
        }),
      });

      const yocoData = await yocoResponse.json();

      console.log('Yoco wallet deposit checkout response:', yocoData);

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

      return NextResponse.json({
        success: true,
        redirectUrl: yocoData.redirectUrl,
        checkoutId: yocoData.id,
      });
    }

    // Handle invoice payments (existing code)
    console.log('Creating Yoco checkout for invoice:', invoiceId);

    // Get the invoice with user details
    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: {
        customer: true,
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            subscriptionTier: true,
            yocoSecretKey: true,
          },
        },
      },
    });

    if (!invoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    if (invoice.status === 'PAID') {
      return NextResponse.json({ 
        error: 'Invoice already paid',
        message: 'This invoice has already been paid. If you believe this is an error, please contact support.',
      }, { status: 400 });
    }

    // Check authorization
    if (invoice.userId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Check for recent checkout to prevent duplicates
    const recentTransaction = await prisma.transaction.findFirst({
      where: {
        wallet: {
          userId: invoice.userId,
        },
        reference: `INV-${invoice.invoiceNumber}`,
        status: 'COMPLETED',
        createdAt: {
          gte: new Date(Date.now() - 5 * 60 * 1000), // Last 5 minutes
        },
      },
    });

    if (recentTransaction) {
      return NextResponse.json({
        error: 'Duplicate payment detected',
        message: 'A payment for this invoice was recently processed. Please wait a few minutes and refresh the page.',
      }, { status: 400 });
    }

    // Determine which Yoco secret key to use
    const useCustomYoco = invoice.user.subscriptionTier === 'BUSINESS' && invoice.user.yocoSecretKey;
    const yocoSecretKey = useCustomYoco ? invoice.user.yocoSecretKey : process.env.YOCO_SECRET_KEY;

    if (!yocoSecretKey) {
      console.error('No Yoco secret key available');
      return NextResponse.json({ error: 'Payment system not configured' }, { status: 500 });
    }

    console.log(`Creating checkout via ${useCustomYoco ? 'merchant' : 'platform'} Yoco account`);

    // Convert amount to cents
    const amountInCents = Math.round(amount * 100);

    // Create Yoco Checkout session
    // Reference: https://developer.yoco.com/api-reference/checkout-api
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
        successUrl: `${baseUrl}/payment/success?invoiceId=${invoiceId}`,
        cancelUrl: `${baseUrl}/invoices/${invoiceId}`,
        failureUrl: `${baseUrl}/payment/failed?invoiceId=${invoiceId}`,
        metadata: {
          invoiceId: invoice.id,
          invoiceNumber: invoice.invoiceNumber,
          customerEmail: invoice.customer?.email || invoice.user.email,
          customerName: invoice.customer?.name || `${invoice.user.firstName} ${invoice.user.lastName}`,
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
