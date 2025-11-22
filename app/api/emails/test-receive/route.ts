import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    console.log('🧪 TEST WEBHOOK - Creating test email directly');
    
    // Find your user (admin)
    const user = await prisma.user.findFirst({
      where: { role: 'ADMIN' }
    });

    if (!user) {
      return NextResponse.json({ error: 'Admin user not found' }, { status: 404 });
    }

    console.log('Found admin user:', user.id, user.email);

    // Create a test email directly in the database
    const testEmail = await prisma.email.create({
      data: {
        messageId: `test-${Date.now()}`,
        subject: 'TEST EMAIL - Manual Creation',
        fromEmail: 'test@example.com',
        fromName: 'Test Sender',
        toEmail: 'support@octrivium.co.za',
        htmlBody: '<p>This is a test email created manually to verify the system works.</p>',
        textBody: 'This is a test email created manually to verify the system works.',
        attachments: null,
        isRead: false,
        isSent: false,
        folder: 'inbox',
        receiverId: user.id,
        receivedAt: new Date(),
      },
    });

    console.log('✅ Test email created:', testEmail.id);

    return NextResponse.json({
      success: true,
      message: 'Test email created successfully',
      emailId: testEmail.id,
      checkInbox: 'Go to /dashboard/emails to see the test email'
    });

  } catch (error) {
    console.error('❌ Test failed:', error);
    return NextResponse.json(
      { 
        error: 'Test failed', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}
