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
        id: true,
        subscriptionTier: true,
        teamMemberCount: true,
        companyOwnerId: true,
        companyOwner: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            companyName: true,
          },
        },
        teamMembers: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            createdAt: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error fetching team members:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { email, firstName, lastName } = await request.json();

    if (!email || !firstName || !lastName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        subscriptionTier: true,
        teamMemberCount: true,
        companyOwnerId: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if user is a team member (can't add team members if you're a member yourself)
    if (user.companyOwnerId) {
      return NextResponse.json({ error: 'Team members cannot invite other members' }, { status: 403 });
    }

    // Check if user is on BUSINESS tier
    if (user.subscriptionTier !== 'BUSINESS') {
      return NextResponse.json({ error: 'Team members feature requires BUSINESS subscription' }, { status: 403 });
    }

    // Check team member limit (max 4 including owner)
    if (user.teamMemberCount >= 4) {
      return NextResponse.json({ error: 'Maximum of 4 team members reached' }, { status: 403 });
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 400 });
    }

    // Generate random password (user will need to reset it)
    const tempPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    // Create team member account
    const teamMember = await prisma.user.create({
      data: {
        email,
        firstName,
        lastName,
        password: hashedPassword,
        role: 'BUSINESS', // Same role as owner
        subscriptionTier: user.subscriptionTier,
        subscriptionStatus: 'ACTIVE',
        companyOwnerId: user.id,
      },
    });

    // Increment team member count
    await prisma.user.update({
      where: { id: user.id },
      data: {
        teamMemberCount: { increment: 1 },
      },
    });

    // TODO: Send invitation email with temporary password
    // For now, return the temp password (in production, email it)

    return NextResponse.json({
      success: true,
      teamMember: {
        id: teamMember.id,
        email: teamMember.email,
        firstName: teamMember.firstName,
        lastName: teamMember.lastName,
      },
      tempPassword, // Remove this in production, send via email instead
    });
  } catch (error) {
    console.error('Error adding team member:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const memberId = searchParams.get('memberId');

    if (!memberId) {
      return NextResponse.json({ error: 'Member ID required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if user is a team member (can't remove members if you're a member yourself)
    if (user.companyOwnerId) {
      return NextResponse.json({ error: 'Team members cannot remove other members' }, { status: 403 });
    }

    // Verify the member belongs to this owner
    const teamMember = await prisma.user.findFirst({
      where: {
        id: memberId,
        companyOwnerId: user.id,
      },
    });

    if (!teamMember) {
      return NextResponse.json({ error: 'Team member not found' }, { status: 404 });
    }

    // Delete the team member
    await prisma.user.delete({
      where: { id: memberId },
    });

    // Decrement team member count
    await prisma.user.update({
      where: { id: user.id },
      data: {
        teamMemberCount: { decrement: 1 },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error removing team member:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
