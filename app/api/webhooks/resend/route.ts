import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

// Add GET for testing
export async function GET() {
  return NextResponse.json({ 
    status: 'active',
    message: 'Resend webhook endpoint is working',
    timestamp: new Date().toISOString()
  });
}

// Verify webhook signature
function verifySignature(payload: string, signature: string, secret: string): boolean {
  try {
    const hmac = crypto.createHmac('sha256', secret);
    const digest = hmac.update(payload).digest('hex');
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest));
  } catch (error) {
    console.error('Signature verification error:', error);
    return false;
  }
}

export async function POST(request: Request) {
  try {
    // Get raw body for signature verification
    const rawBody = await request.text();
    const payload = JSON.parse(rawBody);
    
    // Verify webhook signature if secret is configured
    if (process.env.RESEND_WEBHOOK_SECRET) {
      const signature = request.headers.get('svix-signature') || 
                       request.headers.get('webhook-signature') || 
                       request.headers.get('x-resend-signature');
      
      if (signature) {
        const isValid = verifySignature(rawBody, signature, process.env.RESEND_WEBHOOK_SECRET);
        if (!isValid) {
          console.log('❌ Invalid webhook signature');
          return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
        }
        console.log('✅ Webhook signature verified');
      } else {
        console.log('⚠️ No signature header found');
      }
    } else {
      console.log('⚠️ RESEND_WEBHOOK_SECRET not configured - skipping signature verification');
    }
    
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

      // Forward to user's personal email so they receive it in Gmail/Outlook/etc
      if (user.email && process.env.RESEND_API_KEY) {
        try {
          const { Resend } = require('resend');
          const forwardResend = new Resend(process.env.RESEND_API_KEY);
          
          await forwardResend.emails.send({
            from: 'notifications@octrivium.co.za',
            to: user.email,
            subject: `Fwd: ${subject}`,
            html: `
              <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: #f3f4f6; padding: 16px; border-radius: 8px; margin-bottom: 16px;">
                  <p style="margin: 0; color: #6b7280; font-size: 14px;">
                    📧 You received an email at <strong>${recipientEmail}</strong>
                  </p>
                </div>
                <div style="background: white; padding: 20px; border-radius: 8px; border: 1px solid #e5e7eb;">
                  <p style="margin: 0 0 8px 0;"><strong>From:</strong> ${from}</p>
                  <p style="margin: 0 0 8px 0;"><strong>To:</strong> ${recipientEmail}</p>
                  <p style="margin: 0 0 16px 0;"><strong>Subject:</strong> ${subject}</p>
                  <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 16px 0;">
                  ${html || text || '(No content)'}
                </div>
                <div style="margin-top: 16px; text-align: center; color: #9ca3af; font-size: 12px;">
                  <p>View and reply in your <a href="https://octrivium.co.za/dashboard/emails" style="color: #8b5cf6;">Octrivium Dashboard</a></p>
                </div>
              </div>
            `,
          });
          
          console.log('✅ Email forwarded to user personal inbox:', user.email);
        } catch (fwdError) {
          console.error('Failed to forward email:', fwdError);
          // Don't fail the whole webhook if forwarding fails
        }
      }

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
