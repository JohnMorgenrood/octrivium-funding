import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// PATCH - Update alias
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { displayName, isPrimary, isActive } = await request.json();

    // Verify ownership
    const alias = await prisma.emailAlias.findFirst({
      where: {
        id: params.id,
        userId: session.user.id
      }
    });

    if (!alias) {
      return NextResponse.json({ error: 'Alias not found' }, { status: 404 });
    }

    // If setting as primary, unset other primary aliases
    if (isPrimary && !alias.isPrimary) {
      await prisma.emailAlias.updateMany({
        where: { userId: session.user.id, isPrimary: true },
        data: { isPrimary: false }
      });
    }

    // Update the alias
    const updated = await prisma.emailAlias.update({
      where: { id: params.id },
      data: {
        ...(displayName !== undefined && { displayName }),
        ...(isPrimary !== undefined && { isPrimary }),
        ...(isActive !== undefined && { isActive })
      }
    });

    return NextResponse.json({ alias: updated });
  } catch (error) {
    console.error('Failed to update alias:', error);
    return NextResponse.json(
      { error: 'Failed to update email alias' },
      { status: 500 }
    );
  }
}

// DELETE - Remove alias
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify ownership
    const alias = await prisma.emailAlias.findFirst({
      where: {
        id: params.id,
        userId: session.user.id
      }
    });

    if (!alias) {
      return NextResponse.json({ error: 'Alias not found' }, { status: 404 });
    }

    await prisma.emailAlias.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete alias:', error);
    return NextResponse.json(
      { error: 'Failed to delete email alias' },
      { status: 500 }
    );
  }
}
