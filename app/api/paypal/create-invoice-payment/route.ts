import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { invoiceId, usdAmount } = await request.json();

    console.log('Creating PayPal order for invoice:', invoiceId);
    console.log('USD amount to charge:', usdAmount);
    console.log('PayPal API URL:', process.env.PAYPAL_API_URL);
    console.log('PayPal Client ID configured:', !!process.env.PAYPAL_CLIENT_ID);
    console.log('PayPal Client Secret configured:', !!process.env.PAYPAL_CLIENT_SECRET);

    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: {
        customer: true,
        user: true,
      },
    });

    if (!invoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    if (invoice.status === 'PAID') {
      return NextResponse.json({ error: 'Invoice already paid' }, { status: 400 });
    }

    // Create PayPal order
    const auth = Buffer.from(
      `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
    ).toString('base64');

    console.log('Creating PayPal order with amount:', usdAmount.toFixed(2));
    console.log('Using currency: USD (temporary for testing)');

    const response = await fetch(
      `${process.env.PAYPAL_API_URL}/v2/checkout/orders`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${auth}`,
        },
        body: JSON.stringify({
          intent: 'CAPTURE',
          purchase_units: [
            {
              reference_id: invoice.id,
              description: `Invoice ${invoice.invoiceNumber}`,
              amount: {
                currency_code: 'USD', // Temporarily using USD for testing
                value: usdAmount.toFixed(2),
              },
            },
          ],
          application_context: {
            return_url: `${process.env.NEXT_PUBLIC_APP_URL}/pay/${invoice.paymentLink}/success`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pay/${invoice.paymentLink}`,
            brand_name: invoice.user.companyName || `${invoice.user.firstName} ${invoice.user.lastName}`,
            shipping_preference: 'NO_SHIPPING',
          },
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error('PayPal API error response:', JSON.stringify(data, null, 2));
      console.error('PayPal API status:', response.status);
      
      // Return appropriate status code based on PayPal error
      const statusCode = response.status === 401 || response.status === 403 
        ? response.status 
        : 500;
      
      return NextResponse.json(
        { 
          error: 'Failed to create PayPal order',
          details: data,
          status: response.status
        },
        { status: statusCode }
      );
    }

    const approvalUrl = data.links?.find((link: any) => link.rel === 'approve')?.href;

    return NextResponse.json({
      orderId: data.id,
      approvalUrl,
    });
  } catch (error) {
    console.error('Error creating invoice payment:', error);
    return NextResponse.json(
      { error: 'Failed to create payment' },
      { status: 500 }
    );
  }
}
