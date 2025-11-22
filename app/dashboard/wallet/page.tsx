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
    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    if (amount < 100) {
      alert('Minimum deposit is R100');
      return;
    }

    setLoading(true);

    try {
      // Create Yoco checkout for wallet deposit
      const response = await fetch('/api/yoco/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          type: 'wallet_deposit',
          metadata: {
            userId: session?.user?.id,
            purpose: 'wallet_deposit',
          },
        }),
      });

      const data = await response.json();

      if (data.redirectUrl) {
        // Redirect to Yoco payment page
        window.location.href = data.redirectUrl;
      } else {
        alert('Failed to initialize payment');
      }
    } catch (error) {
      console.error('Deposit error:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setLoading(false);
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
        <p className="text-muted-foreground">
          {session?.user?.role === 'INVESTOR' 
            ? 'Pre-fund your wallet for instant investments in multiple deals without payment delays'
            : 'Receive investment funds and monthly revenue share payments, then withdraw to your bank account'
          }
        </p>
      </div>

      {/* How It Works Info Card */}
      <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="bg-blue-100 dark:bg-blue-900/40 rounded-full p-3">
              <WalletIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                {session?.user?.role === 'INVESTOR' ? 'How Your Wallet Works (Investors)' : 'How Your Wallet Works (Businesses)'}
              </h3>
              {session?.user?.role === 'INVESTOR' ? (
                <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 dark:text-blue-400 mt-0.5">1.</span>
                    <span><strong>Deposit funds</strong> securely via Yoco (card payment) - minimum R100</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 dark:text-blue-400 mt-0.5">2.</span>
                    <span><strong>Invest instantly</strong> in multiple deals without paying each time</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 dark:text-blue-400 mt-0.5">3.</span>
                    <span><strong>Receive revenue shares</strong> monthly from your investments (automatically credited)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 dark:text-blue-400 mt-0.5">4.</span>
                    <span><strong>Withdraw anytime</strong> to your bank card within 1-3 business days</span>
                  </li>
                </ul>
              ) : (
                <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 dark:text-blue-400 mt-0.5">1.</span>
                    <span><strong>Receive investments</strong> automatically when investors fund your deal</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 dark:text-blue-400 mt-0.5">2.</span>
                    <span><strong>Get monthly payouts</strong> after revenue verification (if using accounting software)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 dark:text-blue-400 mt-0.5">3.</span>
                    <span><strong>Track all transactions</strong> including deposits, withdrawals, and revenue shares</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 dark:text-blue-400 mt-0.5">4.</span>
                    <span><strong>Withdraw to your bank</strong> account within 1-3 business days</span>
                  </li>
                </ul>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

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
            <p className="text-sm text-muted-foreground mt-2">
              {session?.user?.role === 'INVESTOR' 
                ? 'Add money to invest in deals instantly without payment delays'
                : 'Manually add funds to your wallet (investments are added automatically)'
              }
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="deposit">Amount (ZAR)</Label>
              <Input
                id="deposit"
                type="number"
                placeholder="100.00"
                min="100"
                step="10"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">Minimum deposit: R100</p>
            </div>
            <Button 
              onClick={handleDeposit} 
              className="w-full" 
              disabled={!depositAmount || loading}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Processing...
                </>
              ) : (
                <>
                  <ArrowDownToLine className="mr-2 h-4 w-4" />
                  Deposit via Yoco (Card Payment)
                </>
              )}
            </Button>
            <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
              <p className="text-xs text-green-800 dark:text-green-200 flex items-start gap-2">
                <span className="text-green-600 dark:text-green-400 text-lg">✓</span>
                <span>
                  <strong>Secure payment via Yoco:</strong> Funds are instantly available after successful payment. 
                  All card details are encrypted and PCI-compliant.
                </span>
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Withdraw Funds</CardTitle>
            <p className="text-sm text-muted-foreground mt-2">
              Transfer available balance to your bank card
            </p>
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
              <p className="text-xs text-muted-foreground">
                Available: {formatCurrency(wallet?.availableBalance || 0)}
              </p>
            </div>
            <Button 
              onClick={handleWithdraw} 
              variant="outline" 
              className="w-full" 
              disabled={!withdrawAmount || parseFloat(withdrawAmount) > (wallet?.availableBalance || 0)}
            >
              <ArrowUpFromLine className="mr-2 h-4 w-4" />
              Withdraw to Bank Card
            </Button>
            <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
              <p className="text-xs text-amber-800 dark:text-amber-200">
                <strong>Processing time:</strong> Withdrawals are processed to your registered bank card 
                within 1-3 business days. You'll receive an email confirmation once processed.
              </p>
            </div>
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
