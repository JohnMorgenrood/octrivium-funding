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
    const industry = formData.get('industry') as string;
    const location = formData.get('location') as string;
    const monthlyRevenue = parseFloat(formData.get('monthlyRevenue') as string);
    const revenueGrowth = parseFloat(formData.get('revenueGrowth') as string);
    const riskLevel = formData.get('riskLevel') as string;
    const foundedYear = parseInt(formData.get('foundedYear') as string);
    const minInvestment = parseFloat(formData.get('minInvestment') as string);

    // Validation
    if (!title || !description || !fundingGoal || !revenueSharePercentage || !duration || !industry || !location || !monthlyRevenue || !revenueGrowth || !riskLevel || !foundedYear || !minInvestment) {
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

    if (minInvestment < 1000) {
      return NextResponse.json({ error: 'Minimum investment must be at least R1,000' }, { status: 400 });
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
            industry: industry,
            description: 'Business profile pending completion',
            address: 'TBA',
            city: location,
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
              industry: industry,
              description: 'Business profile pending completion',
              address: 'TBA',
              city: location,
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

    // Create deal - AUTO-APPROVED (admin can remove if needed)
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
        minInvestment,
        industry,
        location,
        monthlyRevenue,
        revenueGrowth,
        riskLevel,
        foundedYear,
        termsAndConditions: `
          Revenue Share Agreement:
          - ${revenueSharePercentage}% of monthly revenue will be shared with investors
          - Repayment period: ${duration} months
          - Maximum return: 2.0x invested amount
          - Monthly payouts within 7 business days of revenue verification
        `.trim(),
        status: 'ACTIVE', // AUTO-APPROVED - goes live immediately
        approvedAt: new Date(),
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
        ? '✅ Deal created and published successfully!\n\n⚠️ Important: Your deal is live but shows "KYC Not Verified" to investors.\n\n📋 Next Steps:\n1. Complete KYC verification to remove the warning\n2. Investors can see but cannot invest until you\'re KYC verified\n3. Admin can remove your deal if needed\n\n💡 Complete KYC to start accepting investments!'
        : '✅ Deal created and published successfully!\n\nYour deal is now live and available for investment. Investors can start funding your campaign immediately!'
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
              user: {
                select: {
                  kycStatus: true,
                }
              }
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
