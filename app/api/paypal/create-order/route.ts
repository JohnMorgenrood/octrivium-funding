import { NextRequest, NextResponse } from 'next/server';
import checkoutNodeJssdk from '@paypal/checkout-server-sdk';
import { client } from '@/lib/paypal';

export async function POST(req: NextRequest) {
  try {
    const { amount, dealId, dealName } = await req.json();

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400 }
      );
    }

    const request = new checkoutNodeJssdk.orders.OrdersCreateRequest();
    request.prefer('return=representation');
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [
        {
          description: `Investment in ${dealName}`,
          reference_id: dealId,
          amount: {
            currency_code: 'ZAR',
            value: amount.toFixed(2),
          },
        },
      ],
      application_context: {
        brand_name: 'Octrivium Funding',
        landing_page: 'NO_PREFERENCE',
        user_action: 'PAY_NOW',
        return_url: `${process.env.NEXTAUTH_URL}/deals/${dealId}?success=true`,
        cancel_url: `${process.env.NEXTAUTH_URL}/deals/${dealId}?cancelled=true`,
      },
    });

    const order = await client().execute(request);

    return NextResponse.json({
      orderId: order.result.id,
      approvalUrl: order.result.links?.find((link: any) => link.rel === 'approve')?.href,
    });
  } catch (error: any) {
    console.error('PayPal order creation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create PayPal order' },
      { status: 500 }
    );
  }
}
