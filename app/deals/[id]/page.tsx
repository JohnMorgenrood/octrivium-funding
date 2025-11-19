'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Navigation } from '@/components/navigation';
import { ArrowLeft, Building2, Users, MapPin, ArrowUpRight, Clock, Shield, DollarSign, CreditCard, ChevronDown, ChevronUp, FileText, TrendingUp, Target, Award, Calendar, Briefcase, Lock, Info } from 'lucide-react';
import { useState } from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { motion, AnimatePresence } from 'framer-motion';

const fakeDeals: any[] = [
  { id: 1, name: 'Green Energy Solutions', industry: 'Renewable Energy', description: 'Solar panel installation company', fundingGoal: 500000, funded: 425000, investors: 89, monthlyRevenue: 180000, revenueGrowth: 15.5, daysLeft: 12, minInvestment: 1000, targetReturn: 1.5, riskLevel: 'Medium', riskScore: 5, logo: '🔋', location: 'Cape Town', founded: 2020, employees: 24 },
  { id: 2, name: 'Cape Town Coffee Co.', industry: 'Food & Beverage', description: 'Specialty coffee chain', fundingGoal: 750000, funded: 680000, investors: 124, monthlyRevenue: 320000, revenueGrowth: 22.3, daysLeft: 8, minInvestment: 1000, targetReturn: 1.3, riskLevel: 'Low', riskScore: 3, logo: '☕', location: 'Cape Town', founded: 2019, employees: 45 },
  { id: 3, name: 'Tech Innovators SA', industry: 'FinTech', description: 'Mobile payment platform', fundingGoal: 1000000, funded: 340000, investors: 67, monthlyRevenue: 95000, revenueGrowth: 45.2, daysLeft: 25, minInvestment: 5000, targetReturn: 1.7, riskLevel: 'High', riskScore: 7, logo: '💳', location: 'Johannesburg', founded: 2021, employees: 18 },
  { id: 4, name: 'African Fashion Hub', industry: 'E-commerce', description: 'Online fashion marketplace', fundingGoal: 350000, funded: 285000, investors: 52, monthlyRevenue: 125000, revenueGrowth: 18.7, daysLeft: 15, minInvestment: 1000, targetReturn: 1.4, riskLevel: 'Medium', riskScore: 5, logo: '👗', location: 'Durban', founded: 2020, employees: 12 },
  { id: 5, name: 'Swift Logistics ZA', industry: 'Logistics', description: 'Electric delivery service', fundingGoal: 2000000, funded: 1250000, investors: 156, monthlyRevenue: 450000, revenueGrowth: 12.4, daysLeft: 18, minInvestment: 2500, targetReturn: 1.35, riskLevel: 'Medium', riskScore: 4, logo: '🚚', location: 'Johannesburg', founded: 2019, employees: 68 },
];

