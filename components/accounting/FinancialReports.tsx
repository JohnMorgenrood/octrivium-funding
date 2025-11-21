'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrendingUp, TrendingDown, DollarSign, Receipt, Download, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Invoice {
  id: string;
  total: any;
  status: string;
  dueDate: Date;
  createdAt: Date;
  paidAt: Date | null;
}

interface Expense {
  id: string;
  amount: any;
  category: string;
  date: Date;
  taxAmount: any;
}

interface FinancialReportsProps {
  invoices: Invoice[];
  expenses: Expense[];
}

export default function FinancialReports({ invoices, expenses }: FinancialReportsProps) {
  const [period, setPeriod] = useState('thisMonth');
  const [reportType, setReportType] = useState('profitLoss');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
    }).format(amount);
  };

  // Filter data by period
  const getFilteredData = (period: string) => {
    const now = new Date();
    let startDate: Date;

    switch (period) {
      case 'thisMonth':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'lastMonth':
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        break;
      case 'thisQuarter':
        const quarterStart = Math.floor(now.getMonth() / 3) * 3;
        startDate = new Date(now.getFullYear(), quarterStart, 1);
        break;
      case 'thisYear':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      case 'lastYear':
        startDate = new Date(now.getFullYear() - 1, 0, 1);
        break;
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    const endDate = period === 'lastMonth' 
      ? new Date(now.getFullYear(), now.getMonth(), 0) 
      : period === 'lastYear'
      ? new Date(now.getFullYear() - 1, 11, 31)
      : now;

    return {
      invoices: invoices.filter(inv => {
        const date = inv.paidAt || inv.createdAt;
        return date >= startDate && date <= endDate;
      }),
      expenses: expenses.filter(exp => {
        const date = new Date(exp.date);
        return date >= startDate && date <= endDate;
      }),
    };
  };

  const { invoices: filteredInvoices, expenses: filteredExpenses } = getFilteredData(period);

  // Calculate metrics
  const metrics = useMemo(() => {
    const totalRevenue = filteredInvoices
      .filter(inv => inv.status === 'PAID')
      .reduce((sum, inv) => sum + Number(inv.total), 0);

    const totalExpenses = filteredExpenses
      .reduce((sum, exp) => sum + Number(exp.amount), 0);

    const netProfit = totalRevenue - totalExpenses;
    const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

    const pendingRevenue = filteredInvoices
      .filter(inv => inv.status !== 'PAID' && inv.status !== 'CANCELLED')
      .reduce((sum, inv) => sum + Number(inv.total), 0);

    return {
      totalRevenue,
      totalExpenses,
      netProfit,
      profitMargin,
      pendingRevenue,
    };
  }, [filteredInvoices, filteredExpenses]);

  // Expense breakdown
  const expensesByCategory = useMemo(() => {
    const categories: Record<string, number> = {};
    filteredExpenses.forEach(exp => {
      if (!categories[exp.category]) {
        categories[exp.category] = 0;
      }
      categories[exp.category] += Number(exp.amount);
    });
    return Object.entries(categories)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  }, [filteredExpenses]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Financial Reports</h1>
          <p className="text-sm text-muted-foreground mt-1">
            View profit & loss, cash flow, and financial insights
          </p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="thisMonth">This Month</SelectItem>
              <SelectItem value="lastMonth">Last Month</SelectItem>
              <SelectItem value="thisQuarter">This Quarter</SelectItem>
              <SelectItem value="thisYear">This Year</SelectItem>
              <SelectItem value="lastYear">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(metrics.totalRevenue)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {filteredInvoices.filter(i => i.status === 'PAID').length} paid invoices
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-red-500" />
              Total Expenses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(metrics.totalExpenses)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {filteredExpenses.length} expenses recorded
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-blue-500" />
              Net Profit
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${metrics.netProfit >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
              {formatCurrency(metrics.netProfit)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {metrics.profitMargin.toFixed(1)}% profit margin
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Receipt className="h-4 w-4 text-orange-500" />
              Pending Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {formatCurrency(metrics.pendingRevenue)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {filteredInvoices.filter(i => i.status !== 'PAID' && i.status !== 'CANCELLED').length} unpaid invoices
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Profit & Loss Statement */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Profit & Loss Statement
          </CardTitle>
          <CardDescription>Income and expenses breakdown</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Revenue Section */}
            <div>
              <h3 className="font-semibold text-lg mb-3 flex items-center justify-between">
                <span>Revenue</span>
                <span className="text-green-600">{formatCurrency(metrics.totalRevenue)}</span>
              </h3>
              <div className="space-y-2 pl-4 border-l-2 border-green-200">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Invoices Paid</span>
                  <span className="font-medium">{formatCurrency(metrics.totalRevenue)}</span>
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-semibold text-lg mb-3 flex items-center justify-between">
                <span>Expenses</span>
                <span className="text-red-600">{formatCurrency(metrics.totalExpenses)}</span>
              </h3>
              <div className="space-y-2 pl-4 border-l-2 border-red-200">
                {expensesByCategory.map(([category, amount]) => (
                  <div key={category} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{category.replace(/_/g, ' ')}</span>
                    <span className="font-medium">{formatCurrency(amount)}</span>
                  </div>
                ))}
                {expensesByCategory.length === 0 && (
                  <p className="text-sm text-muted-foreground italic">No expenses recorded</p>
                )}
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 rounded-lg">
                <span className="font-bold text-lg">Net Profit</span>
                <div className="text-right">
                  <div className={`text-2xl font-bold ${metrics.netProfit >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                    {formatCurrency(metrics.netProfit)}
                  </div>
                  <Badge variant={metrics.netProfit >= 0 ? 'default' : 'destructive'} className="mt-1">
                    {metrics.profitMargin.toFixed(1)}% Margin
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top Expense Categories */}
      {expensesByCategory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5" />
              Top Expense Categories
            </CardTitle>
            <CardDescription>Your highest spending areas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {expensesByCategory.map(([category, amount], index) => {
                const percentage = (amount / metrics.totalExpenses) * 100;
                return (
                  <div key={category} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{category.replace(/_/g, ' ')}</span>
                      <span className="text-muted-foreground">
                        {formatCurrency(amount)} ({percentage.toFixed(0)}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          index === 0 ? 'bg-red-500' :
                          index === 1 ? 'bg-orange-500' :
                          index === 2 ? 'bg-yellow-500' :
                          index === 3 ? 'bg-blue-500' :
                          'bg-purple-500'
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
