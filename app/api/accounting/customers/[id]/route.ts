import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { 
      name, 
      email, 
      phone, 
      company, 
      companyEmail,
      companyPhone,
      website,
      addressLine1, 
      addressLine2, 
      city, 
      province, 
      postalCode, 
      vatNumber,
      registrationNumber 
    } = body;

    const customer = await prisma.customer.update({
      where: {
        id: params.id,
        userId: session.user.id,
      },
      data: {
        name,
        email,
        phone,
        company,
        companyEmail,
        companyPhone,
        website,
        addressLine1,
        addressLine2,
        city,
        province,
        postalCode,
        vatNumber,
        registrationNumber,
      },
    });

    return NextResponse.json(customer);
  } catch (error) {
    console.error('Customer update error:', error);
    return NextResponse.json(
      { error: 'Failed to update customer' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await prisma.customer.delete({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Customer delete error:', error);
    return NextResponse.json(
      { error: 'Failed to delete customer' },
      { status: 500 }
    );
  }
}
