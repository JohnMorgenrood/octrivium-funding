import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { KYCVerificationList } from '@/components/admin/KYCVerificationList';

export default async function AdminKYCPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/login');
  }

  // Fetch real KYC submissions from database
  const submissions = await prisma.user.findMany({
    where: {
      kycStatus: {
        in: ['PENDING', 'SUBMITTED', 'UNDER_REVIEW', 'REJECTED']
      }
    },
    include: {
      kycDocuments: true,
    },
    orderBy: {
      updatedAt: 'desc'
    }
  });

  // Get stats
  const stats = await prisma.user.groupBy({
    by: ['kycStatus'],
    _count: true,
  });

  const statsMap = {
    pending: stats.find(s => s.kycStatus === 'PENDING')?._count || 0,
    submitted: stats.find(s => s.kycStatus === 'SUBMITTED')?._count || 0,
    underReview: stats.find(s => s.kycStatus === 'UNDER_REVIEW')?._count || 0,
    approved: stats.find(s => s.kycStatus === 'APPROVED')?._count || 0,
    rejected: stats.find(s => s.kycStatus === 'REJECTED')?._count || 0,
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          KYC Verification Management
        </h1>
        <p className="text-slate-600 dark:text-slate-400">Review and verify user identity documents for FICA compliance</p>
      </div>

      <KYCVerificationList submissions={submissions} stats={statsMap} />
    </div>
  );
}
