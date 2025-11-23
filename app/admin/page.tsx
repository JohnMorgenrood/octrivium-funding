'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Users, TrendingUp, FileText, CreditCard, Loader2, Search, Crown, Shield, AlertTriangle, BarChart3, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

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
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between gap-3"
      >
        <div className="flex items-center gap-3">
          <motion.div
            whileHover={{ rotate: 360, scale: 1.1 }}
            transition={{ duration: 0.5 }}
            className="h-12 w-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center shadow-lg"
          >
            <Crown className="h-6 w-6 text-white" />
          </motion.div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            <p className="text-sm text-muted-foreground">Platform overview and user management</p>
          </div>
        </div>
        <Link href="/admin/duplicate-payments">
          <Button variant="outline" className="flex items-center gap-2 glass-card-light dark:glass-card-dark border-white/50 dark:border-slate-700/50 hover:scale-105 transition-transform">
            <AlertTriangle className="h-4 w-4" />
            <span className="hidden sm:inline">Duplicate Payments</span>
          </Button>
        </Link>
      </motion.div>

      {/* Stats Overview */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0, duration: 0.5 }}
          whileHover={{ y: -5, scale: 1.02 }}
        >
          <Card className="glass-card-light dark:glass-card-dark border-none overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }}>
                <Users className="h-5 w-5 text-blue-500" />
              </motion.div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                {userStats?.totalUsers || 0}
              </div>
              <div className="flex gap-2 mt-2 flex-wrap">
                <Badge variant="secondary" className="text-xs">
                  {userStats?.freeUsers || 0} Free
                </Badge>
                <Badge variant="secondary" className="text-xs bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300">
                  {userStats?.starterUsers || 0} Starter
                </Badge>
                <Badge variant="secondary" className="text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300">
                  {userStats?.businessUsers || 0} Business
                </Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          whileHover={{ y: -5, scale: 1.02 }}
        >
          <Card className="glass-card-light dark:glass-card-dark border-none overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
              <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }}>
                <TrendingUp className="h-5 w-5 text-green-500" />
              </motion.div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                {formatCurrency(stats?.revenue?.monthly || 0)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">From active subscriptions</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          whileHover={{ y: -5, scale: 1.02 }}
        >
          <Card className="glass-card-light dark:glass-card-dark border-none overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-amber-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-medium">Total Invoices</CardTitle>
              <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }}>
                <FileText className="h-5 w-5 text-orange-500" />
              </motion.div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                {stats?.invoices?.total || 0}
              </div>
              <div className="flex gap-2 mt-2">
                <Badge variant="secondary" className="text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300">
                  {stats?.invoices?.paid || 0} Paid
                </Badge>
                <Badge variant="secondary" className="text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300">
                  {stats?.invoices?.pending || 0} Pending
                </Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          whileHover={{ y: -5, scale: 1.02 }}
        >
          <Card className="glass-card-light dark:glass-card-dark border-none overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-medium">Active Subs</CardTitle>
              <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }}>
                <CreditCard className="h-5 w-5 text-purple-500" />
              </motion.div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {stats?.subscriptions?.active || 0}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {stats?.subscriptions?.byTier?.starter || 0} starter, {stats?.subscriptions?.byTier?.business || 0} business
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent Subscriptions */}
      {stats?.subscriptions?.recent && stats.subscriptions.recent.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <Card className="glass-card-light dark:glass-card-dark border-none overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20">
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                Recent Subscriptions
              </CardTitle>
              <CardDescription>Latest subscription upgrades</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-2">
                {stats.subscriptions.recent.map((sub: any, index: number) => (
                  <motion.div
                    key={sub.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.05 }}
                    whileHover={{ x: 5, scale: 1.01 }}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors glass-card-light dark:glass-card-dark"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900 dark:to-blue-900 rounded-full flex items-center justify-center">
                        <span className="text-sm font-semibold text-purple-700 dark:text-purple-300">
                          {sub.user.firstName?.charAt(0)}{sub.user.lastName?.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">{sub.user.firstName} {sub.user.lastName}</p>
                        <p className="text-sm text-muted-foreground">{sub.user.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={sub.tier === 'STARTER' ? 'bg-purple-500 hover:bg-purple-600' : 'bg-green-500 hover:bg-green-600'}>
                        {sub.tier}
                      </Badge>
                      <p className="text-sm font-medium mt-1">{formatCurrency(Number(sub.amount))}/mo</p>
                      <p className="text-xs text-muted-foreground">{new Date(sub.createdAt).toLocaleDateString()}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* All Users */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <Card className="glass-card-light dark:glass-card-dark border-none overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
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
                className="pl-10 glass-card-light dark:glass-card-dark border-white/50 dark:border-slate-700/50"
              />
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {filteredUsers.map((user: any, index: number) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.02 }}
                  whileHover={{ x: 5, scale: 1.01 }}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors gap-3 glass-card-light dark:glass-card-dark"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className="h-12 w-12 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-lg font-semibold text-blue-700 dark:text-blue-300">
                        {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-medium">{user.firstName} {user.lastName}</p>
                        {user.role === 'ADMIN' && (
                          <Badge variant="secondary" className="bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300">
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
                      user.subscriptionTier === 'FREE' ? 'bg-gray-500 hover:bg-gray-600' :
                      user.subscriptionTier === 'STARTER' ? 'bg-purple-500 hover:bg-purple-600' :
                      'bg-green-500 hover:bg-green-600'
                    }`}>
                      {user.subscriptionTier}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {user.subscriptionStatus || 'ACTIVE'}
                    </Badge>
                  </div>
                </motion.div>
              ))}
              {filteredUsers.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12"
                >
                  <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-20" />
                  <p className="text-muted-foreground">No users found</p>
                </motion.div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
