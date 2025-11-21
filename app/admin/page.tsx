'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Users, TrendingUp, FileText, CreditCard, Loader2, Search, Crown, Shield } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [userStats, setUserStats] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');

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

  const filteredUsers = users.filter((user) =>
    user.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
          <Crown className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-sm text-muted-foreground">Platform overview and user management</p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{userStats?.totalUsers || 0}</div>
            <div className="flex gap-2 mt-2 flex-wrap">
              <Badge variant="secondary" className="text-xs">
                {userStats?.freeUsers || 0} Free
              </Badge>
              <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-700">
                {userStats?.starterUsers || 0} Starter
              </Badge>
              <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                {userStats?.businessUsers || 0} Business
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <TrendingUp className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {formatCurrency(stats?.revenue?.monthly || 0)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">From active subscriptions</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Invoices</CardTitle>
            <FileText className="h-5 w-5 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats?.invoices?.total || 0}</div>
            <div className="flex gap-2 mt-2">
              <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                {stats?.invoices?.paid || 0} Paid
              </Badge>
              <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-700">
                {stats?.invoices?.pending || 0} Pending
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Subs</CardTitle>
            <CreditCard className="h-5 w-5 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats?.subscriptions?.active || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats?.subscriptions?.byTier?.starter || 0} starter, {stats?.subscriptions?.byTier?.business || 0} business
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Subscriptions */}
      {stats?.subscriptions?.recent && stats.subscriptions.recent.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Recent Subscriptions
            </CardTitle>
            <CardDescription>Latest subscription upgrades</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {stats.subscriptions.recent.map((sub: any) => (
                <div key={sub.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-semibold text-purple-700">
                        {sub.user.firstName?.charAt(0)}{sub.user.lastName?.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{sub.user.firstName} {sub.user.lastName}</p>
                      <p className="text-sm text-muted-foreground">{sub.user.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className={sub.tier === 'STARTER' ? 'bg-purple-500' : 'bg-green-500'}>
                      {sub.tier}
                    </Badge>
                    <p className="text-sm font-medium mt-1">{formatCurrency(Number(sub.amount))}/mo</p>
                    <p className="text-xs text-muted-foreground">{new Date(sub.createdAt).toLocaleDateString()}</p>
                  </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      )}

      {/* All Users */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                All Users
              </CardTitle>
              <CardDescription>Manage user accounts and subscriptions</CardDescription>
            </div>
          </div>
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {filteredUsers.map((user: any) => (
              <div key={user.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors gap-3">
                <div className="flex items-center gap-3 flex-1">
                  <div className="h-12 w-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-lg font-semibold text-blue-700">
                      {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium">{user.firstName} {user.lastName}</p>
                      {user.role === 'ADMIN' && (
                        <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">
                          <Shield className="h-3 w-3 mr-1" />
                          Admin
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {user.invoices?.length || 0} invoices created • Joined {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 sm:flex-shrink-0">
                  <Badge className={`${
                    user.subscriptionTier === 'FREE' ? 'bg-gray-500' :
                    user.subscriptionTier === 'STARTER' ? 'bg-purple-500' :
                    'bg-green-500'
                  }`}>
                    {user.subscriptionTier}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {user.subscriptionStatus || 'ACTIVE'}
                  </Badge>
                </div>
              </div>
            ))}
            {filteredUsers.length === 0 && (
              <div className="text-center py-12">
                <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-20" />
                <p className="text-muted-foreground">No users found</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
