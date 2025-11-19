'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Plus, TrendingUp, Users, Calendar, DollarSign } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface Deal {
  id: string;
  title: string;
  description: string;
  fundingGoal: number;
  currentFunding: number;
  revenueSharePercentage: number;
  status: string;
  createdAt: string;
  _count: {
    investments: number;
  };
}

export default function MyDealsPage() {
  const router = useRouter();
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDeals();
  }, []);

  const loadDeals = async () => {
    try {
      const res = await fetch('/api/deals');
      if (res.ok) {
        const data = await res.json();
        setDeals(data.deals || []);
      }
    } catch (error) {
      console.error('Failed to load deals:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'default';
      case 'FUNDED': return 'secondary';
      case 'CLOSED': return 'destructive';
      default: return 'outline';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading your deals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Deals</h1>
          <p className="text-muted-foreground">Manage your funding campaigns</p>
        </div>
        <Button onClick={() => router.push('/dashboard/business/deals/create')}>
          <Plus className="h-4 w-4 mr-2" />
          Create New Deal
        </Button>
      </div>

      {/* Deals List */}
      {deals.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <TrendingUp className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No deals yet</h3>
            <p className="text-muted-foreground text-center mb-6">
              Create your first funding campaign to start raising capital
            </p>
            <Button onClick={() => router.push('/dashboard/business/deals/create')}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Deal
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {deals.map((deal) => {
            const fundingProgress = (deal.currentFunding / deal.fundingGoal) * 100;
            
            return (
              <Card key={deal.id} className="hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => router.push(`/deals/${deal.id}`)}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="line-clamp-1">{deal.title}</CardTitle>
                      <CardDescription className="line-clamp-2 mt-2">
                        {deal.description}
                      </CardDescription>
                    </div>
                    <Badge variant={getStatusColor(deal.status)}>
                      {deal.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Funding Progress */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Funding Progress</span>
                      <span className="font-semibold">{fundingProgress.toFixed(0)}%</span>
                    </div>
                    <Progress value={fundingProgress} />
                    <div className="flex justify-between text-sm">
                      <span className="font-semibold">{formatCurrency(deal.currentFunding)}</span>
                      <span className="text-muted-foreground">of {formatCurrency(deal.fundingGoal)}</span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Investors</p>
                        <p className="font-semibold">{deal._count.investments}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Rev Share</p>
                        <p className="font-semibold">{deal.revenueSharePercentage}%</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Created</p>
                        <p className="font-semibold">
                          {new Date(deal.createdAt).toLocaleDateString('en-ZA', { month: 'short', day: 'numeric' })}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
