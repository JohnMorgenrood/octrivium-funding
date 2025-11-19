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
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

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
      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
        isActiveRoute(item.href)
          ? 'bg-primary text-white'
          : 'hover:bg-gray-100 text-gray-700'
      }`}
    >
      <item.icon className="h-5 w-5" />
      <span className="font-medium">{item.name}</span>
    </Link>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <header className="bg-white border-b sticky top-0 z-50 shadow-sm">
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
                <SheetContent side="left" className="w-[280px] sm:w-[320px] p-0">
                  <SheetHeader className="border-b p-6 pb-4">
                    <SheetTitle className="text-left">
                      <Link href="/" className="text-xl font-bold text-primary">
                        Octrivium Funding
                      </Link>
                    </SheetTitle>
                    <div className="flex items-center gap-3 mt-4">
                      <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-semibold text-lg">
                        {session.user.name?.charAt(0).toUpperCase()}
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-semibold">{session.user.name}</p>
                        <p className="text-xs text-muted-foreground capitalize">
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
                      className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-50 transition-colors w-full text-left text-red-600 font-medium mt-4"
                    >
                      <LogOut className="h-5 w-5" />
                      <span>Logout</span>
                    </button>
                  </nav>
                </SheetContent>
              </Sheet>

              <Link href="/dashboard" className="text-lg sm:text-xl font-bold text-primary">
                Octrivium
              </Link>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-4">
              <Link href="/dashboard/notifications">
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </Button>
              </Link>
              
              <div className="hidden sm:flex items-center gap-2">
                <div className="text-right">
                  <p className="text-sm font-medium">{session.user.name}</p>
                  <p className="text-xs text-muted-foreground capitalize">
                    {session.user.role.toLowerCase()}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-semibold">
                  {session.user.name?.charAt(0).toUpperCase()}
                </div>
              </div>
              
              <div className="sm:hidden w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-semibold">
                {session.user.name?.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="w-64 bg-white border-r min-h-[calc(100vh-4rem)] hidden md:block">
          <nav className="p-4 space-y-1">
            {navigation.map((item: any) => (
              <NavLink key={item.href} item={item} />
            ))}
            
            <button
              onClick={() => router.push('/api/auth/signout')}
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-50 transition-colors w-full text-left text-red-600 font-medium mt-4"
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {session.user.kycStatus !== 'VERIFIED' && session.user.role !== 'ADMIN' && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
              <h3 className="font-semibold text-yellow-800 mb-1 text-sm sm:text-base">⚠️ KYC/FICA Verification Required</h3>
              <p className="text-xs sm:text-sm text-yellow-700 mb-3">
                {session.user.role === 'INVESTOR' 
                  ? 'Complete your KYC/FICA verification to start investing in deals. This is required by law to prevent fraud and money laundering.'
                  : 'Complete your KYC/FICA verification and provide your business registration documents to create and manage deals. This ensures compliance with South African financial regulations.'
                }
              </p>
              <Link href="/dashboard/kyc">
                <Button size="sm" className="bg-yellow-600 hover:bg-yellow-700 text-xs sm:text-sm">
                  Complete Verification Now
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
