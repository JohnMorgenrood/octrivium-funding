import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
      select: { role: true }
    });

    if (user?.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      isFeatured,
      isTopListing,
      isSponsored,
      isPrioritySearch,
      isNewsletterFeatured,
      isSocialBoosted,
      isPriorityReview,
      premiumExpiresAt,
      premiumNotes
    } = body;

    // Update deal with premium features
    const updatedDeal = await prisma.deal.update({
      where: { id: params.id },
      data: {
        isFeatured: isFeatured ?? false,
        isTopListing: isTopListing ?? false,
        isSponsored: isSponsored ?? false,
        isPrioritySearch: isPrioritySearch ?? false,
        isNewsletterFeatured: isNewsletterFeatured ?? false,
        isSocialBoosted: isSocialBoosted ?? false,
        isPriorityReview: isPriorityReview ?? false,
        premiumExpiresAt: premiumExpiresAt ? new Date(premiumExpiresAt) : null,
        premiumNotes: premiumNotes || null
      },
      include: {
        business: {
          select: {
            tradingName: true,
            logo: true
          }
        }
      }
    });

    return NextResponse.json({
      message: 'Premium features updated successfully',
      deal: updatedDeal
    });
  } catch (error) {
    console.error('Error updating premium features:', error);
    return NextResponse.json(
      { error: 'Failed to update premium features' },
      { status: 500 }
    );
  }
}

// GET endpoint to fetch deal premium features
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const deal = await prisma.deal.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        title: true,
        isFeatured: true,
        isTopListing: true,
        isSponsored: true,
        isPrioritySearch: true,
        isNewsletterFeatured: true,
        isSocialBoosted: true,
        isPriorityReview: true,
        premiumExpiresAt: true,
        premiumNotes: true,
        business: {
          select: {
            tradingName: true,
            logo: true
          }
        }
      }
    });

    if (!deal) {
      return NextResponse.json({ error: 'Deal not found' }, { status: 404 });
    }

    return NextResponse.json({ deal });
  } catch (error) {
    console.error('Error fetching premium features:', error);
    return NextResponse.json(
      { error: 'Failed to fetch premium features' },
      { status: 500 }
    );
  }
}
