import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.json();

    // Validate required fields
    const requiredFields = [
      'firstName',
      'lastName',
      'idNumber',
      'dateOfBirth',
      'nationality',
      'phoneNumber',
      'email',
      'address',
      'city',
      'province',
      'postalCode',
      'country',
      'bankName',
      'accountNumber',
      'accountType',
      'branchCode'
    ];

    // Add business-specific required fields for BUSINESS users
    if (session.user.role === 'BUSINESS') {
      requiredFields.push(
        'businessName',
        'registrationNumber',
        'businessType',
        'industry'
      );
    }

    // Check if all required fields are present
    const missingFields = requiredFields.filter(field => !data[field]);
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Update user with KYC status to PENDING and update ID number if provided
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        kycStatus: 'PENDING',
        idNumber: data.idNumber,
        phone: data.phoneNumber,
      },
    });

    // Note: In a production environment, you would:
    // 1. Upload files to cloud storage (Vercel Blob, AWS S3, etc.)
    // 2. Create KYCDocument records with file URLs
    // 3. Store all form data in a separate KYC submission table
    // For now, we're just updating the status to PENDING

    return NextResponse.json({
      message: 'KYC documents submitted successfully',
      status: 'PENDING'
    });
  } catch (error) {
    console.error('KYC submission error:', error);
    return NextResponse.json(
      { error: 'Failed to submit KYC' },
      { status: 500 }
    );
  }
}
