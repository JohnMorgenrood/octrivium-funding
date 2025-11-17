'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Building2, 
  Landmark, 
  FileText, 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  RefreshCw,
  Upload,
  TrendingUp,
  Calendar,
  DollarSign,
  Users,
  Download
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

interface RevenueConnection {
  id: string;
  sourceType: 'BANK_FEED' | 'ACCOUNTING' | 'MANUAL_UPLOAD';
  provider?: string;
  accountName?: string;
  isConnected: boolean;
  status: string;
  lastSyncAt?: string;
  lastSyncStatus?: string;
  connectedAt?: string;
}

interface RevenueRecord {
  id: string;
  month: string;
  totalRevenue: number;
  revenueShareAmount: number;
  status: string;
  hasDiscrepancy: boolean;
  payoutScheduled: boolean;
  payoutCompletedAt?: string;
}

interface PayoutSchedule {
  id: string;
  month: string;
  totalRevenue: number;
  revenueShareAmount: number;
  platformFee: number;
  netPayoutAmount: number;
  status: string;
  scheduledDate: string;
  processedDate?: string;
  investorCount: number;
}

export default function RevenueVerificationPage() {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [connections, setConnections] = useState<RevenueConnection[]>([]);
  const [revenueRecords, setRevenueRecords] = useState<RevenueRecord[]>([]);
  const [payoutSchedules, setPayoutSchedules] = useState<PayoutSchedule[]>([]);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    if (session?.user) {
      loadData();
    }
  }, [session]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load revenue connections
      const connectionsRes = await fetch('/api/revenue/connections');
      const connectionsData = await connectionsRes.json();
      setConnections(connectionsData.connections || []);

      // Load revenue records
      const recordsRes = await fetch('/api/revenue/records');
      const recordsData = await recordsRes.json();
      setRevenueRecords(recordsData.records || []);

      // Load payout schedules
      const payoutsRes = await fetch('/api/revenue/payouts');
      const payoutsData = await payoutsRes.json();
      setPayoutSchedules(payoutsData.payouts || []);
    } catch (error) {
      console.error('Failed to load data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load revenue data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleConnectBank = async () => {
    try {
      const res = await fetch('/api/integrations/stitch/connect');
      const data = await res.json();
      
      if (data.authUrl) {
        window.location.href = data.authUrl;
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to initiate bank connection',
        variant: 'destructive',
      });
    }
  };

  const handleConnectAccounting = async (provider: string) => {
    try {
      const res = await fetch(`/api/integrations/accounting/connect?provider=${provider}`);
      const data = await res.json();
      
      if (data.authUrl) {
        window.location.href = data.authUrl;
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to connect ${provider}`,
        variant: 'destructive',
      });
    }
  };

  const handleManualSync = async () => {
    try {
      setSyncing(true);
      const res = await fetch('/api/revenue/sync', { method: 'POST' });
      const data = await res.json();
      
      if (data.success) {
        toast({
          title: 'Success',
          description: 'Revenue data synced successfully',
        });
        loadData();
      } else {
        throw new Error(data.error);
      }
    } catch (error: any) {
      toast({
        title: 'Sync Failed',
        description: error.message || 'Failed to sync revenue data',
        variant: 'destructive',
      });
    } finally {
      setSyncing(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'VERIFIED':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'FLAGGED':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'FAILED':
      case 'DISCONNECTED':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <RefreshCw className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      VERIFIED: 'default',
      PENDING: 'secondary',
      FLAGGED: 'destructive',
      FAILED: 'destructive',
      SCHEDULED: 'secondary',
      COMPLETED: 'default',
    };

    return <Badge variant={variants[status] || 'outline'}>{status}</Badge>;
  };

  const bankConnection = connections.find(c => c.sourceType === 'BANK_FEED');
  const accountingConnection = connections.find(c => c.sourceType === 'ACCOUNTING');

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Revenue Verification</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Connect your bank account and accounting software for automatic revenue verification
        </p>
      </div>

      {/* Connection Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Bank Connection */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Landmark className="w-5 h-5" />
                <CardTitle className="text-lg">Bank Account</CardTitle>
              </div>
              {bankConnection && getStatusIcon(bankConnection.status)}
            </div>
            <CardDescription>Via Stitch Open Banking</CardDescription>
          </CardHeader>
          <CardContent>
            {bankConnection?.isConnected ? (
              <div className="space-y-2">
                <p className="text-sm font-medium">{bankConnection.accountName}</p>
                <p className="text-xs text-gray-500">
                  Last synced: {bankConnection.lastSyncAt 
                    ? new Date(bankConnection.lastSyncAt).toLocaleDateString()
                    : 'Never'}
                </p>
                {getStatusBadge(bankConnection.status)}
              </div>
            ) : (
              <Button onClick={handleConnectBank} className="w-full">
                <Landmark className="w-4 h-4 mr-2" />
                Connect Bank
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Accounting Software */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                <CardTitle className="text-lg">Accounting Software</CardTitle>
              </div>
              {accountingConnection && getStatusIcon(accountingConnection.status)}
            </div>
            <CardDescription>Sage, Xero, QuickBooks, Zoho</CardDescription>
          </CardHeader>
          <CardContent>
            {accountingConnection?.isConnected ? (
              <div className="space-y-2">
                <p className="text-sm font-medium">
                  {accountingConnection.provider?.replace('_', ' ')}
                </p>
                <p className="text-xs text-gray-500">
                  {accountingConnection.accountName}
                </p>
                <p className="text-xs text-gray-500">
                  Last synced: {accountingConnection.lastSyncAt 
                    ? new Date(accountingConnection.lastSyncAt).toLocaleDateString()
                    : 'Never'}
                </p>
                {getStatusBadge(accountingConnection.status)}
              </div>
            ) : (
              <div className="space-y-2">
                <Button onClick={() => handleConnectAccounting('XERO')} variant="outline" className="w-full">
                  Connect Xero
                </Button>
                <Button onClick={() => handleConnectAccounting('SAGE_BUSINESS_CLOUD')} variant="outline" className="w-full">
                  Connect Sage
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Manual Upload */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              <CardTitle className="text-lg">Manual Upload</CardTitle>
            </div>
            <CardDescription>Upload bank statements or reports</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/revenue/upload">
              <Button variant="outline" className="w-full">
                <Upload className="w-4 h-4 mr-2" />
                Upload Documents
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Sync Button */}
      {(bankConnection?.isConnected || accountingConnection?.isConnected) && (
        <div className="mb-6">
          <Button onClick={handleManualSync} disabled={syncing}>
            <RefreshCw className={`w-4 h-4 mr-2 ${syncing ? 'animate-spin' : ''}`} />
            {syncing ? 'Syncing...' : 'Sync Now'}
          </Button>
        </div>
      )}

      {/* Tabs */}
      <Tabs defaultValue="revenue" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="revenue">Revenue History</TabsTrigger>
          <TabsTrigger value="payouts">Payout Schedule</TabsTrigger>
        </TabsList>

        {/* Revenue History Tab */}
        <TabsContent value="revenue">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Revenue Records</CardTitle>
              <CardDescription>
                Verified revenue data from connected sources
              </CardDescription>
            </CardHeader>
            <CardContent>
              {revenueRecords.length === 0 ? (
                <p className="text-center text-gray-500 py-8">
                  No revenue records yet. Connect your accounts to start tracking.
                </p>
              ) : (
                <div className="space-y-4">
                  {revenueRecords.map((record) => (
                    <div key={record.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <Calendar className="w-10 h-10 text-blue-600" />
                        <div>
                          <p className="font-medium">
                            {new Date(record.month).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'long' 
                            })}
                          </p>
                          <p className="text-sm text-gray-500">
                            Revenue: R{record.totalRevenue.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm font-medium">Share Amount</p>
                          <p className="text-lg font-bold text-blue-600">
                            R{record.revenueShareAmount.toLocaleString()}
                          </p>
                        </div>
                        {getStatusBadge(record.status)}
                        {record.hasDiscrepancy && (
                          <AlertTriangle className="w-5 h-5 text-yellow-500" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payouts Tab */}
        <TabsContent value="payouts">
          <Card>
            <CardHeader>
              <CardTitle>Payout Schedule</CardTitle>
              <CardDescription>
                Scheduled and completed investor payouts
              </CardDescription>
            </CardHeader>
            <CardContent>
              {payoutSchedules.length === 0 ? (
                <p className="text-center text-gray-500 py-8">
                  No payouts scheduled yet
                </p>
              ) : (
                <div className="space-y-4">
                  {payoutSchedules.map((payout) => (
                    <div key={payout.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="font-medium">
                            {new Date(payout.month).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'long' 
                            })}
                          </p>
                          <p className="text-sm text-gray-500">
                            Scheduled: {new Date(payout.scheduledDate).toLocaleDateString()}
                          </p>
                        </div>
                        {getStatusBadge(payout.status)}
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Revenue</p>
                          <p className="font-medium">R{payout.totalRevenue.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Revenue Share</p>
                          <p className="font-medium">R{payout.revenueShareAmount.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Platform Fee</p>
                          <p className="font-medium">R{payout.platformFee.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Net Payout</p>
                          <p className="font-medium text-green-600">R{payout.netPayoutAmount.toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="mt-3 flex items-center text-sm text-gray-500">
                        <Users className="w-4 h-4 mr-1" />
                        {payout.investorCount} investor{payout.investorCount !== 1 ? 's' : ''}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
