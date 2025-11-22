import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { to, subject, body } = await request.json();
    
    // Validate Resend configuration
    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY not configured');
      return NextResponse.json(
        { error: 'Email service not configured. Please add RESEND_API_KEY to environment variables.' },
        { status: 500 }
      );
    }

    if (!process.env.RESEND_FROM_EMAIL) {
      console.error('RESEND_FROM_EMAIL not configured');
      return NextResponse.json(
        { error: 'Email service not configured. Please add RESEND_FROM_EMAIL to environment variables.' },
        { status: 500 }
      );
    }

    // Check quota
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        email: true,
        firstName: true,
        lastName: true,
        emailPlanType: true,
        emailQuotaLimit: true,
        emailQuotaUsed: true,
        emailQuotaResetDate: true,
        customEmailAddress: true,
        role: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const isAdmin = user.role === 'ADMIN';

    // Check if quota reset is needed
    const now = new Date();
    if (user.emailQuotaResetDate && now > user.emailQuotaResetDate) {
      // Reset quota
      await prisma.user.update({
        where: { id: session.user.id },
        data: {
          emailQuotaUsed: 0,
          emailQuotaResetDate: new Date(now.getFullYear(), now.getMonth() + 1, 1),
        },
      });
      user.emailQuotaUsed = 0;
    }

    // Check if user has quota available (admins and BUSINESS plan users bypass quota)
    if (!isAdmin && user.emailPlanType !== 'BUSINESS' && user.emailQuotaUsed >= user.emailQuotaLimit) {
      return NextResponse.json(
        { 
          error: 'Email quota exceeded',
          message: `You've reached your ${user.emailPlanType} plan limit of ${user.emailQuotaLimit} emails per month. Upgrade to send more.`
        },
        { status: 429 }
      );
    }

    // Send email via Resend
    const fromAddress = process.env.RESEND_FROM_EMAIL;
    
    console.log('Sending email:', {
      from: fromAddress,
      to,
      subject,
    });

    // Create professional HTML email with Octrivium branding
    const htmlBody = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${subject}</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f9fafb;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; padding: 40px 20px;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">
                  <!-- Header with Logo -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #9333ea 0%, #3b82f6 100%); padding: 40px 40px 30px; text-align: center;">
                      <img src="https://octrivium.co.za/assets/logo.png" alt="Octrivium" style="height: 50px; margin-bottom: 10px;">
                      <div style="color: #ffffff; font-size: 14px; font-weight: 500; opacity: 0.9;">
                        Powered by Octrivium
                      </div>
                    </td>
                  </tr>
                  
                  <!-- Email Content -->
                  <tr>
                    <td style="padding: 40px;">
                      <div style="color: #111827; font-size: 16px; line-height: 1.6; white-space: pre-wrap;">
${body}
                      </div>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="background-color: #f9fafb; padding: 30px 40px; text-align: center; border-top: 1px solid #e5e7eb;">
                      <div style="color: #6b7280; font-size: 14px; margin-bottom: 10px;">
                        <strong>${user.firstName} ${user.lastName}</strong>
                      </div>
                      <div style="color: #9ca3af; font-size: 13px; margin-bottom: 15px;">
                        ${user.customEmailAddress || user.email}
                      </div>
                      <div style="color: #9ca3af; font-size: 12px;">
                        Sent via <a href="https://octrivium.co.za" style="color: #9333ea; text-decoration: none; font-weight: 600;">Octrivium</a> Email
                      </div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `;

    const { data, error } = await resend.emails.send({
      from: `${user.firstName} ${user.lastName} <${fromAddress}>`,
      to: [to],
      subject: subject,
      html: htmlBody,
      text: body,
      reply_to: user.customEmailAddress || user.email,
    });

    if (error) {
      console.error('Resend error:', error);
      
      // Check if it's a custom email verification issue
      if (error.message?.includes('not verified') || error.message?.includes('verify')) {
        return NextResponse.json(
          { 
            error: 'Custom email not verified',
            message: 'Your custom email address needs to be verified in Resend. Using default noreply@ address instead.',
            details: error
          },
          { status: 400 }
        );
      }
      
      return NextResponse.json(
        { 
          error: 'Failed to send email', 
          message: error.message || 'Unknown error',
          details: error 
        },
        { status: 500 }
      );
    }

    // Store email in database
    const email = await prisma.email.create({
      data: {
        messageId: data?.id || `sent-${Date.now()}`,
        subject,
        fromEmail: user.customEmailAddress || user.email,
        fromName: `${user.firstName} ${user.lastName}`,
        toEmail: to,
        textBody: body,
        htmlBody: body.replace(/\n/g, '<br>'),
        isSent: true,
        isRead: true,
        folder: 'sent',
        senderId: session.user.id,
        sentAt: new Date(),
      },
    });

    // Increment quota usage
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        emailQuotaUsed: { increment: 1 },
        emailQuotaResetDate: user.emailQuotaResetDate || new Date(now.getFullYear(), now.getMonth() + 1, 1),
      },
    });

    return NextResponse.json({ 
      success: true, 
      emailId: email.id,
      quotaUsed: user.emailQuotaUsed + 1,
    });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}
