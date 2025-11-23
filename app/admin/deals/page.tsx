import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { AdminDealsList } from '@/components/admin/AdminDealsList';

export default async function AdminDealsPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/login');
  }

  const pendingDeals = [
    {
      id: 1,
      businessName: 'Green Energy Solutions',
      amount: 500000,
      revenueShare: 5.0,
      submittedDate: '2025-11-15',
      status: 'PENDING_REVIEW',
      industry: 'Renewable Energy',
      documentsComplete: true,
      kycVerified: true,
    },
    {
      id: 2,
      businessName: 'Cape Town Coffee Co.',
      amount: 250000,
      revenueShare: 6.0,
      submittedDate: '2025-11-14',
      status: 'PENDING_REVIEW',
      industry: 'Food & Beverage',
      documentsComplete: true,
      kycVerified: false,
    },
    {
      id: 3,
      businessName: 'Tech Innovators SA',
      amount: 750000,
      revenueShare: 4.5,
      submittedDate: '2025-11-13',
      status: 'UNDER_REVIEW',
      industry: 'Technology',
      documentsComplete: false,
      kycVerified: true,
    },
  ];

  const stats = {
    pending: 12,
    approved: 45,
    rejected: 8,
    underReview: 5,
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Deal Approvals
        </h1>
        <p className="text-slate-600 dark:text-slate-400">Review and approve business funding applications</p>
      </div>

      <AdminDealsList deals={pendingDeals} stats={stats} />
    </div>
  );
}
