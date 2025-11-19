import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { userId, reason } = await req.json();

    if (!userId || !reason) {
      return NextResponse.json({ error: 'User ID and rejection reason are required' }, { status: 400 });
    }

    // Update user status to REJECTED
    await prisma.user.update({
      where: { id: userId },
      data: { kycStatus: 'REJECTED' },
    });

    // Update documents with rejection reason
    await prisma.kYCDocument.updateMany({
      where: { userId },
      data: { 
        verified: false,
        verifiedAt: new Date(),
        verifiedBy: session.user.id,
        rejectionReason: reason,
      },
    });

    // Get user details for notification
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { firstName: true, lastName: true, email: true }
    });

    // Send notification to user
    await prisma.notification.create({
      data: {
        userId,
        type: 'IN_APP',
        category: 'KYC',
        title: '❌ KYC Verification Rejected',
        message: `Your KYC submission was rejected. Reason: ${reason}. Please review the feedback and resubmit with correct information.`,
        metadata: JSON.stringify({ link: '/dashboard/kyc' }),
      }
    });

    return NextResponse.json({
      message: 'KYC rejected successfully',
      user: user
    });
  } catch (error) {
    console.error('KYC rejection error:', error);
    return NextResponse.json(
      { error: 'Failed to reject KYC' },
      { status: 500 }
    );
  }
}
