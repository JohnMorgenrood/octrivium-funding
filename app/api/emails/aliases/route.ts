import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - List all email aliases for the user
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const aliases = await prisma.emailAlias.findMany({
      where: { userId: session.user.id },
      orderBy: [
        { isPrimary: 'desc' },
        { createdAt: 'asc' }
      ]
    });

    return NextResponse.json({ aliases });
  } catch (error) {
    console.error('Failed to fetch aliases:', error);
    return NextResponse.json(
      { error: 'Failed to fetch email aliases' },
      { status: 500 }
    );
  }
}

// POST - Create a new email alias
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { aliasEmail, displayName, isPrimary } = await request.json();

    // Get user's plan and role
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { emailPlanType: true, role: true }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const isAdmin = user.role === 'ADMIN';

    // Check plan permissions (admins bypass all restrictions)
    if (!isAdmin) {
      if (user.emailPlanType === 'FREE') {
        return NextResponse.json(
          { error: 'Email aliases require PRO or BUSINESS plan' },
          { status: 403 }
        );
      }

      // Count existing aliases
      const aliasCount = await prisma.emailAlias.count({
        where: { userId: session.user.id }
      });

      // PRO: 3 aliases, BUSINESS: unlimited
      const maxAliases = user.emailPlanType === 'PRO' ? 3 : 999;
      
      if (aliasCount >= maxAliases) {
        return NextResponse.json(
          { error: `${user.emailPlanType} plan allows maximum ${maxAliases} email aliases` },
          { status: 403 }
        );
      }
    }

    // Validate email format (must be @octrivium.co.za or @*.octrivium.co.za)
    const emailRegex = /^[a-z0-9._-]+@([a-z0-9-]+\.)?octrivium\.co\.za$/i;
    if (!emailRegex.test(aliasEmail)) {
      return NextResponse.json(
        { error: 'Email must be in format: name@octrivium.co.za or name@company.octrivium.co.za' },
        { status: 400 }
      );
    }

    // Check if alias already exists
    const existing = await prisma.emailAlias.findUnique({
      where: { aliasEmail }
    });

    if (existing) {
      return NextResponse.json(
        { error: 'This email alias is already taken' },
        { status: 409 }
      );
    }

    // If setting as primary, unset other primary aliases
    if (isPrimary) {
      await prisma.emailAlias.updateMany({
        where: { userId: session.user.id, isPrimary: true },
        data: { isPrimary: false }
      });
    }

    // Create the alias
    const alias = await prisma.emailAlias.create({
      data: {
        userId: session.user.id,
        aliasEmail,
        displayName: displayName || aliasEmail.split('@')[0],
        isPrimary: isPrimary || false,
        isActive: true
      }
    });

    return NextResponse.json({ alias }, { status: 201 });
  } catch (error) {
    console.error('Failed to create alias:', error);
    return NextResponse.json(
      { error: 'Failed to create email alias' },
      { status: 500 }
    );
  }
}
