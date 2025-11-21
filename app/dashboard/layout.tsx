'use client';

import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
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
  Shield,
  Menu,
  X,
  Calculator,
  CreditCard
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ThemeToggle } from '@/components/theme-toggle';
import { NotificationBell } from '@/components/NotificationBell';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  // Check KYC status and create notification if needed
  useEffect(() => {
    if (session?.user?.id) {
      fetch('/api/kyc/check-status', { method: 'POST' }).catch(console.error);
    }
  }, [session?.user?.id]);

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
    session.user.role === 'INVESTOR' && { name: 'My Investments', href: '/dashboard/investor/portfolio', icon: TrendingUp },
    session.user.role === 'BUSINESS' && { name: 'My Deals', href: '/dashboard/business/deals', icon: Building2 },
    session.user.role === 'BUSINESS' && { name: 'Revenue', href: '/dashboard/revenue', icon: TrendingUp },
    { name: 'Accounting', href: '/dashboard/accounting/overview', icon: Calculator },
    { name: 'Subscription', href: '/dashboard/subscriptions', icon: CreditCard },
    session.user.role === 'ADMIN' && { name: 'Admin Panel', href: '/admin', icon: Shield },
    session.user.role === 'ADMIN' && { name: 'Review Deals', href: '/admin/deals', icon: Shield },
    session.user.role === 'ADMIN' && { name: 'KYC Verification', href: '/admin/kyc', icon: Users },
    { name: 'Wallet', href: '/dashboard/wallet', icon: Wallet },
    { name: 'KYC', href: '/dashboard/kyc', icon: Shield },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ].filter(Boolean);

  const isActiveRoute = (href: string) => pathname === href;

  const NavLink = ({ item, onClick }: { item: any; onClick?: () => void }) => (
    <Link
      href={item.href}
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
        isActiveRoute(item.href)
          ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30 dark:shadow-indigo-900/50'
          : 'hover:bg-slate-100 dark:hover:bg-slate-800/70 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400'
      }`}
    >
      <item.icon className="h-5 w-5" />
      <span className="font-medium">{item.name}</span>
    </Link>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-slate-50 to-gray-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Top Navigation */}
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-700/50 sticky top-0 z-50 shadow-lg dark:shadow-slate-900/50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              {/* Mobile Menu Button */}
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[280px] sm:w-[320px] p-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl">
                  <SheetHeader className="border-b border-slate-200 dark:border-slate-700/50 p-6 pb-4 bg-gradient-to-br from-indigo-50 dark:from-indigo-950/30 to-transparent">
                    <SheetTitle className="text-left">
                      <Link href="/" className="text-xl font-bold text-primary dark:text-white">
                        Octrivium Funding
                      </Link>
                    </SheetTitle>
                    <div className="flex items-center gap-3 mt-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-semibold text-lg shadow-lg">
                        {session.user.name?.charAt(0).toUpperCase()}
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-semibold dark:text-white">{session.user.name}</p>
                        <p className="text-xs text-muted-foreground dark:text-gray-400 capitalize">
                          {session.user.role.toLowerCase()}
                        </p>
                      </div>
                    </div>
                  </SheetHeader>
                  
                  <nav className="p-4 space-y-1">
                    {navigation.map((item: any) => (
                      <NavLink key={item.href} item={item} onClick={() => setMobileMenuOpen(false)} />
                    ))}
                    
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        router.push('/api/auth/signout');
                      }}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/30 transition-all duration-200 w-full text-left text-red-600 dark:text-red-400 font-medium mt-4 border border-transparent hover:border-red-200 dark:hover:border-red-900/50"
                    >
                      <LogOut className="h-5 w-5" />
                      <span>Logout</span>
                    </button>
                  </nav>
                </SheetContent>
              </Sheet>

              <Link href="/dashboard" className="text-lg sm:text-xl font-bold text-primary dark:text-white">
                Octrivium
              </Link>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-4">
              <ThemeToggle />
              
              <NotificationBell />
              
              <div className="hidden sm:flex items-center gap-2">
                <div className="text-right">
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{session.user.name}</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400 capitalize">
                    {session.user.role.toLowerCase()}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-semibold shadow-lg">
                  {session.user.name?.charAt(0).toUpperCase()}
                </div>
              </div>
              
              <div className="sm:hidden w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-semibold shadow-lg">
                {session.user.name?.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="w-64 bg-white/80 dark:bg-slate-900/50 backdrop-blur-xl border-r border-slate-200/50 dark:border-slate-700/50 min-h-[calc(100vh-4rem)] hidden md:block">
          <nav className="p-4 space-y-1">
            {navigation.map((item: any) => (
              <NavLink key={item.href} item={item} />
            ))}
            
            <button
              onClick={() => router.push('/api/auth/signout')}
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/30 transition-all duration-200 w-full text-left text-red-600 dark:text-red-400 font-medium mt-4 border border-transparent hover:border-red-200 dark:hover:border-red-900/50"
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
