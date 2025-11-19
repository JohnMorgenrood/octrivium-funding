'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Loader2 } from 'lucide-react';

export default function CreateDealPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    fundingGoal: '',
    revenueSharePercentage: '',
    duration: '12',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/deals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          fundingGoal: parseFloat(formData.fundingGoal),
          revenueSharePercentage: parseFloat(formData.revenueSharePercentage),
          duration: parseInt(formData.duration),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to create deal');
        return;
      }

      router.push('/dashboard/business/deals');
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Create New Deal</h1>
          <p className="text-muted-foreground">Set up a new funding campaign for your business</p>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Deal Information</CardTitle>
          <CardDescription>
            Provide details about your funding requirements and revenue-sharing terms
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 border-2 border-red-200 rounded-lg dark:bg-red-900/20 dark:border-red-800">
                <p className="text-sm text-red-700 font-medium dark:text-red-300">{error}</p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="title">Deal Title *</Label>
              <Input
                id="title"
                placeholder="e.g., Expand Our Online Store"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
              <p className="text-xs text-muted-foreground">
                A clear, compelling title that describes your funding goal
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Describe your business, how you'll use the funds, and your revenue model..."
                rows={6}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
              <p className="text-xs text-muted-foreground">
                Explain your business model, growth plans, and how investors will benefit
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="fundingGoal">Funding Goal (ZAR) *</Label>
                <Input
                  id="fundingGoal"
                  type="number"
                  min="10000"
                  step="1000"
                  placeholder="50000"
                  value={formData.fundingGoal}
                  onChange={(e) => setFormData({ ...formData, fundingGoal: e.target.value })}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Minimum: R10,000
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="revenueSharePercentage">Revenue Share (%) *</Label>
                <Input
                  id="revenueSharePercentage"
                  type="number"
                  min="1"
                  max="30"
                  step="0.5"
                  placeholder="10"
                  value={formData.revenueSharePercentage}
                  onChange={(e) => setFormData({ ...formData, revenueSharePercentage: e.target.value })}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  % of monthly revenue shared with investors (1-30%)
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Repayment Duration (months) *</Label>
              <Input
                id="duration"
                type="number"
                min="6"
                max="60"
                placeholder="12"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                required
              />
              <p className="text-xs text-muted-foreground">
                How long you'll share revenue with investors (6-60 months)
              </p>
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading} className="flex-1">
                {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Create Deal
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
