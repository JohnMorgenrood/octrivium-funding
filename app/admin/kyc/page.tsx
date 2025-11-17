import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Clock, User, FileText, Download, Eye } from 'lucide-react';

export default async function AdminKYCPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/login');
  }

  const pendingKYC = [
    {
      id: 1,
      userId: 'user-123',
      name: 'Michael Johnson',
      email: 'm.johnson@email.com',
      type: 'INVESTOR',
      submittedDate: '2025-11-16',
      idNumber: '8705125***089',
      documents: [
        { type: 'ID Document', uploaded: true },
        { type: 'Proof of Address', uploaded: true },
        { type: 'Bank Statement', uploaded: true },
      ],
      status: 'PENDING',
      riskScore: 'LOW',
    },
    {
      id: 2,
      userId: 'user-456',
      name: 'Precious Mthembu',
      email: 'p.mthembu@email.com',
      type: 'BUSINESS',
      submittedDate: '2025-11-15',
      idNumber: '9203087***064',
      documents: [
        { type: 'ID Document', uploaded: true },
        { type: 'Company Registration', uploaded: true },
        { type: 'Tax Clearance', uploaded: false },
        { type: 'Bank Statement', uploaded: true },
      ],
      status: 'PENDING',
      riskScore: 'MEDIUM',
    },
    {
      id: 3,
      userId: 'user-789',
      name: 'Robert Williams',
      email: 'r.williams@email.com',
      type: 'INVESTOR',
      submittedDate: '2025-11-14',
      idNumber: '7809154***073',
      documents: [
        { type: 'ID Document', uploaded: true },
        { type: 'Proof of Address', uploaded: true },
        { type: 'Bank Statement', uploaded: true },
      ],
      status: 'IN_REVIEW',
      riskScore: 'LOW',
    },
  ];

  const stats = {
    pending: 15,
    approved: 342,
    rejected: 23,
    inReview: 8,
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          KYC Verification
        </h1>
        <p className="text-slate-600">Review and verify user identity documents</p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600">Pending Verification</CardTitle>
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
            <CardTitle className="text-sm font-medium text-slate-600">In Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                <Eye className="h-6 w-6 text-white" />
              </div>
              <p className="text-3xl font-bold">{stats.inReview}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600">Verified</CardTitle>
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

      {/* Pending KYC Submissions */}
      <Card>
        <CardHeader>
          <CardTitle>Pending KYC Submissions</CardTitle>
          <CardDescription>Review user identity verification documents</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {pendingKYC.map((kyc) => (
              <div
                key={kyc.id}
                className="p-6 bg-white border-2 border-slate-200 rounded-xl hover:shadow-xl transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      <User className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{kyc.name}</h3>
                      <p className="text-sm text-slate-600">{kyc.email}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <p className="text-xs text-slate-500">ID: {kyc.idNumber}</p>
                        <Badge className="bg-blue-100 text-blue-700 border-blue-300">
                          {kyc.type}
                        </Badge>
                        {kyc.riskScore === 'LOW' && (
                          <Badge className="bg-green-100 text-green-700 border-green-300">
                            Low Risk
                          </Badge>
                        )}
                        {kyc.riskScore === 'MEDIUM' && (
                          <Badge className="bg-orange-100 text-orange-700 border-orange-300">
                            Medium Risk
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {kyc.status === 'PENDING' && (
                      <Badge className="bg-orange-100 text-orange-700 border-orange-300">
                        Pending
                      </Badge>
                    )}
                    {kyc.status === 'IN_REVIEW' && (
                      <Badge className="bg-blue-100 text-blue-700 border-blue-300">
                        In Review
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm font-medium mb-3">Submitted Documents:</p>
                  <div className="grid md:grid-cols-2 gap-3">
                    {kyc.documents.map((doc, index) => (
                      <div
                        key={index}
                        className={`flex items-center justify-between p-3 rounded-lg ${
                          doc.uploaded
                            ? 'bg-green-50 border border-green-200'
                            : 'bg-red-50 border border-red-200'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <FileText
                            className={`h-5 w-5 ${
                              doc.uploaded ? 'text-green-600' : 'text-red-600'
                            }`}
                          />
                          <span className="text-sm font-medium">{doc.type}</span>
                        </div>
                        {doc.uploaded ? (
                          <div className="flex gap-1">
                            <Button size="sm" variant="ghost" className="h-8 px-2">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost" className="h-8 px-2">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <span className="text-xs text-red-600 font-medium">Missing</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-lg mb-4">
                  <h4 className="font-semibold text-sm mb-2">Verification Checklist</h4>
                  <div className="space-y-2 text-sm">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="rounded" />
                      <span>Identity document is valid and not expired</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="rounded" />
                      <span>Personal details match across documents</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="rounded" />
                      <span>Address verification is current (within 3 months)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="rounded" />
                      <span>No sanctions or watchlist matches found</span>
                    </label>
                    {kyc.type === 'BUSINESS' && (
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" className="rounded" />
                        <span>Company registration and tax compliance verified</span>
                      </label>
                    )}
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button variant="default" className="bg-green-600 hover:bg-green-700">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve KYC
                  </Button>
                  <Button variant="destructive">
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                  <Button variant="outline">Request More Info</Button>
                  <Button variant="ghost">View Full Profile</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
