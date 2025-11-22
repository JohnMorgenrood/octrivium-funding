import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const updates = await request.json();

    // Verify email belongs to user
    const email = await prisma.email.findFirst({
      where: {
        id,
        OR: [
          { senderId: session.user.id },
          { receiverId: session.user.id },
        ],
      },
    });

    if (!email) {
      return NextResponse.json({ error: 'Email not found' }, { status: 404 });
    }

    // Update email
    const updatedEmail = await prisma.email.update({
      where: { id },
      data: updates,
    });

    return NextResponse.json({ email: updatedEmail });
  } catch (error) {
    console.error('Error updating email:', error);
    return NextResponse.json(
      { error: 'Failed to update email' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;

    // Verify email belongs to user
    const email = await prisma.email.findFirst({
      where: {
        id,
        OR: [
          { senderId: session.user.id },
          { receiverId: session.user.id },
        ],
      },
    });

    if (!email) {
      return NextResponse.json({ error: 'Email not found' }, { status: 404 });
    }

    // Soft delete - mark as deleted
    await prisma.email.update({
      where: { id },
      data: { isDeleted: true, folder: 'trash' },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting email:', error);
    return NextResponse.json(
      { error: 'Failed to delete email' },
      { status: 500 }
    );
  }
}
