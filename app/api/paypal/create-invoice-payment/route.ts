import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { invoiceId } = await request.json();

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
                currency_code: 'USD', // Change to ZAR when supported
                value: Number(invoice.amountDue).toFixed(2),
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
      console.error('PayPal error:', data);
      return NextResponse.json(
        { error: 'Failed to create PayPal order' },
        { status: 500 }
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
