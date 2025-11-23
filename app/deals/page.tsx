'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Navigation } from '@/components/navigation';
import { Building2, TrendingUp, Users, Calendar, ArrowUpRight, ArrowDownRight, Clock, Target, Shield, ArrowRight, Lock, Check, BarChart3, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { formatCurrency } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

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
  business?: {
    tradingName: string;
    industry: string;
    user?: {
      kycStatus: string;
    };
  };
  _count: {
    investments: number;
  };
}

// Fake deals data - multipliers match seed data
const fakeDeals = [
  {
    id: 1,
    name: 'Green Energy Solutions',
    industry: 'Renewable Energy',
    description: 'Solar panel installation and renewable energy solutions for residential and commercial properties across South Africa.',
    fundingGoal: 500000,
    funded: 425000,
    investors: 89,
    monthlyRevenue: 180000,
    revenueGrowth: 15.5,
    daysLeft: 12,
    minInvestment: 1000,
    targetReturn: 1.5,
    riskLevel: 'Medium',
    status: 'ACTIVE',
    logo: '🔋',
    location: 'Cape Town',
    founded: 2020,
    image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=600&h=400&fit=crop',
    isFeatured: true,
    isTopListing: true,
  },
  {
    id: 2,
    name: 'Cape Town Coffee Co.',
    industry: 'Food & Beverage',
    description: 'Specialty coffee chain expanding across Western Cape with online delivery service and wholesale distribution.',
    fundingGoal: 750000,
    funded: 680000,
    investors: 124,
    monthlyRevenue: 320000,
    revenueGrowth: 22.3,
    daysLeft: 8,
    minInvestment: 1000,
    targetReturn: 1.3,
    riskLevel: 'Low',
    status: 'ACTIVE',
    logo: '☕',
    location: 'Cape Town',
    founded: 2019,
    image: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=600&h=400&fit=crop',
    isFeatured: false,
    isTopListing: false,
  },
  {
    id: 3,
    name: 'Tech Innovators SA',
    industry: 'FinTech',
    description: 'Mobile payment solutions and digital wallet platform serving underbanked communities in South Africa.',
    fundingGoal: 1000000,
    funded: 340000,
    investors: 67,
    monthlyRevenue: 95000,
    revenueGrowth: 45.2,
    daysLeft: 25,
    minInvestment: 5000,
    targetReturn: 1.7,
    riskLevel: 'High',
    status: 'ACTIVE',
    logo: '💳',
    location: 'Johannesburg',
    founded: 2021,
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&h=400&fit=crop',
    isFeatured: false,
    isTopListing: false,
  },
  {
    id: 4,
    name: 'African Fashion Hub',
    industry: 'E-commerce',
    description: 'Online marketplace connecting African fashion designers with global customers. Curated collections of authentic African wear.',
    fundingGoal: 350000,
    funded: 285000,
    investors: 52,
    monthlyRevenue: 125000,
    revenueGrowth: 18.7,
    daysLeft: 15,
    minInvestment: 1000,
    targetReturn: 1.4,
    riskLevel: 'Medium',
    status: 'ACTIVE',
    logo: '👗',
    location: 'Durban',
    founded: 2020,
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=400&fit=crop',
    isFeatured: true,
    isTopListing: false,
  },
  {
    id: 5,
    name: 'Swift Logistics ZA',
    industry: 'Logistics',
    description: 'Last-mile delivery service with electric vehicle fleet. Sustainable logistics solutions for e-commerce businesses.',
    fundingGoal: 2000000,
    funded: 1250000,
    investors: 156,
    monthlyRevenue: 450000,
    revenueGrowth: 12.4,
    daysLeft: 18,
    minInvestment: 2500,
    targetReturn: 1.35,
    riskLevel: 'Medium',
    status: 'ACTIVE',
    logo: '🚚',
    location: 'Johannesburg',
    founded: 2019,
    image: 'https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?w=600&h=400&fit=crop',
    isFeatured: false,
    isTopListing: false,
  },
  {
    id: 6,
    name: 'HealthTech Connect',
    industry: 'Healthcare',
    description: 'Telemedicine platform connecting patients with healthcare providers. Affordable virtual consultations for all South Africans.',
    fundingGoal: 600000,
    funded: 0,
    investors: 0,
    monthlyRevenue: 85000,
    revenueGrowth: 28.5,
    daysLeft: 30,
    minInvestment: 1000,
    targetReturn: 1.6,
    riskLevel: 'Medium',
    status: 'PENDING',
    logo: '🏥',
    location: 'Pretoria',
    founded: 2021,
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&h=400&fit=crop',
    isFeatured: false,
    isTopListing: false,
  },
];

