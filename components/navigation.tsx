'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Home, TrendingUp, Info, HelpCircle, LayoutDashboard, LogOut } from 'lucide-react';
import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { motion } from 'framer-motion';

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: session, status } = useSession();

  const navItems = [
    { href: '/deals', label: 'Browse Deals', icon: TrendingUp },
    { href: '/how-it-works', label: 'How It Works', icon: HelpCircle },
    { href: '/about', label: 'About', icon: Info },
  ];

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              className="relative w-10 h-10 md:w-12 md:h-12"
            >
              <Image
                src="/assets/logo.png"
                alt="Octrivium Logo"
                fill
                className="object-contain"
                priority
              />
            </motion.div>
            <div className="flex flex-col">
              <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent leading-tight tracking-tight">
                Octrivium
              </span>
              <span className="text-xs md:text-sm font-semibold text-slate-500 dark:text-slate-400 tracking-wider uppercase leading-tight">
                Funding
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <motion.div
                key={item.href}
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2 }}
              >
                <Link 
                  href={item.href}
                  className="flex items-center space-x-2 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2 md:space-x-4">
            <ThemeToggle />
            
            {status === 'loading' ? (
              <div className="w-20 h-9 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
            ) : session ? (
              <>
                <Link href="/dashboard" className="hidden md:block">
                  <Button variant="ghost" className="flex items-center space-x-2">
                    <LayoutDashboard className="h-4 w-4" />
                    <span>Dashboard</span>
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="hidden md:flex items-center space-x-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </Button>
              </>
            ) : (
              <>
                <Link href="/login" className="hidden sm:block">
                  <Button variant="ghost">Sign In</Button>
                </Link>
                <Link href="/register" className="hidden sm:block">
                  <Button className="shadow-lg">Get Started</Button>
                </Link>
              </>
            )}

            {/* Mobile Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] bg-white dark:bg-slate-900">
                <div className="flex flex-col space-y-6 mt-8">
                  <Link 
                    href="/" 
                    className="flex items-center space-x-3 text-lg font-medium text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Home className="h-5 w-5" />
                    <span>Home</span>
                  </Link>
                  
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center space-x-3 text-lg font-medium text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </Link>
                  ))}

                  {session && (
                    <Link 
                      href="/dashboard" 
                      className="flex items-center space-x-3 text-lg font-medium text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <LayoutDashboard className="h-5 w-5" />
                      <span>Dashboard</span>
                    </Link>
                  )}

                  <div className="border-t border-slate-200 dark:border-slate-700 pt-6 space-y-4">
                    {session ? (
                      <Button 
                        variant="outline" 
                        className="w-full flex items-center space-x-2"
                        onClick={() => {
                          setMobileMenuOpen(false);
                          signOut({ callbackUrl: '/' });
                        }}
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Sign Out</span>
                      </Button>
                    ) : (
                      <>
                        <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                          <Button variant="outline" className="w-full">Sign In</Button>
                        </Link>
                        <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                          <Button className="w-full shadow-lg">Get Started</Button>
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
