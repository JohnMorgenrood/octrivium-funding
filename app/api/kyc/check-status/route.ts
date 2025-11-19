import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { kycStatus: true, role: true }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Don't create notification for admins or verified users
    if (user.role === 'ADMIN' || user.kycStatus === 'VERIFIED') {
      return NextResponse.json({ message: 'No notification needed' });
    }

    // Check if there's already an unread KYC notification
    const existingNotification = await prisma.notification.findFirst({
      where: {
        userId: session.user.id,
        category: 'KYC',
        read: false,
      }
    });

    if (existingNotification) {
      return NextResponse.json({ message: 'Notification already exists' });
    }

    // Create notification based on status
    let title = '';
    let message = '';

    if (user.kycStatus === 'PENDING') {
      title = '⏳ KYC Verification Pending';
      message = 'Your documents are being reviewed. This usually takes 1-2 business days. You\'ll be notified once verification is complete.';
    } else if (user.kycStatus === 'NOT_SUBMITTED') {
      if (user.role === 'INVESTOR') {
        title = '🔒 Complete KYC Verification';
        message = 'Complete your KYC/FICA verification to start investing in deals. Upload your ID document, proof of address, and banking details.';
      } else {
        title = '🔒 Complete KYC Verification';
        message = 'Complete your KYC/FICA verification to create and manage deals. Upload your ID, business registration (CIPC), and bank statement.';
      }
    } else if (user.kycStatus === 'REJECTED') {
      title = '❌ KYC Verification Rejected';
      message = 'Your KYC submission was rejected. Please review the feedback and resubmit with correct information.';
    }

    if (title && message) {
      await prisma.notification.create({
        data: {
          userId: session.user.id,
          type: 'IN_APP',
          category: 'KYC',
          title,
          message,
          metadata: JSON.stringify({ link: '/dashboard/kyc' }),
        }
      });
    }

    return NextResponse.json({ message: 'Notification created' });
  } catch (error) {
    console.error('KYC check error:', error);
    return NextResponse.json(
      { error: 'Failed to check KYC status' },
      { status: 500 }
    );
  }
}
