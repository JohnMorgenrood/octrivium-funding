'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Plus, Trash2, ArrowLeft, Save, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface Customer {
  id: string;
  name: string;
  email: string | null;
  company: string | null;
}

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface CreateInvoiceFormProps {
  customers: Customer[];
  invoiceNumber: string;
}

export default function CreateInvoiceForm({ customers, invoiceNumber }: CreateInvoiceFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [companyData, setCompanyData] = useState<{
    companyName: string | null;
    companyLogo: string | null;
  }>({
    companyName: null,
    companyLogo: null,
  });

  const [formData, setFormData] = useState({
    customerId: '',
    invoiceNumber,
    documentType: 'INVOICE' as 'INVOICE' | 'QUOTE',
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    taxRate: '15.00',
    includeVat: true,
    requiresSignature: false,
    notes: '',
    terms: 'Payment due within 30 days',
  });

  const [items, setItems] = useState<InvoiceItem[]>([
    { id: '1', description: '', quantity: 1, unitPrice: 0, total: 0 },
  ]);

  const [showNewCustomer, setShowNewCustomer] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    email: '',
    company: '',
  });
  const [showPreview, setShowPreview] = useState(false);

  // Fetch company data on mount
  useEffect(() => {
    fetchCompanyData();
  }, []);

  // Refresh company data when preview is opened
  useEffect(() => {
    if (showPreview) {
      fetchCompanyData();
    }
  }, [showPreview]);

  const fetchCompanyData = async () => {
    try {
      const res = await fetch('/api/user/company');
      if (res.ok) {
        const data = await res.json();
        setCompanyData(data);
      }
    } catch (error) {
      console.error('Failed to fetch company data:', error);
    }
  };

  const addItem = () => {
    setItems([
      ...items,
      { id: Date.now().toString(), description: '', quantity: 1, unitPrice: 0, total: 0 },
    ]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter((item) => item.id !== id));
    }
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: any) => {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          const updated = { ...item, [field]: value };
          if (field === 'quantity' || field === 'unitPrice') {
            updated.total = updated.quantity * updated.unitPrice;
          }
          return updated;
        }
        return item;
      })
    );
  };

  const calculateTotals = () => {
    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    const taxAmount = formData.includeVat ? subtotal * (parseFloat(formData.taxRate) / 100) : 0;
    const total = subtotal + taxAmount;
    return { subtotal, taxAmount, total };
  };

  const { subtotal, taxAmount, total } = calculateTotals();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
    }).format(amount);
  };

  const handleCreateCustomer = async () => {
    if (!newCustomer.name || !newCustomer.email) {
      toast({
        title: 'Validation Error',
        description: 'Customer name and email are required',
        variant: 'destructive',
      });
      return;
    }

    try {
      const res = await fetch('/api/accounting/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCustomer),
      });

      if (!res.ok) throw new Error('Failed to create customer');

      const customer = await res.json();
      setFormData({ ...formData, customerId: customer.id });
      setShowNewCustomer(false);
      setNewCustomer({ name: '', email: '', company: '' });
      
      toast({
        title: 'Success',
        description: 'Customer created successfully',
      });
      
      router.refresh();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create customer',
        variant: 'destructive',
      });
    }
  };

  const handleSubmit = async (status: 'DRAFT' | 'SENT') => {
    if (!formData.customerId) {
      toast({
        title: 'Validation Error',
        description: 'Please select a customer',
        variant: 'destructive',
      });
      return;
    }

    if (items.some((item) => !item.description || item.quantity <= 0 || item.unitPrice <= 0)) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all item details',
        variant: 'destructive',
      });
      return;
    }

    if (status === 'SENT') {
      setShowPreview(true);
      return;
    }

    await saveInvoice(status);
  };

  const saveInvoice = async (status: 'DRAFT' | 'SENT') => {
    setLoading(true);

    try {
      const res = await fetch('/api/accounting/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          status,
          subtotal,
          taxAmount,
          total,
          amountDue: total,
          items: items.map(({ id, ...item }) => item),
        }),
      });

      if (!res.ok) throw new Error('Failed to create invoice');

      const invoice = await res.json();

      toast({
        title: 'Success',
        description: `${formData.documentType === 'QUOTE' ? 'Quote' : 'Invoice'} ${status === 'DRAFT' ? 'saved as draft' : 'created and sent'}`,
      });

      router.push(`/dashboard/accounting/invoices/${invoice.id}`);
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to create ${formData.documentType.toLowerCase()}`,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 px-2 sm:px-0">
      {/* Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-[95vw] sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">Preview {formData.documentType === 'QUOTE' ? 'Quote' : 'Invoice'}</DialogTitle>
            <DialogDescription className="text-xs sm:text-sm">
              Review before sending to customer
            </DialogDescription>
          </DialogHeader>
          
          <div className="border rounded-lg p-8 bg-white">
            {/* Invoice Preview */}
            <div className="space-y-6">
              {/* Header */}
              <div className="flex justify-between items-start">
                <div className="flex items-start gap-4">
                  {companyData.companyLogo && (
                    <img 
                      src={companyData.companyLogo} 
                      alt="Company Logo" 
                      className="w-16 h-16 object-contain"
                    />
                  )}
                  <div>
                    {companyData.companyName && (
                      <h3 className="text-lg font-semibold text-gray-900">{companyData.companyName}</h3>
                    )}
                    <h2 className="text-3xl font-bold text-gray-900">
                      {formData.documentType === 'QUOTE' ? 'QUOTE' : 'INVOICE'}
                    </h2>
                    <p className="text-sm text-gray-600 mt-2">{formData.invoiceNumber}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Date: {new Date(formData.issueDate).toLocaleDateString()}</p>
                  <p className="text-sm text-gray-600">Due: {new Date(formData.dueDate).toLocaleDateString()}</p>
                </div>
              </div>

              {/* Customer */}
              <div>
                <p className="text-sm font-semibold text-gray-900">Bill To:</p>
                <p className="text-sm text-gray-600">
                  {customers.find(c => c.id === formData.customerId)?.name}
                </p>
                <p className="text-sm text-gray-600">
                  {customers.find(c => c.id === formData.customerId)?.email}
                </p>
              </div>

              {/* Items Table */}
              <table className="w-full">
                <thead className="border-b-2 border-gray-300">
                  <tr>
                    <th className="text-left py-2 text-sm font-semibold text-gray-900">Description</th>
                    <th className="text-right py-2 text-sm font-semibold text-gray-900">Qty</th>
                    <th className="text-right py-2 text-sm font-semibold text-gray-900">Price</th>
                    <th className="text-right py-2 text-sm font-semibold text-gray-900">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id} className="border-b border-gray-200">
                      <td className="py-3 text-sm text-gray-900">{item.description}</td>
                      <td className="text-right py-3 text-sm text-gray-600">{item.quantity}</td>
                      <td className="text-right py-3 text-sm text-gray-600">{formatCurrency(item.unitPrice)}</td>
                      <td className="text-right py-3 text-sm text-gray-900 font-medium">{formatCurrency(item.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Totals */}
              <div className="flex justify-end">
                <div className="w-64 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="text-gray-900 font-medium">{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">VAT ({formData.taxRate}%):</span>
                    <span className="text-gray-900 font-medium">{formatCurrency(taxAmount)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t-2 border-gray-300 pt-2">
                    <span className="text-gray-900">Total:</span>
                    <span className="text-gray-900">{formatCurrency(total)}</span>
                  </div>
                </div>
              </div>

              {/* Notes & Terms */}
              {formData.notes && (
                <div>
                  <p className="text-sm font-semibold text-gray-900 mb-1">Notes:</p>
                  <p className="text-sm text-gray-600">{formData.notes}</p>
                </div>
              )}
              {formData.terms && (
                <div>
                  <p className="text-sm font-semibold text-gray-900 mb-1">Terms:</p>
                  <p className="text-sm text-gray-600">{formData.terms}</p>
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPreview(false)}>
              Back to Edit
            </Button>
            <Button onClick={() => { setShowPreview(false); saveInvoice('SENT'); }} disabled={loading}>
              <Send className="h-4 w-4 mr-2" />
              {loading ? 'Sending...' : `Send ${formData.documentType === 'QUOTE' ? 'Quote' : 'Invoice'}`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="h-8 w-8 sm:h-10 sm:w-10">
            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
          <div>
            <h1 className="text-xl sm:text-3xl font-bold">Create {formData.documentType === 'QUOTE' ? 'Quote' : 'Invoice'}</h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">Fill in details below</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Select value={formData.documentType} onValueChange={(value: 'INVOICE' | 'QUOTE') => setFormData({ ...formData, documentType: value })}>
            <SelectTrigger className="w-[110px] sm:w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="INVOICE">Invoice</SelectItem>
              <SelectItem value="QUOTE">Quote</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="secondary" size="sm" onClick={() => setShowPreview(true)} disabled={!formData.customerId || items.some(i => !i.description || i.quantity <= 0 || i.unitPrice <= 0)}>
            <span className="text-xs sm:text-sm">👁️ Preview</span>
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleSubmit('DRAFT')} disabled={loading}>
            <Save className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            <span className="text-xs sm:text-sm">Draft</span>
          </Button>
          <Button size="sm" onClick={() => handleSubmit('SENT')} disabled={loading}>
            <Send className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            <span className="text-xs sm:text-sm">{loading ? 'Creating...' : 'Send'}</span>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Invoice Details */}
          <Card>
            <CardHeader>
              <CardTitle>Invoice Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Invoice Number</Label>
                  <Input value={formData.invoiceNumber} disabled />
                </div>
                <div className="space-y-2">
                  <Label>Customer</Label>
                  {!showNewCustomer ? (
                    <div className="flex gap-2">
                      <Select value={formData.customerId} onValueChange={(value) => setFormData({ ...formData, customerId: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select customer" />
                        </SelectTrigger>
                        <SelectContent className="max-h-[200px]">
                          {customers.map((customer) => (
                            <SelectItem key={customer.id} value={customer.id}>
                              {customer.name} {customer.company && `(${customer.company})`}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button variant="outline" onClick={() => setShowNewCustomer(true)}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-[300px] overflow-y-auto">
                      <Input
                        placeholder="Customer name"
                        value={newCustomer.name}
                        onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                      />
                      <Input
                        placeholder="Email"
                        type="email"
                        value={newCustomer.email}
                        onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                      />
                      <Input
                        placeholder="Company (optional)"
                        value={newCustomer.company}
                        onChange={(e) => setNewCustomer({ ...newCustomer, company: e.target.value })}
                      />
                      <div className="flex gap-2">
                        <Button size="sm" onClick={handleCreateCustomer}>
                          Create
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setShowNewCustomer(false)}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Issue Date</Label>
                  <Input
                    type="date"
                    value={formData.issueDate}
                    onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Due Date</Label>
                  <Input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Invoice Items */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Invoice Items</CardTitle>
                <Button variant="outline" size="sm" onClick={addItem}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {items.map((item, index) => (
                  <div key={item.id} className="grid gap-4 md:grid-cols-12 items-start pb-4 border-b last:border-0">
                    <div className="md:col-span-5 space-y-2">
                      <Label>Description</Label>
                      <Input
                        placeholder="Item description"
                        value={item.description}
                        onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                      />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <Label>Quantity</Label>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.quantity}
                        onChange={(e) => updateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <Label>Unit Price</Label>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.unitPrice}
                        onChange={(e) => updateItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <Label>Total</Label>
                      <Input value={formatCurrency(item.total)} disabled />
                    </div>
                    <div className="md:col-span-1 flex items-end">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(item.id)}
                        disabled={items.length === 1}
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Notes & Terms */}
          <Card>
            <CardHeader>
              <CardTitle>Additional Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Notes</Label>
                <Textarea
                  placeholder="Add any notes or special instructions..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>Payment Terms</Label>
                <Textarea
                  placeholder="Payment terms and conditions..."
                  value={formData.terms}
                  onChange={(e) => setFormData({ ...formData, terms: e.target.value })}
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Summary Sidebar */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal:</span>
                  <span className="font-medium">{formatCurrency(subtotal)}</span>
                </div>
                
                <div className="flex items-center space-x-2 py-2">
                  <Checkbox
                    id="includeVat"
                    checked={formData.includeVat}
                    onCheckedChange={(checked) => setFormData({ ...formData, includeVat: checked as boolean })}
                  />
                  <label
                    htmlFor="includeVat"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    Include VAT
                  </label>
                </div>
                
                <div className="flex items-center space-x-2 py-2">
                  <Checkbox
                    id="requiresSignature"
                    checked={formData.requiresSignature}
                    onCheckedChange={(checked) => setFormData({ ...formData, requiresSignature: checked as boolean })}
                  />
                  <label
                    htmlFor="requiresSignature"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    Require customer signature
                  </label>
                </div>
                
                {formData.includeVat && (
                  <div className="flex justify-between text-sm items-center">
                    <span className="text-muted-foreground">VAT ({formData.taxRate}%):</span>
                    <span className="font-medium">{formatCurrency(taxAmount)}</span>
                  </div>
                )}
                
                <div className="pt-2 border-t">
                  <div className="flex justify-between">
                    <span className="font-semibold">Total:</span>
                    <span className="font-bold text-lg">{formatCurrency(total)}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 space-y-2">
                <div className="text-sm text-muted-foreground">
                  <p>Items: {items.length}</p>
                  <p>Issue Date: {new Date(formData.issueDate).toLocaleDateString()}</p>
                  <p>Due Date: {new Date(formData.dueDate).toLocaleDateString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
