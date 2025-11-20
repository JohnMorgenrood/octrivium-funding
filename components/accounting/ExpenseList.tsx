'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Plus, Search, Filter, Receipt, Trash2, Edit, TrendingDown, Calendar, DollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Expense {
  id: string;
  date: Date;
  description: string;
  category: string;
  amount: number;
  vendor: string | null;
  receiptUrl: string | null;
  taxAmount: number | null;
  taxDeductible: boolean;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

interface ExpenseListProps {
  expenses: Expense[];
  stats: {
    totalExpenses: number;
    thisMonthExpenses: number;
    categoryTotals: Record<string, number>;
    expenseCount: number;
  };
}

const EXPENSE_CATEGORIES = [
  'OFFICE_SUPPLIES',
  'RENT',
  'UTILITIES',
  'SALARIES',
  'MARKETING',
  'TRAVEL',
  'MEALS',
  'INSURANCE',
  'LEGAL',
  'SOFTWARE',
  'EQUIPMENT',
  'MAINTENANCE',
  'OTHER',
];

export default function ExpenseList({ expenses: initialExpenses, stats: initialStats }: ExpenseListProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [expenses] = useState(initialExpenses);
  const [stats] = useState(initialStats);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [loading, setLoading] = useState(false);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    description: '',
    category: 'OTHER',
    amount: '',
    vendor: '',
    taxDeductible: true,
    isRecurring: false,
    recurringType: 'MONTHLY' as 'MONTHLY' | 'ANNUALLY' | 'CUSTOM',
    recurringInterval: 1,
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
    }).format(amount);
  };

  const formatCategoryName = (category: string) => {
    return category.split('_').map(word => 
      word.charAt(0) + word.slice(1).toLowerCase()
    ).join(' ');
  };

  const resetForm = () => {
    setFormData({
      date: new Date().toISOString().split('T')[0],
      description: '',
      category: 'OTHER',
      amount: '',
      vendor: '',
      taxDeductible: true,
      isRecurring: false,
      recurringType: 'MONTHLY',
      recurringInterval: 1,
    });
    setReceiptFile(null);
    setEditingExpense(null);
  };

  const handleOpenAdd = () => {
    resetForm();
    setShowAddDialog(true);
  };

  const handleOpenEdit = (expense: Expense) => {
    setFormData({
      date: new Date(expense.date).toISOString().split('T')[0],
      description: expense.description,
      category: expense.category,
      amount: expense.amount.toString(),
      vendor: expense.vendor || '',
      taxDeductible: expense.taxDeductible,
    });
    setEditingExpense(expense);
    setShowAddDialog(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: 'Error',
          description: 'Receipt file must be less than 5MB',
          variant: 'destructive',
        });
        return;
      }
      setReceiptFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let receiptUrl = editingExpense?.receiptUrl || null;

      // Upload receipt if new file selected
      if (receiptFile) {
        const uploadFormData = new FormData();
        uploadFormData.append('file', receiptFile);

        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: uploadFormData,
        });

        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          receiptUrl = uploadData.url;
        }
      }

      const taxAmount = formData.taxDeductible ? Number(formData.amount) * 0.15 : 0;

      // Calculate next due date for recurring expenses
      let nextDueDate = null;
      if (formData.isRecurring) {
        const startDate = new Date(formData.date);
        if (formData.recurringType === 'MONTHLY') {
          nextDueDate = new Date(startDate.setMonth(startDate.getMonth() + 1));
        } else if (formData.recurringType === 'ANNUALLY') {
          nextDueDate = new Date(startDate.setFullYear(startDate.getFullYear() + 1));
        } else if (formData.recurringType === 'CUSTOM') {
          nextDueDate = new Date(startDate.setMonth(startDate.getMonth() + formData.recurringInterval));
        }
      }

      const expenseData = {
        date: new Date(formData.date).toISOString(),
        description: formData.description,
        category: formData.category,
        amount: Number(formData.amount),
        vendor: formData.vendor || null,
        receiptUrl,
        taxAmount,
        taxDeductible: formData.taxDeductible,
        isRecurring: formData.isRecurring,
        recurringType: formData.isRecurring ? formData.recurringType : null,
        recurringInterval: formData.isRecurring && formData.recurringType === 'CUSTOM' ? formData.recurringInterval : null,
        nextDueDate: nextDueDate ? nextDueDate.toISOString() : null,
      };

      const url = editingExpense 
        ? `/api/accounting/expenses/${editingExpense.id}`
        : '/api/accounting/expenses';
      
      const method = editingExpense ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(expenseData),
      });

      if (!res.ok) throw new Error('Failed to save expense');

      toast({
        title: 'Success',
        description: `Expense ${editingExpense ? 'updated' : 'added'} successfully`,
      });

      setShowAddDialog(false);
      resetForm();
      router.refresh();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save expense',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (expenseId: string) => {
    if (!confirm('Are you sure you want to delete this expense?')) return;

    try {
      const res = await fetch(`/api/accounting/expenses/${expenseId}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to delete expense');

      toast({
        title: 'Success',
        description: 'Expense deleted successfully',
      });

      router.refresh();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete expense',
        variant: 'destructive',
      });
    }
  };

  const filteredExpenses = expenses.filter((expense) => {
    const matchesSearch = 
      expense.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      expense.vendor?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'ALL' || expense.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-4 sm:space-y-6 px-2 sm:px-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Expenses</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Track and manage expenses
          </p>
        </div>
        <Button onClick={handleOpenAdd} size="sm" className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Add Expense
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-6">
            <CardTitle className="text-xs sm:text-sm font-medium">Total</CardTitle>
            <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-3 pt-0 sm:p-6 sm:pt-0">
            <div className="text-lg sm:text-2xl font-bold">{formatCurrency(stats.totalExpenses)}</div>
            <p className="text-[10px] sm:text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-6">
            <CardTitle className="text-xs sm:text-sm font-medium">This Month</CardTitle>
            <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-3 pt-0 sm:p-6 sm:pt-0">
            <div className="text-lg sm:text-2xl font-bold">{formatCurrency(stats.thisMonthExpenses)}</div>
            <p className="text-[10px] sm:text-xs text-muted-foreground">Current month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-6">
            <CardTitle className="text-xs sm:text-sm font-medium">Count</CardTitle>
            <Receipt className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-3 pt-0 sm:p-6 sm:pt-0">
            <div className="text-lg sm:text-2xl font-bold">{stats.expenseCount}</div>
            <p className="text-[10px] sm:text-xs text-muted-foreground">Total expenses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-6">
            <CardTitle className="text-xs sm:text-sm font-medium">Avg/Month</CardTitle>
            <TrendingDown className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-3 pt-0 sm:p-6 sm:pt-0">
            <div className="text-lg sm:text-2xl font-bold">
              {formatCurrency(stats.totalExpenses / Math.max(1, new Date().getMonth() + 1))}
            </div>
            <p className="text-[10px] sm:text-xs text-muted-foreground">Average</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search expenses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Categories</SelectItem>
                {EXPENSE_CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {formatCategoryName(cat)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Expenses List */}
      <Card>
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-base sm:text-lg">Expense Records</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b">
                <tr className="text-left">
                  <th className="p-3 sm:p-4 text-xs sm:text-sm font-medium">Date</th>
                  <th className="p-3 sm:p-4 text-xs sm:text-sm font-medium">Description</th>
                  <th className="p-3 sm:p-4 text-xs sm:text-sm font-medium hidden sm:table-cell">Category</th>
                  <th className="p-3 sm:p-4 text-xs sm:text-sm font-medium hidden md:table-cell">Vendor</th>
                  <th className="p-3 sm:p-4 text-xs sm:text-sm font-medium text-right">Amount</th>
                  <th className="p-3 sm:p-4 text-xs sm:text-sm font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredExpenses.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-sm text-muted-foreground">
                      No expenses found. Click "Add Expense" to get started.
                    </td>
                  </tr>
                ) : (
                  filteredExpenses.map((expense) => (
                    <tr key={expense.id} className="border-b hover:bg-muted/50">
                      <td className="p-3 sm:p-4 text-xs sm:text-sm">
                        {new Date(expense.date).toLocaleDateString()}
                      </td>
                      <td className="p-3 sm:p-4">
                        <div>
                          <p className="text-xs sm:text-sm font-medium">{expense.description}</p>
                          <p className="text-[10px] sm:text-xs text-muted-foreground sm:hidden">
                            {formatCategoryName(expense.category)}
                          </p>
                        </div>
                      </td>
                      <td className="p-3 sm:p-4 text-xs sm:text-sm hidden sm:table-cell">
                        {formatCategoryName(expense.category)}
                      </td>
                      <td className="p-3 sm:p-4 text-xs sm:text-sm text-muted-foreground hidden md:table-cell">
                        {expense.vendor || '-'}
                      </td>
                      <td className="p-3 sm:p-4 text-xs sm:text-sm font-medium text-right">
                        {formatCurrency(expense.amount)}
                      </td>
                      <td className="p-3 sm:p-4">
                        <div className="flex justify-end gap-2">
                          {expense.receiptUrl && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => window.open(expense.receiptUrl!, '_blank')}
                              className="h-7 w-7 sm:h-8 sm:w-8 p-0"
                            >
                              <Receipt className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenEdit(expense)}
                            className="h-7 w-7 sm:h-8 sm:w-8 p-0"
                          >
                            <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(expense.id)}
                            className="h-7 w-7 sm:h-8 sm:w-8 p-0 text-destructive"
                          >
                            <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-[95vw] sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingExpense ? 'Edit' : 'Add'} Expense</DialogTitle>
            <DialogDescription>
              {editingExpense ? 'Update' : 'Enter'} expense details
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date *</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Input
                  id="description"
                  placeholder="Office supplies, rent, etc."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {EXPENSE_CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {formatCategoryName(cat)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Amount (ZAR) *</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="vendor">Vendor</Label>
                <Input
                  id="vendor"
                  placeholder="Vendor name (optional)"
                  value={formData.vendor}
                  onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="receipt">Receipt (optional)</Label>
                <Input
                  id="receipt"
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={handleFileChange}
                />
                <p className="text-xs text-muted-foreground">
                  Upload receipt image or PDF (max 5MB)
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="taxDeductible"
                  checked={formData.taxDeductible}
                  onChange={(e) => setFormData({ ...formData, taxDeductible: e.target.checked })}
                  className="h-4 w-4"
                />
                <Label htmlFor="taxDeductible" className="text-sm font-normal">
                  Tax deductible (15% VAT)
                </Label>
              </div>

              <div className="space-y-3 border-t pt-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isRecurring"
                    checked={formData.isRecurring}
                    onChange={(e) => setFormData({ ...formData, isRecurring: e.target.checked })}
                    className="h-4 w-4"
                  />
                  <Label htmlFor="isRecurring" className="text-sm font-medium">
                    Recurring Expense
                  </Label>
                </div>

                {formData.isRecurring && (
                  <div className="space-y-3 ml-6">
                    <div className="space-y-2">
                      <Label htmlFor="recurringType">Frequency</Label>
                      <Select 
                        value={formData.recurringType} 
                        onValueChange={(value: 'MONTHLY' | 'ANNUALLY' | 'CUSTOM') => setFormData({ ...formData, recurringType: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="MONTHLY">Monthly</SelectItem>
                          <SelectItem value="ANNUALLY">Annually</SelectItem>
                          <SelectItem value="CUSTOM">Custom Interval</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {formData.recurringType === 'CUSTOM' && (
                      <div className="space-y-2">
                        <Label htmlFor="recurringInterval">Every X Months</Label>
                        <Input
                          id="recurringInterval"
                          type="number"
                          min="1"
                          max="24"
                          value={formData.recurringInterval}
                          onChange={(e) => setFormData({ ...formData, recurringInterval: parseInt(e.target.value) || 1 })}
                        />
                        <p className="text-xs text-muted-foreground">
                          e.g., 13 for every 13 months
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowAddDialog(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Saving...' : editingExpense ? 'Update' : 'Add'} Expense
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
