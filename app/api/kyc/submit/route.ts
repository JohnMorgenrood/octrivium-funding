import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse FormData
    const formData = await req.formData();
    
    // Extract text fields
    const data = {
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      idNumber: formData.get('idNumber') as string,
      dateOfBirth: formData.get('dateOfBirth') as string,
      nationality: formData.get('nationality') as string,
      phoneNumber: formData.get('phoneNumber') as string,
      email: formData.get('email') as string,
      address: formData.get('address') as string,
      suburb: formData.get('suburb') as string,
      city: formData.get('city') as string,
      province: formData.get('province') as string,
      postalCode: formData.get('postalCode') as string,
      country: formData.get('country') as string,
      bankName: formData.get('bankName') as string,
      accountNumber: formData.get('accountNumber') as string,
      accountType: formData.get('accountType') as string,
      branchCode: formData.get('branchCode') as string,
      businessName: formData.get('businessName') as string || '',
      registrationNumber: formData.get('registrationNumber') as string || '',
      vatNumber: formData.get('vatNumber') as string || '',
      businessType: formData.get('businessType') as string || '',
      industry: formData.get('industry') as string || '',
    };

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
    const missingFields = requiredFields.filter(field => !data[field as keyof typeof data]);
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Handle file uploads
    const uploadDir = join(process.cwd(), 'public', 'uploads', 'kyc', session.user.id);
    
    // Create upload directory if it doesn't exist
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    const documentPaths: Record<string, string> = {};

    // Process each file
    const fileFields = ['idDocument', 'proofOfAddress', 'businessRegistration', 'bankStatement'];
    
    for (const field of fileFields) {
      const file = formData.get(field) as File | null;
      if (file && file.size > 0) {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        
        // Create safe filename with timestamp
        const timestamp = Date.now();
        const safeFileName = `${field}_${timestamp}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
        const filePath = join(uploadDir, safeFileName);
        
        await writeFile(filePath, buffer);
        documentPaths[field] = `/uploads/kyc/${session.user.id}/${safeFileName}`;
      }
    }

    // Validate required documents
    if (!documentPaths.idDocument || !documentPaths.proofOfAddress) {
      return NextResponse.json(
        { error: 'ID document and proof of address are required' },
        { status: 400 }
      );
    }

    if (session.user.role === 'BUSINESS' && (!documentPaths.businessRegistration || !documentPaths.bankStatement)) {
      return NextResponse.json(
        { error: 'Business registration and bank statement are required for business accounts' },
        { status: 400 }
      );
    }

    // Update user with KYC status to PENDING
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        kycStatus: 'PENDING',
        idNumber: data.idNumber,
      },
    });

    // Store KYC documents in database
    const documentEntries = Object.entries(documentPaths).map(([type, url]) => ({
      userId: session.user.id,
      documentType: type.toUpperCase(),
      fileName: url.split('/').pop() || '',
      fileUrl: url,
      fileSize: 0, // We could calculate this if needed
      mimeType: url.endsWith('.pdf') ? 'application/pdf' : 'image/jpeg',
    }));

    await prisma.kYCDocument.createMany({
      data: documentEntries,
    });

    // Store additional KYC form data in a KYC info table (we'll use metadata JSON on user for now)
    // You could create a separate KYCSubmission model if you want structured data
    
    // Send notification to admins
    const admins = await prisma.user.findMany({
      where: { role: 'ADMIN' },
      select: { id: true }
    });

    if (admins.length > 0) {
      await prisma.notification.createMany({
        data: admins.map(admin => ({
          userId: admin.id,
          type: 'IN_APP',
          category: 'KYC',
          title: 'New KYC Submission',
          message: `${data.firstName} ${data.lastName} has submitted KYC documents for review`,
          metadata: JSON.stringify({
            link: '/admin/kyc',
            submitterId: session.user.id,
          }),
        })),
      });
    }

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
