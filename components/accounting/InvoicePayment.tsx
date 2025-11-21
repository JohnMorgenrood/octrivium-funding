'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Share2 } from 'lucide-react';
import SignaturePad from './SignaturePad';
import PayPalButton from './PayPalButton';
import YocoButton from './YocoButton';
import CurrencyConverter from './CurrencyConverter';
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
    requiresSignature: boolean;
    signatureData: string | null;
    signerName: string | null;
    signedAt: Date | null;
    templateId?: number;
    documentType?: string;
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
      subscriptionTier?: string | null;
      subscriptionStatus?: string | null;
      bankName?: string | null;
      bankAccountName?: string | null;
      bankAccountNumber?: string | null;
      bankBranchCode?: string | null;
      bankAccountType?: string | null;
      yocoPublicKey?: string | null;
      yocoSecretKey?: string | null;
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
  const [showSignature, setShowSignature] = useState(!invoice.signatureData);
  const [signatureSaved, setSignatureSaved] = useState(!!invoice.signatureData);
  const [usdAmountWithFees, setUsdAmountWithFees] = useState<number>(0);

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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
    }).format(amount);
  };

  const isOverdue = new Date(invoice.dueDate) < new Date() && invoice.status !== 'PAID';

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-4 sm:py-8 px-2 sm:px-4">
      <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
        {/* Invoice Template Display */}
        <Card className="print:shadow-none">
          <CardContent className="p-4 sm:p-6">
            <TemplateComponent
              invoice={{
                invoiceNumber: invoice.invoiceNumber,
                issueDate: invoice.issueDate,
                dueDate: invoice.dueDate,
                notes: invoice.notes,
                terms: invoice.terms,
                subtotal: invoice.subtotal,
                taxRate: invoice.taxRate,
                taxAmount: invoice.taxAmount,
                total: invoice.total,
                amountDue: invoice.amountDue,
                status: invoice.status,
                documentType: invoice.documentType || 'INVOICE',
              }}
              user={{
                name: invoice.user.companyName || `${invoice.user.firstName} ${invoice.user.lastName}`,
                firstName: invoice.user.firstName,
                lastName: invoice.user.lastName,
                email: invoice.user.email,
                logo: invoice.user.companyLogo,
                companyName: invoice.user.companyName,
                bankAccountNumber: invoice.user.bankAccountNumber,
                bankAccountName: invoice.user.bankAccountName,
                bankName: invoice.user.bankName,
                bankBranchCode: invoice.user.bankBranchCode,
                subscriptionTier: invoice.user.subscriptionTier,
              }}
              customer={{
                name: invoice.customer?.name || '',
                email: invoice.customer?.email || '',
                company: invoice.customer?.company,
              }}
              items={invoice.items.map((item: any) => ({
                description: item.description,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                total: item.total,
              }))}
            />
          </CardContent>
        </Card>

        {/* Signature Section */}
        {invoice.status !== 'PAID' && invoice.requiresSignature && (
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

        {/* Payment Section */}
        {invoice.status !== 'PAID' && (
          <>
            <Card>
              <CardHeader>
                <CardTitle>
                  Pay with Yoco (ZAR)
                  {invoice.user?.subscriptionTier === 'BUSINESS' && invoice.user?.yocoPublicKey && (
                    <span className="text-xs text-green-600 ml-2 font-normal">
                      • Direct to merchant
                    </span>
                  )}
                  {(invoice.user?.subscriptionTier === 'FREE' || invoice.user?.subscriptionTier === 'STARTER') && (
                    <span className="text-xs text-blue-600 ml-2 font-normal">
                      • Processed via platform
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <YocoButton 
                  invoiceId={invoice.id}
                  amount={invoice.amountDue}
                  invoiceNumber={invoice.invoiceNumber}
                  customPublicKey={invoice.user?.subscriptionTier === 'BUSINESS' ? invoice.user?.yocoPublicKey : undefined}
                />
              </CardContent>
            </Card>

            {/* Bank Transfer - STARTER/BUSINESS Only */}
            {(invoice.user?.subscriptionTier === 'STARTER' || invoice.user?.subscriptionTier === 'BUSINESS') && invoice.user?.bankAccountNumber && (
              <Card className="border-blue-200 bg-blue-50/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    Bank Transfer (EFT)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-sm text-gray-600 mb-4">
                      You can also pay via direct bank transfer using the details below:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm bg-white p-4 rounded-lg">
                      <div>
                        <p className="text-gray-500 text-xs">Bank Name</p>
                        <p className="text-gray-900 font-medium">{invoice.user.bankName || 'Not provided'}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs">Account Holder</p>
                        <p className="text-gray-900 font-medium">{invoice.user.bankAccountName || `${invoice.user.firstName} ${invoice.user.lastName}`}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs">Account Number</p>
                        <p className="text-gray-900 font-medium">{invoice.user.bankAccountNumber}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs">Branch Code</p>
                        <p className="text-gray-900 font-medium">{invoice.user.bankBranchCode || 'Not provided'}</p>
                      </div>
                      <div className="sm:col-span-2">
                        <p className="text-gray-500 text-xs">Payment Reference</p>
                        <p className="text-gray-900 font-medium">{invoice.invoiceNumber}</p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      ⚠️ Please use <strong>{invoice.invoiceNumber}</strong> as your payment reference
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Currency Converter for PayPal */}
            <CurrencyConverter 
              zarAmount={invoice.amountDue} 
              onUsdCalculated={setUsdAmountWithFees}
            />
            
            <Card>
              <CardHeader>
                <CardTitle>Pay with PayPal (USD)</CardTitle>
              </CardHeader>
              <CardContent>
                {usdAmountWithFees > 0 ? (
                  <PayPalButton 
                    invoiceId={invoice.id}
                    amount={invoice.amountDue}
                    paymentLink={invoice.paymentLink || ''}
                    usdAmountWithFees={usdAmountWithFees}
                  />
                ) : (
                  <div className="flex items-center justify-center p-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}

        {/* Share Button */}
        <div className="flex justify-center">
          <Button 
            size="lg" 
            variant="outline"
            onClick={handleShare}
            className="w-full sm:w-auto"
          >
            <Share2 className="h-5 w-5 mr-2" />
            Share Invoice
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
                  Your payment is processed securely. Pay in ZAR using Yoco (South African payment gateway) or in USD using PayPal. Funds will be held until confirmed and then made available to the business for withdrawal.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
