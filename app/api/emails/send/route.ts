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
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

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

    // Check if user has quota available (unless BUSINESS plan)
    if (user.emailPlanType !== 'BUSINESS' && user.emailQuotaUsed >= user.emailQuotaLimit) {
      return NextResponse.json(
        { 
          error: 'Email quota exceeded',
          message: `You've reached your ${user.emailPlanType} plan limit of ${user.emailQuotaLimit} emails per month. Upgrade to send more.`
        },
        { status: 429 }
      );
    }

    // Send email via Resend
    // Note: Custom email addresses must be verified in Resend
    const fromAddress = user.customEmailAddress || process.env.RESEND_FROM_EMAIL;
    
    console.log('Sending email:', {
      from: fromAddress,
      to,
      subject,
      hasCustomEmail: !!user.customEmailAddress
    });

    const { data, error } = await resend.emails.send({
      from: `${user.firstName} ${user.lastName} <${fromAddress}>`,
      to: [to],
      subject: subject,
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
