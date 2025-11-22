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
    
    console.log('Received Resend webhook:', JSON.stringify(payload, null, 2));

    // Resend webhook structure for incoming emails
    const { type, data } = payload;

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
      
      // Find user by email, customEmailAddress, companyEmail, or subdomain
      const user = await prisma.user.findFirst({
        where: {
          OR: [
            { email: recipientEmail },
            { companyEmail: recipientEmail },
            { customEmailAddress: recipientEmail },
            ...(subdomainMatch ? [{ companySubdomain: subdomainMatch[1] }] : []),
          ],
        },
      });

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

    console.log('Unhandled webhook type:', type);
    return NextResponse.json({ received: true, message: 'Unhandled event type' });
  } catch (error) {
    console.error('❌ Resend webhook error:', error);
    return NextResponse.json(
      { 
        error: 'Webhook processing failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
