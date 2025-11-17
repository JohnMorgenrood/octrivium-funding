'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { ArrowRight, TrendingUp, Shield, Users, BarChart3, Zap, Heart, ArrowUpRight, ArrowDownRight, Clock, DollarSign, Target, Menu, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { motion, AnimatePresence } from 'framer-motion';

// Hero Carousel Slides
const heroSlides = [
  {
    id: 1,
    title: 'Invest in South African Excellence',
    subtitle: 'Fund tomorrow\'s success stories today',
    description: 'Connect with high-growth businesses and earn revenue-based returns',
    image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&h=800&fit=crop',
    cta: 'Start Investing',
    ctaLink: '/register?role=investor',
    gradient: 'from-black/80 via-slate-900/75 to-black/80',
  },
  {
    id: 2,
    title: 'Empower Local Entrepreneurs',
    subtitle: 'Be part of their growth journey',
    description: 'Support verified businesses and share in their revenue growth',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&h=800&fit=crop',
    cta: 'Explore Deals',
    ctaLink: '/deals',
    gradient: 'from-black/85 via-slate-900/80 to-slate-800/85',
  },
  {
    id: 3,
    title: 'Grow Your Business with Community',
    subtitle: 'Raise capital without giving up equity',
    description: 'Access funding from investors who believe in your vision',
    image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1200&h=800&fit=crop',
    cta: 'Raise Capital',
    ctaLink: '/register?role=business',
    gradient: 'from-black/80 via-slate-800/75 to-black/80',
  },
];

