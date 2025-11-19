'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  FileText, 
  AlertCircle,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Users,
} from 'lucide-react';
import { formatDistance } from 'date-fns';

interface Stats {
  totalIncome: number;
  totalExpenses: number;
  profit: number;
  overdueInvoices: number;
  totalInvoices: number;
  paidInvoices: number;
  unpaidAmount: number;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  status: string;
  total: any;
  dueDate: Date;
  customer: { name: string } | null;
}

interface Expense {
  id: string;
  description: string;
  category: string;
  amount: any;
  date: Date;
}

interface Transaction {
  id: string;
  description: string;
  category: string;
  amount: any;
  date: Date;
}

interface AccountingOverviewProps {
  stats: Stats;
  invoices: Invoice[];
  expenses: Expense[];
  transactions: Transaction[];
}

export default function AccountingOverview({
  stats,
  invoices,
  expenses,
  transactions,
}: AccountingOverviewProps) {
  const router = useRouter();
  const [timeRange, setTimeRange] = useState('month');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'OVERDUE':
        return 'bg-red-500/10 text-red-600 border-red-500/20';
      case 'SENT':
        return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      case 'DRAFT':
        return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
      default:
        return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      INCOME: 'text-green-600',
      EXPENSE: 'text-red-600',
      TRANSFER: 'text-blue-600',
    };
    return colors[category] || 'text-gray-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Accounting Overview</h1>
          <p className="text-muted-foreground mt-1">
            Track your finances, invoices, and expenses
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => router.push('/dashboard/accounting/customers')}>
            <Users className="h-4 w-4 mr-2" />
            Customers
          </Button>
          <Button onClick={() => router.push('/dashboard/accounting/expenses')}>
            <Plus className="h-4 w-4 mr-2" />
            Add Expense
          </Button>
          <Button onClick={() => router.push('/dashboard/accounting/invoices/create')}>
            <Plus className="h-4 w-4 mr-2" />
            Create Invoice
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(stats.totalIncome)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              This month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(stats.totalExpenses)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              This month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${stats.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(stats.profit)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.profit >= 0 ? 'Profitable' : 'Loss'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue Invoices</CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {stats.overdueInvoices}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {formatCurrency(stats.unpaidAmount)} unpaid
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Invoice Summary */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Invoice Summary</CardTitle>
              <CardDescription>Overview of your invoicing activity</CardDescription>
            </div>
            <Button variant="outline" onClick={() => router.push('/dashboard/accounting/invoices')}>
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3 mb-6">
            <div className="p-4 border rounded-lg">
              <p className="text-sm text-muted-foreground">Total Invoices</p>
              <p className="text-2xl font-bold mt-1">{stats.totalInvoices}</p>
            </div>
            <div className="p-4 border rounded-lg bg-green-500/5">
              <p className="text-sm text-muted-foreground">Paid</p>
              <p className="text-2xl font-bold text-green-600 mt-1">{stats.paidInvoices}</p>
            </div>
            <div className="p-4 border rounded-lg bg-orange-500/5">
              <p className="text-sm text-muted-foreground">Unpaid Amount</p>
              <p className="text-2xl font-bold text-orange-600 mt-1">
                {formatCurrency(stats.unpaidAmount)}
              </p>
            </div>
          </div>

          {/* Recent Invoices */}
          <div className="space-y-3">
            <h4 className="font-semibold text-sm">Recent Invoices</h4>
            {invoices.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-3 opacity-20" />
                <p>No invoices yet</p>
                <Button 
                  variant="link" 
                  onClick={() => router.push('/dashboard/accounting/invoices/create')}
                  className="mt-2"
                >
                  Create your first invoice
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                {invoices.map((invoice) => (
                  <div
                    key={invoice.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent cursor-pointer transition-colors"
                    onClick={() => router.push(`/dashboard/accounting/invoices/${invoice.id}`)}
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium text-sm">{invoice.invoiceNumber}</p>
                        <p className="text-xs text-muted-foreground">
                          {invoice.customer?.name || 'No customer'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="font-semibold text-sm">
                          {formatCurrency(Number(invoice.total))}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Due {formatDistance(new Date(invoice.dueDate), new Date(), { addSuffix: true })}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs border ${getStatusColor(invoice.status)}`}>
                        {invoice.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Expenses */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Expenses</CardTitle>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => router.push('/dashboard/accounting/expenses')}
              >
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {expenses.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p className="text-sm">No expenses recorded</p>
              </div>
            ) : (
              <div className="space-y-3">
                {expenses.map((expense) => (
                  <div key={expense.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium text-sm">{expense.description}</p>
                      <p className="text-xs text-muted-foreground">{expense.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-sm text-red-600">
                        -{formatCurrency(Number(expense.amount))}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDistance(new Date(expense.date), new Date(), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Transactions</CardTitle>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => router.push('/dashboard/accounting/transactions')}
              >
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {transactions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p className="text-sm">No transactions yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {transactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-2">
                      {transaction.category === 'INCOME' ? (
                        <ArrowUpRight className="h-4 w-4 text-green-600" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4 text-red-600" />
                      )}
                      <div>
                        <p className="font-medium text-sm">{transaction.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDistance(new Date(transaction.date), new Date(), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                    <p className={`font-semibold text-sm ${getCategoryColor(transaction.category)}`}>
                      {transaction.category === 'INCOME' ? '+' : '-'}
                      {formatCurrency(Number(transaction.amount))}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