export default function DealsPage() {
  const [filterIndustry, setFilterIndustry] = useState('all');
  const [filterRisk, setFilterRisk] = useState('all');
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [compareDeals, setCompareDeals] = useState<number[]>([]);
  const [showComparison, setShowComparison] = useState(false);

  useEffect(() => {
    fetchDeals();
  }, []);

  const fetchDeals = async () => {
    try {
      const res = await fetch('/api/deals');
      if (res.ok) {
        const data = await res.json();
        // Filter to only show active and pending approval deals (pending shown as "coming soon")
        const publicDeals = data.deals.filter((d: Deal) => 
          d.status === 'ACTIVE' || d.status === 'APPROVED' || d.status === 'PENDING_APPROVAL'
        );
        setDeals(publicDeals);
      }
    } catch (error) {
      console.error('Failed to load deals:', error);
    } finally {
      setLoading(false);
    }
  };

  // Helper functions to safely access properties from both real and fake deals
  const getDealProperty = (deal: any, realProp: string, fakeProp: string) => {
    if (realProp in deal) return deal[realProp];
    if (fakeProp in deal) return deal[fakeProp];
    return null;
  };

  const getDealName = (deal: any) => 
    'business' in deal ? deal.business?.tradingName : ('name' in deal ? deal.name : 'Untitled');
  
  const getDealIndustry = (deal: any) => 
    'business' in deal ? deal.business?.industry : ('industry' in deal ? deal.industry : 'Other');
  
  const getDealFunded = (deal: any) => 
    'currentFunding' in deal ? deal.currentFunding : ('funded' in deal ? deal.funded : 0);
  
  const getDealInvestors = (deal: any) => 
    '_count' in deal ? deal._count.investments : ('investors' in deal ? deal.investors : 0);

  // Comparison functions
  const toggleCompare = (dealId: number) => {
    setCompareDeals(prev => {
      if (prev.includes(dealId)) {
        return prev.filter(id => id !== dealId);
      } else if (prev.length < 3) {
        return [...prev, dealId];
      }
      return prev;
    });
  };

  const clearComparison = () => {
    setCompareDeals([]);
    setShowComparison(false);
  };
  
  const getDealImage = (deal: any) => 
    'imageUrl' in deal && deal.imageUrl ? deal.imageUrl : ('image' in deal ? deal.image : '/placeholder-business.jpg');
  
  const getDealLogo = (deal: any) => 
    'logo' in deal ? deal.logo : '🏢';

  // Combine real deals with fake deals for demo
  const allDeals = [...deals, ...fakeDeals];

  const filteredDeals = allDeals
    .filter(deal => {
      if (filterIndustry !== 'all') {
        const dealIndustry = 'business' in deal ? deal.business?.industry : ('industry' in deal ? deal.industry : null);
        if (dealIndustry !== filterIndustry) return false;
      }
      if (filterRisk !== 'all' && 'riskLevel' in deal && deal.riskLevel !== filterRisk) return false;
      return true;
  })
    .sort((a, b) => {
      // Real pending deals first (coming soon)
      const aIsPending = 'status' in a && a.status === 'PENDING_APPROVAL';
      const bIsPending = 'status' in b && b.status === 'PENDING_APPROVAL';
      if (aIsPending && !bIsPending) return -1;
      if (!aIsPending && bIsPending) return 1;
      
      // Then sort premium deals: Top Listing > Featured > Regular
      const aTopListing = 'isTopListing' in a ? a.isTopListing : false;
      const bTopListing = 'isTopListing' in b ? b.isTopListing : false;
      const aFeatured = 'isFeatured' in a ? a.isFeatured : false;
      const bFeatured = 'isFeatured' in b ? b.isFeatured : false;
      
      if (aTopListing && !bTopListing) return -1;
      if (!aTopListing && bTopListing) return 1;
      if (aFeatured && !bFeatured) return -1;
      if (!aFeatured && bFeatured) return 1;
      return 0;
    });

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
      case 'Medium': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'High': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400';
    }
  };

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950">
        <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="mb-6 md:mb-8">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2 md:mb-3 text-slate-900 dark:text-white">
            Investment Opportunities
          </h1>
          <p className="text-base md:text-lg text-slate-600 dark:text-slate-300">
            Discover vetted South African businesses raising capital through revenue-share agreements
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 md:p-6 mb-6 md:mb-8 shadow-lg">
          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block text-slate-700 dark:text-slate-300">Industry</label>
              <select 
                value={filterIndustry}
                onChange={(e) => setFilterIndustry(e.target.value)}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Industries</option>
                <option value="Renewable Energy">Renewable Energy</option>
                <option value="Food & Beverage">Food & Beverage</option>
                <option value="FinTech">FinTech</option>
                <option value="E-commerce">E-commerce</option>
                <option value="Logistics">Logistics</option>
                <option value="Healthcare">Healthcare</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block text-slate-700 dark:text-slate-300">Risk Level</label>
              <select
                value={filterRisk}
                onChange={(e) => setFilterRisk(e.target.value)}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Risk Levels</option>
                <option value="Low">Low Risk</option>
                <option value="Medium">Medium Risk</option>
                <option value="High">High Risk</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block text-slate-700 dark:text-slate-300">Min Investment</label>
              <select className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500">
                <option>Any Amount</option>
                <option>R1,000</option>
                <option>R2,500</option>
                <option>R5,000</option>
                <option>R10,000+</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block text-slate-700 dark:text-slate-300">Sort By</label>
              <select className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500">
                <option>Most Funded</option>
                <option>Ending Soon</option>
                <option>Recently Added</option>
                <option>Highest Growth</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6 flex justify-between items-center">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Showing <span className="font-semibold text-slate-900 dark:text-white">{filteredDeals.length}</span> active deals
          </p>
          <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
            <Shield className="h-3 w-3 mr-1" />
            All businesses verified
          </Badge>
        </div>

        {/* Deals Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredDeals.map((deal, index) => {
            const funded = getDealFunded(deal);
            const percentFunded = (funded / deal.fundingGoal) * 100;
            const revenueGrowth = 'revenueGrowth' in deal ? deal.revenueGrowth : 0;
            const isGrowing = revenueGrowth > 0;
            const monthlyRevenue = 'monthlyRevenue' in deal ? deal.monthlyRevenue : 0;
            const targetReturn = 'targetReturn' in deal ? deal.targetReturn : ('revenueSharePercentage' in deal ? deal.revenueSharePercentage / 100 : 1.5);
            const riskLevel = 'riskLevel' in deal ? deal.riskLevel : 'Medium';
            const daysLeft = 'daysLeft' in deal ? deal.daysLeft : 30;
            const isTopListing = 'isTopListing' in deal ? deal.isTopListing : false;
            const isFeatured = 'isFeatured' in deal ? deal.isFeatured : false;
            const dealName = getDealName(deal);
            const dealIndustry = getDealIndustry(deal);
            const dealImage = getDealImage(deal);
            const dealLogo = getDealLogo(deal);
            const investors = getDealInvestors(deal);
            
            // Assign colorful borders
            const borderColors = [
              'border-l-4 border-emerald-500 dark:border-emerald-400',
              'border-l-4 border-yellow-500 dark:border-yellow-400',
              'border-l-4 border-blue-500 dark:border-blue-400',
              'border-l-4 border-purple-500 dark:border-purple-400',
              'border-l-4 border-pink-500 dark:border-pink-400',
            ];
            const borderColor = borderColors[index % borderColors.length];
            
            return (
              <div
                key={deal.id}
                className={`group bg-white dark:bg-slate-800 rounded-2xl shadow-lg hover:shadow-2xl border-2 ${
                  isTopListing
                    ? 'border-purple-400 dark:border-purple-500 ring-2 ring-purple-300 dark:ring-purple-600'
                    : isFeatured
                    ? 'border-amber-400 dark:border-amber-500 ring-2 ring-amber-300 dark:ring-amber-600'
                    : 'border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600'
                } hover:-translate-y-2 transition-all duration-300 backdrop-blur-sm overflow-hidden`}
              >
                {/* Business Image Header */}
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={dealImage}
                    alt={dealName}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  
                  {/* Logo and Name Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="w-12 h-12 bg-white dark:bg-slate-900 rounded-full flex items-center justify-center text-2xl shadow-xl ring-2 ring-white/50">
                        {dealLogo}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-white leading-tight">
                          {dealName}
                        </h3>
                        <p className="text-xs text-white/90">{dealIndustry}</p>
                      </div>
                    </div>
                  </div>

                  {/* Return Badge and Featured Badge */}
                  <div className="absolute top-4 right-4 flex flex-col gap-2 items-end">
                    <Badge className="bg-emerald-500 text-white font-bold text-sm px-3 py-1 shadow-lg">
                      {targetReturn}x Return
                    </Badge>
                    {isFeatured && (
                      <Badge className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-bold text-xs px-3 py-1 shadow-lg flex items-center gap-1">
                        <span className="text-white">⭐</span> Recommended
                      </Badge>
                    )}
                    {isTopListing && (
                      <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-xs px-3 py-1 shadow-lg flex items-center gap-1">
                        <span className="text-white">👑</span> Top Deal
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-4 md:p-6 space-y-4">
                  {/* Description */}
                  <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                    {deal.description}
                  </p>

                  {/* Progress Bar */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs md:text-sm font-semibold text-slate-700 dark:text-slate-300">
                        Funding Progress
                      </span>
                      <span className="text-xs md:text-sm font-bold text-blue-600 dark:text-blue-400">
                        {percentFunded.toFixed(0)}%
                      </span>
                    </div>
                    <div className="h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(percentFunded, 100)}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        <Lock className="h-3 w-3" /> Private
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        <Lock className="h-3 w-3" /> Private
                      </span>
                    </div>
                  </div>

                  {/* Key Stats */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="relative bg-gradient-to-br from-slate-900/80 to-slate-800/80 dark:from-slate-700/80 dark:to-slate-600/80 rounded-lg p-2.5 md:p-3 border border-slate-700 dark:border-slate-600 overflow-hidden">
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <Lock className="h-5 w-5 text-white mb-1" />
                        <div className="text-xs text-white font-medium">Private</div>
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mb-1 opacity-20">Monthly Revenue</div>
                      <div className="font-bold text-sm md:text-base text-slate-900 dark:text-white opacity-20">
                        R***k
                      </div>
                      <div className="flex items-center text-xs mt-1 text-emerald-600 dark:text-emerald-400 opacity-20">
                        <ArrowUpRight className="h-3 w-3" />
                        **%
                      </div>
                    </div>
                    <div className="relative bg-gradient-to-br from-slate-900/80 to-slate-800/80 dark:from-slate-700/80 dark:to-slate-600/80 rounded-lg p-2.5 md:p-3 border border-slate-700 dark:border-slate-600 overflow-hidden">
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <Lock className="h-5 w-5 text-white mb-1" />
                        <div className="text-xs text-white font-medium">Private</div>
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mb-1 opacity-20">Target Return</div>
                      <div className="font-bold text-sm md:text-base text-slate-900 dark:text-white opacity-20">
                        {targetReturn}x
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 opacity-20">Capped</div>
                    </div>
                  </div>

                  {/* Bottom Info */}
                  <div className="flex justify-between items-center pt-2">
                    <div className="flex items-center space-x-3">
                      <Badge variant="outline" className={`${getRiskColor(riskLevel)} border-0 text-xs`}>
                        {riskLevel}
                      </Badge>
                      <div className="flex items-center text-xs text-slate-500 dark:text-slate-400">
                        <Clock className="h-3 w-3 mr-1" />
                        {daysLeft}d left
                      </div>
                      <div className="flex items-center text-xs text-slate-500 dark:text-slate-400">
                        <Users className="h-3 w-3 mr-1" />
                        {investors}
                      </div>
                    </div>
                  </div>

                  {/* KYC Warning */}
                  {'business' in deal && deal.business?.user?.kycStatus !== 'VERIFIED' && (
                    <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                        <p className="text-xs text-amber-700 dark:text-amber-300 font-medium">
                          KYC Not Verified - Investment disabled until business completes verification
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Compare Checkbox */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-700">
                    <span className="text-xs text-slate-600 dark:text-slate-400">Compare this deal</span>
                    <button
                      onClick={() => toggleCompare(Number(deal.id))}
                      className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                        compareDeals.includes(Number(deal.id))
                          ? 'bg-green-500 text-white scale-110'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                      } shadow-md`}
                    >
                      {compareDeals.includes(Number(deal.id)) ? (
                        <Check className="h-5 w-5" />
                      ) : (
                        <div className="w-5 h-5 border-2 border-slate-400 dark:border-slate-500 rounded"></div>
                      )}
                    </button>
                  </div>

                  {/* CTA Button */}
                  <Link href={`/deals/${deal.id}`} className="block">
                    <Button 
                      size="lg" 
                      className="w-full shadow-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 group-hover:shadow-xl transition-all text-base font-semibold"
                    >
                      View Investment Details
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Floating Compare Button */}
        <AnimatePresence>
          {compareDeals.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              className="fixed bottom-8 right-8 z-40"
            >
              <Button
                size="lg"
                onClick={() => setShowComparison(true)}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-2xl px-6 py-6 text-lg font-bold group"
              >
                Compare Deals ({compareDeals.length}/3)
                <BarChart3 className="ml-2 h-5 w-5 group-hover:scale-110 transition-transform" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Comparison Modal */}
        <AnimatePresence>
          {showComparison && compareDeals.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowComparison(false)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 50 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-auto"
              >
                {/* Modal Header */}
                <div className="sticky top-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 p-6 flex justify-between items-center z-10">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Compare Deals</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Side-by-side comparison of {compareDeals.length} deals</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={clearComparison} size="sm">
                      Clear All
                    </Button>
                    <Button variant="ghost" onClick={() => setShowComparison(false)} size="sm">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Comparison Table */}
                <div className="p-6">
                  <div className="grid gap-6" style={{ gridTemplateColumns: `repeat(${compareDeals.length}, 1fr)` }}>
                    {compareDeals.map((dealId) => {
                      const deal = [...fakeDeals, ...deals].find((d: any) => Number(d.id) === dealId);
                      if (!deal) return null;

                      const dealName = getDealName(deal);
                      const dealIndustry = getDealIndustry(deal);
                      const dealImage = getDealImage(deal);
                      const dealLogo = getDealLogo(deal);
                      const funded = getDealFunded(deal);
                      const percentFunded = (funded / deal.fundingGoal) * 100;
                      const investors = getDealInvestors(deal);
                      const targetReturn = 'targetReturn' in deal ? deal.targetReturn : 1.5;
                      const riskLevel = 'riskLevel' in deal ? deal.riskLevel : 'Medium';
                      const daysLeft = 'daysLeft' in deal ? deal.daysLeft : 30;

                      return (
                        <div key={deal.id} className="space-y-4">
                          {/* Deal Card */}
                          <div className="bg-slate-50 dark:bg-slate-800 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
                            <div className="relative h-32">
                              <Image src={dealImage} alt={dealName} fill className="object-cover" />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                              <div className="absolute bottom-3 left-3 flex items-center gap-2">
                                <span className="text-2xl">{dealLogo}</span>
                                <div>
                                  <div className="text-white font-bold text-sm">{dealName}</div>
                                  <div className="text-white/80 text-xs">{dealIndustry}</div>
                                </div>
                              </div>
                            </div>
                            <div className="p-4 space-y-3">
                              <div className="flex justify-between items-center">
                                <span className="text-xs text-slate-600 dark:text-slate-400">Target Return</span>
                                <Badge className="bg-green-500/10 text-green-600 dark:text-green-400 font-bold">{targetReturn}x</Badge>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-xs text-slate-600 dark:text-slate-400">Risk Level</span>
                                <Badge variant="outline" className="text-xs">{riskLevel}</Badge>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-xs text-slate-600 dark:text-slate-400">Funding Progress</span>
                                <span className="font-bold text-sm text-blue-600 dark:text-blue-400">{percentFunded.toFixed(0)}%</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-xs text-slate-600 dark:text-slate-400">Total Raised</span>
                                <span className="font-bold text-sm">{formatCurrency(funded)}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-xs text-slate-600 dark:text-slate-400">Funding Goal</span>
                                <span className="font-bold text-sm">{formatCurrency(deal.fundingGoal)}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-xs text-slate-600 dark:text-slate-400">Investors</span>
                                <span className="font-bold text-sm">{investors}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-xs text-slate-600 dark:text-slate-400">Days Left</span>
                                <Badge variant="outline" className="text-xs">{daysLeft} days</Badge>
                              </div>
                            </div>
                          </div>

                          <Link href={`/deals/${deal.id}`}>
                            <Button className="w-full" size="sm">
                              View Full Details
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                          </Link>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* No Results */}
        {filteredDeals.length === 0 && (
          <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-4">
              No deals match your current filters
            </p>
            <Button
              onClick={() => {
                setFilterIndustry('all');
                setFilterRisk('all');
              }}
              variant="outline"
            >
              Clear Filters
            </Button>
          </div>
        )}
        </div>
      </div>
    </>
  );
}
