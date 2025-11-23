import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        brandColorPrimary: true,
        brandColorSecondary: true,
        brandColorAccent: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error fetching brand colors:', error);
    return NextResponse.json(
      { error: 'Failed to fetch brand colors' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { primary, secondary, accent } = body;

    if (!primary || !secondary || !accent) {
      return NextResponse.json(
        { error: 'Missing required color values' },
        { status: 400 }
      );
    }

    const user = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        brandColorPrimary: primary,
        brandColorSecondary: secondary,
        brandColorAccent: accent,
      },
    });

    return NextResponse.json({
      success: true,
      brandColorPrimary: user.brandColorPrimary,
      brandColorSecondary: user.brandColorSecondary,
      brandColorAccent: user.brandColorAccent,
    });
  } catch (error) {
    console.error('Error saving brand colors:', error);
    return NextResponse.json(
      { error: 'Failed to save brand colors' },
      { status: 500 }
    );
  }
}
