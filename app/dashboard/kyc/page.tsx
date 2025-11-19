'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Clock, Upload, Loader2, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function KYCVerificationPage() {
  const { data: session, update } = useSession();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [kycStatus, setKycStatus] = useState('PENDING');
  const [formData, setFormData] = useState({
    idNumber: '',
    address: '',
    city: '',
    postalCode: '',
    idDocument: null as File | null,
    proofOfAddress: null as File | null,
  });

  useEffect(() => {
    if (session?.user?.kycStatus) {
      setKycStatus(session.user.kycStatus);
    }
  }, [session]);

  const handleFileChange = (field: 'idDocument' | 'proofOfAddress', file: File | null) => {
    setFormData({ ...formData, [field]: file });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // In a real implementation, you'd upload files to a storage service
      // For now, we'll just submit the form data
      const res = await fetch('/api/kyc/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idNumber: formData.idNumber,
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode,
        }),
      });

      if (res.ok) {
        toast({
          title: 'Success',
          description: 'KYC documents submitted for review',
        });
        setKycStatus('PENDING');
        await update();
      } else {
        const data = await res.json();
        toast({
          title: 'Error',
          description: data.error || 'Failed to submit KYC',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An error occurred',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'VERIFIED':
        return (
          <Badge className="bg-green-500">
            <CheckCircle className="h-3 w-3 mr-1" />
            Verified
          </Badge>
        );
      case 'PENDING':
        return (
          <Badge variant="secondary">
            <Clock className="h-3 w-3 mr-1" />
            Pending Review
          </Badge>
        );
      case 'REJECTED':
        return (
          <Badge variant="destructive">
            <XCircle className="h-3 w-3 mr-1" />
            Rejected
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            <AlertCircle className="h-3 w-3 mr-1" />
            Not Submitted
          </Badge>
        );
    }
  };

  if (kycStatus === 'VERIFIED') {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">KYC Verification</h1>
          <p className="text-muted-foreground">Your identity verification status</p>
        </div>

        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="h-20 w-20 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mb-4">
              <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-2xl font-semibold mb-2">Verification Complete</h3>
            <p className="text-muted-foreground text-center mb-4">
              Your identity has been successfully verified
            </p>
            {getStatusBadge(kycStatus)}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (kycStatus === 'PENDING') {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">KYC Verification</h1>
          <p className="text-muted-foreground">Your identity verification status</p>
        </div>

        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="h-20 w-20 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-4">
              <Clock className="h-10 w-10 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-2xl font-semibold mb-2">Verification Pending</h3>
            <p className="text-muted-foreground text-center mb-4">
              Your documents are currently being reviewed. This usually takes 1-2 business days.
            </p>
            {getStatusBadge(kycStatus)}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">KYC Verification</h1>
        <p className="text-muted-foreground">Complete your identity verification to start investing or raising funds</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Identity Verification</CardTitle>
              <CardDescription>
                Provide your identification documents to verify your identity
              </CardDescription>
            </div>
            {getStatusBadge(kycStatus)}
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {kycStatus === 'REJECTED' && (
              <div className="p-4 bg-red-50 border-2 border-red-200 rounded-lg dark:bg-red-900/20 dark:border-red-800">
                <p className="text-sm text-red-700 font-medium dark:text-red-300">
                  Your previous submission was rejected. Please review and resubmit with correct information.
                </p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="idNumber">ID / Passport Number *</Label>
              <Input
                id="idNumber"
                placeholder="Enter your ID or passport number"
                value={formData.idNumber}
                onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Street Address *</Label>
              <Input
                id="address"
                placeholder="123 Main Street"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  placeholder="Cape Town"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="postalCode">Postal Code *</Label>
                <Input
                  id="postalCode"
                  placeholder="8001"
                  value={formData.postalCode}
                  onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="idDocument">ID Document / Passport Copy *</Label>
              <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer">
                <input
                  type="file"
                  id="idDocument"
                  accept="image/*,.pdf"
                  onChange={(e) => handleFileChange('idDocument', e.target.files?.[0] || null)}
                  className="hidden"
                />
                <label htmlFor="idDocument" className="cursor-pointer">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm font-medium">
                    {formData.idDocument ? formData.idDocument.name : 'Click to upload ID document'}
                  </p>
                  <p className="text-xs text-muted-foreground">PNG, JPG or PDF (max. 10MB)</p>
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="proofOfAddress">Proof of Address *</Label>
              <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer">
                <input
                  type="file"
                  id="proofOfAddress"
                  accept="image/*,.pdf"
                  onChange={(e) => handleFileChange('proofOfAddress', e.target.files?.[0] || null)}
                  className="hidden"
                />
                <label htmlFor="proofOfAddress" className="cursor-pointer">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm font-medium">
                    {formData.proofOfAddress ? formData.proofOfAddress.name : 'Click to upload proof of address'}
                  </p>
                  <p className="text-xs text-muted-foreground">Utility bill or bank statement (max. 10MB)</p>
                </label>
              </div>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg dark:bg-blue-900/20 dark:border-blue-800">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                <strong>Note:</strong> All documents must be clear, unaltered, and less than 3 months old. 
                This information is kept secure and confidential in accordance with POPIA regulations.
              </p>
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Submit for Verification
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
