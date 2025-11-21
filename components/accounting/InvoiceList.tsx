'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Plus, 
  FileText, 
  Search, 
  Filter,
  MoreVertical,
  Eye,
  Send,
  Download,
  Trash2,
  Link,
  Share2,
  Edit,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { formatDistance } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

interface Invoice {
  id: string;
  invoiceNumber: string;
  status: string;
  total: any;
  amountPaid: any;
  amountDue: any;
  issueDate: Date;
  dueDate: Date;
  paymentLink: string | null;
  customer: { name: string; email: string | null } | null;
  items: any[];
}

interface InvoiceListProps {
  invoices: Invoice[];
  stats: {
    total: number;
    draft: number;
    sent: number;
    paid: number;
    overdue: number;
    totalAmount: number;
    paidAmount: number;
    unpaidAmount: number;
  };
}

export default function InvoiceList({ invoices, stats }: InvoiceListProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { data: session } = useSession();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [statusDialog, setStatusDialog] = useState<{ open: boolean; invoice: Invoice | null }>({
    open: false,
    invoice: null,
  });
  const [newStatus, setNewStatus] = useState('');
  const [statusReason, setStatusReason] = useState('');
  const [updating, setUpdating] = useState(false);

  const isAdmin = session?.user?.email === 'golearnx@gmail.com';

  const handleDelete = async (invoiceId: string) => {
    if (!confirm('Are you sure you want to delete this invoice?')) return;

    try {
      const res = await fetch(`/api/accounting/invoices/${invoiceId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        toast({
          title: 'Success',
          description: 'Invoice deleted successfully',
        });
        router.refresh();
      } else {
        throw new Error('Failed to delete');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete invoice',
        variant: 'destructive',
      });
    }
  };

  const handleCopyLink = (link: string) => {
    navigator.clipboard.writeText(link);
    toast({
      title: 'Link Copied',
      description: 'Payment link copied to clipboard',
    });
  };

  const handleDownloadPDF = async (invoiceId: string, invoiceNumber: string) => {
    try {
      const res = await fetch(`/api/accounting/invoices/${invoiceId}/pdf`);
      if (!res.ok) throw new Error('Failed to generate PDF');
      
      const html = await res.text();
      
      // Open in new window for printing/saving
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(html);
        printWindow.document.close();
        printWindow.focus();
        
        // Trigger print dialog after a short delay
        setTimeout(() => {
          printWindow.print();
        }, 500);
      }
      
      toast({
        title: 'PDF Generated',
        description: 'Use your browser\'s print dialog to save as PDF.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to generate PDF',
        variant: 'destructive',
      });
    }
  };

  const handleUpdateStatus = async () => {
    if (!statusDialog.invoice || !newStatus) return;

    setUpdating(true);
    try {
      // Use different endpoint for quotes vs invoices
      const isQuote = statusDialog.invoice.items?.[0]?.description?.toLowerCase().includes('quote') || 
                      statusDialog.invoice.invoiceNumber.startsWith('QUO');
      
      const endpoint = isQuote 
        ? `/api/admin/quotes/${statusDialog.invoice.id}/update-status`
        : `/api/admin/invoices/${statusDialog.invoice.id}/update-status`;

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, reason: statusReason }),
      });

      if (res.ok) {
        toast({
          title: 'Status Updated',
          description: `${isQuote ? 'Quote' : 'Invoice'} status changed to ${newStatus}`,
        });
        setStatusDialog({ open: false, invoice: null });
        setNewStatus('');
        setStatusReason('');
        router.refresh();
      } else {
        const error = await res.json();
        throw new Error(error.error || 'Failed to update status');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update status',
        variant: 'destructive',
      });
    } finally {
      setUpdating(false);
    }
  };

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
      case 'PARTIAL':
        return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
      case 'ACCEPTED':
        return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
      case 'SIGNED':
        return 'bg-teal-500/10 text-teal-600 border-teal-500/20';
      case 'PENDING_PAYMENT':
        return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
      case 'REJECTED':
        return 'bg-red-500/10 text-red-600 border-red-500/20';
      case 'CANCELLED':
        return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
      case 'EXPIRED':
        return 'bg-orange-500/10 text-orange-600 border-orange-500/20';
      case 'REFUNDED':
        return 'bg-purple-500/10 text-purple-600 border-purple-500/20';
      default:
        return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
    }
  };

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      invoice.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.customer?.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Invoices</h1>
          <p className="text-muted-foreground mt-1">
            Manage and track your invoices
          </p>
        </div>
        <Button onClick={() => router.push('/dashboard/accounting/invoices/create')}>
          <Plus className="h-4 w-4 mr-2" />
          Create Invoice
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Invoices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {formatCurrency(stats.totalAmount)} total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Paid</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.paid}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {formatCurrency(stats.paidAmount)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Unpaid</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {stats.sent + stats.overdue + stats.draft}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {formatCurrency(stats.unpaidAmount)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Overdue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.overdue}</div>
            <p className="text-xs text-red-600 mt-1">Requires attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search invoices..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Statuses</SelectItem>
                <SelectItem value="DRAFT">Draft</SelectItem>
                <SelectItem value="SENT">Sent</SelectItem>
                <SelectItem value="PAID">Paid</SelectItem>
                <SelectItem value="OVERDUE">Overdue</SelectItem>
                <SelectItem value="PARTIAL">Partially Paid</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {filteredInvoices.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-20" />
              <h3 className="text-lg font-semibold mb-2">No invoices found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery || statusFilter !== 'ALL'
                  ? 'Try adjusting your filters'
                  : 'Create your first invoice to get started'}
              </p>
              {!searchQuery && statusFilter === 'ALL' && (
                <Button onClick={() => router.push('/dashboard/accounting/invoices/create')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Invoice
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredInvoices.map((invoice) => (
                <div
                  key={invoice.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold">{invoice.invoiceNumber}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs border ${getStatusColor(invoice.status)}`}>
                          {invoice.status}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {invoice.customer?.name || 'No customer'} • {invoice.items.length} items
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right hidden sm:block">
                      <p className="font-semibold">{formatCurrency(Number(invoice.total))}</p>
                      <p className="text-xs text-muted-foreground">
                        Due {formatDistance(new Date(invoice.dueDate), new Date(), { addSuffix: true })}
                      </p>
                    </div>

                    {invoice.paymentLink && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          const link = `${window.location.origin}/pay/${invoice.paymentLink}`;
                          handleCopyLink(link);
                        }}
                        title="Copy payment link"
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                    )}

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => router.push(`/dashboard/accounting/invoices/${invoice.id}`)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        {invoice.paymentLink && (
                          <DropdownMenuItem
                            onClick={() => {
                              const link = `${window.location.origin}/pay/${invoice.paymentLink}`;
                              handleCopyLink(link);
                            }}
                          >
                            <Link className="h-4 w-4 mr-2" />
                            Copy Payment Link
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem>
                          <Send className="h-4 w-4 mr-2" />
                          Send Invoice
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDownloadPDF(invoice.id, invoice.invoiceNumber)}>
                          <Download className="h-4 w-4 mr-2" />
                          Download PDF
                        </DropdownMenuItem>
                        {isAdmin && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => {
                                setStatusDialog({ open: true, invoice });
                                setNewStatus(invoice.status);
                              }}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Update Status
                            </DropdownMenuItem>
                          </>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(invoice.id)}>
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Status Update Dialog */}
      <Dialog open={statusDialog.open} onOpenChange={(open) => setStatusDialog({ open, invoice: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update {statusDialog.invoice?.invoiceNumber.startsWith('QUO') ? 'Quote' : 'Invoice'} Status</DialogTitle>
            <DialogDescription>
              Change the status of {statusDialog.invoice?.invoiceNumber.startsWith('QUO') ? 'quote' : 'invoice'} {statusDialog.invoice?.invoiceNumber}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>New Status</Label>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {statusDialog.invoice?.invoiceNumber.startsWith('QUO') ? (
                    // Quote statuses
                    <>
                      <SelectItem value="DRAFT">Draft</SelectItem>
                      <SelectItem value="SENT">Sent</SelectItem>
                      <SelectItem value="ACCEPTED">Accepted</SelectItem>
                      <SelectItem value="SIGNED">Signed</SelectItem>
                      <SelectItem value="PENDING_PAYMENT">Pending Payment</SelectItem>
                      <SelectItem value="PAID">Paid</SelectItem>
                      <SelectItem value="REJECTED">Rejected</SelectItem>
                      <SelectItem value="CANCELLED">Cancelled</SelectItem>
                      <SelectItem value="EXPIRED">Expired</SelectItem>
                    </>
                  ) : (
                    // Invoice statuses
                    <>
                      <SelectItem value="DRAFT">Draft</SelectItem>
                      <SelectItem value="SENT">Sent</SelectItem>
                      <SelectItem value="PAID">Paid</SelectItem>
                      <SelectItem value="OVERDUE">Overdue</SelectItem>
                      <SelectItem value="CANCELLED">Cancelled</SelectItem>
                      <SelectItem value="REFUNDED">Refunded</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Reason (Optional)</Label>
              <Textarea
                placeholder="Enter reason for status change..."
                value={statusReason}
                onChange={(e) => setStatusReason(e.target.value)}
                rows={3}
              />
            </div>

            {newStatus === 'PAID' && statusDialog.invoice?.status !== 'PAID' && (
              <div className="bg-blue-50 border border-blue-200 rounded-md p-3 text-sm">
                <p className="text-blue-900 font-medium">This will:</p>
                <ul className="text-blue-700 mt-1 space-y-1 list-disc list-inside">
                  <li>Mark {statusDialog.invoice?.invoiceNumber.startsWith('QUO') ? 'quote' : 'invoice'} as paid</li>
                  <li>Add {formatCurrency(Number(statusDialog.invoice?.total))} to user wallet</li>
                  <li>Lock funds for 7 days</li>
                </ul>
              </div>
            )}

            {newStatus === 'ACCEPTED' && statusDialog.invoice?.invoiceNumber.startsWith('QUO') && (
              <div className="bg-green-50 border border-green-200 rounded-md p-3 text-sm">
                <p className="text-green-900 font-medium">Quote Accepted:</p>
                <p className="text-green-700 mt-1">Customer has accepted the quote terms</p>
              </div>
            )}

            {newStatus === 'SIGNED' && statusDialog.invoice?.invoiceNumber.startsWith('QUO') && (
              <div className="bg-green-50 border border-green-200 rounded-md p-3 text-sm">
                <p className="text-green-900 font-medium">Quote Signed:</p>
                <p className="text-green-700 mt-1">Customer has signed the quote agreement</p>
              </div>
            )}

            {newStatus === 'REJECTED' && statusDialog.invoice?.invoiceNumber.startsWith('QUO') && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3 text-sm">
                <p className="text-red-900 font-medium">Quote Rejected:</p>
                <p className="text-red-700 mt-1">Customer has declined this quote</p>
              </div>
            )}

            {newStatus === 'CANCELLED' && statusDialog.invoice?.status === 'PAID' && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3 text-sm">
                <p className="text-red-900 font-medium">Warning:</p>
                <ul className="text-red-700 mt-1 space-y-1 list-disc list-inside">
                  <li>This will remove {formatCurrency(Number(statusDialog.invoice?.total))} from user wallet</li>
                  <li>Funds will be refunded</li>
                </ul>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setStatusDialog({ open: false, invoice: null })}>
              Cancel
            </Button>
            <Button onClick={handleUpdateStatus} disabled={!newStatus || updating}>
              {updating ? 'Updating...' : 'Update Status'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
