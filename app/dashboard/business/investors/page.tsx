import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Users, Mail, TrendingUp, DollarSign, Search } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export default async function InvestorsPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'BUSINESS') {
    redirect('/login');
  }

  const investors = [
    {
      id: 1,
      name: 'Sarah Thompson',
      email: 's.thompson@email.com',
      investment: 50000,
      share: 2.5,
      paidOut: 12500,
      remaining: 72500,
      joinDate: '2024-03-15',
      status: 'Active',
    },
    {
      id: 2,
      name: 'John Matthews',
      email: 'j.matthews@email.com',
      investment: 35000,
      share: 1.75,
      paidOut: 8750,
      remaining: 50750,
      joinDate: '2024-04-22',
      status: 'Active',
    },
    {
      id: 3,
      name: 'Linda Nkosi',
      email: 'l.nkosi@email.com',
      investment: 75000,
      share: 3.75,
      paidOut: 18750,
      remaining: 108750,
      joinDate: '2024-02-10',
      status: 'Active',
    },
    {
      id: 4,
      name: 'David Chen',
      email: 'd.chen@email.com',
      investment: 25000,
      share: 1.25,
      paidOut: 6250,
      remaining: 36250,
      joinDate: '2024-05-18',
      status: 'Active',
    },
    {
      id: 5,
      name: 'Emma van der Merwe',
      email: 'e.vandermerwe@email.com',
      investment: 100000,
      share: 5.0,
      paidOut: 25000,
      remaining: 145000,
      joinDate: '2024-01-05',
      status: 'Active',
    },
  ];

  const totalInvestment = investors.reduce((sum, inv) => sum + inv.investment, 0);
  const totalPaidOut = investors.reduce((sum, inv) => sum + inv.paidOut, 0);
  const totalRemaining = investors.reduce((sum, inv) => sum + inv.remaining, 0);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Investor Management
        </h1>
        <p className="text-slate-600">Track and manage your investor relationships</p>
      </div>

      {/* Summary Stats */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600">Total Investors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-white" />
              </div>
              <p className="text-3xl font-bold">{investors.length}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600">Total Investment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-emerald-600 rounded-lg flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
              <p className="text-3xl font-bold">R{(totalInvestment / 1000).toFixed(0)}K</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600">Total Paid Out</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <p className="text-3xl font-bold">R{(totalPaidOut / 1000).toFixed(0)}K</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600">Remaining Obligation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
              <p className="text-3xl font-bold">R{(totalRemaining / 1000).toFixed(0)}K</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Investor List */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>All Investors</CardTitle>
              <CardDescription>Detailed breakdown of your investor base</CardDescription>
            </div>
            <div className="flex gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input placeholder="Search investors..." className="pl-9 w-64" />
              </div>
              <Button>
                <Mail className="h-4 w-4 mr-2" />
                Contact All
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {investors.map((investor) => {
              const progress = (investor.paidOut / (investor.paidOut + investor.remaining)) * 100;
              return (
                <div
                  key={investor.id}
                  className="p-6 bg-white border border-slate-200 rounded-xl hover:shadow-lg transition-all duration-200"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                        {investor.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">{investor.name}</h3>
                        <p className="text-sm text-slate-600">{investor.email}</p>
                        <p className="text-xs text-slate-500 mt-1">
                          Invested since {new Date(investor.joinDate).toLocaleDateString('en-ZA')}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                        {investor.status}
                      </span>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-4 gap-4 mb-4">
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-xs text-slate-600 mb-1">Investment Amount</p>
                      <p className="text-lg font-bold">R{investor.investment.toLocaleString()}</p>
                    </div>
                    <div className="bg-purple-50 p-3 rounded-lg">
                      <p className="text-xs text-slate-600 mb-1">Revenue Share</p>
                      <p className="text-lg font-bold">{investor.share}%</p>
                    </div>
                    <div className="bg-emerald-50 p-3 rounded-lg">
                      <p className="text-xs text-slate-600 mb-1">Total Paid Out</p>
                      <p className="text-lg font-bold">R{investor.paidOut.toLocaleString()}</p>
                    </div>
                    <div className="bg-orange-50 p-3 rounded-lg">
                      <p className="text-xs text-slate-600 mb-1">Remaining</p>
                      <p className="text-lg font-bold">R{investor.remaining.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-600">Repayment Progress</span>
                      <span className="font-semibold">{progress.toFixed(1)}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Mail className="h-4 w-4 mr-2" />
                      Contact
                    </Button>
                    <Button variant="ghost" size="sm">View Details</Button>
                    <Button variant="ghost" size="sm">Payment History</Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Communication */}
      <Card className="mt-8">
        <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
          <CardTitle>Investor Communications</CardTitle>
          <CardDescription className="text-indigo-100">
            Send updates and announcements to your investors
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <form className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Subject</label>
              <Input placeholder="e.g. Q4 Performance Update" />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Message</label>
              <textarea
                className="w-full h-32 px-4 py-2 border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Write your message to investors..."
              />
            </div>
            <div className="flex gap-3">
              <Button type="submit">Send to All Investors</Button>
              <Button type="button" variant="outline">Save as Draft</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
