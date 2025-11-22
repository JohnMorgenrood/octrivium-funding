import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Add GET for testing
export async function GET() {
  return NextResponse.json({ 
    status: 'active',
    message: 'Resend webhook endpoint is working',
    timestamp: new Date().toISOString()
  });
}

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    
    console.log('🔔 ===== RESEND WEBHOOK RECEIVED =====');
    console.log('Timestamp:', new Date().toISOString());
    console.log('Full Payload:', JSON.stringify(payload, null, 2));
    console.log('====================================');

    // Resend webhook structure for incoming emails
    const { type, data } = payload;

    console.log('Event Type:', type);

    if (type === 'email.received') {
      const {
        message_id,
        from,
        to,
        subject,
        html,
        text,
        attachments,
        headers,
      } = data;

      console.log('Processing email.received:', { message_id, from, to, subject });

      // Extract recipient email to find the user
      const recipientEmail = Array.isArray(to) ? to[0] : to;
      
      console.log('Looking for user with email:', recipientEmail);
      
      // Check if it's a subdomain email (e.g., support@acme.octrivium.co.za)
      const subdomainMatch = recipientEmail.match(/^.+@([^.]+)\.octrivium\.co\.za$/);
      
      // Find user by email, customEmailAddress, emailAlias, companyEmail, or subdomain
      let user = await prisma.user.findFirst({
        where: {
          OR: [
            { email: recipientEmail },
            { companyEmail: recipientEmail },
            { customEmailAddress: recipientEmail },
            ...(subdomainMatch ? [{ companySubdomain: subdomainMatch[1] }] : []),
          ],
        },
      });

      // If not found, check email aliases
      if (!user) {
        const alias = await prisma.emailAlias.findUnique({
          where: { aliasEmail: recipientEmail },
          include: { user: true }
        });
        
        if (alias && alias.isActive) {
          user = alias.user;
          console.log('Found user via email alias:', alias.aliasEmail, '-> user:', user.id);
        }
      }

      if (!user) {
        console.log('User not found for email:', recipientEmail);
        return NextResponse.json({ 
          received: true, 
          message: 'User not found',
          recipientEmail 
        });
      }

      console.log('Found user:', user.id, user.email);

      // Check for duplicates
      const existingEmail = await prisma.email.findUnique({
        where: { messageId: message_id },
      });

      if (existingEmail) {
        console.log('Email already exists:', message_id);
        return NextResponse.json({ 
          received: true, 
          message: 'Duplicate email' 
        });
      }

      // Parse from email
      const fromMatch = from.match(/<(.+?)>/) || from.match(/^(.+?)$/);
      const fromEmail = fromMatch ? fromMatch[1] : from;
      const fromName = from.replace(/<.+?>/, '').trim();

      console.log('Creating email record:', { messageId: message_id, fromEmail, toEmail: recipientEmail });

      // Store email in database
      const newEmail = await prisma.email.create({
        data: {
          messageId: message_id,
          subject: subject || '(No Subject)',
          fromEmail,
          fromName: fromName !== fromEmail ? fromName : null,
          toEmail: recipientEmail,
          htmlBody: html,
          textBody: text,
          attachments: attachments ? JSON.parse(JSON.stringify(attachments)) : null,
          isRead: false,
          isSent: false,
          folder: 'inbox',
          receiverId: user.id,
          receivedAt: new Date(),
        },
      });

      console.log('✅ Email stored successfully:', newEmail.id);

      return NextResponse.json({ 
        received: true, 
        message: 'Email processed successfully',
        emailId: newEmail.id
      });
    }

    console.log('ℹ️ Unhandled webhook type:', type);
    console.log('Returning success for unhandled event');
    return NextResponse.json({ received: true, message: 'Unhandled event type', type });
  } catch (error) {
    console.error('❌ ===== RESEND WEBHOOK ERROR =====');
    console.error('Error:', error);
    console.error('Stack:', error instanceof Error ? error.stack : 'No stack trace');
    console.error('===================================');
    return NextResponse.json(
      { 
        error: 'Webhook processing failed',
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
