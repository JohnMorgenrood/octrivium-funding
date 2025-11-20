'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  CreditCard, 
  PieChart,
  FileText
} from 'lucide-react';

interface SARSToolsProps {
  data: {
    totalRevenue: number;
    totalExpenses: number;
    profit: number;
    profitMargin: number;
    totalInvoiced: number;
    totalPaid: number;
    totalOutstanding: number;
    vatCollected: number;
    vatPaid: number;
    taxableIncome: number;
  };
}

export default function SARSTools({ data }: SARSToolsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">SARS Tools</h1>
        <p className="text-muted-foreground mt-1">
          Financial overview for tax and compliance reporting
        </p>
      </div>

      {/* Profit & Loss Summary */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Revenue
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(data.totalRevenue)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Income from invoices
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Expenses
              </CardTitle>
              <TrendingDown className="h-4 w-4 text-red-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(data.totalExpenses)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Business expenses
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Net Profit
              </CardTitle>
              <DollarSign className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${data.profit >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
              {formatCurrency(data.profit)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Margin: {formatPercentage(data.profitMargin)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Taxable Income
              </CardTitle>
              <FileText className="h-4 w-4 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {formatCurrency(data.taxableIncome)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              For tax purposes
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Credits & Debits */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-green-600" />
              Credits (Money In)
            </CardTitle>
            <CardDescription>Income and receivables</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center pb-2 border-b">
              <span className="text-sm text-muted-foreground">Total Invoiced</span>
              <span className="font-semibold">{formatCurrency(data.totalInvoiced)}</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b">
              <span className="text-sm text-muted-foreground">Paid Invoices</span>
              <span className="font-semibold text-green-600">{formatCurrency(data.totalPaid)}</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b">
              <span className="text-sm text-muted-foreground">Outstanding</span>
              <span className="font-semibold text-orange-600">{formatCurrency(data.totalOutstanding)}</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t-2">
              <span className="font-medium">Net Credits</span>
              <span className="font-bold text-lg text-green-600">
                {formatCurrency(data.totalPaid)}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-red-600" />
              Debits (Money Out)
            </CardTitle>
            <CardDescription>Expenses and payables</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center pb-2 border-b">
              <span className="text-sm text-muted-foreground">Total Expenses</span>
              <span className="font-semibold text-red-600">{formatCurrency(data.totalExpenses)}</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b">
              <span className="text-sm text-muted-foreground">VAT Paid</span>
              <span className="font-semibold">{formatCurrency(data.vatPaid)}</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b">
              <span className="text-sm text-muted-foreground">Outstanding Payables</span>
              <span className="font-semibold text-orange-600">R0.00</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t-2">
              <span className="font-medium">Net Debits</span>
              <span className="font-bold text-lg text-red-600">
                {formatCurrency(data.totalExpenses + data.vatPaid)}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* VAT Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="h-5 w-5 text-blue-600" />
            VAT Summary
          </CardTitle>
          <CardDescription>Value Added Tax overview</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">VAT Collected (Output)</p>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(data.vatCollected)}
              </p>
              <p className="text-xs text-muted-foreground">From sales</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">VAT Paid (Input)</p>
              <p className="text-2xl font-bold text-orange-600">
                {formatCurrency(data.vatPaid)}
              </p>
              <p className="text-xs text-muted-foreground">On expenses</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">VAT Payable to SARS</p>
              <p className={`text-2xl font-bold ${(data.vatCollected - data.vatPaid) >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                {formatCurrency(data.vatCollected - data.vatPaid)}
              </p>
              <p className="text-xs text-muted-foreground">
                {(data.vatCollected - data.vatPaid) >= 0 ? 'Amount owed' : 'Refund due'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tax Calculation Guide */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="text-blue-900">Tax Calculation Reference</CardTitle>
          <CardDescription className="text-blue-700">
            Estimated tax based on taxable income
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-blue-900">Taxable Income:</span>
            <span className="font-semibold text-blue-900">{formatCurrency(data.taxableIncome)}</span>
          </div>
          <div className="text-xs text-blue-700 space-y-1">
            <p>• Individual: Progressive rates from 18% to 45%</p>
            <p>• Small Business Corporation: 0% - 28% (turnover-based)</p>
            <p>• Company: 27% flat rate</p>
            <p className="pt-2 font-medium">Consult with a tax professional for accurate calculations</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
