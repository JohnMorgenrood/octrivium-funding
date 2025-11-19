import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const card = await prisma.bankCard.findUnique({
      where: { id: params.id },
    });

    if (!card || card.userId !== session.user.id) {
      return NextResponse.json({ error: 'Card not found' }, { status: 404 });
    }

    await prisma.bankCard.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Card deleted successfully' });
  } catch (error) {
    console.error('Bank card deletion error:', error);
    return NextResponse.json(
      { error: 'Failed to delete bank card' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const card = await prisma.bankCard.findUnique({
      where: { id: params.id },
    });

    if (!card || card.userId !== session.user.id) {
      return NextResponse.json({ error: 'Card not found' }, { status: 404 });
    }

    const { isDefault } = await req.json();

    // If setting as default, unset other default cards
    if (isDefault) {
      await prisma.bankCard.updateMany({
        where: {
          userId: session.user.id,
          isDefault: true,
        },
        data: {
          isDefault: false,
        },
      });
    }

    const updated = await prisma.bankCard.update({
      where: { id: params.id },
      data: { isDefault },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Bank card update error:', error);
    return NextResponse.json(
      { error: 'Failed to update bank card' },
      { status: 500 }
    );
  }
}
