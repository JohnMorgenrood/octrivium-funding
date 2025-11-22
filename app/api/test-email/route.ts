import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET() {
  try {
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
      to: ['delivered@resend.dev'], // Resend test email
      subject: '✅ Octrivium Email Test',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
              }
              .header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 30px;
                text-align: center;
                border-radius: 10px 10px 0 0;
              }
              .content {
                background: #f9fafb;
                padding: 30px;
                border-radius: 0 0 10px 10px;
              }
              .success {
                background: #10b981;
                color: white;
                padding: 15px;
                border-radius: 5px;
                text-align: center;
                margin: 20px 0;
              }
              .info {
                background: white;
                padding: 15px;
                border-left: 4px solid #667eea;
                margin: 20px 0;
              }
              .footer {
                text-align: center;
                color: #6b7280;
                font-size: 12px;
                margin-top: 30px;
                padding-top: 20px;
                border-top: 1px solid #e5e7eb;
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>🎉 Octrivium Funding</h1>
              <p>Email System Test</p>
            </div>
            <div class="content">
              <div class="success">
                <h2>✅ Email Configuration Successful!</h2>
              </div>
              
              <div class="info">
                <h3>System Information:</h3>
                <ul>
                  <li><strong>Platform:</strong> Octrivium Funding</li>
                  <li><strong>Email Provider:</strong> Resend</li>
                  <li><strong>From Address:</strong> ${process.env.RESEND_FROM_EMAIL || 'Not set'}</li>
                  <li><strong>Status:</strong> Operational</li>
                  <li><strong>Test Date:</strong> ${new Date().toLocaleString()}</li>
                </ul>
              </div>

              <p>This is a test email to confirm your Resend integration is working correctly.</p>
              
              <h3>What is Working:</h3>
              <ul>
                <li>✅ API Key configured</li>
                <li>✅ Email sending operational</li>
                <li>✅ HTML templates rendering</li>
                <li>✅ Ready for production use</li>
              </ul>

              <h3>Next Steps:</h3>
              <ol>
                <li>Verify your domain in Resend dashboard</li>
                <li>Add DNS records for domain authentication</li>
                <li>Update RESEND_FROM_EMAIL to use your verified domain</li>
                <li>Test invoice sending and notifications</li>
              </ol>
            </div>
            <div class="footer">
              <p>Octrivium Funding - Revenue-Based Crowdfunding Platform</p>
              <p>Powered by Resend</p>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error('Email test error:', error);
      return NextResponse.json({ 
        success: false, 
        error: error.message,
        details: 'Check your RESEND_API_KEY and RESEND_FROM_EMAIL environment variables'
      }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Test email sent successfully!',
      emailId: data?.id,
      sentTo: 'delivered@resend.dev',
      note: 'Check your Resend dashboard at https://resend.com/emails to see the test email'
    });
  } catch (error) {
    console.error('Test email error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