export default function DealDetailPage({ params }: { params: { id: string } }) {
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal'>('card');
  const [processing, setProcessing] = useState(false);
  const [expandedSection, setExpandedSection] = useState<'about' | 'terms' | 'risk' | null>(null);
  const [showRevenueTooltip, setShowRevenueTooltip] = useState(false);
  const deal = fakeDeals.find(d => d.id === parseInt(params.id)) || fakeDeals[0];
  const percentFunded = (deal.funded / deal.fundingGoal) * 100;

  const toggleSection = (section: 'about' | 'terms' | 'risk') => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
      case 'Medium': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'High': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-slate-50 to-gray-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <div className="container mx-auto px-4 py-6 md:py-8 max-w-7xl">
        <Link href="/deals">
          <Button variant="ghost" className="mb-6 hover:bg-slate-100 dark:hover:bg-slate-800">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Deals
          </Button>
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Hero Card */}
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-slate-200/50 dark:border-slate-700/50">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-4xl shadow-lg">
                    {deal.logo}
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent mb-2">
                      {deal.name}
                    </h1>
                    <div className="flex flex-wrap items-center gap-3 text-slate-600 dark:text-slate-400">
                      <span className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 dark:bg-slate-700/50 rounded-full text-sm">
                        <Building2 className="h-4 w-4" />{deal.industry}
                      </span>
                      <span className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 dark:bg-slate-700/50 rounded-full text-sm">
                        <MapPin className="h-4 w-4" />{deal.location}
                      </span>
                      <span className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 dark:bg-slate-700/50 rounded-full text-sm">
                        <Calendar className="h-4 w-4" />Est. {deal.founded}
                      </span>
                    </div>
                  </div>
                </div>
                <Badge className={getRiskColor(deal.riskLevel)}>{deal.riskLevel} Risk</Badge>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-4 border border-blue-200/50 dark:border-blue-700/50">
                  <Users className="h-5 w-5 text-blue-600 dark:text-blue-400 mb-2" />
                  <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">Employees</div>
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">{deal.employees}</div>
                </div>
                
                <div className="relative bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl p-4 border border-emerald-200/50 dark:border-emerald-700/50">
                  <div 
                    className="absolute inset-0 bg-gradient-to-br from-slate-900/80 to-slate-800/80 dark:from-slate-700/80 dark:to-slate-600/80 backdrop-blur-sm rounded-xl flex items-center justify-center cursor-pointer"
                    onMouseEnter={() => setShowRevenueTooltip(true)}
                    onMouseLeave={() => setShowRevenueTooltip(false)}
                  >
                    <div className="text-center">
                      <Lock className="h-6 w-6 text-white mx-auto mb-2" />
                      <div className="text-xs text-white font-medium">Private</div>
                    </div>
                  </div>
                  
                  {showRevenueTooltip && (
                    <div className="absolute -top-24 left-1/2 transform -translate-x-1/2 z-50 w-64 bg-slate-900 dark:bg-slate-700 text-white text-xs rounded-lg p-3 shadow-xl">
                      <div className="flex items-start gap-2">
                        <Info className="h-4 w-4 text-blue-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <div className="font-semibold mb-1">Revenue Information</div>
                          <div className="text-slate-300">Only visible to investors who have funded this deal</div>
                        </div>
                      </div>
                      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-slate-900 dark:bg-slate-700 rotate-45"></div>
                    </div>
                  )}
                  
                  <DollarSign className="h-5 w-5 text-emerald-600 dark:text-emerald-400 mb-2 opacity-20" />
                  <div className="text-sm text-slate-600 dark:text-slate-400 mb-1 opacity-20">Revenue</div>
                  <div className="text-2xl font-bold text-slate-900 dark:text-white opacity-20">R***k</div>
                </div>
                
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-4 border border-purple-200/50 dark:border-purple-700/50">
                  <TrendingUp className="h-5 w-5 text-purple-600 dark:text-purple-400 mb-2" />
                  <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">Growth</div>
                  <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 flex items-center">
                    <ArrowUpRight className="h-5 w-5 mr-1" />{deal.revenueGrowth}%
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl p-4 border border-amber-200/50 dark:border-amber-700/50">
                  <Target className="h-5 w-5 text-amber-600 dark:text-amber-400 mb-2" />
                  <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">Target Return</div>
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">{deal.targetReturn}x</div>
                </div>
              </div>
            </div>

            {/* About Business Section */}
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/50 dark:border-slate-700/50 overflow-hidden">
              <button
                onClick={() => toggleSection('about')}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Briefcase className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">About the Business</h2>
                </div>
                {expandedSection === 'about' ? (
                  <ChevronUp className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                )}
              </button>
              
              <AnimatePresence>
                {expandedSection === 'about' && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 space-y-4">
                      <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                        {deal.description}
                      </p>
                      <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-4">
                        <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Company Highlights</h3>
                        <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                          <li className="flex items-start gap-2">
                            <span className="text-emerald-500">✓</span>
                            <span>Established in {deal.founded} with {deal.employees} dedicated team members</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-emerald-500">✓</span>
                            <span>Strong growth trajectory with {deal.revenueGrowth}% revenue increase</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-emerald-500">✓</span>
                            <span>Verified business operations and KYC compliance</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Terms & Conditions Section */}
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/50 dark:border-slate-700/50 overflow-hidden">
              <button
                onClick={() => toggleSection('terms')}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">Terms & Conditions</h2>
                </div>
                {expandedSection === 'terms' ? (
                  <ChevronUp className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                )}
              </button>
              
              <AnimatePresence>
                {expandedSection === 'terms' && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 space-y-4">
                      <div className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
                        <div>
                          <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Investment Terms</h3>
                          <ul className="space-y-2">
                            <li className="flex items-start gap-2">
                              <span className="text-blue-500 mt-1">•</span>
                              <span><strong>Minimum Investment:</strong> R{deal.minInvestment.toLocaleString()}</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-blue-500 mt-1">•</span>
                              <span><strong>Target Return:</strong> {deal.targetReturn}x of your investment</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-blue-500 mt-1">•</span>
                              <span><strong>Revenue Share:</strong> Monthly payments based on business revenue</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-blue-500 mt-1">•</span>
                              <span><strong>Repayment Cap:</strong> Fixed at {deal.targetReturn}x - you never pay more</span>
                            </li>
                          </ul>
                        </div>
                        
                        <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
                          <div className="flex items-start gap-3 mb-3">
                            <Shield className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                            <h3 className="font-semibold text-slate-900 dark:text-white">Important to Understand</h3>
                          </div>
                          <ul className="space-y-2 text-sm">
                            <li className="flex items-start gap-2">
                              <span className="text-amber-500 mt-1">•</span>
                              <span>All investments carry risk. You could lose some or all of your capital.</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-amber-500 mt-1">•</span>
                              <span>Returns are based on business performance and are not guaranteed.</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-amber-500 mt-1">•</span>
                              <span>Your investment is not protected by deposit insurance schemes.</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-amber-500 mt-1">•</span>
                              <span>Investments are illiquid - you may not be able to sell your position easily.</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-amber-500 mt-1">•</span>
                              <span>Tax treatment depends on individual circumstances and may change.</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-amber-500 mt-1">•</span>
                              <span>Only invest money you can afford to lose without affecting your lifestyle.</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Risk Assessment Section */}
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/50 dark:border-slate-700/50 overflow-hidden">
              <button
                onClick={() => toggleSection('risk')}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg">
                    <Shield className="h-5 w-5 text-white" />
                  </div>
                  <div className="text-left">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Risk Assessment</h2>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Risk Score: {deal.riskScore}/10</p>
                  </div>
                </div>
                {expandedSection === 'risk' ? (
                  <ChevronUp className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                )}
              </button>
              
              <AnimatePresence>
                {expandedSection === 'risk' && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 space-y-4">
                      <div>
                        <div className="flex justify-between mb-2 text-sm">
                          <span className="text-slate-600 dark:text-slate-400">Risk Level</span>
                          <span className="font-semibold text-slate-900 dark:text-white">{deal.riskScore}/10</span>
                        </div>
                        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${
                              deal.riskScore <= 3 ? 'bg-gradient-to-r from-emerald-500 to-emerald-600' :
                              deal.riskScore <= 6 ? 'bg-gradient-to-r from-yellow-500 to-amber-600' :
                              'bg-gradient-to-r from-orange-500 to-red-600'
                            }`}
                            style={{ width: `${(deal.riskScore / 10) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div className="space-y-3 text-sm">
                        <h3 className="font-semibold text-slate-900 dark:text-white">Risk Factors</h3>
                        <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                          <li className="flex items-start gap-2">
                            <span className="text-slate-400 mt-1">•</span>
                            <span><strong>Market Risk:</strong> Industry competition and market conditions may impact performance</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-slate-400 mt-1">•</span>
                            <span><strong>Business Risk:</strong> Operational challenges may affect revenue generation</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-slate-400 mt-1">•</span>
                            <span><strong>Liquidity Risk:</strong> Limited ability to exit investment before full repayment</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Trust Badges */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border border-blue-200/50 dark:border-blue-700/50">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <Award className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                Why Invest with Confidence
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-emerald-500 rounded-lg">
                    <Shield className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-white text-sm">Verified Business</div>
                    <div className="text-xs text-slate-600 dark:text-slate-400">Full KYC & due diligence completed</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-500 rounded-lg">
                    <FileText className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-white text-sm">Transparent Reporting</div>
                    <div className="text-xs text-slate-600 dark:text-slate-400">Monthly updates on performance</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-purple-500 rounded-lg">
                    <Lock className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-white text-sm">Secure Payments</div>
                    <div className="text-xs text-slate-600 dark:text-slate-400">Bank-grade encryption</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Investment Sidebar */}
          <div className="space-y-6">
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border-2 border-indigo-500/50 dark:border-indigo-400/50 lg:sticky lg:top-8">
              <div className="mb-6">
                <div className="flex justify-between mb-3">
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Campaign Progress</span>
                  <span className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    {percentFunded.toFixed(0)}%
                  </span>
                </div>
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-full mb-3 overflow-hidden">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(percentFunded, 100)}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  ></motion.div>
                </div>
                <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
                  <span>R{(deal.funded / 1000).toFixed(0)}k</span>
                  <span>R{(deal.fundingGoal / 1000).toFixed(0)}k</span>
                </div>
              </div>

              <div className="space-y-2 md:space-y-3 mb-4 md:mb-6">
                <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                  <Users className="h-4 w-4 mr-2" />{deal.investors} investors
                </div>
                <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                  <Clock className="h-4 w-4 mr-2" />{deal.daysLeft} days left
                </div>
                <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                  <Shield className="h-4 w-4 mr-2" />Verified & KYC Approved
                </div>
              </div>

              <div className="border-t border-slate-200 dark:border-slate-700 pt-4 md:pt-6">
                <Label className="text-sm md:text-base text-slate-900 dark:text-white mb-2 block font-semibold">Amount (R)</Label>
                <Input 
                  type="number" 
                  placeholder={`Min: R${deal.minInvestment}`} 
                  value={investmentAmount} 
                  onChange={(e) => setInvestmentAmount(e.target.value)} 
                  className="mb-4 text-base md:text-lg h-12 md:h-14" 
                />
                {investmentAmount && parseFloat(investmentAmount) >= deal.minInvestment && (
                  <>
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 md:p-4 mb-4">
                      <div className="text-xs md:text-sm text-slate-600 dark:text-slate-400">Potential Return ({deal.targetReturn}x)</div>
                      <div className="text-xl md:text-2xl font-bold text-blue-600 dark:text-blue-400">R{(parseFloat(investmentAmount) * deal.targetReturn).toFixed(2)}</div>
                    </div>

                    {/* Payment Method Selection */}
                    <div className="mb-4">
                      <Label className="text-sm text-slate-900 dark:text-white mb-3 block">Payment Method</Label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={() => setPaymentMethod('card')}
                          className={`p-3 rounded-lg border-2 transition-all ${
                            paymentMethod === 'card'
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                              : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                          }`}
                        >
                          <CreditCard className="h-5 w-5 mx-auto mb-1" />
                          <div className="text-xs font-medium">Card</div>
                        </button>
                        <button
                          onClick={() => setPaymentMethod('paypal')}
                          className={`p-3 rounded-lg border-2 transition-all ${
                            paymentMethod === 'paypal'
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                              : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                          }`}
                        >
                          <svg className="h-5 w-5 mx-auto mb-1" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 3.72a.77.77 0 0 1 .76-.633h7.2c3.135 0 5.26 1.885 5.26 4.657 0 3.44-2.315 5.86-5.645 5.86h-3.29l-1.153 7.733zm5.31-13.334h-2.82l-.966 6.465h2.82c2.083 0 3.445-1.365 3.445-3.465 0-1.574-.922-3-2.479-3z"/>
                          </svg>
                          <div className="text-xs font-medium">PayPal</div>
                        </button>
                      </div>
                    </div>

                    {/* Card Payment Button */}
                    {paymentMethod === 'card' && (
                      <Button 
                        className="w-full h-12 md:h-14 text-base md:text-lg" 
                        size="lg"
                        disabled={processing}
                      >
                        <CreditCard className="h-5 w-5 mr-2" />
                        {processing ? 'Processing...' : 'Pay with Card'}
                      </Button>
                    )}

                    {/* PayPal Button */}
                    {paymentMethod === 'paypal' && (
                      <PayPalScriptProvider
                        options={{
                          clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || 'sb',
                          currency: 'ZAR',
                        }}
                      >
                        <PayPalButtons
                          style={{ layout: 'vertical', label: 'pay' }}
                          disabled={processing}
                          createOrder={async () => {
                            setProcessing(true);
                            try {
                              const response = await fetch('/api/paypal/create-order', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                  amount: parseFloat(investmentAmount),
                                  dealId: deal.id,
                                  dealName: deal.name,
                                }),
                              });
                              const data = await response.json();
                              return data.orderId;
                            } catch (error) {
                              console.error('Error creating order:', error);
                              setProcessing(false);
                              throw error;
                            }
                          }}
                          onApprove={async (data) => {
                            try {
                              const response = await fetch('/api/paypal/capture-order', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                  orderId: data.orderID,
                                  dealId: deal.id,
                                  amount: parseFloat(investmentAmount),
                                }),
                              });
                              const result = await response.json();
                              if (result.success) {
                                alert('Investment successful!');
                                window.location.href = '/dashboard';
                              }
                            } catch (error) {
                              console.error('Error capturing order:', error);
                              alert('Payment failed. Please try again.');
                            } finally {
                              setProcessing(false);
                            }
                          }}
                          onError={(err) => {
                            console.error('PayPal error:', err);
                            alert('Payment failed. Please try again.');
                            setProcessing(false);
                          }}
                        />
                      </PayPalScriptProvider>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </>
  );
}
