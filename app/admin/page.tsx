'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, TrendingUp, FileText, CreditCard, Loader2 } from 'lucide-react';

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [userStats, setUserStats] = useState<any>(null);

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session || (session.user as any).role !== 'ADMIN') {
      router.push('/dashboard');
      return;
    }

    fetchData();
  }, [session, status, router]);

  const fetchData = async () => {
    try {
      const [statsRes, usersRes] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/admin/users'),
      ]);

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }

      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setUsers(usersData.users);
        setUserStats(usersData.stats);
      }
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!session || (session.user as any).role !== 'ADMIN') {
    return null;
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
    }).format(amount);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">Platform overview and user management</p>
      </div>

      {/* Stats Overview */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats?.totalUsers || 0}</div>
            <p className="text-xs text-muted-foreground">
              {userStats?.freeUsers} free, {userStats?.starterUsers} starter, {userStats?.businessUsers} business
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats?.revenue?.monthly || 0)}</div>
            <p className="text-xs text-muted-foreground">From subscriptions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Invoices</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.invoices?.total || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.invoices?.paid} paid, {stats?.invoices?.pending} pending
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.subscriptions?.active || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.subscriptions?.byTier?.starter} starter, {stats?.subscriptions?.byTier?.business} business
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Subscriptions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Subscriptions</CardTitle>
          <CardDescription>Latest subscription upgrades</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {stats?.subscriptions?.recent?.map((sub: any) => (
              <div key={sub.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">{sub.user.firstName} {sub.user.lastName}</p>
                  <p className="text-sm text-muted-foreground">{sub.user.email}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{sub.tier}</p>
                  <p className="text-sm text-muted-foreground">{formatCurrency(Number(sub.amount))}/month</p>
                  <p className="text-xs text-muted-foreground">{new Date(sub.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* All Users */}
      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>Manage user accounts and subscriptions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {users.map((user: any) => (
              <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">{user.firstName} {user.lastName}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                  <p className="text-xs text-muted-foreground">
                    {user.invoiceCount || 0} invoices • {user.invoices.length} total created
                  </p>
                </div>
                <div className="text-right space-y-2">
                  <div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.subscriptionTier === 'FREE' ? 'bg-gray-100 text-gray-700' :
                      user.subscriptionTier === 'STARTER' ? 'bg-purple-100 text-purple-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {user.subscriptionTier}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Joined {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
