'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, Lock, Bell, Building2, Loader2, CreditCard, Users, Landmark } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function SettingsPage() {
  const { data: session, update } = useSession();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });
  const [companyData, setCompanyData] = useState({
    companyName: '',
    companyLogo: '',
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>('');
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [subscriptionTier, setSubscriptionTier] = useState<string>('FREE');
  const [bankData, setBankData] = useState({
    bankName: '',
    bankAccountName: '',
    bankAccountNumber: '',
    bankBranchCode: '',
    bankAccountType: '',
  });
  const [yocoData, setYocoData] = useState({
    yocoPublicKey: '',
    yocoSecretKey: '',
    hasSecretKey: false,
  });
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [newMember, setNewMember] = useState({
    email: '',
    firstName: '',
    lastName: '',
  });
  const [isOwner, setIsOwner] = useState(true);

  useEffect(() => {
    if (session?.user) {
      const names = session.user.name?.split(' ') || ['', ''];
      setProfileData({
        firstName: names[0] || '',
        lastName: names[1] || '',
        email: session.user.email || '',
        phone: '',
      });
      
      // Fetch company data
      fetchCompanyData();
      fetchBankData();
      fetchYocoData();
      fetchTeamMembers();
    }
  }, [session]);

  const fetchBankData = async () => {
    try {
      const res = await fetch('/api/user/bank-details');
      if (res.ok) {
        const data = await res.json();
        setBankData({
          bankName: data.bankName || '',
          bankAccountName: data.bankAccountName || '',
          bankAccountNumber: data.bankAccountNumber || '',
          bankBranchCode: data.bankBranchCode || '',
          bankAccountType: data.bankAccountType || '',
        });
        setSubscriptionTier(data.subscriptionTier || 'FREE');
      }
    } catch (error) {
      console.error('Failed to fetch bank data:', error);
    }
  };

  const fetchYocoData = async () => {
    try {
      const res = await fetch('/api/user/yoco-keys');
      if (res.ok) {
        const data = await res.json();
        setYocoData({
          yocoPublicKey: data.yocoPublicKey || '',
          yocoSecretKey: '', // Never send secret key to frontend
          hasSecretKey: data.hasSecretKey || false,
        });
        setSubscriptionTier(data.subscriptionTier || 'FREE');
      }
    } catch (error) {
      console.error('Failed to fetch Yoco data:', error);
    }
  };

  const fetchTeamMembers = async () => {
    try {
      const res = await fetch('/api/team/members');
      if (res.ok) {
        const data = await res.json();
        setTeamMembers(data.teamMembers || []);
        setIsOwner(!data.companyOwnerId);
        setSubscriptionTier(data.subscriptionTier || 'FREE');
      }
    } catch (error) {
      console.error('Failed to fetch team members:', error);
    }
  };

  const fetchCompanyData = async () => {
    try {
      const res = await fetch('/api/user/company');
      if (res.ok) {
        const data = await res.json();
        setCompanyData({
          companyName: data.companyName || '',
          companyLogo: data.companyLogo || '',
        });
        if (data.companyLogo) {
          setLogoPreview(data.companyLogo);
        }
      }
    } catch (error) {
      console.error('Failed to fetch company data:', error);
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast({
          title: 'Error',
          description: 'Logo must be less than 2MB',
          variant: 'destructive',
        });
        return;
      }
      
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    setLogoFile(null);
    setLogoPreview('');
    setCompanyData({ ...companyData, companyLogo: '' });
  };

  const handleCompanyUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let logoUrl = companyData.companyLogo;
      
      // Upload logo if new file selected
      if (logoFile) {
        const formData = new FormData();
        formData.append('file', logoFile);
        
        // First compress the image
        const compressRes = await fetch('/api/upload/compress-image', {
          method: 'POST',
          body: formData,
        });

        if (!compressRes.ok) {
          throw new Error('Failed to compress image');
        }

        const compressData = await compressRes.json();
        
        toast({
          title: 'Image Compressed',
          description: `Reduced by ${compressData.compressionRatio}% (${(compressData.originalSize / 1024).toFixed(0)}KB → ${(compressData.compressedSize / 1024).toFixed(0)}KB)`,
        });

        // Use the compressed image data URL
        logoUrl = compressData.dataUrl;
      }
      
      const res = await fetch('/api/user/company', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName: companyData.companyName,
          companyLogo: logoUrl || null,
        }),
      });

      if (res.ok) {
        const updatedData = await res.json();
        setCompanyData({
          companyName: updatedData.companyName || '',
          companyLogo: updatedData.companyLogo || '',
        });
        setLogoPreview(updatedData.companyLogo || '');
        toast({
          title: 'Success',
          description: 'Company settings updated successfully',
        });
        await update();
        setLogoFile(null);
      } else {
        toast({
          title: 'Error',
          description: 'Failed to update company settings',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An error occurred while updating',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData),
      });

      if (res.ok) {
        toast({
          title: 'Success',
          description: 'Profile updated successfully',
        });
        await update();
      } else {
        toast({
          title: 'Error',
          description: 'Failed to update profile',
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

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: 'Error',
        description: 'Passwords do not match',
        variant: 'destructive',
      });
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast({
        title: 'Error',
        description: 'Password must be at least 8 characters',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/user/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      if (res.ok) {
        toast({
          title: 'Success',
          description: 'Password changed successfully',
        });
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      } else {
        const data = await res.json();
        toast({
          title: 'Error',
          description: data.error || 'Failed to change password',
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

  const handleBankUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/user/bank-details', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bankData),
      });

      if (res.ok) {
        toast({
          title: 'Success',
          description: 'Bank details updated successfully',
        });
      } else {
        const data = await res.json();
        toast({
          title: 'Error',
          description: data.error || 'Failed to update bank details',
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

  const handleYocoUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/user/yoco-keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          yocoPublicKey: yocoData.yocoPublicKey,
          yocoSecretKey: yocoData.yocoSecretKey,
        }),
      });

      if (res.ok) {
        toast({
          title: 'Success',
          description: 'Yoco API keys saved and validated successfully',
        });
        fetchYocoData();
      } else {
        const data = await res.json();
        toast({
          title: 'Error',
          description: data.error || 'Failed to save Yoco keys',
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

  const handleAddTeamMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/team/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMember),
      });

      if (res.ok) {
        const data = await res.json();
        toast({
          title: 'Success',
          description: `Team member added! Temporary password: ${data.tempPassword}`,
        });
        setNewMember({ email: '', firstName: '', lastName: '' });
        fetchTeamMembers();
      } else {
        const data = await res.json();
        toast({
          title: 'Error',
          description: data.error || 'Failed to add team member',
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

  const handleRemoveTeamMember = async (memberId: string) => {
    if (!confirm('Are you sure you want to remove this team member?')) {
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`/api/team/members?memberId=${memberId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        toast({
          title: 'Success',
          description: 'Team member removed successfully',
        });
        fetchTeamMembers();
      } else {
        const data = await res.json();
        toast({
          title: 'Error',
          description: data.error || 'Failed to remove team member',
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

  return (
    <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Settings</h1>
        <p className="text-sm sm:text-base text-muted-foreground">Manage your account settings and preferences</p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="w-full justify-start overflow-x-auto flex-nowrap">
          <TabsTrigger value="profile" className="flex-shrink-0">
            <User className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Profile</span>
            <span className="sm:hidden">Profile</span>
          </TabsTrigger>
          <TabsTrigger value="company" className="flex-shrink-0">
            <Building2 className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Company</span>
            <span className="sm:hidden">Co.</span>
          </TabsTrigger>
          {(subscriptionTier === 'STARTER' || subscriptionTier === 'BUSINESS') && (
            <TabsTrigger value="bank" className="flex-shrink-0">
              <Landmark className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Bank Details</span>
              <span className="sm:hidden">Bank</span>
            </TabsTrigger>
          )}
          {subscriptionTier === 'BUSINESS' && (
            <>
              <TabsTrigger value="yoco" className="flex-shrink-0">
                <CreditCard className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Yoco API</span>
                <span className="sm:hidden">Yoco</span>
              </TabsTrigger>
              {isOwner && (
                <TabsTrigger value="team" className="flex-shrink-0">
                  <Users className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Team</span>
                  <span className="sm:hidden">Team</span>
                </TabsTrigger>
              )}
            </>
          )}
          <TabsTrigger value="security" className="flex-shrink-0">
            <Lock className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Security</span>
            <span className="sm:hidden">Sec.</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex-shrink-0">
            <Bell className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Notifications</span>
            <span className="sm:hidden">Notif.</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal information</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={profileData.firstName}
                      onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={profileData.lastName}
                      onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+27 XX XXX XXXX"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                  />
                </div>

                <Button type="submit" disabled={loading}>
                  {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Save Changes
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="company">
          <Card>
            <CardHeader>
              <CardTitle>Company Settings</CardTitle>
              <CardDescription>Manage your company information for invoices and quotes</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCompanyUpdate} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    placeholder="Your Company Name"
                    value={companyData.companyName}
                    onChange={(e) => setCompanyData({ ...companyData, companyName: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground">This will appear on your invoices and quotes</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="logo">Company Logo</Label>
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <Input
                        id="logo"
                        type="file"
                        accept="image/png,image/jpeg,image/jpg"
                        onChange={handleLogoChange}
                        className="cursor-pointer"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        PNG, JPG or JPEG. Max 2MB. Recommended: 200x200px
                      </p>
                    </div>
                    {logoPreview && (
                      <div className="flex flex-col gap-2">
                        <div className="w-24 h-24 border rounded-lg overflow-hidden bg-muted flex items-center justify-center">
                          <img 
                            src={logoPreview} 
                            alt="Logo preview" 
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={handleRemoveLogo}
                          className="text-xs"
                        >
                          Remove
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                <Button type="submit" disabled={loading}>
                  {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Save Company Settings
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Bank Details Tab - STARTER/BUSINESS */}
        {(subscriptionTier === 'STARTER' || subscriptionTier === 'BUSINESS') && (
          <TabsContent value="bank">
            <Card>
              <CardHeader>
                <CardTitle>Bank Account Details</CardTitle>
                <CardDescription>
                  Add your bank details to receive EFT payments from customers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleBankUpdate} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="bankName">Bank Name</Label>
                    <Select 
                      value={bankData.bankName} 
                      onValueChange={(value) => setBankData({ ...bankData, bankName: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your bank" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ABSA">ABSA</SelectItem>
                        <SelectItem value="Capitec">Capitec Bank</SelectItem>
                        <SelectItem value="FNB">First National Bank (FNB)</SelectItem>
                        <SelectItem value="Nedbank">Nedbank</SelectItem>
                        <SelectItem value="Standard Bank">Standard Bank</SelectItem>
                        <SelectItem value="Investec">Investec</SelectItem>
                        <SelectItem value="African Bank">African Bank</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bankAccountName">Account Holder Name</Label>
                    <Input
                      id="bankAccountName"
                      value={bankData.bankAccountName}
                      onChange={(e) => setBankData({ ...bankData, bankAccountName: e.target.value })}
                      placeholder="Full name as per bank account"
                      required
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="bankAccountNumber">Account Number</Label>
                      <Input
                        id="bankAccountNumber"
                        value={bankData.bankAccountNumber}
                        onChange={(e) => setBankData({ ...bankData, bankAccountNumber: e.target.value })}
                        placeholder="1234567890"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bankBranchCode">Branch Code</Label>
                      <Input
                        id="bankBranchCode"
                        value={bankData.bankBranchCode}
                        onChange={(e) => setBankData({ ...bankData, bankBranchCode: e.target.value })}
                        placeholder="123456"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bankAccountType">Account Type</Label>
                    <Select 
                      value={bankData.bankAccountType} 
                      onValueChange={(value) => setBankData({ ...bankData, bankAccountType: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select account type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Cheque">Cheque/Current Account</SelectItem>
                        <SelectItem value="Savings">Savings Account</SelectItem>
                        <SelectItem value="Business">Business Account</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-800">
                      <strong>Note:</strong> These bank details will be displayed on your invoices for customers to make EFT payments directly to your account.
                    </p>
                  </div>

                  <Button type="submit" disabled={loading}>
                    {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    Save Bank Details
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {/* Yoco API Tab - BUSINESS ONLY */}
        {subscriptionTier === 'BUSINESS' && (
          <TabsContent value="yoco">
            <Card>
              <CardHeader>
                <CardTitle>Yoco API Configuration</CardTitle>
                <CardDescription>
                  Connect your own Yoco account to receive payments directly (100% of revenue minus Yoco fees)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-semibold text-green-900 mb-2">✓ Direct Payment Routing</h4>
                    <p className="text-sm text-green-800">
                      When you add your own Yoco API keys, customer payments go directly to YOUR Yoco account. You keep 100% of your revenue (minus Yoco's standard transaction fees).
                    </p>
                    <p className="text-sm text-green-800 mt-2">
                      <strong>Without custom keys:</strong> Payments are processed through the platform's Yoco account.
                    </p>
                  </div>

                  <form onSubmit={handleYocoUpdate} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="yocoPublicKey">Yoco Public Key</Label>
                      <Input
                        id="yocoPublicKey"
                        value={yocoData.yocoPublicKey}
                        onChange={(e) => setYocoData({ ...yocoData, yocoPublicKey: e.target.value })}
                        placeholder="pk_live_... or pk_test_..."
                        required
                      />
                      <p className="text-xs text-muted-foreground">
                        Starts with pk_live_ (production) or pk_test_ (testing)
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="yocoSecretKey">Yoco Secret Key</Label>
                      <Input
                        id="yocoSecretKey"
                        type="password"
                        value={yocoData.yocoSecretKey}
                        onChange={(e) => setYocoData({ ...yocoData, yocoSecretKey: e.target.value })}
                        placeholder={yocoData.hasSecretKey ? '••••••••••••••••' : 'sk_live_... or sk_test_...'}
                        required={!yocoData.hasSecretKey}
                      />
                      <p className="text-xs text-muted-foreground">
                        Starts with sk_live_ (production) or sk_test_ (testing)
                      </p>
                      {yocoData.hasSecretKey && (
                        <p className="text-xs text-green-600">
                          ✓ Secret key already saved. Leave blank to keep existing key.
                        </p>
                      )}
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <p className="text-sm text-yellow-800">
                        <strong>Where to find your Yoco API keys:</strong>
                      </p>
                      <ol className="text-sm text-yellow-800 mt-2 ml-4 list-decimal space-y-1">
                        <li>Log in to your Yoco Business Portal</li>
                        <li>Go to Settings → Developers → API Keys</li>
                        <li>Copy both your Public Key and Secret Key</li>
                      </ol>
                    </div>

                    <Button type="submit" disabled={loading}>
                      {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                      {yocoData.hasSecretKey ? 'Update' : 'Save'} Yoco API Keys
                    </Button>
                  </form>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {/* Team Members Tab - BUSINESS ONLY */}
        {subscriptionTier === 'BUSINESS' && isOwner && (
          <TabsContent value="team">
            <Card>
              <CardHeader>
                <CardTitle>Team Members</CardTitle>
                <CardDescription>
                  Invite up to 4 team members to share access to your accounting software
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Current Team Members */}
                  {teamMembers.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-3">Current Team Members ({teamMembers.length}/4)</h4>
                      <div className="space-y-2">
                        {teamMembers.map((member: any) => (
                          <div key={member.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                              <p className="font-medium">{member.firstName} {member.lastName}</p>
                              <p className="text-sm text-muted-foreground">{member.email}</p>
                              <p className="text-xs text-muted-foreground">
                                Added {new Date(member.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleRemoveTeamMember(member.id)}
                              disabled={loading}
                            >
                              Remove
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Add New Member Form */}
                  {teamMembers.length < 4 && (
                    <div>
                      <h4 className="font-semibold mb-3">Add New Team Member</h4>
                      <form onSubmit={handleAddTeamMember} className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="memberFirstName">First Name</Label>
                            <Input
                              id="memberFirstName"
                              value={newMember.firstName}
                              onChange={(e) => setNewMember({ ...newMember, firstName: e.target.value })}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="memberLastName">Last Name</Label>
                            <Input
                              id="memberLastName"
                              value={newMember.lastName}
                              onChange={(e) => setNewMember({ ...newMember, lastName: e.target.value })}
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="memberEmail">Email Address</Label>
                          <Input
                            id="memberEmail"
                            type="email"
                            value={newMember.email}
                            onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                            placeholder="teammate@example.com"
                            required
                          />
                        </div>

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <p className="text-sm text-blue-800">
                            <strong>Note:</strong> A temporary password will be generated and shown to you. The team member will need to change it on first login.
                          </p>
                        </div>

                        <Button type="submit" disabled={loading}>
                          {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                          Add Team Member
                        </Button>
                      </form>
                    </div>
                  )}

                  {teamMembers.length >= 4 && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <p className="text-sm text-yellow-800">
                        <strong>Maximum team members reached.</strong> Remove a member to add a new one.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>Update your password to keep your account secure</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    required
                  />
                  <p className="text-xs text-muted-foreground">Must be at least 8 characters</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    required
                  />
                </div>

                <Button type="submit" disabled={loading}>
                  {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Change Password
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Choose what notifications you want to receive</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-sm text-muted-foreground">Receive email updates about your investments</p>
                  </div>
                  <input type="checkbox" defaultChecked className="h-4 w-4" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Investment Updates</p>
                    <p className="text-sm text-muted-foreground">Get notified when deals you invested in have updates</p>
                  </div>
                  <input type="checkbox" defaultChecked className="h-4 w-4" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Revenue Share Payments</p>
                    <p className="text-sm text-muted-foreground">Notifications for monthly revenue share payments</p>
                  </div>
                  <input type="checkbox" defaultChecked className="h-4 w-4" />
                </div>
                <Button>Save Preferences</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
