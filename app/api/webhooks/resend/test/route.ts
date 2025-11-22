import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'OK',
    message: 'Webhook test endpoint is working',
    timestamp: new Date().toISOString(),
    instructions: {
      step1: 'Go to https://resend.com/webhooks',
      step2: 'Click "Add Webhook"',
      step3: 'Set URL to: https://octrivium.co.za/api/webhooks/resend',
      step4: 'Select event: "email.received"',
      step5: 'Click "Add Webhook"',
      step6: 'Test by sending email to: noreply@octrivium.co.za or any custom address',
    },
    webhookUrl: 'https://octrivium.co.za/api/webhooks/resend'
  });
}

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    
    console.log('🔔 TEST WEBHOOK RECEIVED:', {
      timestamp: new Date().toISOString(),
      type: payload.type,
      data: payload.data,
      fullPayload: JSON.stringify(payload, null, 2)
    });

    return NextResponse.json({
      received: true,
      message: 'Test webhook received successfully',
      timestamp: new Date().toISOString(),
      payload
    });
  } catch (error: any) {
    console.error('❌ Test webhook error:', error);
    return NextResponse.json({
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
