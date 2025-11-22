import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    
    console.log('Received webhook:', payload);

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

      // Extract recipient email to find the user
      const recipientEmail = Array.isArray(to) ? to[0] : to;
      
      // Find user by email
      const user = await prisma.user.findFirst({
        where: {
          OR: [
            { email: recipientEmail },
            { companyEmail: recipientEmail },
          ],
        },
      });

      if (!user) {
        console.log('User not found for email:', recipientEmail);
        return NextResponse.json({ 
          received: true, 
          message: 'User not found' 
        });
      }

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

      // Store email in database
      await prisma.email.create({
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

      console.log('Email stored successfully:', message_id);

      return NextResponse.json({ 
        received: true, 
        message: 'Email processed successfully' 
      });
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
