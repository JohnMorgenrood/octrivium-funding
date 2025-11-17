'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Navigation } from '@/components/navigation';
import { ArrowLeft, Building2, Users, MapPin, ArrowUpRight, Clock, Shield, DollarSign, CreditCard } from 'lucide-react';
import { useState } from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';

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
  const deal = fakeDeals.find(d => d.id === parseInt(params.id)) || fakeDeals[0];
  const percentFunded = (deal.funded / deal.fundingGoal) * 100;

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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950">
        <div className="container mx-auto px-4 py-6 md:py-8">
        <Link href="/deals">
          <Button variant="ghost" className="mb-4 md:mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Deals
          </Button>
        </Link>

        <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 md:p-6 lg:p-8 shadow-xl border-l-4 border-emerald-500 dark:border-emerald-400">
              <div className="flex flex-col sm:flex-row items-start justify-between mb-4 md:mb-6 gap-4">
                <div className="flex items-center space-x-3 md:space-x-4">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-3xl md:text-4xl shadow-lg ring-4 ring-white dark:ring-slate-800 flex-shrink-0">
                    {deal.logo}
                  </div>
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2">{deal.name}</h1>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 text-sm md:text-base text-slate-600 dark:text-slate-400 gap-1 sm:gap-0">
                      <span className="flex items-center"><Building2 className="h-4 w-4 mr-1" />{deal.industry}</span>
                      <span className="flex items-center"><MapPin className="h-4 w-4 mr-1" />{deal.location}</span>
                    </div>
                  </div>
                </div>
                <Badge className={getRiskColor(deal.riskLevel)}>{deal.riskLevel} Risk</Badge>
              </div>

              <p className="text-base md:text-lg text-slate-600 dark:text-slate-300 mb-4 md:mb-6">{deal.description}</p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-3 md:p-4">
                  <div className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mb-1">Founded</div>
                  <div className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">{deal.founded}</div>
                </div>
                <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-3 md:p-4">
                  <div className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mb-1">Employees</div>
                  <div className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">{deal.employees}</div>
                </div>
                <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-3 md:p-4">
                  <div className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mb-1">Revenue</div>
                  <div className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">R{(deal.monthlyRevenue / 1000).toFixed(0)}k</div>
                </div>
                <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-3 md:p-4">
                  <div className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mb-1">Growth</div>
                  <div className="text-xl md:text-2xl font-bold flex items-center text-emerald-600 dark:text-emerald-400">
                    <ArrowUpRight className="h-4 w-4 md:h-5 md:w-5 mr-1" />{deal.revenueGrowth}%
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 md:p-6 shadow-xl border-2 border-yellow-500 dark:border-yellow-400 lg:sticky lg:top-8">
              <div className="mb-4 md:mb-6">
                <div className="flex justify-between mb-3">
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Progress</span>
                  <span className="text-base md:text-lg font-bold text-blue-600 dark:text-blue-400">{percentFunded.toFixed(0)}%</span>
                </div>
                <div className="h-3 md:h-4 bg-slate-200 dark:bg-slate-700 rounded-full mb-3">
                  <div className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full" style={{ width: `${Math.min(percentFunded, 100)}%` }}></div>
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
