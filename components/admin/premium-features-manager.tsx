'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Card } from '@/components/ui/card';
import {
  Award,
  Star,
  TrendingUp,
  Mail,
  Share2,
  Zap,
  Clock,
  Calendar
} from 'lucide-react';

interface PremiumFeaturesManagerProps {
  dealId: string;
  currentFeatures: {
    isFeatured: boolean;
    isTopListing: boolean;
    isSponsored: boolean;
    isPrioritySearch: boolean;
    isNewsletterFeatured: boolean;
    isSocialBoosted: boolean;
    isPriorityReview: boolean;
    premiumExpiresAt: string | null;
    premiumNotes: string | null;
  };
  onUpdate: (features: any) => Promise<void>;
}

const premiumFeatures = [
  {
    id: 'isFeatured',
    name: 'Featured Badge',
    description: 'Show "Recommended Deal" badge on card',
    price: 'R1,500/week',
    icon: Award,
    color: 'text-amber-600'
  },
  {
    id: 'isTopListing',
    name: 'Top Homepage Spot',
    description: 'Featured prominently in homepage hero',
    price: 'R2,500/week',
    icon: Star,
    color: 'text-yellow-600'
  },
  {
    id: 'isSponsored',
    name: 'Sponsored Placement',
    description: 'Highlighted styling and category placement',
    price: 'Included with Top Listing',
    icon: TrendingUp,
    color: 'text-blue-600'
  },
  {
    id: 'isPrioritySearch',
    name: 'Priority Search',
    description: 'Appear at top of search results',
    price: 'R1,000/week',
    icon: Zap,
    color: 'text-purple-600'
  },
  {
    id: 'isNewsletterFeatured',
    name: 'Newsletter Feature',
    description: 'Featured in investor email newsletter',
    price: 'R3,000/campaign',
    icon: Mail,
    color: 'text-green-600'
  },
  {
    id: 'isSocialBoosted',
    name: 'Social Media Boost',
    description: 'Featured on Octrivium social channels',
    price: 'R2,000/week',
    icon: Share2,
    color: 'text-pink-600'
  },
  {
    id: 'isPriorityReview',
    name: 'Priority Review',
    description: 'Fast-track application approval',
    price: 'R1,500 one-time',
    icon: Clock,
    color: 'text-indigo-600'
  }
];

export function PremiumFeaturesManager({
  dealId,
  currentFeatures,
  onUpdate
}: PremiumFeaturesManagerProps) {
  const [features, setFeatures] = useState(currentFeatures);
  const [expiryDate, setExpiryDate] = useState(
    currentFeatures.premiumExpiresAt
      ? new Date(currentFeatures.premiumExpiresAt).toISOString().split('T')[0]
      : ''
  );
  const [notes, setNotes] = useState(currentFeatures.premiumNotes || '');
  const [isUpdating, setIsUpdating] = useState(false);

  const handleToggle = (featureId: string) => {
    setFeatures((prev) => ({
      ...prev,
      [featureId]: !prev[featureId as keyof typeof prev]
    }));
  };

  const handleSave = async () => {
    setIsUpdating(true);
    try {
      await onUpdate({
        ...features,
        premiumExpiresAt: expiryDate ? new Date(expiryDate).toISOString() : null,
        premiumNotes: notes || null
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const activeCount = Object.values(features).filter(
    (v) => typeof v === 'boolean' && v
  ).length;

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Star className="w-6 h-6 text-amber-600" />
            Premium Features
          </h3>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Manage premium listing features for this deal
          </p>
        </div>
        <Badge variant="secondary" className="text-lg px-4 py-2">
          {activeCount} Active
        </Badge>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-6">
        {premiumFeatures.map((feature) => {
          const Icon = feature.icon;
          const isActive = features[feature.id as keyof typeof features];

          return (
            <div
              key={feature.id}
              className={`border-2 rounded-xl p-4 transition-all ${
                isActive
                  ? 'border-amber-400 bg-amber-50 dark:bg-amber-900/20'
                  : 'border-slate-200 dark:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Icon className={`w-5 h-5 ${feature.color}`} />
                  <h4 className="font-bold text-slate-900 dark:text-white">
                    {feature.name}
                  </h4>
                </div>
                <Switch
                  checked={!!isActive}
                  onCheckedChange={() => handleToggle(feature.id)}
                />
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                {feature.description}
              </p>
              <p className="text-sm font-bold text-amber-600">
                {feature.price}
              </p>
            </div>
          );
        })}
      </div>

      {/* Expiry Date */}
      <div className="mb-6">
        <label className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white mb-2">
          <Calendar className="w-4 h-4" />
          Premium Features Expiry Date
        </label>
        <input
          type="date"
          value={expiryDate}
          onChange={(e) => setExpiryDate(e.target.value)}
          className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
        />
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Leave empty for no expiry. Features will be auto-disabled after this date.
        </p>
      </div>

      {/* Admin Notes */}
      <div className="mb-6">
        <label className="block text-sm font-bold text-slate-900 dark:text-white mb-2">
          Admin Notes
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          placeholder="Internal notes about premium features, payment status, etc."
          className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
        />
      </div>

      {/* Summary */}
      <div className="bg-slate-100 dark:bg-slate-700 rounded-lg p-4 mb-6">
        <h4 className="font-bold text-slate-900 dark:text-white mb-2">
          Active Features Summary
        </h4>
        {activeCount === 0 ? (
          <p className="text-slate-600 dark:text-slate-400">
            No premium features currently active
          </p>
        ) : (
          <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-300">
            {premiumFeatures.map((feature) => {
              const isActive = features[feature.id as keyof typeof features];
              return (
                isActive && (
                  <li key={feature.id} className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-amber-600 rounded-full" />
                    {feature.name} - {feature.price}
                  </li>
                )
              );
            })}
          </ul>
        )}
      </div>

      {/* Save Button */}
      <Button
        onClick={handleSave}
        disabled={isUpdating}
        className="w-full bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700"
        size="lg"
      >
        {isUpdating ? 'Updating...' : 'Save Premium Features'}
      </Button>
    </Card>
  );
}
