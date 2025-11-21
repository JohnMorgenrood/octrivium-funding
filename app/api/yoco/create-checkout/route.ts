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

    const { invoiceId, amount, invoiceNumber } = await request.json();

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
