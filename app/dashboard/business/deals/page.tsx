'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Plus, TrendingUp, Users, Calendar, DollarSign, Clock } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import Image from 'next/image';

interface Deal {
  id: string;
  title: string;
  description: string;
  fundingGoal: number;
  currentFunding: number;
  revenueSharePercentage: number;
  status: string;
  imageUrl?: string;
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
      case 'ACTIVE': 
      case 'APPROVED': 
        return 'default';
      case 'FUNDED': 
        return 'secondary';
      case 'CLOSED': 
      case 'CANCELLED':
        return 'destructive';
      case 'PENDING_APPROVAL':
      case 'PENDING': 
        return 'outline';
      default: 
        return 'outline';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'PENDING_APPROVAL':
      case 'PENDING': 
        return 'Pending Approval';
      case 'APPROVED':
      case 'ACTIVE': 
        return 'Active';
      case 'FUNDED': 
        return 'Fully Funded';
      case 'CLOSED': 
        return 'Closed';
      case 'CANCELLED':
        return 'Cancelled';
      default: 
        return status;
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
        <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
          {deals.map((deal) => {
            const fundingProgress = (deal.currentFunding / deal.fundingGoal) * 100;
            const isPending = deal.status === 'PENDING_APPROVAL' || deal.status === 'PENDING';
            
            return (
              <Card 
                key={deal.id} 
                className={`hover:shadow-lg transition-all cursor-pointer overflow-hidden group ${
                  isPending ? 'border-yellow-200 bg-yellow-50/30' : ''
                }`}
                onClick={() => router.push(`/deals/${deal.id}`)}
              >
                {/* Deal Image */}
                {deal.imageUrl && (
                  <div className="relative w-full h-48 overflow-hidden bg-gray-100">
                    <Image
                      src={deal.imageUrl}
                      alt={deal.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {isPending && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <div className="bg-yellow-500 text-white px-4 py-2 rounded-full flex items-center gap-2 font-semibold">
                          <Clock className="h-4 w-4" />
                          Coming Soon
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
                <CardHeader className={deal.imageUrl ? 'pb-3' : ''}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="line-clamp-1 text-lg">{deal.title}</CardTitle>
                      <CardDescription className="line-clamp-2 mt-1.5 text-sm">
                        {deal.description}
                      </CardDescription>
                    </div>
                    <Badge variant={getStatusColor(deal.status)} className="shrink-0">
                      {getStatusLabel(deal.status)}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4 pt-0">
                  {/* Funding Progress */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {isPending ? 'Target' : 'Funding Progress'}
                      </span>
                      {!isPending && (
                        <span className="font-semibold text-primary">{fundingProgress.toFixed(0)}%</span>
                      )}
                    </div>
                    {!isPending && <Progress value={fundingProgress} className="h-2" />}
                    <div className="flex justify-between text-sm">
                      <span className="font-semibold text-lg">
                        {formatCurrency(isPending ? deal.fundingGoal : deal.currentFunding)}
                      </span>
                      {!isPending && (
                        <span className="text-muted-foreground">of {formatCurrency(deal.fundingGoal)}</span>
                      )}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-3 pt-3 border-t">
                    <div className="flex items-start gap-2">
                      <Users className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs text-muted-foreground">Investors</p>
                        <p className="font-semibold text-sm">
                          {isPending ? 'TBA' : deal._count.investments}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs text-muted-foreground">Rev Share</p>
                        <p className="font-semibold text-sm">{deal.revenueSharePercentage}%</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs text-muted-foreground">
                          {isPending ? 'Submitted' : 'Created'}
                        </p>
                        <p className="font-semibold text-sm">
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
