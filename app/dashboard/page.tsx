import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { TrendingUp, Wallet, DollarSign, Activity } from 'lucide-react';

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
                  {stats.totalReturns > 0 ? '+' : ''}{((stats.totalReturns / (stats.totalInvested || 1)) * 100).toFixed(1)}% ROI
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

    const totalInvested = investments.reduce((sum, inv) => sum + Number(inv.amount), 0);
    const totalReturns = investments.reduce((sum, inv) => sum + Number(inv.totalReceived), 0);

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

    const totalRaised = deals.reduce((sum, deal) => sum + Number(deal.currentFunding), 0);
    const totalRepaid = deals.reduce((sum, deal) => sum + Number(deal.totalRepaid), 0);
    const investorCount = deals.reduce((sum, deal) => sum + deal._count.investments, 0);
    const activeDeals = deals.filter(d => ['ACTIVE', 'FUNDED', 'REPAYING'].includes(d.status)).length;

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
