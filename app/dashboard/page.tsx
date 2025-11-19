import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';
import { TrendingUp, Wallet, DollarSign, Activity, Shield, AlertCircle, CheckCircle2, FileText, Lock, Eye } from 'lucide-react';
import Link from 'next/link';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  // Fetch user-specific data based on role
  const stats = await getDashboardStats(session.user.id, session.user.role);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Welcome back, {session.user.name?.split(' ')[0]}!</h1>
        <p className="text-muted-foreground">
          {session.user.role === 'INVESTOR' && "Track your investments and discover new opportunities"}
          {session.user.role === 'BUSINESS' && "Manage your deals and monitor revenue"}
          {session.user.role === 'ADMIN' && "Oversee platform operations and approvals"}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {session.user.role === 'INVESTOR' && (
          <>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Invested</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(stats.totalInvested || 0)}</div>
                <p className="text-xs text-muted-foreground">Across {stats.activeInvestments || 0} deals</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Returns</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(stats.totalReturns || 0)}</div>
                <p className="text-xs text-muted-foreground">
                  {(stats.totalReturns || 0) > 0 ? '+' : ''}{(((stats.totalReturns || 0) / (stats.totalInvested || 1)) * 100).toFixed(1)}% ROI
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Wallet Balance</CardTitle>
                <Wallet className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(stats.walletBalance || 0)}</div>
                <p className="text-xs text-muted-foreground">Available to invest</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Investments</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.activeInvestments || 0}</div>
                <p className="text-xs text-muted-foreground">Currently funding businesses</p>
              </CardContent>
            </Card>
          </>
        )}

        {session.user.role === 'BUSINESS' && (
          <>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Raised</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(stats.totalRaised || 0)}</div>
                <p className="text-xs text-muted-foreground">From {stats.investorCount || 0} investors</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(stats.monthlyRevenue || 0)}</div>
                <p className="text-xs text-muted-foreground">Last month reported</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Repaid</CardTitle>
                <Wallet className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(stats.totalRepaid || 0)}</div>
                <p className="text-xs text-muted-foreground">To investors so far</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Deals</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.activeDeals || 0}</div>
                <p className="text-xs text-muted-foreground">Currently active</p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Activity className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No recent activity to display</p>
          </div>
        </CardContent>
      </Card>

      {/* AML & FICA Compliance Section */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* AML Compliance Card */}
        <Card className="relative overflow-hidden border-2 border-blue-500/20 dark:border-blue-400/20">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl"></div>
          <CardHeader className="relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl shadow-lg">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl">AML Compliance</CardTitle>
                  <p className="text-sm text-muted-foreground">Anti-Money Laundering</p>
                </div>
              </div>
              <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Verified
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="relative z-10 space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-sm">Identity Verification</h4>
                  <p className="text-xs text-muted-foreground">Government ID verified and approved</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-sm">Source of Funds</h4>
                  <p className="text-xs text-muted-foreground">Banking details validated</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-sm">Risk Assessment</h4>
                  <p className="text-xs text-muted-foreground">Profile assessed as low-risk</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-4 border-t">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Lock className="h-3 w-3" />
                <span>Last reviewed: Today</span>
              </div>
              <Link href="/dashboard/kyc">
                <Button variant="outline" size="sm" className="text-xs">
                  <Eye className="h-3 w-3 mr-1" />
                  View Details
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* FICA Compliance Card */}
        <Card className="relative overflow-hidden border-2 border-purple-500/20 dark:border-purple-400/20">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-3xl"></div>
          <CardHeader className="relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-lg">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl">FICA Compliance</CardTitle>
                  <p className="text-sm text-muted-foreground">Financial Intelligence Centre Act</p>
                </div>
              </div>
              <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Compliant
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="relative z-10 space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-sm">Customer Due Diligence</h4>
                  <p className="text-xs text-muted-foreground">CDD requirements fulfilled</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-sm">Proof of Address</h4>
                  <p className="text-xs text-muted-foreground">Residential address confirmed</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-sm">Beneficial Ownership</h4>
                  <p className="text-xs text-muted-foreground">Ultimate beneficial owner identified</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-4 border-t">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Lock className="h-3 w-3" />
                <span>Compliance valid until: Dec 2025</span>
              </div>
              <Link href="/dashboard/kyc">
                <Button variant="outline" size="sm" className="text-xs">
                  <Eye className="h-3 w-3 mr-1" />
                  View Details
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Regulatory Notice */}
      <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border-amber-200 dark:border-amber-800">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-amber-500 rounded-lg flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-amber-900 dark:text-amber-100 mb-2">
                Regulatory Compliance Information
              </h3>
              <p className="text-sm text-amber-800 dark:text-amber-200 leading-relaxed mb-3">
                Octrivium operates under strict compliance with South African financial regulations including the Financial Intelligence Centre Act (FICA) and Anti-Money Laundering (AML) requirements. Your information is securely stored and used solely for regulatory compliance purposes.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="bg-white/50 dark:bg-slate-900/50 text-xs">
                  <Shield className="h-3 w-3 mr-1" />
                  FIC Registered
                </Badge>
                <Badge variant="outline" className="bg-white/50 dark:bg-slate-900/50 text-xs">
                  <Lock className="h-3 w-3 mr-1" />
                  Encrypted Storage
                </Badge>
                <Badge variant="outline" className="bg-white/50 dark:bg-slate-900/50 text-xs">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  POPIA Compliant
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

async function getDashboardStats(userId: string, role: string) {
  if (role === 'INVESTOR') {
    const [wallet, investments] = await Promise.all([
      prisma.wallet.findUnique({ where: { userId } }),
      prisma.investment.findMany({
        where: { userId, status: 'ACTIVE' },
      }),
    ]);

    const totalInvested = investments.reduce((sum: number, inv: any) => sum + Number(inv.amount), 0);
    const totalReturns = investments.reduce((sum: number, inv: any) => sum + Number(inv.totalReceived), 0);

    return {
      totalInvested,
      totalReturns,
      walletBalance: Number(wallet?.balance || 0),
      activeInvestments: investments.length,
    };
  }

  if (role === 'BUSINESS') {
    const business = await prisma.business.findFirst({ where: { userId } });
    
    if (!business) {
      return {
        totalRaised: 0,
        monthlyRevenue: 0,
        totalRepaid: 0,
        investorCount: 0,
        activeDeals: 0,
      };
    }

    const deals = await prisma.deal.findMany({
      where: { businessId: business.id },
      include: { _count: { select: { investments: true } } },
    });

    const totalRaised = deals.reduce((sum: number, deal: any) => sum + Number(deal.currentFunding), 0);
    const totalRepaid = deals.reduce((sum: number, deal: any) => sum + Number(deal.totalRepaid), 0);
    const investorCount = deals.reduce((sum: number, deal: any) => sum + deal._count.investments, 0);
    const activeDeals = deals.filter((d: any) => ['ACTIVE', 'FUNDED', 'REPAYING'].includes(d.status)).length;

    return {
      totalRaised,
      monthlyRevenue: Number(deals[0]?.actualMonthlyRevenue || 0),
      totalRepaid,
      investorCount,
      activeDeals,
    };
  }

  return {};
}
