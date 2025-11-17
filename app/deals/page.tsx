'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Building2, TrendingUp, Users, Calendar, ArrowUpRight, ArrowDownRight, Clock, Target, Shield, ArrowRight } from 'lucide-react';
import { useState } from 'react';

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
    image: 'https://images.unsplash.com/photo-1558769132-cb1aea1f162f?w=600&h=400&fit=crop',
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
  },
];

export default function DealsPage() {
  const [filterIndustry, setFilterIndustry] = useState('all');
  const [filterRisk, setFilterRisk] = useState('all');

  const filteredDeals = fakeDeals.filter(deal => {
    if (filterIndustry !== 'all' && deal.industry !== filterIndustry) return false;
    if (filterRisk !== 'all' && deal.riskLevel !== filterRisk) return false;
    return deal.status === 'ACTIVE';
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
            const percentFunded = (deal.funded / deal.fundingGoal) * 100;
            const isGrowing = deal.revenueGrowth > 0;
            
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
                className="group bg-white dark:bg-slate-800 rounded-2xl shadow-lg hover:shadow-2xl border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 hover:-translate-y-2 transition-all duration-300 backdrop-blur-sm overflow-hidden"
              >
                {/* Business Image Header */}
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={deal.image}
                    alt={deal.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  
                  {/* Logo and Name Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="w-12 h-12 bg-white dark:bg-slate-900 rounded-full flex items-center justify-center text-2xl shadow-xl ring-2 ring-white/50">
                        {deal.logo}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-white leading-tight">
                          {deal.name}
                        </h3>
                        <p className="text-xs text-white/90">{deal.industry}</p>
                      </div>
                    </div>
                  </div>

                  {/* Return Badge */}
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-emerald-500 text-white font-bold text-sm px-3 py-1 shadow-lg">
                      {deal.targetReturn}x Return
                    </Badge>
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
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        R{(deal.funded / 1000).toFixed(0)}k raised
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        R{(deal.fundingGoal / 1000).toFixed(0)}k goal
                      </span>
                    </div>
                  </div>

                  {/* Key Stats */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900/50 dark:to-slate-900/30 rounded-lg p-2.5 md:p-3 border border-slate-200 dark:border-slate-700">
                      <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Monthly Revenue</div>
                      <div className="font-bold text-sm md:text-base text-slate-900 dark:text-white">
                        R{(deal.monthlyRevenue / 1000).toFixed(0)}k
                      </div>
                      <div className={`flex items-center text-xs mt-1 ${isGrowing ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                        {isGrowing ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                        {deal.revenueGrowth}%
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900/50 dark:to-slate-900/30 rounded-lg p-2.5 md:p-3 border border-slate-200 dark:border-slate-700">
                      <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Target Return</div>
                      <div className="font-bold text-sm md:text-base text-slate-900 dark:text-white">
                        {deal.targetReturn}x
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Capped</div>
                    </div>
                  </div>

                  {/* Bottom Info */}
                  <div className="flex justify-between items-center pt-2">
                    <div className="flex items-center space-x-3">
                      <Badge variant="outline" className={`${getRiskColor(deal.riskLevel)} border-0 text-xs`}>
                        {deal.riskLevel}
                      </Badge>
                      <div className="flex items-center text-xs text-slate-500 dark:text-slate-400">
                        <Clock className="h-3 w-3 mr-1" />
                        {deal.daysLeft}d left
                      </div>
                      <div className="flex items-center text-xs text-slate-500 dark:text-slate-400">
                        <Users className="h-3 w-3 mr-1" />
                        {deal.investors}
                      </div>
                    </div>
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
  );
}
