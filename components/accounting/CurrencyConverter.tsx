'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle, TrendingDown } from 'lucide-react';

interface CurrencyConverterProps {
  zarAmount: number;
}

export default function CurrencyConverter({ zarAmount }: CurrencyConverterProps) {
  const [usdAmount, setUsdAmount] = useState<number | null>(null);
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  // PayPal fees: 3.9% + $0.30 for international payments
  const PAYPAL_PERCENTAGE_FEE = 0.039; // 3.9%
  const PAYPAL_FIXED_FEE = 0.30; // $0.30

  useEffect(() => {
    async function fetchExchangeRate() {
      try {
        // Using exchangerate-api.com (free tier: 1,500 requests/month)
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/ZAR');
        const data = await response.json();
        const rate = data.rates.USD;
        
        setExchangeRate(rate);
        const convertedAmount = zarAmount * rate;
        setUsdAmount(convertedAmount);
      } catch (error) {
        console.error('Failed to fetch exchange rate:', error);
        // Fallback rate (approximate)
        const fallbackRate = 0.055; // ~R18 per USD
        setExchangeRate(fallbackRate);
        setUsdAmount(zarAmount * fallbackRate);
      } finally {
        setLoading(false);
      }
    }

    fetchExchangeRate();
  }, [zarAmount]);

  if (loading || !usdAmount || !exchangeRate) {
    return (
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-blue-600">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span className="text-sm">Calculating conversion...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calculate PayPal fees
  const paypalFee = (usdAmount * PAYPAL_PERCENTAGE_FEE) + PAYPAL_FIXED_FEE;
  const amountAfterPayPal = usdAmount - paypalFee;
  
  // Convert back to ZAR after fees
  const zarAfterFees = amountAfterPayPal / exchangeRate;
  const totalFeesInZar = zarAmount - zarAfterFees;

  const formatUSD = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatZAR = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
      <CardContent className="p-6 space-y-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
            <TrendingDown className="w-5 h-5 text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-1">Currency Conversion</h3>
            <p className="text-xs text-gray-600 mb-3">
              PayPal processes in USD. Here's the breakdown:
            </p>
          </div>
        </div>

        <div className="space-y-3 bg-white rounded-lg p-4">
          <div className="flex justify-between items-center pb-2 border-b">
            <span className="text-sm text-gray-600">Invoice Amount (ZAR)</span>
            <span className="font-semibold text-gray-900">{formatZAR(zarAmount)}</span>
          </div>

          <div className="flex justify-between items-center pb-2 border-b">
            <span className="text-sm text-gray-600">
              Converted to USD
              <span className="block text-xs text-gray-400">Rate: 1 ZAR = {formatUSD(exchangeRate)}</span>
            </span>
            <span className="font-semibold text-gray-900">{formatUSD(usdAmount)}</span>
          </div>

          <div className="flex justify-between items-center pb-2 border-b">
            <span className="text-sm text-red-600">
              PayPal Fees
              <span className="block text-xs text-red-400">3.9% + $0.30</span>
            </span>
            <span className="font-semibold text-red-600">-{formatUSD(paypalFee)}</span>
          </div>

          <div className="flex justify-between items-center pt-2">
            <span className="text-sm font-semibold text-gray-900">You Receive (USD)</span>
            <span className="text-lg font-bold text-green-600">{formatUSD(amountAfterPayPal)}</span>
          </div>

          <div className="flex justify-between items-center pt-1 border-t">
            <span className="text-sm font-semibold text-gray-900">You Receive (ZAR)</span>
            <span className="text-lg font-bold text-green-600">{formatZAR(zarAfterFees)}</span>
          </div>

          <div className="flex justify-between items-center pt-1 text-xs text-gray-500">
            <span>Total Fees in ZAR</span>
            <span>{formatZAR(totalFeesInZar)} ({((totalFeesInZar / zarAmount) * 100).toFixed(1)}%)</span>
          </div>
        </div>

        <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg p-3">
          <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-amber-800">
            Exchange rates fluctuate. Final amount may vary slightly. PayPal also charges FNB transfer fees when withdrawing to your South African bank account.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
