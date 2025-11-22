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

    // Get user's email addresses and aliases
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        emailAliases: {
          where: { isActive: true }
        }
      },
      select: {
        id: true,
        email: true,
        customEmailAddress: true,
        companySubdomain: true,
        companyEmail: true,
        emailAliases: true,
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Collect all email addresses for this user
    const userEmails = [
      user.email,
      user.customEmailAddress,
      user.companyEmail,
      ...user.emailAliases.map(a => a.aliasEmail)
    ].filter(Boolean);

    console.log('Syncing emails for user:', user.id, 'Addresses:', userEmails);

    // Fetch emails from Resend
    // Note: Resend's list API might be limited - check their documentation
    const { data: emails, error } = await resend.emails.list({
      limit: 100,
    }) as any;

    if (error) {
      console.error('Resend API error:', error);
      return NextResponse.json({ error: 'Failed to fetch emails from Resend' }, { status: 500 });
    }

    let syncedCount = 0;
    let skippedCount = 0;

    // Process each email
    for (const email of emails?.data || []) {
      try {
        // Check if this email is for one of the user's addresses
        const toAddresses = Array.isArray(email.to) ? email.to : [email.to];
        const isForUser = toAddresses.some((addr: string) => {
          const cleanAddr = addr.match(/<(.+?)>/) ? addr.match(/<(.+?)>/)![1] : addr;
          return userEmails.includes(cleanAddr);
        });

        if (!isForUser) {
          continue;
        }

        // Get full email details
        const { data: fullEmail, error: detailError } = await resend.emails.get(email.id) as any;

        if (detailError || !fullEmail) {
          console.error('Failed to get email details:', email.id, detailError);
          continue;
        }

        // Check if already exists
        const existing = await prisma.email.findUnique({
          where: { messageId: fullEmail.id }
        });

        if (existing) {
          skippedCount++;
          continue;
        }

        // Determine recipient email
        const recipientEmail = toAddresses[0].match(/<(.+?)>/) 
          ? toAddresses[0].match(/<(.+?)>/)![1] 
          : toAddresses[0];

        // Parse from email
        const fromMatch = fullEmail.from.match(/<(.+?)>/) || fullEmail.from.match(/^(.+?)$/);
        const fromEmail = fromMatch ? fromMatch[1] : fullEmail.from;
        const fromName = fullEmail.from.replace(/<.+?>/, '').trim();

        // Create email record
        await prisma.email.create({
          data: {
            messageId: fullEmail.id,
            subject: fullEmail.subject || '(No Subject)',
            fromEmail,
            fromName: fromName !== fromEmail ? fromName : null,
            toEmail: recipientEmail,
            htmlBody: fullEmail.html || null,
            textBody: fullEmail.text || null,
            attachments: null,
            isRead: false,
            isSent: false,
            folder: 'inbox',
            receiverId: user.id,
            receivedAt: new Date(fullEmail.created_at),
          },
        });

        syncedCount++;
      } catch (err) {
        console.error('Error processing email:', email.id, err);
      }
    }

    return NextResponse.json({
      success: true,
      synced: syncedCount,
      skipped: skippedCount,
      total: emails?.data?.length || 0,
    });

  } catch (error) {
    console.error('Error syncing emails:', error);
    return NextResponse.json(
      { error: 'Failed to sync emails' },
      { status: 500 }
    );
  }
}