// Fake deals data
const fakeDealss = [
  {
    id: 1,
    name: 'Green Energy Solutions',
    industry: 'Renewable Energy',
    fundingGoal: 500000,
    funded: 425000,
    investors: 89,
    monthlyRevenue: 180000,
    revenueGrowth: 15.5,
    daysLeft: 12,
    minInvestment: 1000,
    targetReturn: 1.7,
    status: 'active',
    logo: '🔋',
  },
  {
    id: 2,
    name: 'Cape Town Coffee Co.',
    industry: 'Food & Beverage',
    fundingGoal: 750000,
    funded: 680000,
    investors: 124,
    monthlyRevenue: 320000,
    revenueGrowth: 22.3,
    daysLeft: 8,
    minInvestment: 1000,
    targetReturn: 1.7,
    status: 'active',
    logo: '☕',
  },
  {
    id: 3,
    name: 'Tech Innovators SA',
    industry: 'FinTech',
    fundingGoal: 1000000,
    funded: 340000,
    investors: 67,
    monthlyRevenue: 95000,
    revenueGrowth: 45.2,
    daysLeft: 25,
    minInvestment: 5000,
    targetReturn: 1.7,
    status: 'active',
    logo: '💳',
  },
  {
    id: 4,
    name: 'African Fashion Hub',
    industry: 'E-commerce',
    fundingGoal: 350000,
    funded: 285000,
    investors: 52,
    monthlyRevenue: 125000,
    revenueGrowth: 18.7,
    daysLeft: 15,
    minInvestment: 1000,
    targetReturn: 1.7,
    status: 'active',
    logo: '👗',
  },
];

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 5000 })]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    
    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };
    
    emblaApi.on('select', onSelect);
    onSelect();
    
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi]);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950">
      {/* Navigation */}
      <nav className="border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">O</span>
            </div>
            <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Octrivium Funding
            </span>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/deals" className="text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">
              Browse Deals
            </Link>
            <Link href="/how-it-works" className="text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">
              How It Works
            </Link>
            <Link href="/about" className="text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">
              About
            </Link>
          </div>
          <div className="flex items-center space-x-2 md:space-x-4">
            <ThemeToggle />
            <Link href="/login" className="hidden sm:block">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/register" className="hidden sm:block">
              <Button className="shadow-lg">Get Started</Button>
            </Link>
            
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
                    href="/deals" 
                    className="text-lg font-medium text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Browse Deals
                  </Link>
                  <Link 
                    href="/how-it-works" 
                    className="text-lg font-medium text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    How It Works
                  </Link>
                  <Link 
                    href="/about" 
                    className="text-lg font-medium text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    About
                  </Link>
                  <div className="border-t border-slate-200 dark:border-slate-700 pt-6 space-y-4">
                    <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="outline" className="w-full">Sign In</Button>
                    </Link>
                    <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                      <Button className="w-full shadow-lg">Get Started</Button>
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      {/* Hero Carousel Section */}
      <section className="relative h-[600px] md:h-[700px] lg:h-[800px] overflow-hidden">
        <div className="embla h-full" ref={emblaRef}>
          <div className="embla__container h-full flex">
            {heroSlides.map((slide, index) => (
              <div key={slide.id} className="embla__slide flex-[0_0_100%] min-w-0 relative h-full">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0">
                  <Image
                    src={slide.image}
                    alt={slide.title}
                    fill
                    className="object-cover"
                    priority={index === 0}
                    quality={90}
                  />
                  <div className={`absolute inset-0 bg-gradient-to-r ${slide.gradient}`} />
                  <div className="absolute inset-0 bg-black/20" />
                </div>

                {/* Content */}
                <div className="relative h-full container mx-auto px-4 flex items-center">
                  <AnimatePresence mode="wait">
                    {selectedIndex === index && (
                      <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -30 }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                        className="max-w-3xl"
                      >
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.2, duration: 0.5 }}
                          className="inline-block px-4 py-2 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-sm font-semibold mb-6"
                        >
                          {slide.subtitle}
                        </motion.div>
                        
                        <motion.h1
                          initial={{ opacity: 0, x: -30 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3, duration: 0.6 }}
                          className="text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight drop-shadow-2xl"
                        >
                          {slide.title}
                        </motion.h1>
                        
                        <motion.p
                          initial={{ opacity: 0, x: -30 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.4, duration: 0.6 }}
                          className="text-lg md:text-xl lg:text-2xl text-white/95 mb-8 max-w-2xl leading-relaxed drop-shadow-lg"
                        >
                          {slide.description}
                        </motion.p>
                        
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5, duration: 0.6 }}
                          className="flex flex-col sm:flex-row gap-4"
                        >
                          <Link href={slide.ctaLink}>
                            <Button 
                              size="lg" 
                              className="text-lg px-8 py-6 bg-white text-slate-900 hover:bg-slate-100 shadow-2xl w-full sm:w-auto group"
                            >
                              {slide.cta}
                              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                            </Button>
                          </Link>
                          <Link href="/how-it-works">
                            <Button 
                              size="lg" 
                              variant="outline" 
                              className="text-lg px-8 py-6 bg-transparent text-white border-white/50 hover:bg-white/10 backdrop-blur-sm w-full sm:w-auto"
                            >
                              Learn More
                            </Button>
                          </Link>
                        </motion.div>

                        {/* Stats on Carousel */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.6, duration: 0.6 }}
                          className="grid grid-cols-3 gap-3 md:gap-6 mt-12 max-w-2xl"
                        >
                          <div className="backdrop-blur-md bg-white/10 rounded-xl p-3 md:p-4 border border-white/20">
                            <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-1">R50M+</div>
                            <div className="text-xs md:text-sm text-white/80">Capital Raised</div>
                          </div>
                          <div className="backdrop-blur-md bg-white/10 rounded-xl p-3 md:p-4 border border-white/20">
                            <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-1">500+</div>
                            <div className="text-xs md:text-sm text-white/80">Businesses</div>
                          </div>
                          <div className="backdrop-blur-md bg-white/10 rounded-xl p-3 md:p-4 border border-white/20">
                            <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-1">15%</div>
                            <div className="text-xs md:text-sm text-white/80">Avg Returns</div>
                          </div>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={scrollPrev}
          className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white hover:bg-white/30 transition-all shadow-lg"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          onClick={scrollNext}
          className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white hover:bg-white/30 transition-all shadow-lg"
          aria-label="Next slide"
        >
          <ChevronRight className="h-6 w-6" />
        </button>

        {/* Dots Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex gap-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => emblaApi?.scrollTo(index)}
              className={`h-2 rounded-full transition-all ${
                selectedIndex === index ? 'w-8 bg-white' : 'w-2 bg-white/50'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Scroll Down Indicator */}
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 hidden lg:block">
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="text-white/70 text-sm font-medium"
          >
            <div className="flex flex-col items-center">
              <span className="mb-2">Scroll to explore</span>
              <div className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-2">
                <motion.div
                  animate={{ y: [0, 12, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="w-1.5 h-1.5 bg-white rounded-full"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 md:py-20 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-slate-900 dark:text-white">
              Why Choose Octrivium?
            </h2>
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto px-4">
              A transparent, fair, and innovative way to fund growth and invest in your community
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
            <div className="group">
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-200 dark:border-slate-700 h-full">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                  <TrendingUp className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold mb-3 text-slate-900 dark:text-white">Revenue-Based Returns</h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  Earn returns proportional to business performance. No fixed debt, just fair revenue sharing up to 1.7× your investment.
                </p>
              </div>
            </div>

            <div className="group">
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-200 dark:border-slate-700 h-full">
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-green-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                  <Shield className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold mb-3 text-slate-900 dark:text-white">Verified Businesses</h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  Every business is thoroughly vetted with KYC/AML compliance, document verification, and financial health checks.
                </p>
              </div>
            </div>

            <div className="group">
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-200 dark:border-slate-700 h-full">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                  <Users className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold mb-3 text-slate-900 dark:text-white">Community Impact</h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  Support local South African businesses while earning returns. Your investment creates jobs and drives economic growth.
                </p>
              </div>
            </div>

            <div className="group">
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-200 dark:border-slate-700 h-full">
                <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                  <BarChart3 className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold mb-3 text-slate-900 dark:text-white">Full Transparency</h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  Track business performance with monthly revenue reports. See exactly how your investment is performing in real-time.
                </p>
              </div>
            </div>

            <div className="group">
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-200 dark:border-slate-700 h-full">
                <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                  <Zap className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold mb-3 text-slate-900 dark:text-white">Quick & Easy</h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  Start investing with as little as R1,000. Simple onboarding, secure payments, and automated monthly payouts.
                </p>
              </div>
            </div>

            <div className="group">
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-200 dark:border-slate-700 h-full">
                <div className="w-14 h-14 bg-gradient-to-br from-rose-500 to-pink-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                  <Heart className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold mb-3 text-slate-900 dark:text-white">Diversify Portfolio</h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  Spread investments across multiple businesses and industries to minimize risk and maximize potential returns.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900 dark:text-white">
              How It Works
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300">Simple, transparent, and effective</p>
          </div>

          <div className="max-w-5xl mx-auto">
            {/* For Investors */}
            <div className="mb-16">
              <h3 className="text-3xl font-bold mb-8 text-center text-blue-600 dark:text-blue-400">For Investors</h3>
              <div className="grid md:grid-cols-4 gap-6">
                <div className="relative">
                  <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border-2 border-blue-200 dark:border-blue-500/50 hover:shadow-xl transition-shadow">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl mb-4 shadow-lg">
                      1
                    </div>
                    <h4 className="font-bold text-lg mb-2 text-slate-900 dark:text-white">Sign Up</h4>
                    <p className="text-slate-600 dark:text-slate-300 text-sm">Create your investor account in minutes</p>
                  </div>
                </div>
                <div className="relative">
                  <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border-2 border-blue-200 dark:border-blue-500/50 hover:shadow-xl transition-shadow">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl mb-4 shadow-lg">
                      2
                    </div>
                    <h4 className="font-bold text-lg mb-2 text-slate-900 dark:text-white">Browse Deals</h4>
                    <p className="text-slate-600 dark:text-slate-300 text-sm">Explore verified businesses seeking funding</p>
                  </div>
                </div>
                <div className="relative">
                  <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border-2 border-blue-200 dark:border-blue-500/50 hover:shadow-xl transition-shadow">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl mb-4 shadow-lg">
                      3
                    </div>
                    <h4 className="font-bold text-lg mb-2 text-slate-900 dark:text-white">Invest</h4>
                    <p className="text-slate-600 dark:text-slate-300 text-sm">Choose your amount and confirm investment</p>
                  </div>
                </div>
                <div className="relative">
                  <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border-2 border-blue-200 dark:border-blue-500/50 hover:shadow-xl transition-shadow">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl mb-4 shadow-lg">
                      4
                    </div>
                    <h4 className="font-bold text-lg mb-2 text-slate-900 dark:text-white">Earn Returns</h4>
                    <p className="text-slate-600 dark:text-slate-300 text-sm">Receive monthly revenue share payments</p>
                  </div>
                </div>
              </div>
            </div>

            {/* For Businesses */}
            <div>
              <h3 className="text-3xl font-bold mb-8 text-center text-indigo-600 dark:text-indigo-400">For Businesses</h3>
              <div className="grid md:grid-cols-4 gap-6">
                <div className="relative">
                  <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border-2 border-indigo-200 dark:border-indigo-500/50 hover:shadow-xl transition-shadow">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-xl mb-4 shadow-lg">
                      1
                    </div>
                    <h4 className="font-bold text-lg mb-2 text-slate-900 dark:text-white">Apply</h4>
                    <p className="text-slate-600 dark:text-slate-300 text-sm">Submit your business details and documents</p>
                  </div>
                </div>
                <div className="relative">
                  <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border-2 border-indigo-200 dark:border-indigo-500/50 hover:shadow-xl transition-shadow">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-xl mb-4 shadow-lg">
                      2
                    </div>
                    <h4 className="font-bold text-lg mb-2 text-slate-900 dark:text-white">Get Verified</h4>
                    <p className="text-slate-600 dark:text-slate-300 text-sm">Complete KYC and business verification</p>
                  </div>
                </div>
                <div className="relative">
                  <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border-2 border-indigo-200 dark:border-indigo-500/50 hover:shadow-xl transition-shadow">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-xl mb-4 shadow-lg">
                      3
                    </div>
                    <h4 className="font-bold text-lg mb-2 text-slate-900 dark:text-white">Get Funded</h4>
                    <p className="text-slate-600 dark:text-slate-300 text-sm">Launch your deal and receive investments</p>
                  </div>
                </div>
                <div className="relative">
                  <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border-2 border-indigo-200 dark:border-indigo-500/50 hover:shadow-xl transition-shadow">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-xl mb-4 shadow-lg">
                      4
                    </div>
                    <h4 className="font-bold text-lg mb-2 text-slate-900 dark:text-white">Share Revenue</h4>
                    <p className="text-slate-600 dark:text-slate-300 text-sm">Report monthly revenue and share profits</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Deals - Trading Platform Style */}
      <section className="py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-2">
                Live Investment Opportunities
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-300">
                Trending deals from verified South African businesses
              </p>
            </div>
            <Link href="/deals">
              <Button variant="outline" className="hidden md:flex">
                View All Deals
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {fakeDealss.map((deal, index) => {
              const percentFunded = (deal.funded / deal.fundingGoal) * 100;
              const isGrowing = deal.revenueGrowth > 0;
              
              // Assign colors based on index
              const borderColors = [
                'border-l-4 border-emerald-500 dark:border-emerald-400',
                'border-l-4 border-yellow-500 dark:border-yellow-400',
                'border-l-4 border-blue-500 dark:border-blue-400',
                'border-l-4 border-purple-500 dark:border-purple-400',
              ];
              const borderColor = borderColors[index % borderColors.length];
              
              return (
                <div
                  key={deal.id}
                  className={`group bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl border-2 border-slate-100 dark:border-slate-700 hover:border-slate-200 dark:hover:border-slate-600 hover:-translate-y-1 transition-all duration-300 ${borderColor} backdrop-blur-sm`}
                >
                  {/* Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-2xl shadow-lg ring-4 ring-white dark:ring-slate-800">
                        {deal.logo}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                          {deal.name}
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{deal.industry}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-sm font-semibold">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                      <span>ACTIVE</span>
                    </div>
                  </div>

                  {/* Key Metrics */}
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900/50 dark:to-slate-900/30 rounded-xl p-3 border border-slate-200 dark:border-slate-700">
                      <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Monthly Revenue</div>
                      <div className="font-bold text-slate-900 dark:text-white">
                        R{(deal.monthlyRevenue / 1000).toFixed(0)}k
                      </div>
                      <div className={`flex items-center text-xs mt-1 ${isGrowing ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                        {isGrowing ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                        {deal.revenueGrowth}%
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900/50 dark:to-slate-900/30 rounded-xl p-3 border border-slate-200 dark:border-slate-700">
                      <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Target Return</div>
                      <div className="font-bold text-slate-900 dark:text-white">
                        {deal.targetReturn}x
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Capped</div>
                    </div>
                    <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900/50 dark:to-slate-900/30 rounded-xl p-3 border border-slate-200 dark:border-slate-700">
                      <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Min Investment</div>
                      <div className="font-bold text-slate-900 dark:text-white">
                        R{(deal.minInvestment / 1000).toFixed(0)}k
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Entry</div>
                    </div>
                  </div>

                  {/* Funding Progress */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                        Funding Progress
                      </span>
                      <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                        {percentFunded.toFixed(0)}%
                      </span>
                    </div>
                    <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full transition-all duration-500"
                        style={{ width: `${percentFunded}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        R{(deal.funded / 1000).toFixed(0)}k raised
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        R{(deal.fundingGoal / 1000).toFixed(0)}k goal
                      </span>
                    </div>
                  </div>

                  {/* Bottom Stats */}
                  <div className="flex justify-between items-center pt-4 border-t border-slate-200 dark:border-slate-700">
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center text-slate-600 dark:text-slate-300">
                        <Users className="h-4 w-4 mr-1" />
                        {deal.investors} investors
                      </div>
                      <div className="flex items-center text-slate-600 dark:text-slate-300">
                        <Clock className="h-4 w-4 mr-1" />
                        {deal.daysLeft} days left
                      </div>
                    </div>
                    <Link href={`/deals/${deal.id}`}>
                      <Button size="sm" className="shadow-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 group-hover:scale-105 transition-transform">
                        View Deal
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-8 md:hidden">
            <Link href="/deals">
              <Button variant="outline" className="w-full">
                View All Deals
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl mb-10 text-blue-100">
              Join thousands of South Africans building a stronger economy together
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register?role=investor">
                <Button size="lg" variant="secondary" className="text-lg px-8 py-6 w-full sm:w-auto">
                  Start Investing Today
                </Button>
              </Link>
              <Link href="/register?role=business">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6 w-full sm:w-auto bg-transparent text-white border-white hover:bg-white hover:text-blue-600">
                  Apply for Funding
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 dark:bg-slate-950 text-slate-300 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">O</span>
                </div>
                <span className="text-white font-bold text-xl">Octrivium</span>
              </div>
              <p className="text-sm text-slate-400">
                Empowering South African businesses through community investment.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Platform</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/deals" className="hover:text-white transition-colors">Browse Deals</Link></li>
                <li><Link href="/how-it-works" className="hover:text-white transition-colors">How It Works</Link></li>
                <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/risk" className="hover:text-white transition-colors">Risk Disclosure</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Contact</h4>
              <ul className="space-y-2 text-sm">
                <li>support@octrivium.co.za</li>
                <li>+27 (0) 21 123 4567</li>
                <li>Cape Town, South Africa</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-sm text-center text-slate-400">
            <p>&copy; 2025 Octrivium Funding. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FinancialService',
            name: 'Octrivium Funding',
            description: 'Revenue-based crowdfunding platform for South African businesses',
            url: 'https://octrivium.co.za',
            logo: 'https://octrivium.co.za/logo.png',
            address: {
              '@type': 'PostalAddress',
              addressLocality: 'Cape Town',
              addressCountry: 'ZA',
            },
            contactPoint: {
              '@type': 'ContactPoint',
              telephone: '+27-21-123-4567',
              contactType: 'Customer Service',
              areaServed: 'ZA',
              availableLanguage: ['English', 'Afrikaans'],
            },
            sameAs: [
              'https://twitter.com/octrivium',
              'https://linkedin.com/company/octrivium',
              'https://facebook.com/octrivium',
            ],
          }),
        }}
      />
    </div>
  );
}
