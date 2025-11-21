import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Get notification preferences
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        emailNotifications: true,
        pushNotifications: true,
        notificationPreferences: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      emailNotifications: user.emailNotifications ?? true,
      pushNotifications: user.pushNotifications ?? false,
      preferences: user.notificationPreferences || {
        invoicePaid: true,
        invoiceOverdue: true,
        newInvestor: true,
        revenueUpdate: true,
        systemUpdates: false,
      },
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notification preferences' },
      { status: 500 }
    );
  }
}

// Update notification preferences
export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { emailNotifications, pushNotifications, preferences } = body;

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        emailNotifications: emailNotifications ?? undefined,
        pushNotifications: pushNotifications ?? undefined,
        notificationPreferences: preferences ?? undefined,
      },
      select: {
        emailNotifications: true,
        pushNotifications: true,
        notificationPreferences: true,
      },
    });

    return NextResponse.json({
      emailNotifications: updatedUser.emailNotifications,
      pushNotifications: updatedUser.pushNotifications,
      preferences: updatedUser.notificationPreferences,
    });
  } catch (error) {
    console.error('Update notifications error:', error);
    return NextResponse.json(
      { error: 'Failed to update notification preferences' },
      { status: 500 }
    );
  }
}
