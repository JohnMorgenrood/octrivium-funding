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
  const [kycStatus, setKycStatus] = useState('NOT_SUBMITTED');
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: '',
    lastName: '',
    idNumber: '',
    dateOfBirth: '',
    nationality: 'South African',
    
    // Contact Information
    phoneNumber: '',
    email: '',
    
    // Address Information
    address: '',
    suburb: '',
    city: '',
    province: '',
    postalCode: '',
    country: 'South Africa',
    
    // Business Information (for BUSINESS role)
    businessName: '',
    registrationNumber: '',
    vatNumber: '',
    businessType: '',
    industry: '',
    
    // Banking Information
    bankName: '',
    accountNumber: '',
    accountType: '',
    branchCode: '',
    
    // Documents
    idDocument: null as File | null,
    proofOfAddress: null as File | null,
    businessRegistration: null as File | null,
    bankStatement: null as File | null,
  });

  useEffect(() => {
    if (session?.user?.kycStatus) {
      setKycStatus(session.user.kycStatus);
    } else {
      setKycStatus('NOT_SUBMITTED');
    }
  }, [session]);

  const handleFileChange = (field: 'idDocument' | 'proofOfAddress' | 'businessRegistration' | 'bankStatement', file: File | null) => {
    setFormData({ ...formData, [field]: file });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required documents
    if (!formData.idDocument || !formData.proofOfAddress) {
      toast({
        title: 'Missing Documents',
        description: 'Please upload your ID and proof of address',
        variant: 'destructive',
      });
      return;
    }

    if (session?.user?.role === 'BUSINESS' && (!formData.businessRegistration || !formData.bankStatement)) {
      toast({
        title: 'Missing Documents',
        description: 'Please upload your business registration and bank statement',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      // Create FormData to handle file uploads
      const uploadData = new FormData();
      
      // Add all text fields
      uploadData.append('firstName', formData.firstName);
      uploadData.append('lastName', formData.lastName);
      uploadData.append('idNumber', formData.idNumber);
      uploadData.append('dateOfBirth', formData.dateOfBirth);
      uploadData.append('nationality', formData.nationality);
      uploadData.append('phoneNumber', formData.phoneNumber);
      uploadData.append('email', formData.email);
      uploadData.append('address', formData.address);
      uploadData.append('suburb', formData.suburb || '');
      uploadData.append('city', formData.city);
      uploadData.append('province', formData.province);
      uploadData.append('postalCode', formData.postalCode);
      uploadData.append('country', formData.country);
      uploadData.append('bankName', formData.bankName);
      uploadData.append('accountNumber', formData.accountNumber);
      uploadData.append('accountType', formData.accountType);
      uploadData.append('branchCode', formData.branchCode);
      
      // Add business fields if applicable
      if (session?.user?.role === 'BUSINESS') {
        uploadData.append('businessName', formData.businessName);
        uploadData.append('registrationNumber', formData.registrationNumber);
        uploadData.append('vatNumber', formData.vatNumber || '');
        uploadData.append('businessType', formData.businessType);
        uploadData.append('industry', formData.industry);
      }
      
      // Add file uploads
      if (formData.idDocument) {
        uploadData.append('idDocument', formData.idDocument);
      }
      if (formData.proofOfAddress) {
        uploadData.append('proofOfAddress', formData.proofOfAddress);
      }
      if (formData.businessRegistration) {
        uploadData.append('businessRegistration', formData.businessRegistration);
      }
      if (formData.bankStatement) {
        uploadData.append('bankStatement', formData.bankStatement);
      }

      const res = await fetch('/api/kyc/submit', {
        method: 'POST',
        body: uploadData, // Send as FormData, not JSON
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
      <div className="max-w-2xl mx-auto space-y-4 sm:space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">KYC/FICA Verification</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Your identity verification status</p>
        </div>

        <Card>
          <CardContent className="py-8 sm:py-16 px-4 sm:px-6">
            <div className="text-center space-y-4 sm:space-y-6">
              <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mx-auto">
                <CheckCircle className="h-8 w-8 sm:h-10 sm:w-10 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-semibold mb-2">✓ Verification Complete</h3>
                <p className="text-muted-foreground mb-1">
                  Your identity has been successfully verified
                </p>
                {getStatusBadge(kycStatus)}
              </div>
              
              <div className="max-w-md mx-auto text-left bg-slate-50 dark:bg-slate-900 rounded-lg p-6 space-y-3">
                <h4 className="font-semibold text-sm text-muted-foreground uppercase">Verified Documents</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Identity Document (ID/Passport)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Proof of Residential Address</span>
                  </div>
                  {session?.user?.role === 'BUSINESS' && (
                    <>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Business Registration (CIPC)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Business Bank Statement</span>
                      </div>
                    </>
                  )}
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Banking Details</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>FICA/POPIA Compliance</span>
                  </div>
                </div>
              </div>

              <p className="text-sm text-muted-foreground">
                You can now {session?.user?.role === 'INVESTOR' ? 'invest in deals' : 'create funding campaigns'} on the platform.
              </p>
            </div>
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
        <h1 className="text-3xl font-bold">KYC/FICA Verification</h1>
        <p className="text-muted-foreground">Complete your identity verification to comply with South African financial regulations</p>
      </div>

      {/* Info Banner */}
      <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950">
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <AlertCircle className="h-6 w-6 text-blue-600" />
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-blue-900 dark:text-blue-100">Why do we need this information?</h3>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Under the Financial Intelligence Centre Act (FICA) and Protection of Personal Information Act (POPIA), 
                we are legally required to verify the identity of all users. This helps prevent fraud, money laundering, 
                and protects both investors and businesses on our platform.
              </p>
              <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1 ml-4">
                <li>✓ All information is encrypted and stored securely</li>
                <li>✓ Your data is never shared with third parties</li>
                <li>✓ Verification typically takes 1-2 business days</li>
                <li>✓ Required for compliance with SA financial regulations</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

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

            {/* Personal Information */}
            <div className="space-y-4 p-6 bg-slate-50 dark:bg-slate-900 rounded-lg">
              <h3 className="text-lg font-semibold">Personal Information</h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="idNumber">ID / Passport Number *</Label>
                  <Input
                    id="idNumber"
                    placeholder="9001015009087"
                    value={formData.idNumber}
                    onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="nationality">Nationality *</Label>
                <Input
                  id="nationality"
                  placeholder="South African"
                  value={formData.nationality}
                  onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4 p-6 bg-slate-50 dark:bg-slate-900 rounded-lg">
              <h3 className="text-lg font-semibold">Contact Information</h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number *</Label>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    placeholder="+27 82 123 4567"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Residential Address */}
            <div className="space-y-4 p-6 bg-slate-50 dark:bg-slate-900 rounded-lg">
              <h3 className="text-lg font-semibold">Residential Address</h3>
              
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
                  <Label htmlFor="suburb">Suburb</Label>
                  <Input
                    id="suburb"
                    placeholder="Gardens"
                    value={formData.suburb}
                    onChange={(e) => setFormData({ ...formData, suburb: e.target.value })}
                  />
                </div>
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
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="province">Province *</Label>
                  <select
                    id="province"
                    value={formData.province}
                    onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md"
                    required
                  >
                    <option value="">Select Province</option>
                    <option value="Eastern Cape">Eastern Cape</option>
                    <option value="Free State">Free State</option>
                    <option value="Gauteng">Gauteng</option>
                    <option value="KwaZulu-Natal">KwaZulu-Natal</option>
                    <option value="Limpopo">Limpopo</option>
                    <option value="Mpumalanga">Mpumalanga</option>
                    <option value="Northern Cape">Northern Cape</option>
                    <option value="North West">North West</option>
                    <option value="Western Cape">Western Cape</option>
                  </select>
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
                <div className="space-y-2">
                  <Label htmlFor="country">Country *</Label>
                  <Input
                    id="country"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Business Information (show only for BUSINESS role) */}
            {session?.user?.role === 'BUSINESS' && (
              <div className="space-y-4 p-6 bg-slate-50 dark:bg-slate-900 rounded-lg">
                <h3 className="text-lg font-semibold">Business Information</h3>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="businessName">Business Name *</Label>
                    <Input
                      id="businessName"
                      placeholder="ABC Trading (Pty) Ltd"
                      value={formData.businessName}
                      onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                      required={session?.user?.role === 'BUSINESS'}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="registrationNumber">Registration Number *</Label>
                    <Input
                      id="registrationNumber"
                      placeholder="2020/123456/07"
                      value={formData.registrationNumber}
                      onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
                      required={session?.user?.role === 'BUSINESS'}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="vatNumber">VAT Number (if applicable)</Label>
                    <Input
                      id="vatNumber"
                      placeholder="4123456789"
                      value={formData.vatNumber}
                      onChange={(e) => setFormData({ ...formData, vatNumber: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="businessType">Business Type *</Label>
                    <select
                      id="businessType"
                      value={formData.businessType}
                      onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                      className="w-full px-3 py-2 border rounded-md"
                      required={session?.user?.role === 'BUSINESS'}
                    >
                      <option value="">Select Type</option>
                      <option value="Sole Proprietor">Sole Proprietor</option>
                      <option value="Partnership">Partnership</option>
                      <option value="Private Company">Private Company (Pty Ltd)</option>
                      <option value="Public Company">Public Company (Ltd)</option>
                      <option value="Close Corporation">Close Corporation (CC)</option>
                      <option value="Trust">Trust</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="industry">Industry *</Label>
                  <Input
                    id="industry"
                    placeholder="e.g., E-commerce, Manufacturing, Services"
                    value={formData.industry}
                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                    required={session?.user?.role === 'BUSINESS'}
                  />
                </div>
              </div>
            )}

            {/* Banking Information */}
            <div className="space-y-4 p-6 bg-slate-50 dark:bg-slate-900 rounded-lg">
              <h3 className="text-lg font-semibold">Banking Information</h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bankName">Bank Name *</Label>
                  <select
                    id="bankName"
                    value={formData.bankName}
                    onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md"
                    required
                  >
                    <option value="">Select Bank</option>
                    <option value="ABSA">ABSA</option>
                    <option value="Capitec">Capitec</option>
                    <option value="FNB">First National Bank (FNB)</option>
                    <option value="Nedbank">Nedbank</option>
                    <option value="Standard Bank">Standard Bank</option>
                    <option value="African Bank">African Bank</option>
                    <option value="Discovery Bank">Discovery Bank</option>
                    <option value="TymeBank">TymeBank</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accountType">Account Type *</Label>
                  <select
                    id="accountType"
                    value={formData.accountType}
                    onChange={(e) => setFormData({ ...formData, accountType: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md"
                    required
                  >
                    <option value="">Select Type</option>
                    <option value="Savings">Savings</option>
                    <option value="Cheque">Cheque/Current</option>
                    <option value="Business">Business</option>
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="accountNumber">Account Number *</Label>
                  <Input
                    id="accountNumber"
                    placeholder="1234567890"
                    value={formData.accountNumber}
                    onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="branchCode">Branch Code *</Label>
                  <Input
                    id="branchCode"
                    placeholder="250655"
                    value={formData.branchCode}
                    onChange={(e) => setFormData({ ...formData, branchCode: e.target.value })}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Document Uploads */}
            <div className="space-y-4 p-6 bg-slate-50 dark:bg-slate-900 rounded-lg">
              <h3 className="text-lg font-semibold">Required Documents</h3>

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

            {session?.user?.role === 'BUSINESS' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="businessRegistration">Business Registration Certificate *</Label>
                  <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer">
                    <input
                      type="file"
                      id="businessRegistration"
                      accept="image/*,.pdf"
                      onChange={(e) => handleFileChange('businessRegistration', e.target.files?.[0] || null)}
                      className="hidden"
                    />
                    <label htmlFor="businessRegistration" className="cursor-pointer">
                      <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm font-medium">
                        {formData.businessRegistration ? formData.businessRegistration.name : 'Click to upload business registration'}
                      </p>
                      <p className="text-xs text-muted-foreground">CIPC certificate or registration docs (max. 10MB)</p>
                    </label>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bankStatement">Business Bank Statement *</Label>
                  <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer">
                    <input
                      type="file"
                      id="bankStatement"
                      accept="image/*,.pdf"
                      onChange={(e) => handleFileChange('bankStatement', e.target.files?.[0] || null)}
                      className="hidden"
                    />
                    <label htmlFor="bankStatement" className="cursor-pointer">
                      <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm font-medium">
                        {formData.bankStatement ? formData.bankStatement.name : 'Click to upload bank statement'}
                      </p>
                      <p className="text-xs text-muted-foreground">Last 3 months bank statement (max. 10MB)</p>
                    </label>
                  </div>
                </div>
              </>
            )}
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg dark:bg-blue-900/20 dark:border-blue-800">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                <strong>Note:</strong> All documents must be clear, unaltered, and less than 3 months old. 
                This information is kept secure and confidential in accordance with POPIA regulations.
              </p>
            </div>

            {/* FICA Consent */}
            <div className="space-y-4 p-6 bg-slate-50 dark:bg-slate-900 rounded-lg">
              <h3 className="text-lg font-semibold">Consent & Declarations</h3>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="ficaConsent"
                    required
                    className="w-4 h-4 mt-1 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="ficaConsent" className="text-sm">
                    I consent to Octrivium Funding processing my personal information in accordance with the 
                    <strong> Financial Intelligence Centre Act (FICA)</strong> and the 
                    <strong> Protection of Personal Information Act (POPIA)</strong>. I understand this is required 
                    for legal compliance and fraud prevention.
                  </label>
                </div>

                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="accuracyDeclaration"
                    required
                    className="w-4 h-4 mt-1 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="accuracyDeclaration" className="text-sm">
                    I declare that all information provided is true, accurate, and complete to the best of my knowledge. 
                    I understand that providing false information may result in account suspension and legal action.
                  </label>
                </div>

                {session?.user?.role === 'BUSINESS' && (
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="businessAuthorization"
                      required
                      className="w-4 h-4 mt-1 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="businessAuthorization" className="text-sm">
                      I confirm that I am an authorized representative of the business and have the authority to 
                      enter into agreements on behalf of the business.
                    </label>
                  </div>
                )}

                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="termsAgreement"
                    required
                    className="w-4 h-4 mt-1 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="termsAgreement" className="text-sm">
                    I have read and agree to the{' '}
                    <a href="/terms" target="_blank" className="text-blue-600 hover:underline font-medium">
                      Terms of Service
                    </a>
                    {' '}and{' '}
                    <a href="/privacy" target="_blank" className="text-blue-600 hover:underline font-medium">
                      Privacy Policy
                    </a>.
                  </label>
                </div>
              </div>
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
