import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== 'BUSINESS') {
      return NextResponse.json({ error: 'Only businesses can create deals' }, { status: 403 });
    }

    // Note: KYC check removed - deals can be created but won't be investable until KYC verified
    // The deal status will be PENDING_APPROVAL which prevents investment until admin approves

    const formData = await req.formData();
    
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const fundingGoal = parseFloat(formData.get('fundingGoal') as string);
    const revenueSharePercentage = parseFloat(formData.get('revenueSharePercentage') as string);
    const duration = parseInt(formData.get('duration') as string);
    const image = formData.get('image') as File | null;

    // Validation
    if (!title || !description || !fundingGoal || !revenueSharePercentage || !duration) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (fundingGoal < 10000) {
      return NextResponse.json({ error: 'Minimum funding goal is R10,000' }, { status: 400 });
    }

    if (revenueSharePercentage < 1 || revenueSharePercentage > 30) {
      return NextResponse.json({ error: 'Revenue share must be between 1% and 30%' }, { status: 400 });
    }

    if (duration < 6 || duration > 60) {
      return NextResponse.json({ error: 'Duration must be between 6 and 60 months' }, { status: 400 });
    }

    let imageUrl: string | null = null;

    // Handle image upload
    if (image) {
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Generate unique filename
      const fileExtension = image.name.split('.').pop();
      const filename = `${uuidv4()}.${fileExtension}`;
      
      // Create uploads directory if it doesn't exist
      const uploadsDir = join(process.cwd(), 'public', 'uploads', 'deals');
      try {
        await mkdir(uploadsDir, { recursive: true });
      } catch (error) {
        // Directory already exists
      }

      // Save file
      const filepath = join(uploadsDir, filename);
      await writeFile(filepath, buffer);
      
      imageUrl = `/uploads/deals/${filename}`;
    }

    // Get or create business profile
    let business = await prisma.business.findFirst({
      where: { userId: session.user.id }
    });

    if (!business) {
      // Generate truly unique registration number for pending businesses
      const timestamp = Date.now().toString(36).toUpperCase();
      const uniqueId = session.user.id.slice(-6).toUpperCase();
      const uniqueRegNumber = `PENDING-${uniqueId}-${timestamp}`;
      
      try {
        business = await prisma.business.create({
          data: {
            userId: session.user.id,
            tradingName: session.user.name || 'My Business',
            legalName: session.user.name || 'My Business',
            registrationNumber: uniqueRegNumber,
            industry: 'Other',
            description: 'Business profile pending completion',
            address: 'TBA',
            city: 'TBA',
            province: 'Gauteng',
            postalCode: '0000',
          }
        });
      } catch (createError: any) {
        // If registration number conflict (shouldn't happen with timestamp), use fallback
        if (createError.code === 'P2002') {
          const fallbackRegNumber = `PENDING-${uuidv4().slice(0, 8).toUpperCase()}`;
          business = await prisma.business.create({
            data: {
              userId: session.user.id,
              tradingName: session.user.name || 'My Business',
              legalName: session.user.name || 'My Business',
              registrationNumber: fallbackRegNumber,
              industry: 'Other',
              description: 'Business profile pending completion',
              address: 'TBA',
              city: 'TBA',
              province: 'Gauteng',
              postalCode: '0000',
            }
          });
        } else {
          throw createError;
        }
      }
    }

    // Check user's KYC status
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { kycStatus: true }
    });

    const isKycVerified = user?.kycStatus === 'VERIFIED';

    // Calculate funding deadline (90 days from now)
    const fundingDeadline = new Date();
    fundingDeadline.setDate(fundingDeadline.getDate() + 90);

    // Create deal - status depends on KYC
    // PENDING_APPROVAL: Not yet verified, needs KYC + admin approval
    // PENDING: KYC verified, just needs admin approval
    const deal = await prisma.deal.create({
      data: {
        businessId: business.id,
        title,
        description,
        imageUrl,
        fundingGoal,
        revenueSharePercentage,
        repaymentCap: 2.0, // Default 2x return cap
        fundingDeadline,
        termsAndConditions: `
          Revenue Share Agreement:
          - ${revenueSharePercentage}% of monthly revenue will be shared with investors
          - Repayment period: ${duration} months
          - Maximum return: 2.0x invested amount
          - Monthly payouts within 7 business days of revenue verification
        `.trim(),
        status: 'PENDING_APPROVAL', // Always starts as pending approval
      },
    });

    return NextResponse.json({
      success: true,
      deal: {
        id: deal.id,
        title: deal.title,
        status: deal.status,
      },
      needsKyc: !isKycVerified,
      message: !isKycVerified
        ? '✅ Deal created successfully!\n\n📋 Next Steps:\n1. Your deal is now visible on the deals page\n2. Complete your KYC verification\n3. Submit required documents\n4. Wait for admin approval\n\n💡 Once approved, investors can fund your deal and you\'ll receive the funds!'
        : '✅ Deal created successfully!\n\nYour deal is now pending admin approval. Once approved, it will be available for investment.'
    });

  } catch (error) {
    console.error('Deal creation error:', error);
    
    // Provide more specific error message
    let errorMessage = 'Failed to create deal';
    
    if (error instanceof Error) {
      console.error('Error details:', error.message);
      // Don't expose internal errors to user, but log them
      if (process.env.NODE_ENV === 'development') {
        errorMessage = error.message;
      }
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get deals based on user role
    if (session.user.role === 'BUSINESS') {
      // Get business profile
      const business = await prisma.business.findFirst({
        where: { userId: session.user.id }
      });

      if (!business) {
        return NextResponse.json({ deals: [] });
      }

      // Get all deals for this business
      const deals = await prisma.deal.findMany({
        where: { businessId: business.id },
        include: {
          _count: {
            select: { investments: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      });

      return NextResponse.json({ deals });
    } else if (session.user.role === 'INVESTOR') {
      // Get all active/approved deals for investors
      const deals = await prisma.deal.findMany({
        where: {
          status: {
            in: ['APPROVED', 'ACTIVE', 'PENDING_APPROVAL'] // Show pending as "coming soon"
          }
        },
        include: {
          business: {
            select: {
              tradingName: true,
              industry: true,
            }
          },
          _count: {
            select: { investments: true }
          }
        },
        orderBy: [
          { isFeatured: 'desc' },
          { createdAt: 'desc' }
        ]
      });

      return NextResponse.json({ deals });
    } else {
      // Admin - get all deals
      const deals = await prisma.deal.findMany({
        include: {
          business: {
            select: {
              tradingName: true,
              industry: true,
            }
          },
          _count: {
            select: { investments: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      });

      return NextResponse.json({ deals });
    }

  } catch (error) {
    console.error('Fetch deals error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch deals' },
      { status: 500 }
    );
  }
}
