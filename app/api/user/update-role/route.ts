import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { role } = await req.json();

    if (!['INVESTOR', 'BUSINESS'].includes(role)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }

    // Update user role
    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: { role },
    });

    return NextResponse.json({ success: true, role: updatedUser.role });
  } catch (error) {
    console.error('Update role error:', error);
    return NextResponse.json({ error: 'Failed to update role' }, { status: 500 });
  }
}
