import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {  CheckCircle, XCircle, Clock, AlertTriangle, FileText, Building } from 'lucide-react';
import Link from 'next/link';

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
        <p className="text-slate-600">Review and approve business funding applications</p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600">Pending Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <p className="text-3xl font-bold">{stats.pending}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600">Under Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-white" />
              </div>
              <p className="text-3xl font-bold">{stats.underReview}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600">Approved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-emerald-600 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
              <p className="text-3xl font-bold">{stats.approved}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-rose-50 border-red-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600">Rejected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center">
                <XCircle className="h-6 w-6 text-white" />
              </div>
              <p className="text-3xl font-bold">{stats.rejected}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Deals */}
      <Card>
        <CardHeader>
          <CardTitle>Pending Deal Applications</CardTitle>
          <CardDescription>Review these applications for approval</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {pendingDeals.map((deal) => (
              <div
                key={deal.id}
                className="p-6 bg-white border-2 border-slate-200 rounded-xl hover:shadow-xl transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                      <Building className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{deal.businessName}</h3>
                      <p className="text-sm text-slate-600">{deal.industry}</p>
                      <p className="text-xs text-slate-500 mt-1">
                        Submitted: {new Date(deal.submittedDate).toLocaleDateString('en-ZA')}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {deal.status === 'PENDING_REVIEW' && (
                      <Badge className="bg-orange-100 text-orange-700 border-orange-300">
                        Pending Review
                      </Badge>
                    )}
                    {deal.status === 'UNDER_REVIEW' && (
                      <Badge className="bg-blue-100 text-blue-700 border-blue-300">
                        Under Review
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4 mb-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-xs text-slate-600 mb-1">Funding Amount</p>
                    <p className="text-2xl font-bold">R{deal.amount.toLocaleString()}</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <p className="text-xs text-slate-600 mb-1">Revenue Share</p>
                    <p className="text-2xl font-bold">{deal.revenueShare}%</p>
                  </div>
                  <div className="bg-emerald-50 p-4 rounded-lg">
                    <p className="text-xs text-slate-600 mb-1">Repayment Cap</p>
                    <p className="text-2xl font-bold">R{(deal.amount * 1.7).toLocaleString()}</p>
                  </div>
                </div>

                <div className="flex items-center gap-6 mb-4">
                  <div className="flex items-center gap-2">
                    {deal.documentsComplete ? (
                      <>
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <span className="text-sm font-medium text-green-700">Documents Complete</span>
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="h-5 w-5 text-orange-600" />
                        <span className="text-sm font-medium text-orange-700">Documents Pending</span>
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {deal.kycVerified ? (
                      <>
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <span className="text-sm font-medium text-green-700">KYC Verified</span>
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="h-5 w-5 text-orange-600" />
                        <span className="text-sm font-medium text-orange-700">KYC Pending</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button variant="default" className="bg-green-600 hover:bg-green-700">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve Deal
                  </Button>
                  <Button variant="destructive">
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                  <Button variant="outline">
                    <FileText className="h-4 w-4 mr-2" />
                    View Documents
                  </Button>
                  <Link href={`/admin/deals/${deal.id}`}>
                    <Button variant="ghost">Full Review</Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
