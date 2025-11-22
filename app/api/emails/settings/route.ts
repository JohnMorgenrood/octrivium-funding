import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        emailPlanType: true,
        customEmailAddress: true,
        companySubdomain: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error fetching email settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { customEmailAddress, companySubdomain } = await request.json();

    // Get user's current plan
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { emailPlanType: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check permissions
    if (customEmailAddress) {
      if (user.emailPlanType === 'FREE') {
        return NextResponse.json(
          { error: 'Custom email addresses require PRO or BUSINESS plan' },
          { status: 403 }
        );
      }

      // Validate format
      const emailRegex = /^[a-z0-9.-]+$/;
      if (!emailRegex.test(customEmailAddress)) {
        return NextResponse.json(
          { error: 'Invalid email format. Use only lowercase letters, numbers, dots, and hyphens.' },
          { status: 400 }
        );
      }

      const fullEmail = `${customEmailAddress}@octrivium.co.za`;

      // Check if already taken
      const existing = await prisma.user.findFirst({
        where: {
          customEmailAddress: fullEmail,
          NOT: { id: session.user.id },
        },
      });

      if (existing) {
        return NextResponse.json(
          { error: 'This email address is already taken' },
          { status: 400 }
        );
      }

      // Update user
      await prisma.user.update({
        where: { id: session.user.id },
        data: { customEmailAddress: fullEmail },
      });

      return NextResponse.json({ 
        success: true, 
        customEmailAddress: fullEmail,
        message: 'Custom email address saved successfully' 
      });
    }

    if (companySubdomain) {
      if (user.emailPlanType !== 'BUSINESS') {
        return NextResponse.json(
          { error: 'Company subdomains require BUSINESS plan' },
          { status: 403 }
        );
      }

      // Validate format
      const subdomainRegex = /^[a-z0-9-]+$/;
      if (!subdomainRegex.test(companySubdomain)) {
        return NextResponse.json(
          { error: 'Invalid subdomain format. Use only lowercase letters, numbers, and hyphens.' },
          { status: 400 }
        );
      }

      // Check if already taken
      const existing = await prisma.user.findFirst({
        where: {
          companySubdomain: companySubdomain,
          NOT: { id: session.user.id },
        },
      });

      if (existing) {
        return NextResponse.json(
          { error: 'This subdomain is already taken' },
          { status: 400 }
        );
      }

      // Update user
      await prisma.user.update({
        where: { id: session.user.id },
        data: { companySubdomain },
      });

      return NextResponse.json({ 
        success: true, 
        companySubdomain,
        message: 'Company subdomain saved successfully' 
      });
    }

    return NextResponse.json({ error: 'No data provided' }, { status: 400 });
  } catch (error) {
    console.error('Error saving email settings:', error);
    return NextResponse.json(
      { error: 'Failed to save settings' },
      { status: 500 }
    );
  }
}
