'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Bell, Mail, Smartphone, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface NotificationPreferences {
  invoicePaid: boolean;
  invoiceOverdue: boolean;
  newInvestor: boolean;
  revenueUpdate: boolean;
  systemUpdates: boolean;
}

export default function NotificationSettings() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    invoicePaid: true,
    invoiceOverdue: true,
    newInvestor: true,
    revenueUpdate: true,
    systemUpdates: false,
  });

  useEffect(() => {
    fetchPreferences();
  }, []);

  const fetchPreferences = async () => {
    try {
      const res = await fetch('/api/user/notifications');
      if (!res.ok) throw new Error('Failed to fetch preferences');
      
      const data = await res.json();
      setEmailNotifications(data.emailNotifications ?? true);
      setPushNotifications(data.pushNotifications ?? false);
      setPreferences(data.preferences || {
        invoicePaid: true,
        invoiceOverdue: true,
        newInvestor: true,
        revenueUpdate: true,
        systemUpdates: false,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load notification preferences',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/user/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          emailNotifications,
          pushNotifications,
          preferences,
        }),
      });

      if (!res.ok) throw new Error('Failed to save preferences');

      toast({
        title: 'Success',
        description: 'Notification preferences saved',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save notification preferences',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const requestPushPermission = async () => {
    if (!('Notification' in window)) {
      toast({
        title: 'Not Supported',
        description: 'Push notifications are not supported in this browser',
        variant: 'destructive',
      });
      return;
    }

    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      setPushNotifications(true);
      toast({
        title: 'Enabled',
        description: 'Push notifications enabled',
      });
    } else {
      toast({
        title: 'Denied',
        description: 'Push notification permission was denied',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading...</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-blue-600" />
            <CardTitle>Notification Channels</CardTitle>
          </div>
          <CardDescription>
            Choose how you want to receive notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-gray-500" />
              <div>
                <Label htmlFor="email-notifications" className="text-base font-medium">
                  Email Notifications
                </Label>
                <p className="text-sm text-muted-foreground">
                  Receive notifications via email
                </p>
              </div>
            </div>
            <Switch
              id="email-notifications"
              checked={emailNotifications}
              onCheckedChange={setEmailNotifications}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Smartphone className="h-5 w-5 text-gray-500" />
              <div>
                <Label htmlFor="push-notifications" className="text-base font-medium">
                  Push Notifications
                </Label>
                <p className="text-sm text-muted-foreground">
                  Receive notifications in your browser
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                id="push-notifications"
                checked={pushNotifications}
                onCheckedChange={(checked) => {
                  if (checked) {
                    requestPushPermission();
                  } else {
                    setPushNotifications(false);
                  }
                }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
          <CardDescription>
            Choose what notifications you want to receive
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="invoice-paid" className="text-base font-medium">
                Invoice Paid
              </Label>
              <p className="text-sm text-muted-foreground">
                When a customer pays an invoice
              </p>
            </div>
            <Switch
              id="invoice-paid"
              checked={preferences.invoicePaid}
              onCheckedChange={(checked) =>
                setPreferences({ ...preferences, invoicePaid: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="invoice-overdue" className="text-base font-medium">
                Invoice Overdue
              </Label>
              <p className="text-sm text-muted-foreground">
                When an invoice becomes overdue
              </p>
            </div>
            <Switch
              id="invoice-overdue"
              checked={preferences.invoiceOverdue}
              onCheckedChange={(checked) =>
                setPreferences({ ...preferences, invoiceOverdue: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="new-investor" className="text-base font-medium">
                New Investor
              </Label>
              <p className="text-sm text-muted-foreground">
                When someone invests in your business
              </p>
            </div>
            <Switch
              id="new-investor"
              checked={preferences.newInvestor}
              onCheckedChange={(checked) =>
                setPreferences({ ...preferences, newInvestor: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="revenue-update" className="text-base font-medium">
                Revenue Updates
              </Label>
              <p className="text-sm text-muted-foreground">
                Monthly revenue reports and updates
              </p>
            </div>
            <Switch
              id="revenue-update"
              checked={preferences.revenueUpdate}
              onCheckedChange={(checked) =>
                setPreferences({ ...preferences, revenueUpdate: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="system-updates" className="text-base font-medium">
                System Updates
              </Label>
              <p className="text-sm text-muted-foreground">
                Platform updates and new features
              </p>
            </div>
            <Switch
              id="system-updates"
              checked={preferences.systemUpdates}
              onCheckedChange={(checked) =>
                setPreferences({ ...preferences, systemUpdates: checked })
              }
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving} size="lg">
          <Save className="h-4 w-4 mr-2" />
          {saving ? 'Saving...' : 'Save Preferences'}
        </Button>
      </div>
    </div>
  );
}
