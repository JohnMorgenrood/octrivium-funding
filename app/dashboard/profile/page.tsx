import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { User, Mail, Phone, MapPin, Shield, Bell, CreditCard, Lock } from 'lucide-react';

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Profile & Settings
        </h1>
        <p className="text-slate-600">Manage your account information and preferences</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Profile Summary */}
        <Card className="lg:col-span-1">
          <CardHeader className="text-center bg-gradient-to-br from-blue-50 to-indigo-50">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="h-12 w-12 text-white" />
            </div>
            <CardTitle>{session.user.name || 'User'}</CardTitle>
            <CardDescription>{session.user.email}</CardDescription>
            <div className="mt-4">
              {session.user.role === 'INVESTOR' && (
                <Badge className="bg-blue-100 text-blue-700 border-blue-300">Investor</Badge>
              )}
              {session.user.role === 'BUSINESS' && (
                <Badge className="bg-purple-100 text-purple-700 border-purple-300">Business</Badge>
              )}
              {session.user.role === 'ADMIN' && (
                <Badge className="bg-emerald-100 text-emerald-700 border-emerald-300">Admin</Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-slate-600" />
                  <span className="text-sm font-medium">KYC Status</span>
                </div>
                <Badge className="bg-green-100 text-green-700 border-green-300">
                  Verified
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-slate-600" />
                  <span className="text-sm font-medium">Email</span>
                </div>
                <Badge className="bg-green-100 text-green-700 border-green-300">
                  Verified
                </Badge>
              </div>
              <Button className="w-full" variant="outline">
                <User className="h-4 w-4 mr-2" />
                Edit Profile Photo
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <Card>
            <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <form className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" defaultValue="John" />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" defaultValue="Doe" />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" defaultValue={session.user.email || ''} />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" type="tel" defaultValue="+27 82 123 4567" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="idNumber">ID Number</Label>
                  <Input id="idNumber" defaultValue="8705125***089" disabled />
                  <p className="text-xs text-slate-500 mt-1">Contact support to update ID number</p>
                </div>
                <Button type="submit">Save Changes</Button>
              </form>
            </CardContent>
          </Card>

          {/* Address Information */}
          <Card>
            <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Address Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <form className="space-y-4">
                <div>
                  <Label htmlFor="street">Street Address</Label>
                  <Input id="street" defaultValue="123 Main Street" />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input id="city" defaultValue="Johannesburg" />
                  </div>
                  <div>
                    <Label htmlFor="province">Province</Label>
                    <Input id="province" defaultValue="Gauteng" />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="postalCode">Postal Code</Label>
                    <Input id="postalCode" defaultValue="2000" />
                  </div>
                  <div>
                    <Label htmlFor="country">Country</Label>
                    <Input id="country" defaultValue="South Africa" disabled />
                  </div>
                </div>
                <Button type="submit">Save Address</Button>
              </form>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card>
            <CardHeader className="bg-gradient-to-r from-emerald-600 to-green-600 text-white">
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Security Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-3">Change Password</h4>
                  <form className="space-y-3">
                    <div>
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input id="currentPassword" type="password" />
                    </div>
                    <div>
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input id="newPassword" type="password" />
                    </div>
                    <div>
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input id="confirmPassword" type="password" />
                    </div>
                    <Button type="submit">Update Password</Button>
                  </form>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-3">Two-Factor Authentication</h4>
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div>
                      <p className="font-medium">2FA Status</p>
                      <p className="text-sm text-slate-600">Add an extra layer of security</p>
                    </div>
                    <Button variant="outline">Enable 2FA</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notification Preferences */}
          <Card>
            <CardHeader className="bg-gradient-to-r from-orange-600 to-red-600 text-white">
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <label className="flex items-center justify-between p-3 bg-slate-50 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors">
                  <div>
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-sm text-slate-600">Receive updates via email</p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-5 h-5 rounded" />
                </label>
                <label className="flex items-center justify-between p-3 bg-slate-50 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors">
                  <div>
                    <p className="font-medium">Investment Updates</p>
                    <p className="text-sm text-slate-600">Get notified about your investments</p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-5 h-5 rounded" />
                </label>
                <label className="flex items-center justify-between p-3 bg-slate-50 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors">
                  <div>
                    <p className="font-medium">New Deal Alerts</p>
                    <p className="text-sm text-slate-600">Be the first to know about new opportunities</p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-5 h-5 rounded" />
                </label>
                <label className="flex items-center justify-between p-3 bg-slate-50 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors">
                  <div>
                    <p className="font-medium">Monthly Reports</p>
                    <p className="text-sm text-slate-600">Receive monthly performance summaries</p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-5 h-5 rounded" />
                </label>
                <label className="flex items-center justify-between p-3 bg-slate-50 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors">
                  <div>
                    <p className="font-medium">Marketing Communications</p>
                    <p className="text-sm text-slate-600">Promotions and platform updates</p>
                  </div>
                  <input type="checkbox" className="w-5 h-5 rounded" />
                </label>
                <Button>Save Preferences</Button>
              </div>
            </CardContent>
          </Card>

          {/* Payment Methods (for investors) */}
          {session.user.role === 'INVESTOR' && (
            <Card>
              <CardHeader className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white">
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Methods
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border-2 border-blue-200">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                        <CreditCard className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="font-medium">Bank Account •••• 4567</p>
                        <p className="text-sm text-slate-600">Standard Bank</p>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-700 border-green-300">Primary</Badge>
                  </div>
                  <Button variant="outline" className="w-full">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Add Payment Method
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
