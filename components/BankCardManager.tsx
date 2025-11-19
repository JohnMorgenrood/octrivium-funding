'use client';

import { useState, useEffect } from 'react';
import { CreditCard, Plus, Trash2, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface BankCard {
  id: string;
  bankName: string;
  accountHolder: string;
  accountNumber: string;
  accountType: string;
  branchCode: string;
  branchName?: string;
  isDefault: boolean;
  verified: boolean;
}

const SA_BANKS = [
  { name: 'Capitec', color: 'from-blue-600 to-blue-700', universalBranch: '470010' },
  { name: 'FNB', color: 'from-orange-500 to-red-600', universalBranch: '250655' },
  { name: 'Nedbank', color: 'from-green-600 to-emerald-700', universalBranch: '198765' },
  { name: 'Standard Bank', color: 'from-blue-700 to-cyan-600', universalBranch: '051001' },
  { name: 'ABSA', color: 'from-red-600 to-pink-600', universalBranch: '632005' },
  { name: 'Discovery Bank', color: 'from-purple-600 to-indigo-700', universalBranch: '679000' },
  { name: 'TymeBank', color: 'from-yellow-500 to-orange-600', universalBranch: '678910' },
  { name: 'African Bank', color: 'from-teal-600 to-cyan-700', universalBranch: '430000' },
  { name: 'Other', color: 'from-slate-600 to-slate-700', universalBranch: '' },
];

export function BankCardManager() {
  const { toast } = useToast();
  const [cards, setCards] = useState<BankCard[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    bankName: '',
    accountHolder: '',
    accountNumber: '',
    accountType: 'Cheque',
    branchCode: '',
    branchName: '',
    isDefault: false,
  });

  const fetchCards = async () => {
    try {
      const res = await fetch('/api/wallet/cards');
      if (res.ok) {
        const data = await res.json();
        setCards(data);
      }
    } catch (error) {
      console.error('Failed to fetch accounts:', error);
    }
  };

  useEffect(() => {
    fetchCards();
  }, []);

  const handleBankSelect = (bankName: string) => {
    const bank = SA_BANKS.find(b => b.name === bankName);
    setFormData({ 
      ...formData, 
      bankName,
      branchCode: bank?.universalBranch || ''
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/wallet/cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        toast({
          title: '✓ Bank Account Added',
          description: `${formData.bankName} account ending in ${formData.accountNumber.slice(-4)} has been linked`,
        });
        setShowAddForm(false);
        setFormData({
          bankName: '',
          accountHolder: '',
          accountNumber: '',
          accountType: 'Cheque',
          branchCode: '',
          branchName: '',
          isDefault: false,
        });
        await fetchCards(); // Refresh the account list
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to link card',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Card linking error:', error);
      toast({
        title: 'Error',
        description: 'An error occurred while linking your bank account',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteCard = async (id: string) => {
    if (!confirm('Are you sure you want to remove this bank account?')) return;

    try {
      const res = await fetch(`/api/wallet/cards/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        toast({
          title: 'Success',
          description: 'Bank account removed successfully',
        });
        fetchCards();
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to remove bank account',
        variant: 'destructive',
      });
    }
  };

  const setDefaultCard = async (id: string) => {
    try {
      const res = await fetch(`/api/wallet/cards/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isDefault: true }),
      });

      if (res.ok) {
        toast({
          title: 'Success',
          description: 'Default account updated',
        });
        fetchCards();
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update account',
        variant: 'destructive',
      });
    }
  };

  const getBankColor = (bankName: string) => {
    const bank = SA_BANKS.find((b) => b.name === bankName);
    return bank?.color || 'from-slate-600 to-slate-700';
  };

  return (
    <div className="space-y-4">
      {/* Add Card Button */}
      {!showAddForm && (
        <Button
          onClick={() => setShowAddForm(true)}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Bank Account
        </Button>
      )}

      {/* Add Account Form */}
      {showAddForm && (
        <Card className="border-2 border-indigo-200 dark:border-indigo-900">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Link Bank Account</CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowAddForm(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <CardDescription>
              Add your bank account details for receiving payments via EFT when campaigns end.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Security Notice */}
              <div className="p-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-lg">
                <p className="text-xs text-blue-800 dark:text-blue-300">
                  <strong>Note:</strong> This information is used by admins to pay you via EFT when deals complete. 
                  Your banking details are encrypted and only accessible to authorized administrators for payment processing.
                </p>
              </div>

              {/* Bank Selection */}
              <div className="space-y-2">
                <Label>Select Your Bank *</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {SA_BANKS.map((bank) => (
                    <button
                      key={bank.name}
                      type="button"
                      onClick={() => handleBankSelect(bank.name)}
                      className={`p-3 rounded-xl border-2 transition-all ${
                        formData.bankName === bank.name
                          ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/30'
                          : 'border-slate-200 dark:border-slate-700 hover:border-indigo-300'
                      }`}
                    >
                      <div
                        className={`w-full h-12 rounded-lg bg-gradient-to-br ${bank.color} flex items-center justify-center text-white font-semibold text-sm mb-2`}
                      >
                        {bank.name === 'Other' ? '?' : bank.name.charAt(0)}
                      </div>
                      <p className="text-xs font-medium text-center">{bank.name}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Account Holder Name */}
              <div className="space-y-2">
                <Label htmlFor="accountHolder">Account Holder Name *</Label>
                <Input
                  id="accountHolder"
                  placeholder="John Doe"
                  value={formData.accountHolder}
                  onChange={(e) =>
                    setFormData({ ...formData, accountHolder: e.target.value })
                  }
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Must match the name on your bank account
                </p>
              </div>

              {/* Account Number */}
              <div className="space-y-2">
                <Label htmlFor="accountNumber">Account Number *</Label>
                <Input
                  id="accountNumber"
                  placeholder="1234567890"
                  value={formData.accountNumber}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    setFormData({ ...formData, accountNumber: value });
                  }}
                  required
                />
              </div>

              {/* Account Type and Branch Code */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="accountType">Account Type *</Label>
                  <select
                    id="accountType"
                    value={formData.accountType}
                    onChange={(e) => setFormData({ ...formData, accountType: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md"
                    required
                  >
                    <option value="Cheque">Cheque/Current</option>
                    <option value="Savings">Savings</option>
                    <option value="Business">Business</option>
                  </select>
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
                  <p className="text-xs text-muted-foreground">
                    Auto-filled for most banks
                  </p>
                </div>
              </div>

              {/* Optional Branch Name */}
              <div className="space-y-2">
                <Label htmlFor="branchName">Branch Name (Optional)</Label>
                <Input
                  id="branchName"
                  placeholder="Sandton City"
                  value={formData.branchName}
                  onChange={(e) => setFormData({ ...formData, branchName: e.target.value })}
                />
              </div>

              {/* Default Account */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isDefault"
                  checked={formData.isDefault}
                  onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                  className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <Label htmlFor="isDefault" className="cursor-pointer">
                  Set as default account for receiving payments
                </Label>
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? 'Adding...' : 'Add Account'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Existing Accounts */}
      <div className="space-y-3">
        {cards.map((card) => (
          <div
            key={card.id}
            className={`relative overflow-hidden rounded-2xl p-4 ${
              card.isDefault
                ? 'ring-2 ring-indigo-500 ring-offset-2 dark:ring-offset-slate-900'
                : ''
            }`}
          >
            <div
              className={`absolute inset-0 bg-gradient-to-br ${getBankColor(
                card.bankName
              )} opacity-90`}
            />
            <div className="relative text-white">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-xs opacity-80 uppercase tracking-wide">{card.bankName}</p>
                  <p className="text-lg font-semibold mt-1">{card.accountHolder}</p>
                </div>
                <div className="flex gap-2">
                  {card.isDefault && (
                    <div className="bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium">
                      Default
                    </div>
                  )}
                  {card.verified && (
                    <div className="bg-green-500/30 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium">
                      ✓ Verified
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-mono">Acc: •••• {card.accountNumber.slice(-4)}</p>
                  <p className="text-xs opacity-80 mt-1">
                    {card.accountType} • Branch: {card.branchCode}
                  </p>
                  {card.branchName && (
                    <p className="text-xs opacity-70 mt-0.5">{card.branchName}</p>
                  )}
                </div>

                <div className="flex gap-2">
                  {!card.isDefault && (
                    <button
                      onClick={() => setDefaultCard(card.id)}
                      className="p-2 rounded-lg bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-colors"
                      title="Set as default"
                    >
                      <Check className="h-4 w-4" />
                    </button>
                  )}
                  <button
                    onClick={() => deleteCard(card.id)}
                    className="p-2 rounded-lg bg-white/20 hover:bg-red-500/50 backdrop-blur-sm transition-colors"
                    title="Remove account"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {cards.length === 0 && !showAddForm && (
        <div className="text-center py-8 text-muted-foreground">
          <CreditCard className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No bank accounts linked yet</p>
          <p className="text-xs mt-1">Add your bank account to receive payments via EFT</p>
        </div>
      )}
    </div>
  );
}
