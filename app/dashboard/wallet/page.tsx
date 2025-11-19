'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Wallet as WalletIcon, ArrowDownToLine, ArrowUpFromLine, History } from 'lucide-react';
import { BankCardManager } from '@/components/BankCardManager';

export default function WalletPage() {
  const { data: session } = useSession();
  const [wallet, setWallet] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');

  useEffect(() => {
    fetchWalletData();
  }, []);

  const fetchWalletData = async () => {
    try {
      const [walletRes, transactionsRes] = await Promise.all([
        fetch('/api/wallet'),
        fetch('/api/wallet/transactions'),
      ]);

      const walletData = await walletRes.json();
      const transactionsData = await transactionsRes.json();

      setWallet(walletData.wallet);
      setTransactions(transactionsData.transactions);
    } catch (error) {
      console.error('Error fetching wallet data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeposit = async () => {
    const amount = parseFloat(depositAmount);
    if (isNaN(amount) || amount <= 0) return;

    try {
      const response = await fetch('/api/wallet/deposit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount }),
      });

      if (response.ok) {
        setDepositAmount('');
        fetchWalletData();
      }
    } catch (error) {
      console.error('Deposit error:', error);
    }
  };

  const handleWithdraw = async () => {
    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount <= 0) return;

    if (amount > wallet.availableBalance) {
      alert('Insufficient available balance');
      return;
    }

    try {
      const response = await fetch('/api/wallet/withdraw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount }),
      });

      if (response.ok) {
        setWithdrawAmount('');
        fetchWalletData();
      }
    } catch (error) {
      console.error('Withdraw error:', error);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading wallet...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">My Wallet</h1>
        <p className="text-muted-foreground">Manage your funds and view transaction history</p>
      </div>

      {/* Balance Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            <WalletIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(wallet?.balance || 0)}</div>
            <p className="text-xs text-muted-foreground">All funds in your wallet</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Balance</CardTitle>
            <ArrowUpFromLine className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(wallet?.availableBalance || 0)}
            </div>
            <p className="text-xs text-muted-foreground">Ready to invest or withdraw</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Locked Balance</CardTitle>
            <ArrowDownToLine className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {formatCurrency(wallet?.lockedBalance || 0)}
            </div>
            <p className="text-xs text-muted-foreground">In active investments</p>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Deposit Funds</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="deposit">Amount (ZAR)</Label>
              <Input
                id="deposit"
                type="number"
                placeholder="0.00"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
              />
            </div>
            <Button onClick={handleDeposit} className="w-full" disabled={!depositAmount}>
              <ArrowDownToLine className="mr-2 h-4 w-4" />
              Deposit Funds
            </Button>
            <p className="text-xs text-muted-foreground">
              Note: This is a demo. In production, this would redirect to PayFast payment gateway.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Withdraw Funds</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="withdraw">Amount (ZAR)</Label>
              <Input
                id="withdraw"
                type="number"
                placeholder="0.00"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                max={wallet?.availableBalance || 0}
              />
            </div>
            <Button onClick={handleWithdraw} variant="outline" className="w-full" disabled={!withdrawAmount}>
              <ArrowUpFromLine className="mr-2 h-4 w-4" />
              Withdraw Funds
            </Button>
            <p className="text-xs text-muted-foreground">
              Withdrawals are processed to your default card within 1-3 business days.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Bank Cards */}
      <Card>
        <CardHeader>
          <CardTitle>Bank Account for Payments</CardTitle>
          <p className="text-sm text-muted-foreground">
            Add your South African bank account details so admins can pay you via EFT when deals complete. 
            Your banking information is securely encrypted and only used for processing payments.
          </p>
        </CardHeader>
        <CardContent>
          <BankCardManager />
        </CardContent>
      </Card>

      {/* Transaction History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Transaction History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <History className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No transactions yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {transactions.map((tx: any) => (
                <div key={tx.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      tx.type === 'DEPOSIT' ? 'bg-green-100' : 
                      tx.type === 'WITHDRAWAL' ? 'bg-red-100' : 
                      'bg-blue-100'
                    }`}>
                      {tx.type === 'DEPOSIT' && <ArrowDownToLine className="h-5 w-5 text-green-600" />}
                      {tx.type === 'WITHDRAWAL' && <ArrowUpFromLine className="h-5 w-5 text-red-600" />}
                      {tx.type === 'INVESTMENT' && <WalletIcon className="h-5 w-5 text-blue-600" />}
                    </div>
                    <div>
                      <p className="font-medium">{tx.description || tx.type}</p>
                      <p className="text-sm text-muted-foreground">{formatDate(tx.createdAt)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${
                      tx.type === 'DEPOSIT' ? 'text-green-600' : 
                      tx.type === 'WITHDRAWAL' ? 'text-red-600' : 
                      'text-blue-600'
                    }`}>
                      {tx.type === 'DEPOSIT' ? '+' : '-'}{formatCurrency(tx.amount)}
                    </p>
                    <p className="text-xs text-muted-foreground capitalize">{tx.status.toLowerCase()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
