import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const results: any = {
      config: {},
      recommendations: []
    };

    // Check environment variables
    results.config.resendApiKey = {
      label: 'Resend API Key',
      status: process.env.RESEND_API_KEY ? 'ok' : 'error',
      message: process.env.RESEND_API_KEY ? 'Configured' : 'Missing RESEND_API_KEY environment variable',
      value: process.env.RESEND_API_KEY ? `${process.env.RESEND_API_KEY.substring(0, 10)}...` : null
    };

    results.config.resendFromEmail = {
      label: 'From Email Address',
      status: process.env.RESEND_FROM_EMAIL ? 'ok' : 'error',
      message: process.env.RESEND_FROM_EMAIL ? 'Configured' : 'Missing RESEND_FROM_EMAIL environment variable',
      value: process.env.RESEND_FROM_EMAIL
    };

    // Check if using noreply
    if (process.env.RESEND_FROM_EMAIL?.includes('noreply')) {
      results.config.resendFromEmail.status = 'warning';
      results.config.resendFromEmail.message = 'Using noreply address - replies may not be received';
      results.recommendations.push(
        'Change RESEND_FROM_EMAIL to an address that can receive replies (e.g., support@octrivium.co.za)'
      );
    }

    results.config.webhookSecret = {
      label: 'Webhook Secret',
      status: process.env.RESEND_WEBHOOK_SECRET ? 'ok' : 'warning',
      message: process.env.RESEND_WEBHOOK_SECRET 
        ? 'Webhook signature verification enabled' 
        : 'No webhook secret configured - signatures not verified',
      value: process.env.RESEND_WEBHOOK_SECRET ? `${process.env.RESEND_WEBHOOK_SECRET.substring(0, 15)}...` : null
    };

    if (!process.env.RESEND_WEBHOOK_SECRET) {
      results.recommendations.push(
        'Add RESEND_WEBHOOK_SECRET to your environment variables for webhook signature verification'
      );
    }

    // Get user settings
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        email: true,
        emailPlanType: true,
        customEmailAddress: true,
        companySubdomain: true,
        role: true,
      },
    });

    results.user = user;

    // Get email aliases
    const aliases = await prisma.emailAlias.findMany({
      where: { userId: session.user.id },
      select: {
        id: true,
        aliasEmail: true,
        displayName: true,
        isPrimary: true,
        isActive: true,
      },
      orderBy: { isPrimary: 'desc' }
    });

    results.aliases = aliases;

    // Check if user has any receiving addresses configured
    const hasReceivingAddress = 
      user?.customEmailAddress || 
      user?.companySubdomain || 
      aliases.length > 0;

    if (!hasReceivingAddress) {
      results.recommendations.push(
        'Configure at least one email address (custom email, subdomain, or alias) to receive emails'
      );
    }

    // Webhook status
    const webhookUrl = process.env.NEXTAUTH_URL 
      ? `${process.env.NEXTAUTH_URL}/api/webhooks/resend`
      : 'https://octrivium.co.za/api/webhooks/resend';

    results.webhook = {
      label: 'Webhook Endpoint',
      status: 'ok',
      message: 'Configure this URL in your Resend dashboard under Webhooks',
      url: webhookUrl
    };

    // Check recent emails
    const recentEmails = await prisma.email.findMany({
      where: { receiverId: session.user.id },
      orderBy: { receivedAt: 'desc' },
      take: 5,
      select: {
        id: true,
        subject: true,
        fromEmail: true,
        toEmail: true,
        receivedAt: true,
        isRead: true,
      }
    });

    results.recentEmails = {
      count: recentEmails.length,
      emails: recentEmails
    };

    if (recentEmails.length === 0) {
      results.recommendations.push(
        'No emails received yet. Verify your webhook is properly configured in Resend dashboard'
      );
    }

    // Check if aliases are active
    const inactiveAliases = aliases.filter(a => !a.isActive);
    if (inactiveAliases.length > 0) {
      results.recommendations.push(
        `You have ${inactiveAliases.length} inactive email alias(es). Activate them to receive emails.`
      );
    }

    return NextResponse.json(results);
  } catch (error) {
    console.error('Error running diagnostics:', error);
    return NextResponse.json(
      { error: 'Failed to run diagnostics' },
      { status: 500 }
    );
  }
}
