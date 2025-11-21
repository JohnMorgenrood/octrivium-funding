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
        companyName: true,
        companyLogo: true,
        companyEmail: true,
        companyPhone: true,
        companyAddress: true,
        companyCity: true,
        companyPostalCode: true,
        companyCountry: true,
        taxNumber: true,
        registrationNumber: true,
        website: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error fetching company data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch company data' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { 
      companyName, 
      companyLogo,
      companyEmail,
      companyPhone,
      companyAddress,
      companyCity,
      companyPostalCode,
      companyCountry,
      taxNumber,
      registrationNumber,
      website,
    } = await request.json();

    const user = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        companyName: companyName || null,
        companyLogo: companyLogo || null,
        companyEmail: companyEmail || null,
        companyPhone: companyPhone || null,
        companyAddress: companyAddress || null,
        companyCity: companyCity || null,
        companyPostalCode: companyPostalCode || null,
        companyCountry: companyCountry || null,
        taxNumber: taxNumber || null,
        registrationNumber: registrationNumber || null,
        website: website || null,
      },
      select: {
        id: true,
        companyName: true,
        companyLogo: true,
        companyEmail: true,
        companyPhone: true,
        companyAddress: true,
        companyCity: true,
        companyPostalCode: true,
        companyCountry: true,
        taxNumber: true,
        registrationNumber: true,
        website: true,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error updating company data:', error);
    return NextResponse.json(
      { error: 'Failed to update company data' },
      { status: 500 }
    );
  }
}
