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
  Package,
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
    <div className="space-y-4 sm:space-y-6 px-2 sm:px-0">
      {/* Header */}
      <div className="space-y-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Accounting</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Track finances & invoices
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
          <Button 
            onClick={() => router.push('/dashboard/accounting/invoices/create')}
            className="w-full sm:w-auto"
          >
            <Plus className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Create Invoice</span>
            <span className="sm:hidden text-xs">Invoice</span>
          </Button>
          <Button 
            variant="outline" 
            onClick={() => router.push('/dashboard/accounting/customers')}
            className="w-full sm:w-auto"
          >
            <Users className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Customers</span>
            <span className="sm:hidden text-xs">Customers</span>
          </Button>
          <Button 
            variant="outline" 
            onClick={() => router.push('/dashboard/accounting/products')}
            className="w-full sm:w-auto"
          >
            <Package className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Products</span>
            <span className="sm:hidden text-xs">Products</span>
          </Button>
          <Button 
            variant="outline" 
            onClick={() => router.push('/dashboard/accounting/expenses')}
            className="w-full sm:w-auto col-span-2 sm:col-span-1"
          >
            <Plus className="h-4 w-4 sm:mr-2" />
            <span className="text-xs sm:text-sm">Add Expense</span>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-6">
            <CardTitle className="text-xs sm:text-sm font-medium">Income</CardTitle>
            <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
          </CardHeader>
          <CardContent className="p-3 pt-0 sm:p-6 sm:pt-0">
            <div className="text-lg sm:text-2xl font-bold text-green-600">
              {formatCurrency(stats.totalIncome)}
            </div>
            <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">
              This month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-6">
            <CardTitle className="text-xs sm:text-sm font-medium">Expenses</CardTitle>
            <TrendingDown className="h-3 w-3 sm:h-4 sm:w-4 text-red-600" />
          </CardHeader>
          <CardContent className="p-3 pt-0 sm:p-6 sm:pt-0">
            <div className="text-lg sm:text-2xl font-bold text-red-600">
              {formatCurrency(stats.totalExpenses)}
            </div>
            <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">
              This month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-6">
            <CardTitle className="text-xs sm:text-sm font-medium">Profit</CardTitle>
            <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
          </CardHeader>
          <CardContent className="p-3 pt-0 sm:p-6 sm:pt-0">
            <div className={`text-lg sm:text-2xl font-bold ${stats.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(stats.profit)}
            </div>
            <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">
              {stats.profit >= 0 ? 'Profitable' : 'Loss'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-6">
            <CardTitle className="text-xs sm:text-sm font-medium">Overdue</CardTitle>
            <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 text-orange-600" />
          </CardHeader>
          <CardContent className="p-3 pt-0 sm:p-6 sm:pt-0">
            <div className="text-lg sm:text-2xl font-bold text-orange-600">
              {stats.overdueInvoices}
            </div>
            <p className="text-[10px] sm:text-xs text-muted-foreground mt-1 truncate">
              {formatCurrency(stats.unpaidAmount)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Invoice Summary */}
      <Card>
        <CardHeader className="p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base sm:text-lg">Invoices</CardTitle>
              <CardDescription className="text-xs sm:text-sm">Overview of invoicing</CardDescription>
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
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border rounded-lg hover:bg-accent hover:border-primary transition-all gap-3"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-sm truncate">{invoice.invoiceNumber}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {invoice.customer?.name || 'No customer'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 justify-between sm:justify-end">
                      <div className="text-left sm:text-right">
                        <p className="font-semibold text-sm">
                          {formatCurrency(Number(invoice.total))}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Due {formatDistance(new Date(invoice.dueDate), new Date(), { addSuffix: true })}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs border flex-shrink-0 ${getStatusColor(invoice.status)}`}>
                        {invoice.status}
                      </span>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="flex-shrink-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/dashboard/accounting/invoices/${invoice.id}`);
                        }}
                      >
                        View
                      </Button>
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
