'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  TrendingUp, 
  Wallet, 
  Settings, 
  Bell,
  LogOut,
  Building2,
  Users,
  Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    session.user.role === 'INVESTOR' && { name: 'Browse Deals', href: '/deals', icon: TrendingUp },
    session.user.role === 'INVESTOR' && { name: 'My Investments', href: '/dashboard/investments', icon: TrendingUp },
    session.user.role === 'BUSINESS' && { name: 'My Deals', href: '/dashboard/deals', icon: Building2 },
    session.user.role === 'BUSINESS' && { name: 'Create Deal', href: '/dashboard/deals/create', icon: Building2 },
    session.user.role === 'ADMIN' && { name: 'Review Deals', href: '/admin/deals', icon: Shield },
    session.user.role === 'ADMIN' && { name: 'KYC Verification', href: '/admin/kyc', icon: Users },
    { name: 'Wallet', href: '/dashboard/wallet', icon: Wallet },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ].filter(Boolean);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="text-xl font-bold text-primary">
              Octrivium Funding
            </Link>
            
            <div className="flex items-center gap-4">
              <Link href="/dashboard/notifications">
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </Button>
              </Link>
              
              <div className="flex items-center gap-2">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium">{session.user.name}</p>
                  <p className="text-xs text-muted-foreground capitalize">
                    {session.user.role.toLowerCase()}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-semibold">
                  {session.user.name?.charAt(0).toUpperCase()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r min-h-[calc(100vh-4rem)] hidden md:block">
          <nav className="p-4 space-y-1">
            {navigation.map((item: any) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <item.icon className="h-5 w-5 text-gray-600" />
                <span>{item.name}</span>
              </Link>
            ))}
            
            <button
              onClick={() => router.push('/api/auth/signout')}
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors w-full text-left text-red-600"
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {session.user.kycStatus !== 'APPROVED' && session.user.role !== 'ADMIN' && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-yellow-800 mb-1">KYC Verification Required</h3>
              <p className="text-sm text-yellow-700 mb-3">
                Complete your KYC verification to {session.user.role === 'INVESTOR' ? 'start investing' : 'create deals'}.
              </p>
              <Link href="/dashboard/settings?tab=kyc">
                <Button size="sm" variant="outline">
                  Complete Verification
                </Button>
              </Link>
            </div>
          )}
          
          {children}
        </main>
      </div>
    </div>
  );
}
