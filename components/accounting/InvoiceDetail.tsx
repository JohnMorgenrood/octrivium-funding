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
  Template1Classic,
  Template2Modern,
  Template3Minimal,
  Template4Bold,
  Template5Corporate,
  Template6Creative,
  Template7Elegant,
  Template8Tech,
  Template9Luxury,
  Template10Playful,
} from './invoice-templates';
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
  const [sendingReminder, setSendingReminder] = useState(false);

  // Template mapping
  const TEMPLATE_COMPONENTS: any = {
    1: Template1Classic,
    2: Template2Modern,
    3: Template3Minimal,
    4: Template4Bold,
    5: Template5Corporate,
    6: Template6Creative,
    7: Template7Elegant,
    8: Template8Tech,
    9: Template9Luxury,
    10: Template10Playful,
  };

  const TemplateComponent = TEMPLATE_COMPONENTS[invoice.templateId || 1] || Template1Classic;

  const handleEdit = () => {
    router.push(`/dashboard/accounting/invoices/${invoice.id}/edit`);
  };

  const handleSendReminder = async () => {
    if (!invoice.customer?.email) {
      toast({
        title: 'Error',
        description: 'Customer email not found',
        variant: 'destructive',
      });
      return;
    }

    setSendingReminder(true);
    try {
      const res = await fetch('/api/invoices/send-reminder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invoiceId: invoice.id }),
      });

      if (!res.ok) throw new Error('Failed to send reminder');

      const data = await res.json();
      toast({
        title: 'Success',
        description: `Payment reminder sent to ${data.details.to}`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send reminder email',
        variant: 'destructive',
      });
    } finally {
      setSendingReminder(false);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      // Simply trigger the browser's print dialog which will use the current template
      window.print();
      
      toast({
        title: 'Success',
        description: 'Use your browser\'s print dialog to save as PDF.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to open print dialog',
        variant: 'destructive',
      });
    }
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
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-area, .print-area * {
            visibility: visible;
          }
          .print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>
      
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
          {invoice.status !== 'PAID' && invoice.customer?.email && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleSendReminder}
              disabled={sendingReminder}
              className="border-orange-300 text-orange-700 hover:bg-orange-50"
            >
              <Mail className="h-4 w-4 mr-2" />
              {sendingReminder ? 'Sending...' : 'Send Reminder'}
            </Button>
          )}
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
      <Card className="print-area">
        <CardContent className="p-6 sm:p-8">
          <TemplateComponent
            invoice={{
              invoiceNumber: invoice.invoiceNumber,
              issueDate: invoice.issueDate,
              dueDate: invoice.dueDate,
              paidDate: invoice.paidDate,
              notes: invoice.notes,
              terms: invoice.terms,
              subtotal: Number(invoice.subtotal),
              taxRate: Number(invoice.taxRate),
              taxAmount: Number(invoice.taxAmount),
              total: Number(invoice.total),
              amountPaid: Number(invoice.amountPaid),
              amountDue: Number(invoice.amountDue),
              status: invoice.status,
              documentType: invoice.documentType || 'INVOICE',
            }}
            user={{
              name: invoice.user?.companyName || `${invoice.user.firstName} ${invoice.user.lastName}`,
              firstName: invoice.user.firstName,
              lastName: invoice.user.lastName,
              email: invoice.user?.companyEmail || invoice.user.email,
              companyEmail: invoice.user?.companyEmail,
              logo: invoice.user?.companyLogo,
              companyName: invoice.user?.companyName,
              companyLogo: invoice.user?.companyLogo,
              bankAccountNumber: invoice.user?.bankAccountNumber,
              bankAccountName: invoice.user?.bankAccountName,
              bankName: invoice.user?.bankName,
              bankBranchCode: invoice.user?.bankBranchCode,
              subscriptionTier: invoice.user?.subscriptionTier,
            }}
            customer={{
              name: invoice.customer?.name || '',
              email: invoice.customer?.email || '',
              company: invoice.customer?.company,
            }}
            items={invoice.items.map((item: any) => ({
              description: item.description,
              quantity: Number(item.quantity),
              unitPrice: Number(item.unitPrice),
              costPrice: item.costPrice ? Number(item.costPrice) : undefined,
              total: Number(item.total),
              profit: item.profit ? Number(item.profit) : undefined,
            }))}
          />
        </CardContent>
      </Card>

      {/* Payment Link Card */}
      {paymentLink && invoice.status !== 'PAID' && (
        <Card className="border-blue-200 bg-blue-50/30 no-print">
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
