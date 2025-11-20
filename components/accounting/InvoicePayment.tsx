'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Share2, Download } from 'lucide-react';
import SignaturePad from './SignaturePad';

interface InvoicePaymentProps {
  invoice: {
    id: string;
    invoiceNumber: string;
    issueDate: Date;
    dueDate: Date;
    subtotal: number;
    taxRate: number;
    taxAmount: number;
    total: number;
    amountDue: number;
    notes: string | null;
    terms: string | null;
    paymentLink: string | null;
    status: string;
    signatureData: string | null;
    signerName: string | null;
    signedAt: Date | null;
    customer: {
      name: string;
      email: string | null;
      company: string | null;
    } | null;
    user: {
      firstName: string;
      lastName: string;
      email: string;
      companyName: string | null;
      companyLogo: string | null;
    };
    items: Array<{
      id: string;
      description: string;
      quantity: number;
      unitPrice: number;
      total: number;
    }>;
  };
}

export default function InvoicePayment({ invoice }: InvoicePaymentProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [showSignature, setShowSignature] = useState(!invoice.signatureData);
  const [signatureSaved, setSignatureSaved] = useState(!!invoice.signatureData);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
    }).format(amount);
  };

  const handleSaveSignature = async (signatureData: string, signerName: string) => {
    try {
      const res = await fetch(`/api/accounting/invoices/${invoice.id}/signature`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invoiceId: invoice.id, signatureData, signerName }),
      });

      if (!res.ok) throw new Error('Failed to save signature');

      toast({
        title: 'Success!',
        description: 'Signature saved successfully',
      });
      
      setSignatureSaved(true);
      setShowSignature(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save signature. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handlePayNow = async () => {
    setLoading(true);
    try {
      // Create PayPal order
      const res = await fetch('/api/paypal/create-invoice-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invoiceId: invoice.id }),
      });

      const data = await res.json();
      
      if (data.approvalUrl) {
        // Redirect to PayPal
        window.location.href = data.approvalUrl;
      } else {
        throw new Error('Failed to create payment');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to process payment. Please try again.',
        variant: 'destructive',
      });
      setLoading(false);
    }
  };

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/pay/${invoice.paymentLink}`;
    const shareText = `Invoice ${invoice.invoiceNumber} - ${formatCurrency(invoice.total)}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: shareText,
          text: `Pay invoice: ${shareText}`,
          url: shareUrl,
        });
        toast({
          title: 'Shared!',
          description: 'Invoice link shared successfully',
        });
      } catch (error) {
        // User cancelled
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(shareUrl);
      toast({
        title: 'Copied!',
        description: 'Payment link copied to clipboard',
      });
    }
  };

  const isOverdue = new Date(invoice.dueDate) < new Date() && invoice.status !== 'PAID';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div className="flex items-start gap-4">
              {invoice.user.companyLogo && (
                <img 
                  src={invoice.user.companyLogo} 
                  alt="Company Logo" 
                  className="w-16 h-16 object-contain"
                />
              )}
              <div>
                {invoice.user.companyName && (
                  <h2 className="text-lg font-semibold text-gray-900">{invoice.user.companyName}</h2>
                )}
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">INVOICE</h1>
                <p className="text-gray-600 mt-1">{invoice.invoiceNumber}</p>
              </div>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-sm text-gray-600">Issue Date: {new Date(invoice.issueDate).toLocaleDateString()}</p>
              <p className="text-sm text-gray-600">Due Date: {new Date(invoice.dueDate).toLocaleDateString()}</p>
              {isOverdue && (
                <p className="text-sm font-semibold text-red-600 mt-2">OVERDUE</p>
              )}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 mt-8">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2">From:</h3>
              <p className="text-sm text-gray-600">
                {invoice.user.firstName} {invoice.user.lastName}
              </p>
              <p className="text-sm text-gray-600">{invoice.user.email}</p>
            </div>
            {invoice.customer && (
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Bill To:</h3>
                <p className="text-sm text-gray-600">{invoice.customer.name}</p>
                {invoice.customer.company && (
                  <p className="text-sm text-gray-600">{invoice.customer.company}</p>
                )}
                {invoice.customer.email && (
                  <p className="text-sm text-gray-600">{invoice.customer.email}</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Items */}
        <Card>
          <CardHeader>
            <CardTitle>Items</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b-2 border-gray-300 bg-gray-50">
                  <tr>
                    <th className="text-left p-4 text-sm font-semibold">Description</th>
                    <th className="text-right p-4 text-sm font-semibold">Qty</th>
                    <th className="text-right p-4 text-sm font-semibold">Price</th>
                    <th className="text-right p-4 text-sm font-semibold">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items.map((item) => (
                    <tr key={item.id} className="border-b">
                      <td className="p-4 text-sm">{item.description}</td>
                      <td className="text-right p-4 text-sm">{item.quantity}</td>
                      <td className="text-right p-4 text-sm">{formatCurrency(item.unitPrice)}</td>
                      <td className="text-right p-4 text-sm font-medium">{formatCurrency(item.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end p-6 bg-gray-50 border-t">
              <div className="w-full sm:w-64 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium">{formatCurrency(invoice.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">VAT ({invoice.taxRate}%):</span>
                  <span className="font-medium">{formatCurrency(invoice.taxAmount)}</span>
                </div>
                <div className="flex justify-between text-xl font-bold border-t-2 border-gray-300 pt-2">
                  <span>Total:</span>
                  <span>{formatCurrency(invoice.total)}</span>
                </div>
                <div className="flex justify-between text-lg font-semibold text-blue-600">
                  <span>Amount Due:</span>
                  <span>{formatCurrency(invoice.amountDue)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notes and Terms */}
        {(invoice.notes || invoice.terms) && (
          <Card>
            <CardContent className="p-6 space-y-4">
              {invoice.notes && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Notes:</h3>
                  <p className="text-sm text-gray-600 whitespace-pre-wrap">{invoice.notes}</p>
                </div>
              )}
              {invoice.terms && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Terms:</h3>
                  <p className="text-sm text-gray-600 whitespace-pre-wrap">{invoice.terms}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Signature Section */}
        {invoice.status !== 'PAID' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Sign Invoice</span>
                {signatureSaved && (
                  <span className="text-sm text-green-600 font-normal">✓ Signed</span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {signatureSaved && invoice.signatureData ? (
                <div className="space-y-4">
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <img 
                      src={invoice.signatureData} 
                      alt="Signature" 
                      className="max-h-32 mx-auto"
                    />
                  </div>
                  <div className="text-sm text-gray-600">
                    <p>Signed by: <span className="font-medium">{invoice.signerName}</span></p>
                    {invoice.signedAt && (
                      <p>Date: {new Date(invoice.signedAt).toLocaleString()}</p>
                    )}
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowSignature(true)}
                  >
                    Update Signature
                  </Button>
                </div>
              ) : showSignature ? (
                <SignaturePad onSave={handleSaveSignature} />
              ) : (
                <Button onClick={() => setShowSignature(true)}>
                  Add Signature
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button 
            size="lg" 
            className="flex-1 text-lg py-6"
            onClick={handlePayNow}
            disabled={loading}
          >
            {loading ? 'Processing...' : `Pay ${formatCurrency(invoice.amountDue)} with PayPal`}
          </Button>
          <Button 
            size="lg" 
            variant="outline"
            onClick={handleShare}
            className="sm:w-auto"
          >
            <Share2 className="h-5 w-5 mr-2" />
            Share
          </Button>
        </div>

        {/* Payment Info */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Secure Payment</h3>
                <p className="text-sm text-gray-600">
                  Your payment is processed securely through PayPal. Funds will be held until confirmed and then made available to the business for withdrawal.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
