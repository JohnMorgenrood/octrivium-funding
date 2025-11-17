'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { ArrowRight, TrendingUp, Shield, Users, BarChart3, Zap, Heart, ArrowUpRight, ArrowDownRight, Clock, DollarSign, Target, Menu } from 'lucide-react';
import { useState } from 'react';

// Fake deals data
const fakeDealss = [
  {
    id: 1,
    name: 'Green Energy Solutions',
    industry: 'Renewable Energy',
    fundingGoal: 500000,
    funded: 425000,
    investors: 89,
    monthlyRevenue: 180000,
    revenueGrowth: 15.5,
    daysLeft: 12,
    minInvestment: 1000,
    targetReturn: 1.7,
    status: 'active',
    logo: '🔋',
  },
  {
    id: 2,
    name: 'Cape Town Coffee Co.',
    industry: 'Food & Beverage',
    fundingGoal: 750000,
    funded: 680000,
    investors: 124,
    monthlyRevenue: 320000,
    revenueGrowth: 22.3,
    daysLeft: 8,
    minInvestment: 1000,
    targetReturn: 1.7,
    status: 'active',
    logo: '☕',
  },
  {
    id: 3,
    name: 'Tech Innovators SA',
    industry: 'FinTech',
    fundingGoal: 1000000,
    funded: 340000,
    investors: 67,
    monthlyRevenue: 95000,
    revenueGrowth: 45.2,
    daysLeft: 25,
    minInvestment: 5000,
    targetReturn: 1.7,
    status: 'active',
    logo: '💳',
  },
  {
    id: 4,
    name: 'African Fashion Hub',
    industry: 'E-commerce',
    fundingGoal: 350000,
    funded: 285000,
    investors: 52,
    monthlyRevenue: 125000,
    revenueGrowth: 18.7,
    daysLeft: 15,
    minInvestment: 1000,
    targetReturn: 1.7,
    status: 'active',
    logo: '👗',
  },
];

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950">
      {/* Navigation */}
      <nav className="border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">O</span>
            </div>
            <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Octrivium Funding
            </span>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/deals" className="text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">
              Browse Deals
            </Link>
            <Link href="/how-it-works" className="text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">
              How It Works
            </Link>
            <Link href="/about" className="text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">
              About
            </Link>
          </div>
          <div className="flex items-center space-x-2 md:space-x-4">
            <ThemeToggle />
            <Link href="/login" className="hidden sm:block">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/register" className="hidden sm:block">
              <Button className="shadow-lg">Get Started</Button>
            </Link>
            
            {/* Mobile Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] bg-white dark:bg-slate-900">
                <div className="flex flex-col space-y-6 mt-8">
                  <Link 
                    href="/deals" 
                    className="text-lg font-medium text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Browse Deals
                  </Link>
                  <Link 
                    href="/how-it-works" 
                    className="text-lg font-medium text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    How It Works
                  </Link>
                  <Link 
                    href="/about" 
                    className="text-lg font-medium text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    About
                  </Link>
                  <div className="border-t border-slate-200 dark:border-slate-700 pt-6 space-y-4">
                    <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="outline" className="w-full">Sign In</Button>
                    </Link>
                    <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                      <Button className="w-full shadow-lg">Get Started</Button>
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 md:py-20 lg:py-32">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 font-semibold text-sm mb-6 shadow-sm">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></span>
            Empowering South African Businesses
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Fund Growth,
            </span>
            <br />
            <span className="text-slate-900 dark:text-white">Share Success</span>
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl text-slate-600 dark:text-slate-300 mb-10 max-w-3xl mx-auto leading-relaxed px-4">
            Revenue-based crowdfunding platform connecting small businesses with everyday investors.
            Invest in your community, earn as they grow.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center px-4">
            <Link href="/register?role=investor">
              <Button size="lg" className="text-base md:text-lg px-6 md:px-8 py-4 md:py-6 w-full sm:w-auto">
                Start Investing
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/register?role=business">
              <Button size="lg" variant="outline" className="text-base md:text-lg px-6 md:px-8 py-4 md:py-6 w-full sm:w-auto">
                Raise Capital
              </Button>
            </Link>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 md:gap-8 mt-12 md:mt-16 max-w-3xl mx-auto px-4">
            <div className="text-center">
              <div className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                R50M+
              </div>
              <div className="text-xs md:text-base text-slate-600 dark:text-slate-400 font-medium">Capital Raised</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                500+
              </div>
              <div className="text-xs md:text-base text-slate-600 dark:text-slate-400 font-medium">Businesses Funded</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                15%
              </div>
              <div className="text-xs md:text-base text-slate-600 dark:text-slate-400 font-medium">Avg. Returns</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 md:py-20 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-slate-900 dark:text-white">
              Why Choose Octrivium?
            </h2>
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto px-4">
              A transparent, fair, and innovative way to fund growth and invest in your community
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
            <div className="group">
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-200 dark:border-slate-700 h-full">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                  <TrendingUp className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold mb-3 text-slate-900 dark:text-white">Revenue-Based Returns</h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  Earn returns proportional to business performance. No fixed debt, just fair revenue sharing up to 1.7× your investment.
                </p>
              </div>
            </div>

            <div className="group">
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-200 dark:border-slate-700 h-full">
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-green-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                  <Shield className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold mb-3 text-slate-900 dark:text-white">Verified Businesses</h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  Every business is thoroughly vetted with KYC/AML compliance, document verification, and financial health checks.
                </p>
              </div>
            </div>

            <div className="group">
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-200 dark:border-slate-700 h-full">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                  <Users className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold mb-3 text-slate-900 dark:text-white">Community Impact</h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  Support local South African businesses while earning returns. Your investment creates jobs and drives economic growth.
                </p>
              </div>
            </div>

            <div className="group">
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-200 dark:border-slate-700 h-full">
                <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                  <BarChart3 className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold mb-3 text-slate-900 dark:text-white">Full Transparency</h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  Track business performance with monthly revenue reports. See exactly how your investment is performing in real-time.
                </p>
              </div>
            </div>

            <div className="group">
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-200 dark:border-slate-700 h-full">
                <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                  <Zap className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold mb-3 text-slate-900 dark:text-white">Quick & Easy</h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  Start investing with as little as R1,000. Simple onboarding, secure payments, and automated monthly payouts.
                </p>
              </div>
            </div>

            <div className="group">
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-200 dark:border-slate-700 h-full">
                <div className="w-14 h-14 bg-gradient-to-br from-rose-500 to-pink-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                  <Heart className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold mb-3 text-slate-900 dark:text-white">Diversify Portfolio</h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  Spread investments across multiple businesses and industries to minimize risk and maximize potential returns.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900 dark:text-white">
              How It Works
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300">Simple, transparent, and effective</p>
          </div>

          <div className="max-w-5xl mx-auto">
            {/* For Investors */}
            <div className="mb-16">
              <h3 className="text-3xl font-bold mb-8 text-center text-blue-600 dark:text-blue-400">For Investors</h3>
              <div className="grid md:grid-cols-4 gap-6">
                <div className="relative">
                  <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border-2 border-blue-200 dark:border-blue-500/50 hover:shadow-xl transition-shadow">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl mb-4 shadow-lg">
                      1
                    </div>
                    <h4 className="font-bold text-lg mb-2 text-slate-900 dark:text-white">Sign Up</h4>
                    <p className="text-slate-600 dark:text-slate-300 text-sm">Create your investor account in minutes</p>
                  </div>
                </div>
                <div className="relative">
                  <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border-2 border-blue-200 dark:border-blue-500/50 hover:shadow-xl transition-shadow">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl mb-4 shadow-lg">
                      2
                    </div>
                    <h4 className="font-bold text-lg mb-2 text-slate-900 dark:text-white">Browse Deals</h4>
                    <p className="text-slate-600 dark:text-slate-300 text-sm">Explore verified businesses seeking funding</p>
                  </div>
                </div>
                <div className="relative">
                  <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border-2 border-blue-200 dark:border-blue-500/50 hover:shadow-xl transition-shadow">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl mb-4 shadow-lg">
                      3
                    </div>
                    <h4 className="font-bold text-lg mb-2 text-slate-900 dark:text-white">Invest</h4>
                    <p className="text-slate-600 dark:text-slate-300 text-sm">Choose your amount and confirm investment</p>
                  </div>
                </div>
                <div className="relative">
                  <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border-2 border-blue-200 dark:border-blue-500/50 hover:shadow-xl transition-shadow">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl mb-4 shadow-lg">
                      4
                    </div>
                    <h4 className="font-bold text-lg mb-2 text-slate-900 dark:text-white">Earn Returns</h4>
                    <p className="text-slate-600 dark:text-slate-300 text-sm">Receive monthly revenue share payments</p>
                  </div>
                </div>
              </div>
            </div>

            {/* For Businesses */}
            <div>
              <h3 className="text-3xl font-bold mb-8 text-center text-indigo-600 dark:text-indigo-400">For Businesses</h3>
              <div className="grid md:grid-cols-4 gap-6">
                <div className="relative">
                  <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border-2 border-indigo-200 dark:border-indigo-500/50 hover:shadow-xl transition-shadow">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-xl mb-4 shadow-lg">
                      1
                    </div>
                    <h4 className="font-bold text-lg mb-2 text-slate-900 dark:text-white">Apply</h4>
                    <p className="text-slate-600 dark:text-slate-300 text-sm">Submit your business details and documents</p>
                  </div>
                </div>
                <div className="relative">
                  <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border-2 border-indigo-200 dark:border-indigo-500/50 hover:shadow-xl transition-shadow">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-xl mb-4 shadow-lg">
                      2
                    </div>
                    <h4 className="font-bold text-lg mb-2 text-slate-900 dark:text-white">Get Verified</h4>
                    <p className="text-slate-600 dark:text-slate-300 text-sm">Complete KYC and business verification</p>
                  </div>
                </div>
                <div className="relative">
                  <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border-2 border-indigo-200 dark:border-indigo-500/50 hover:shadow-xl transition-shadow">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-xl mb-4 shadow-lg">
                      3
                    </div>
                    <h4 className="font-bold text-lg mb-2 text-slate-900 dark:text-white">Get Funded</h4>
                    <p className="text-slate-600 dark:text-slate-300 text-sm">Launch your deal and receive investments</p>
                  </div>
                </div>
                <div className="relative">
                  <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border-2 border-indigo-200 dark:border-indigo-500/50 hover:shadow-xl transition-shadow">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-xl mb-4 shadow-lg">
                      4
                    </div>
                    <h4 className="font-bold text-lg mb-2 text-slate-900 dark:text-white">Share Revenue</h4>
                    <p className="text-slate-600 dark:text-slate-300 text-sm">Report monthly revenue and share profits</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Deals - Trading Platform Style */}
      <section className="py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-2">
                Live Investment Opportunities
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-300">
                Trending deals from verified South African businesses
              </p>
            </div>
            <Link href="/deals">
              <Button variant="outline" className="hidden md:flex">
                View All Deals
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {fakeDealss.map((deal, index) => {
              const percentFunded = (deal.funded / deal.fundingGoal) * 100;
              const isGrowing = deal.revenueGrowth > 0;
              
              // Assign colors based on index
              const borderColors = [
                'border-l-4 border-emerald-500 dark:border-emerald-400',
                'border-l-4 border-yellow-500 dark:border-yellow-400',
                'border-l-4 border-blue-500 dark:border-blue-400',
                'border-l-4 border-purple-500 dark:border-purple-400',
              ];
              const borderColor = borderColors[index % borderColors.length];
              
              return (
                <div
                  key={deal.id}
                  className={`group bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl border-2 border-slate-100 dark:border-slate-700 hover:border-slate-200 dark:hover:border-slate-600 hover:-translate-y-1 transition-all duration-300 ${borderColor} backdrop-blur-sm`}
                >
                  {/* Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-2xl shadow-lg ring-4 ring-white dark:ring-slate-800">
                        {deal.logo}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                          {deal.name}
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{deal.industry}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-sm font-semibold">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                      <span>ACTIVE</span>
                    </div>
                  </div>

                  {/* Key Metrics */}
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900/50 dark:to-slate-900/30 rounded-xl p-3 border border-slate-200 dark:border-slate-700">
                      <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Monthly Revenue</div>
                      <div className="font-bold text-slate-900 dark:text-white">
                        R{(deal.monthlyRevenue / 1000).toFixed(0)}k
                      </div>
                      <div className={`flex items-center text-xs mt-1 ${isGrowing ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                        {isGrowing ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                        {deal.revenueGrowth}%
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900/50 dark:to-slate-900/30 rounded-xl p-3 border border-slate-200 dark:border-slate-700">
                      <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Target Return</div>
                      <div className="font-bold text-slate-900 dark:text-white">
                        {deal.targetReturn}x
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Capped</div>
                    </div>
                    <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900/50 dark:to-slate-900/30 rounded-xl p-3 border border-slate-200 dark:border-slate-700">
                      <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Min Investment</div>
                      <div className="font-bold text-slate-900 dark:text-white">
                        R{(deal.minInvestment / 1000).toFixed(0)}k
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Entry</div>
                    </div>
                  </div>

                  {/* Funding Progress */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                        Funding Progress
                      </span>
                      <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                        {percentFunded.toFixed(0)}%
                      </span>
                    </div>
                    <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full transition-all duration-500"
                        style={{ width: `${percentFunded}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        R{(deal.funded / 1000).toFixed(0)}k raised
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        R{(deal.fundingGoal / 1000).toFixed(0)}k goal
                      </span>
                    </div>
                  </div>

                  {/* Bottom Stats */}
                  <div className="flex justify-between items-center pt-4 border-t border-slate-200 dark:border-slate-700">
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center text-slate-600 dark:text-slate-300">
                        <Users className="h-4 w-4 mr-1" />
                        {deal.investors} investors
                      </div>
                      <div className="flex items-center text-slate-600 dark:text-slate-300">
                        <Clock className="h-4 w-4 mr-1" />
                        {deal.daysLeft} days left
                      </div>
                    </div>
                    <Link href={`/deals/${deal.id}`}>
                      <Button size="sm" className="shadow-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 group-hover:scale-105 transition-transform">
                        View Deal
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-8 md:hidden">
            <Link href="/deals">
              <Button variant="outline" className="w-full">
                View All Deals
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl mb-10 text-blue-100">
              Join thousands of South Africans building a stronger economy together
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register?role=investor">
                <Button size="lg" variant="secondary" className="text-lg px-8 py-6 w-full sm:w-auto">
                  Start Investing Today
                </Button>
              </Link>
              <Link href="/register?role=business">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6 w-full sm:w-auto bg-transparent text-white border-white hover:bg-white hover:text-blue-600">
                  Apply for Funding
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 dark:bg-slate-950 text-slate-300 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">O</span>
                </div>
                <span className="text-white font-bold text-xl">Octrivium</span>
              </div>
              <p className="text-sm text-slate-400">
                Empowering South African businesses through community investment.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Platform</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/deals" className="hover:text-white transition-colors">Browse Deals</Link></li>
                <li><Link href="/how-it-works" className="hover:text-white transition-colors">How It Works</Link></li>
                <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/risk" className="hover:text-white transition-colors">Risk Disclosure</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Contact</h4>
              <ul className="space-y-2 text-sm">
                <li>support@octrivium.co.za</li>
                <li>+27 (0) 21 123 4567</li>
                <li>Cape Town, South Africa</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-sm text-center text-slate-400">
            <p>&copy; 2025 Octrivium Funding. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
