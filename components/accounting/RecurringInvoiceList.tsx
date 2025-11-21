'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, Plus, Calendar, DollarSign } from 'lucide-react';
import { formatDistance } from 'date-fns';

interface RecurringInvoice {
  id: string;
  frequency: string;
  interval: number;
  nextInvoiceDate: Date;
  total: any;
  active: boolean;
  customer: { name: string };
  lastGeneratedAt: Date | null;
}

interface RecurringInvoiceListProps {
  recurring: RecurringInvoice[];
  customers: any[];
}

export default function RecurringInvoiceList({ recurring, customers }: RecurringInvoiceListProps) {
  const [loading, setLoading] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
    }).format(amount);
  };

  const getFrequencyLabel = (frequency: string, interval: number) => {
    const freq = frequency === 'MONTHLY' ? 'month' : frequency === 'ANNUALLY' ? 'year' : 'period';
    return interval === 1 ? `Every ${freq}` : `Every ${interval} ${freq}s`;
  };

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Recurring Invoices</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Auto-generate invoices on a schedule
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Template
        </Button>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Templates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recurring.filter(r => r.active).length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Monthly Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(
                recurring
                  .filter(r => r.active && r.frequency === 'MONTHLY')
                  .reduce((sum, r) => sum + Number(r.total), 0)
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Next Generation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-semibold">
              {recurring.length > 0
                ? formatDistance(new Date(recurring[0].nextInvoiceDate), new Date(), { addSuffix: true })
                : 'No schedules'}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recurring Invoice List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5" />
            Recurring Schedules
          </CardTitle>
          <CardDescription>Invoices that auto-generate on schedule</CardDescription>
        </CardHeader>
        <CardContent>
          {recurring.length === 0 ? (
            <div className="text-center py-12">
              <RefreshCw className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-20" />
              <h3 className="text-lg font-semibold mb-2">No Recurring Invoices</h3>
              <p className="text-muted-foreground mb-4">
                Set up recurring invoices for subscriptions and regular billing
              </p>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create First Template
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {recurring.map((rec) => (
                <div
                  key={rec.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors gap-3"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold">{rec.customer.name}</h4>
                      {rec.active ? (
                        <Badge className="bg-green-500">Active</Badge>
                      ) : (
                        <Badge variant="secondary">Paused</Badge>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <RefreshCw className="h-3 w-3" />
                        {getFrequencyLabel(rec.frequency, rec.interval)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Next: {new Date(rec.nextInvoiceDate).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <DollarSign className="h-3 w-3" />
                        {formatCurrency(Number(rec.total))}
                      </span>
                    </div>
                    {rec.lastGeneratedAt && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Last generated {formatDistance(new Date(rec.lastGeneratedAt), new Date(), { addSuffix: true })}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                    <Button variant="outline" size="sm">
                      {rec.active ? 'Pause' : 'Resume'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
