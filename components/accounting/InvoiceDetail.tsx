'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  Download, 
  Send, 
  Share2, 
  Mail, 
  Copy, 
  Check,
  Edit,
  Trash2,
  FileText,
  PenTool,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { formatDistance } from 'date-fns';

interface InvoiceDetailProps {
  invoice: any;
}

export default function InvoiceDetail({ invoice }: InvoiceDetailProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);

  const handleEdit = () => {
    router.push(`/dashboard/accounting/invoices/${invoice.id}/edit`);
  };

  const handleDownloadPDF = () => {
    window.print();
  };

  const handleSendEmail = async () => {
    if (!invoice.customer?.email) {
      toast({
        title: 'Error',
        description: 'Customer email not found',
        variant: 'destructive',
      });
      return;
    }

    setSendingEmail(true);
    try {
      const res = await fetch(`/api/accounting/invoices/${invoice.id}/send`, {
        method: 'POST',
      });

      if (!res.ok) throw new Error('Failed to send email');

      toast({
        title: 'Success',
        description: 'Invoice sent successfully to ' + invoice.customer.email,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send invoice email',
        variant: 'destructive',
      });
    } finally {
      setSendingEmail(false);
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
      default:
        return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
    }
  };

  const paymentLink = invoice.paymentLink 
    ? `${window.location.origin}/pay/${invoice.paymentLink}`
    : null;

  const handleCopyLink = () => {
    if (paymentLink) {
      navigator.clipboard.writeText(paymentLink);
      setCopied(true);
      toast({
        title: 'Link Copied',
        description: 'Payment link copied to clipboard',
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShareWhatsApp = () => {
    if (paymentLink) {
      const message = `Hi ${invoice.customer?.name}, here's your invoice ${invoice.invoiceNumber} for ${formatCurrency(Number(invoice.total))}. You can view and pay it here: ${paymentLink}`;
      window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
    }
  };

  const handleShareEmail = () => {
    if (paymentLink && invoice.customer?.email) {
      const subject = `Invoice ${invoice.invoiceNumber}`;
      const body = `Hi ${invoice.customer?.name},\n\nPlease find your invoice attached.\n\nAmount Due: ${formatCurrency(Number(invoice.total))}\nDue Date: ${new Date(invoice.dueDate).toLocaleDateString()}\n\nYou can view and pay online: ${paymentLink}\n\nThank you!`;
      window.location.href = `mailto:${invoice.customer.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/accounting/invoices/${invoice.id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        toast({
          title: 'Success',
          description: 'Invoice deleted successfully',
        });
        router.push('/dashboard/accounting/invoices');
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

  return (
    <div className="space-y-4 sm:space-y-6 px-2 sm:px-0 max-w-5xl mx-auto">
      {/* Share Dialog */}
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share Invoice</DialogTitle>
            <DialogDescription>
              Share this invoice with your customer
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {paymentLink && (
              <>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm font-medium mb-2">Payment Link</p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={paymentLink}
                      readOnly
                      className="flex-1 text-sm bg-background px-3 py-2 rounded border"
                    />
                    <Button size="sm" onClick={handleCopyLink}>
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" onClick={handleShareWhatsApp} className="w-full">
                    <Share2 className="h-4 w-4 mr-2" />
                    WhatsApp
                  </Button>
                  <Button variant="outline" onClick={handleShareEmail} className="w-full">
                    <Mail className="h-4 w-4 mr-2" />
                    Email
                  </Button>
                </div>

                {invoice.signatureData ? (
                  <div className="p-4 border rounded-lg bg-green-50/50 border-green-200">
                    <div className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-green-900">Signed</p>
                        <p className="text-xs text-green-700 mt-1">
                          By {invoice.signerName} on {new Date(invoice.signedAt).toLocaleString()}
                        </p>
                        <div className="mt-2 border rounded bg-white p-2">
                          <img 
                            src={invoice.signatureData} 
                            alt="Signature" 
                            className="max-h-16"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 border rounded-lg bg-blue-50/50 border-blue-200">
                    <div className="flex items-start gap-3">
                      <PenTool className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-blue-900">Pending Signature</p>
                        <p className="text-xs text-blue-700 mt-1">
                          Customer can digitally sign this invoice when they open the payment link.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowShareDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Invoice</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this invoice? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 no-print">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Invoice {invoice.invoiceNumber}</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Created {formatDistance(new Date(invoice.issueDate), new Date(), { addSuffix: true })}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={handleSendEmail} disabled={sendingEmail}>
            <Send className="h-4 w-4 mr-2" />
            {sendingEmail ? 'Sending...' : 'Send Email'}
          </Button>
          <Button variant="outline" size="sm" onClick={() => setShowShareDialog(true)}>
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownloadPDF}>
            <Download className="h-4 w-4 mr-2" />
            PDF
          </Button>
          <Button variant="outline" size="sm" onClick={handleEdit}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button variant="outline" size="sm" onClick={() => setShowDeleteDialog(true)}>
            <Trash2 className="h-4 w-4 mr-2 text-red-600" />
            Delete
          </Button>
        </div>
      </div>

      {/* Status Badge */}
      <div className="no-print">
        <span className={`inline-flex px-3 py-1.5 rounded-full text-sm font-medium border ${getStatusColor(invoice.status)}`}>
          {invoice.status}
        </span>
      </div>

      {/* Invoice Preview */}
      <Card>
        <CardContent className="p-6 sm:p-8">
          <div className="space-y-8">
            {/* Header */}
            <div className="flex justify-between items-start flex-wrap gap-4">
              <div className="flex items-start gap-4">
                {invoice.user?.companyLogo && (
                  <img 
                    src={invoice.user.companyLogo} 
                    alt="Company Logo" 
                    className="w-20 h-20 object-contain rounded"
                  />
                )}
                <div>
                  {invoice.user?.companyName && (
                    <h3 className="text-xl font-semibold text-gray-900">{invoice.user.companyName}</h3>
                  )}
                  <h2 className="text-4xl font-bold text-gray-900 mt-1">INVOICE</h2>
                </div>
              </div>
              <div className="text-left sm:text-right">
                <p className="text-sm text-gray-600"><strong>Invoice #:</strong> {invoice.invoiceNumber}</p>
                <p className="text-sm text-gray-600 mt-1"><strong>Date:</strong> {new Date(invoice.issueDate).toLocaleDateString()}</p>
                <p className="text-sm text-gray-600"><strong>Due:</strong> {new Date(invoice.dueDate).toLocaleDateString()}</p>
              </div>
            </div>

            {/* Bill To */}
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-semibold text-gray-900 mb-2">From:</p>
                <p className="text-sm text-gray-600">{invoice.user.firstName} {invoice.user.lastName}</p>
                <p className="text-sm text-gray-600">{invoice.user.email}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900 mb-2">Bill To:</p>
                <p className="text-sm text-gray-600">{invoice.customer?.name}</p>
                <p className="text-sm text-gray-600">{invoice.customer?.email}</p>
                {invoice.customer?.company && (
                  <p className="text-sm text-gray-600">{invoice.customer.company}</p>
                )}
              </div>
            </div>

            {/* Items Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-300">
                    <th className="text-left py-3 px-2 text-sm font-semibold text-gray-900">Description</th>
                    <th className="text-right py-3 px-2 text-sm font-semibold text-gray-900">Qty</th>
                    <th className="text-right py-3 px-2 text-sm font-semibold text-gray-900">Price</th>
                    <th className="text-right py-3 px-2 text-sm font-semibold text-gray-900">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items.map((item: any, index: number) => (
                    <tr key={index} className="border-b border-gray-200">
                      <td className="py-3 px-2 text-sm text-gray-900">{item.description}</td>
                      <td className="py-3 px-2 text-sm text-gray-600 text-right">{Number(item.quantity)}</td>
                      <td className="py-3 px-2 text-sm text-gray-600 text-right">{formatCurrency(Number(item.unitPrice))}</td>
                      <td className="py-3 px-2 text-sm text-gray-900 text-right font-medium">{formatCurrency(Number(item.total))}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="flex justify-end">
              <div className="w-full sm:w-64 space-y-2">
                <div className="flex justify-between py-2">
                  <span className="text-sm text-gray-600">Subtotal:</span>
                  <span className="text-sm font-medium text-gray-900">{formatCurrency(Number(invoice.subtotal))}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-sm text-gray-600">Tax ({Number(invoice.taxRate)}%):</span>
                  <span className="text-sm font-medium text-gray-900">{formatCurrency(Number(invoice.taxAmount))}</span>
                </div>
                <div className="flex justify-between py-3 border-t-2 border-gray-300">
                  <span className="text-base font-semibold text-gray-900">Total:</span>
                  <span className="text-base font-bold text-gray-900">{formatCurrency(Number(invoice.total))}</span>
                </div>
                {invoice.status !== 'PAID' && (
                  <div className="flex justify-between py-2 bg-orange-50 px-3 rounded">
                    <span className="text-sm font-semibold text-orange-900">Amount Due:</span>
                    <span className="text-sm font-bold text-orange-900">{formatCurrency(Number(invoice.amountDue))}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Notes and Terms */}
            {(invoice.notes || invoice.terms) && (
              <div className="space-y-4 pt-4 border-t">
                {invoice.notes && (
                  <div>
                    <p className="text-sm font-semibold text-gray-900 mb-1">Notes:</p>
                    <p className="text-sm text-gray-600 whitespace-pre-wrap">{invoice.notes}</p>
                  </div>
                )}
                {invoice.terms && (
                  <div>
                    <p className="text-sm font-semibold text-gray-900 mb-1">Terms:</p>
                    <p className="text-sm text-gray-600 whitespace-pre-wrap">{invoice.terms}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Payment Link Card */}
      {paymentLink && invoice.status !== 'PAID' && (
        <Card className="border-blue-200 bg-blue-50/30">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              Customer Payment Link
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Share this link with your customer to allow them to view and pay the invoice online.
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                value={paymentLink}
                readOnly
                className="flex-1 text-sm bg-background px-3 py-2 rounded border"
              />
              <Button size="sm" onClick={handleCopyLink}>
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleShareWhatsApp}>
                <Share2 className="h-4 w-4 mr-2" />
                WhatsApp
              </Button>
              <Button variant="outline" size="sm" onClick={handleShareEmail}>
                <Mail className="h-4 w-4 mr-2" />
                Email
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
