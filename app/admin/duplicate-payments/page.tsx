'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, Loader2, RefreshCw, DollarSign, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

export default function DuplicatePaymentsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [duplicates, setDuplicates] = useState<any[]>([]);
  const [processing, setProcessing] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session || (session.user as any).role !== 'ADMIN') {
      router.push('/dashboard');
      return;
    }

    fetchDuplicates();
  }, [session, status, router]);

  const fetchDuplicates = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/duplicate-payments');
      if (response.ok) {
        const data = await response.json();
        setDuplicates(data.duplicates);
      }
    } catch (error) {
      console.error('Error fetching duplicates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefund = async (transaction: any) => {
    if (!confirm('Are you sure you want to process this refund? This action cannot be undone.')) {
      return;
    }

    setProcessing(transaction.id);

    try {
      // Extract invoice ID from reference
      const invoiceNumber = transaction.reference.replace('DUPLICATE-PAYMENT-INV-', '');
      
      // Get invoice by invoice number
      const invoiceResponse = await fetch(`/api/admin/invoice-by-number?number=${invoiceNumber}`);
      if (!invoiceResponse.ok) {
        throw new Error('Invoice not found');
      }
      
      const invoiceData = await invoiceResponse.json();
      const invoiceId = invoiceData.invoice.id;

      // Process refund
      const response = await fetch(`/api/invoices/${invoiceId}/refund`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reason: 'Duplicate payment - automatic refund',
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: 'Refund Processed',
          description: `Successfully refunded R${Math.abs(transaction.amount).toFixed(2)} for invoice ${invoiceNumber}`,
        });
        fetchDuplicates(); // Refresh list
      } else {
        throw new Error(data.error || 'Refund failed');
      }
    } catch (error) {
      console.error('Refund error:', error);
      toast({
        title: 'Refund Failed',
        description: error instanceof Error ? error.message : 'Failed to process refund',
        variant: 'destructive',
      });
    } finally {
      setProcessing(null);
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
    }).format(Math.abs(amount));
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <AlertTriangle className="h-8 w-8 text-orange-600" />
            Duplicate Payments
          </h1>
          <p className="text-muted-foreground mt-1">
            Monitor and process refunds for duplicate payments
          </p>
        </div>
        <Button onClick={fetchDuplicates} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {duplicates.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <div className="flex flex-col items-center gap-2">
              <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                <AlertCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold">No Duplicate Payments</h3>
              <p className="text-muted-foreground">
                All payments are processing correctly. No duplicates detected.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-600" />
                {duplicates.length} Duplicate Payment{duplicates.length !== 1 ? 's' : ''} Detected
              </CardTitle>
              <CardDescription>
                These payments require manual review and refund processing
              </CardDescription>
            </CardHeader>
          </Card>

          {duplicates.map((duplicate) => (
            <Card key={duplicate.id} className="border-orange-200">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-2">
                      <Badge variant="destructive">Duplicate Payment</Badge>
                      {duplicate.status === 'PENDING' && (
                        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                          Awaiting Refund
                        </Badge>
                      )}
                      {duplicate.status === 'COMPLETED' && (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          Refunded
                        </Badge>
                      )}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Invoice</p>
                        <p className="font-semibold">{duplicate.reference.replace('DUPLICATE-PAYMENT-INV-', '')}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Amount</p>
                        <p className="font-semibold text-red-600">{formatCurrency(duplicate.amount)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">User</p>
                        <p className="font-semibold">
                          {duplicate.wallet?.user?.firstName} {duplicate.wallet?.user?.lastName}
                        </p>
                        <p className="text-xs text-muted-foreground">{duplicate.wallet?.user?.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Detected</p>
                        <p className="font-semibold">{new Date(duplicate.createdAt).toLocaleDateString()}</p>
                        <p className="text-xs text-muted-foreground">{new Date(duplicate.createdAt).toLocaleTimeString()}</p>
                      </div>
                    </div>

                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                      <p className="text-sm text-orange-800">
                        <strong>⚠️ Action Required:</strong> {duplicate.description}
                      </p>
                    </div>
                  </div>

                  {duplicate.status === 'PENDING' && (
                    <div className="ml-4">
                      <Button
                        onClick={() => handleRefund(duplicate)}
                        disabled={processing === duplicate.id}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        {processing === duplicate.id ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <DollarSign className="h-4 w-4 mr-2" />
                            Process Refund
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
