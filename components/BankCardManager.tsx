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
  cardHolderName: string;
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  cardType: string;
  isDefault: boolean;
}

const SA_BANKS = [
  { name: 'Capitec', color: 'from-blue-600 to-blue-700' },
  { name: 'FNB', color: 'from-orange-500 to-red-600' },
  { name: 'Nedbank', color: 'from-green-600 to-emerald-700' },
  { name: 'Standard Bank', color: 'from-blue-700 to-cyan-600' },
  { name: 'ABSA', color: 'from-red-600 to-pink-600' },
  { name: 'Discovery Bank', color: 'from-purple-600 to-indigo-700' },
  { name: 'TymeBank', color: 'from-yellow-500 to-orange-600' },
  { name: 'African Bank', color: 'from-teal-600 to-cyan-700' },
  { name: 'Custom', color: 'from-slate-600 to-slate-700' },
];

export function BankCardManager() {
  const { toast } = useToast();
  const [cards, setCards] = useState<BankCard[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    bankName: '',
    cardHolderName: '',
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cardType: 'Visa',
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
      console.error('Failed to fetch cards:', error);
    }
  };

  useEffect(() => {
    fetchCards();
  }, []);

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, '');
    const chunks = cleaned.match(/.{1,4}/g);
    return chunks ? chunks.join(' ') : cleaned;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s/g, '');
    if (value.length <= 16 && /^\d*$/.test(value)) {
      setFormData({ ...formData, cardNumber: value });
    }
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

      if (res.ok) {
        toast({
          title: 'Success',
          description: 'Card linked successfully',
        });
        setShowAddForm(false);
        setFormData({
          bankName: '',
          cardHolderName: '',
          cardNumber: '',
          expiryMonth: '',
          expiryYear: '',
          cardType: 'Visa',
          isDefault: false,
        });
        fetchCards();
      } else {
        const data = await res.json();
        toast({
          title: 'Error',
          description: data.error || 'Failed to link card',
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

  const deleteCard = async (id: string) => {
    if (!confirm('Are you sure you want to remove this card?')) return;

    try {
      const res = await fetch(`/api/wallet/cards/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        toast({
          title: 'Success',
          description: 'Card removed successfully',
        });
        fetchCards();
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to remove card',
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
          description: 'Default card updated',
        });
        fetchCards();
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update card',
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
          Link New Card
        </Button>
      )}

      {/* Add Card Form */}
      {showAddForm && (
        <Card className="border-2 border-indigo-200 dark:border-indigo-900">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Link Bank Card</CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowAddForm(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <CardDescription>
              Add your bank card for easy withdrawals. We only store the last 4 digits.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Bank Selection */}
              <div className="space-y-2">
                <Label>Select Your Bank</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {SA_BANKS.map((bank) => (
                    <button
                      key={bank.name}
                      type="button"
                      onClick={() => setFormData({ ...formData, bankName: bank.name })}
                      className={`p-3 rounded-xl border-2 transition-all ${
                        formData.bankName === bank.name
                          ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/30'
                          : 'border-slate-200 dark:border-slate-700 hover:border-indigo-300'
                      }`}
                    >
                      <div
                        className={`w-full h-12 rounded-lg bg-gradient-to-br ${bank.color} flex items-center justify-center text-white font-semibold text-sm mb-2`}
                      >
                        {bank.name === 'Custom' ? '?' : bank.name.charAt(0)}
                      </div>
                      <p className="text-xs font-medium text-center">{bank.name}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Card Holder Name */}
              <div className="space-y-2">
                <Label htmlFor="cardHolderName">Card Holder Name *</Label>
                <Input
                  id="cardHolderName"
                  placeholder="JOHN DOE"
                  value={formData.cardHolderName}
                  onChange={(e) =>
                    setFormData({ ...formData, cardHolderName: e.target.value.toUpperCase() })
                  }
                  required
                />
              </div>

              {/* Card Number */}
              <div className="space-y-2">
                <Label htmlFor="cardNumber">Card Number *</Label>
                <Input
                  id="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  value={formatCardNumber(formData.cardNumber)}
                  onChange={handleCardNumberChange}
                  maxLength={19}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Only the last 4 digits will be stored
                </p>
              </div>

              {/* Expiry Date */}
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiryMonth">Month *</Label>
                  <select
                    id="expiryMonth"
                    value={formData.expiryMonth}
                    onChange={(e) => setFormData({ ...formData, expiryMonth: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md"
                    required
                  >
                    <option value="">MM</option>
                    {Array.from({ length: 12 }, (_, i) => {
                      const month = (i + 1).toString().padStart(2, '0');
                      return (
                        <option key={month} value={month}>
                          {month}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expiryYear">Year *</Label>
                  <select
                    id="expiryYear"
                    value={formData.expiryYear}
                    onChange={(e) => setFormData({ ...formData, expiryYear: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md"
                    required
                  >
                    <option value="">YY</option>
                    {Array.from({ length: 15 }, (_, i) => {
                      const year = (new Date().getFullYear() + i).toString().slice(-2);
                      return (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cardType">Type *</Label>
                  <select
                    id="cardType"
                    value={formData.cardType}
                    onChange={(e) => setFormData({ ...formData, cardType: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md"
                    required
                  >
                    <option value="Visa">Visa</option>
                    <option value="Mastercard">Mastercard</option>
                    <option value="Amex">Amex</option>
                  </select>
                </div>
              </div>

              {/* Default Card */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isDefault"
                  checked={formData.isDefault}
                  onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                  className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <Label htmlFor="isDefault" className="cursor-pointer">
                  Set as default card for withdrawals
                </Label>
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? 'Linking...' : 'Link Card'}
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

      {/* Existing Cards */}
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
                  <p className="text-lg font-semibold mt-1">{card.cardHolderName}</p>
                </div>
                {card.isDefault && (
                  <div className="bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium">
                    Default
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-mono">•••• {card.cardNumber}</p>
                  <p className="text-xs opacity-80 mt-1">
                    {card.cardType} • Expires {card.expiryMonth}/{card.expiryYear}
                  </p>
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
                    title="Remove card"
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
          <p className="text-sm">No cards linked yet</p>
          <p className="text-xs mt-1">Link a card to make withdrawals easier</p>
        </div>
      )}
    </div>
  );
}
