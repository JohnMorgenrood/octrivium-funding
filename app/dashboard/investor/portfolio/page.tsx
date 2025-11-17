import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, DollarSign, PieChart, Building2, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import Link from 'next/link';

export default async function PortfolioPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'INVESTOR') {
    redirect('/login');
  }

  const investments = [
    {
      id: 1,
      businessName: 'Green Energy Solutions',
      amount: 50000,
      currentValue: 62500,
      paidOut: 12500,
      remaining: 72500,
      revenueShare: 2.5,
      status: 'Active',
      industry: 'Renewable Energy',
      progress: 14.7,
      monthlyReturn: 1250,
      trend: 'up',
    },
    {
      id: 2,
      businessName: 'Cape Town Coffee Co.',
      amount: 35000,
      currentValue: 43750,
      paidOut: 8750,
      remaining: 50750,
      revenueShare: 1.75,
      status: 'Active',
      industry: 'Food & Beverage',
      progress: 14.7,
      monthlyReturn: 875,
      trend: 'up',
    },
    {
      id: 3,
      businessName: 'Tech Innovators SA',
      amount: 75000,
      currentValue: 93750,
      paidOut: 18750,
      remaining: 108750,
      revenueShare: 3.75,
      status: 'Active',
      industry: 'Technology',
      progress: 14.7,
      monthlyReturn: 1875,
      trend: 'down',
    },
  ];

  const totalInvested = investments.reduce((sum, inv) => sum + inv.amount, 0);
  const totalReturns = investments.reduce((sum, inv) => sum + inv.paidOut, 0);
  const totalValue = investments.reduce((sum, inv) => sum + inv.currentValue, 0);
  const monthlyIncome = investments.reduce((sum, inv) => sum + inv.monthlyReturn, 0);

  const overallROI = ((totalReturns / totalInvested) * 100).toFixed(1);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Portfolio Analytics
        </h1>
        <p className="text-slate-600">Track your investments and returns</p>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600">Total Invested</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-3xl font-bold">R{(totalInvested / 1000).toFixed(0)}K</p>
                <p className="text-xs text-slate-600">{investments.length} investments</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600">Total Returns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-emerald-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-3xl font-bold">R{(totalReturns / 1000).toFixed(0)}K</p>
                <p className="text-xs text-emerald-600 font-medium">+{overallROI}% ROI</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600">Portfolio Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                <PieChart className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-3xl font-bold">R{(totalValue / 1000).toFixed(0)}K</p>
                <p className="text-xs text-purple-600 font-medium">+{((totalValue - totalInvested) / totalInvested * 100).toFixed(1)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600">Monthly Income</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-3xl font-bold">R{(monthlyIncome / 1000).toFixed(1)}K</p>
                <p className="text-xs text-slate-600">Avg per month</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Chart Placeholder */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Portfolio Performance</CardTitle>
          <CardDescription>Your returns over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg flex items-center justify-center border-2 border-dashed border-blue-200">
            <div className="text-center">
              <TrendingUp className="h-12 w-12 text-blue-400 mx-auto mb-3" />
              <p className="text-slate-600 font-medium">Performance chart coming soon</p>
              <p className="text-sm text-slate-500">Track your returns month by month</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Industry Breakdown */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Industry Breakdown</CardTitle>
            <CardDescription>Your investment diversification</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Renewable Energy</span>
                  <span className="text-sm text-slate-600">31.3%</span>
                </div>
                <Progress value={31.3} className="h-2 bg-blue-100" />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Technology</span>
                  <span className="text-sm text-slate-600">46.9%</span>
                </div>
                <Progress value={46.9} className="h-2 bg-purple-100" />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Food & Beverage</span>
                  <span className="text-sm text-slate-600">21.9%</span>
                </div>
                <Progress value={21.9} className="h-2 bg-emerald-100" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Risk Distribution</CardTitle>
            <CardDescription>Investment risk profile</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Low Risk</span>
                  <span className="text-sm text-slate-600">40%</span>
                </div>
                <Progress value={40} className="h-2 bg-green-100" />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Medium Risk</span>
                  <span className="text-sm text-slate-600">45%</span>
                </div>
                <Progress value={45} className="h-2 bg-orange-100" />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">High Risk</span>
                  <span className="text-sm text-slate-600">15%</span>
                </div>
                <Progress value={15} className="h-2 bg-red-100" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Investments */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Active Investments</CardTitle>
              <CardDescription>Your current portfolio holdings</CardDescription>
            </div>
            <Link href="/deals">
              <Button>Browse More Deals</Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {investments.map((investment) => (
              <div
                key={investment.id}
                className="p-6 bg-white border-2 border-slate-200 rounded-xl hover:shadow-xl transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                      <Building2 className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{investment.businessName}</h3>
                      <p className="text-sm text-slate-600">{investment.industry}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full font-medium">
                          {investment.status}
                        </span>
                        {investment.trend === 'up' ? (
                          <span className="flex items-center text-xs text-green-600 font-medium">
                            <ArrowUpRight className="h-3 w-3" />
                            Growing
                          </span>
                        ) : (
                          <span className="flex items-center text-xs text-red-600 font-medium">
                            <ArrowDownRight className="h-3 w-3" />
                            Declining
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-4 gap-4 mb-4">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-xs text-slate-600 mb-1">Invested</p>
                    <p className="text-lg font-bold">R{investment.amount.toLocaleString()}</p>
                  </div>
                  <div className="bg-emerald-50 p-3 rounded-lg">
                    <p className="text-xs text-slate-600 mb-1">Current Value</p>
                    <p className="text-lg font-bold text-emerald-700">R{investment.currentValue.toLocaleString()}</p>
                  </div>
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <p className="text-xs text-slate-600 mb-1">Total Returns</p>
                    <p className="text-lg font-bold text-purple-700">R{investment.paidOut.toLocaleString()}</p>
                  </div>
                  <div className="bg-orange-50 p-3 rounded-lg">
                    <p className="text-xs text-slate-600 mb-1">Monthly Income</p>
                    <p className="text-lg font-bold text-orange-700">R{investment.monthlyReturn.toLocaleString()}</p>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-600">Repayment Progress</span>
                    <span className="font-semibold">{investment.progress}%</span>
                  </div>
                  <Progress value={investment.progress} className="h-2" />
                  <p className="text-xs text-slate-500 mt-1">
                    R{investment.remaining.toLocaleString()} remaining until 1.7× cap
                  </p>
                </div>

                <div className="flex gap-3">
                  <Link href={`/deals/${investment.id}`}>
                    <Button variant="outline" size="sm">View Details</Button>
                  </Link>
                  <Button variant="ghost" size="sm">Payment History</Button>
                  <Button variant="ghost" size="sm">Revenue Reports</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
