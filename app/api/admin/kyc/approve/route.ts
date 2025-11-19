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

    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Update user status to VERIFIED
    await prisma.user.update({
      where: { id: userId },
      data: { kycStatus: 'VERIFIED' },
    });

    // Mark all documents as verified
    await prisma.kYCDocument.updateMany({
      where: { userId },
      data: { 
        verified: true,
        verifiedAt: new Date(),
        verifiedBy: session.user.id,
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
        title: '✓ KYC Verification Approved',
        message: `Congratulations! Your identity has been verified. You can now access all platform features.`,
        metadata: JSON.stringify({ link: '/dashboard' }),
      }
    });

    return NextResponse.json({
      message: 'KYC approved successfully',
      user: user
    });
  } catch (error) {
    console.error('KYC approval error:', error);
    return NextResponse.json(
      { error: 'Failed to approve KYC' },
      { status: 500 }
    );
  }
}
