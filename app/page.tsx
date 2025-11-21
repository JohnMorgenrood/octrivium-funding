'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
    description: 'Solar panel installation and renewable energy solutions for residential and commercial properties.',
    fundingGoal: 500000,
    funded: 425000,
    investors: 89,
    monthlyRevenue: 180000,
    revenueGrowth: 15.5,
    daysLeft: 12,
    minInvestment: 1000,
    targetReturn: 1.5,
    status: 'active',
    logo: '🔋',
    image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=600&h=400&fit=crop',
  },
  {
    id: 2,
    name: 'Cape Town Coffee Co.',
    industry: 'Food & Beverage',
    description: 'Specialty coffee chain expanding across Western Cape with online delivery service.',
    fundingGoal: 750000,
    funded: 680000,
    investors: 124,
    monthlyRevenue: 320000,
    revenueGrowth: 22.3,
    daysLeft: 8,
    minInvestment: 1000,
    targetReturn: 1.3,
    status: 'active',
    logo: '☕',
    image: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=600&h=400&fit=crop',
  },
  {
    id: 3,
    name: 'Tech Innovators SA',
    industry: 'FinTech',
    description: 'Mobile payment solutions and digital wallet platform serving underbanked communities.',
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
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&h=400&fit=crop',
  },
  {
    id: 4,
    name: 'African Fashion Hub',
    industry: 'E-commerce',
    description: 'Online marketplace connecting African fashion designers with global customers.',
    fundingGoal: 350000,
    funded: 285000,
    investors: 52,
    monthlyRevenue: 125000,
    revenueGrowth: 18.7,
    daysLeft: 15,
    minInvestment: 1000,
    targetReturn: 1.4,
    status: 'active',
    logo: '👗',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=400&fit=crop',
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
      {/* JSON-LD Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FinancialService',
            name: 'Octrivium Funding',
            description: 'Revenue-based crowdfunding platform connecting South African businesses with community investors',
            url: 'https://octrivium.co.za',
            logo: 'https://octrivium.co.za/assets/logo.png',
            image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&h=630&fit=crop',
            address: {
              '@type': 'PostalAddress',
              addressLocality: 'Cape Town',
              addressRegion: 'Western Cape',
              addressCountry: 'ZA',
            },
            geo: {
              '@type': 'GeoCoordinates',
              addressCountry: 'ZA',
            },
            areaServed: {
              '@type': 'Country',
              name: 'South Africa',
            },
            sameAs: [
              'https://www.facebook.com/octriviumfunding',
              'https://twitter.com/octriviumza',
              'https://www.linkedin.com/company/octrivium',
              'https://www.instagram.com/octriviumfunding',
            ],
            contactPoint: {
              '@type': 'ContactPoint',
              email: 'support@octrivium.co.za',
              contactType: 'Customer Service',
              areaServed: 'ZA',
              availableLanguage: ['English', 'Afrikaans'],
            },
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: '4.8',
              ratingCount: '127',
              bestRating: '5',
              worstRating: '1',
            },
            offers: {
              '@type': 'AggregateOffer',
              priceCurrency: 'ZAR',
              lowPrice: '1000',
              highPrice: '1000000',
              offerCount: '50+',
            },
          }),
        }}
      />
      
      {/* Navigation */}
      <nav className="border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-3">
            <div className="relative w-10 h-10 md:w-12 md:h-12">
              <Image
                src="/assets/logo.png"
                alt="Octrivium Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent leading-tight tracking-tight">
                Octrivium
              </span>
              <span className="text-xs md:text-sm font-semibold text-slate-500 dark:text-slate-400 tracking-wider uppercase leading-tight">
                Funding
              </span>
            </div>
          </Link>
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
                  <div className="border-t border-slate-200 dark:border-slate-700 pt-6 mt-6 space-y-3">
                    <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="outline" className="w-full h-12 text-base">Sign In</Button>
                    </Link>
                    <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                      <Button className="w-full h-12 text-base shadow-lg">Get Started</Button>
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      {/* Hero Carousel Section */}
      <section className="relative h-[650px] md:h-[750px] lg:h-[850px] overflow-hidden">
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
                          className="grid grid-cols-3 gap-4 md:gap-6 mt-12 max-w-2xl"
                        >
                          <div className="backdrop-blur-xl bg-white/15 rounded-2xl p-4 md:p-5 border border-white/30 shadow-2xl hover:bg-white/20 transition-all duration-300">
                            <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-1">R50M+</div>
                            <div className="text-xs md:text-sm text-white/90 font-medium">Capital Raised</div>
                          </div>
                          <div className="backdrop-blur-xl bg-white/15 rounded-2xl p-4 md:p-5 border border-white/30 shadow-2xl hover:bg-white/20 transition-all duration-300">
                            <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-1">500+</div>
                            <div className="text-xs md:text-sm text-white/90 font-medium">Businesses</div>
                          </div>
                          <div className="backdrop-blur-xl bg-white/15 rounded-2xl p-4 md:p-5 border border-white/30 shadow-2xl hover:bg-white/20 transition-all duration-300">
                            <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-1">15%</div>
                            <div className="text-xs md:text-sm text-white/90 font-medium">Avg Returns</div>
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

        {/* Navigation Arrows - Hidden */}
        <button
          onClick={scrollPrev}
          className="hidden absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white hover:bg-white/30 transition-all shadow-lg"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          onClick={scrollNext}
          className="hidden absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white hover:bg-white/30 transition-all shadow-lg"
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

      {/* Features - Why Choose Octrivium */}
      <section className="py-20 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-indigo-950 dark:to-purple-950 relative overflow-hidden">
        {/* Floating Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ 
              y: [0, 30, 0],
              rotate: [0, 5, 0]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-20 -left-20 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ 
              y: [0, -30, 0],
              rotate: [0, -5, 0]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-20 -right-20 w-80 h-80 bg-purple-400/20 rounded-full blur-3xl"
          />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, type: "spring" }}
              className="inline-block mb-6"
            >
              {/* Octrivium Logo */}
              <div className="mb-8">
                <Image
                  src="/assets/logo.png"
                  alt="Octrivium Logo"
                  width={180}
                  height={180}
                  className="mx-auto drop-shadow-2xl"
                  priority
                />
              </div>
            </motion.div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Why Choose Octrivium?
            </h2>
            <p className="text-lg md:text-xl text-slate-700 dark:text-slate-300 max-w-3xl mx-auto">
              A transparent, fair, and innovative way to fund growth and invest in your community
            </p>
          </motion.div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto">
            {[
              {
                icon: TrendingUp,
                title: 'Revenue-Based Returns',
                desc: 'Earn returns proportional to business performance. No fixed debt, just fair revenue sharing up to 1.7× your investment.',
                gradient: 'from-blue-500 to-indigo-500',
                delay: 0.1
              },
              {
                icon: Shield,
                title: 'Verified Businesses',
                desc: 'Every business is thoroughly vetted with KYC/AML compliance, document verification, and financial health checks.',
                gradient: 'from-emerald-500 to-green-500',
                delay: 0.2
              },
              {
                icon: Users,
                title: 'Community Impact',
                desc: 'Support local South African businesses while earning returns. Your investment creates jobs and drives economic growth.',
                gradient: 'from-purple-500 to-pink-500',
                delay: 0.3
              },
              {
                icon: BarChart3,
                title: 'Full Transparency',
                desc: 'Track business performance with monthly revenue reports. See exactly how your investment is performing in real-time.',
                gradient: 'from-orange-500 to-red-500',
                delay: 0.4
              },
              {
                icon: Zap,
                title: 'Quick & Easy',
                desc: 'Start investing with as little as R1,000. Simple onboarding, secure payments, and automated monthly payouts.',
                gradient: 'from-cyan-500 to-blue-500',
                delay: 0.5
              },
              {
                icon: Heart,
                title: 'Diversify Portfolio',
                desc: 'Spread investments across multiple businesses and industries to minimize risk and maximize potential returns.',
                gradient: 'from-rose-500 to-pink-500',
                delay: 0.6
              }
            ].map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: feature.delay }}
                  whileHover={{ y: -10, transition: { duration: 0.2 } }}
                  className="group"
                >
                  <div className="relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-slate-200/50 dark:border-slate-700/50 hover:border-blue-300 dark:hover:border-blue-600 h-full overflow-hidden">
                    {/* Hover gradient effect */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                    
                    <motion.div
                      whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                      transition={{ duration: 0.5 }}
                      className="relative"
                    >
                      <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:shadow-2xl transition-all`}>
                        <Icon className="h-8 w-8 text-white" />
                      </div>
                    </motion.div>
                    
                    <h3 className="text-xl md:text-2xl font-bold mb-4 text-slate-900 dark:text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-indigo-600 group-hover:bg-clip-text transition-all">
                      {feature.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                      {feature.desc}
                    </p>

                    {/* Animated corner accent */}
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: feature.delay + 0.3 }}
                      className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${feature.gradient} opacity-10 rounded-bl-full`}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Bottom Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto"
          >
            {[
              { number: '500+', label: 'Active Investors' },
              { number: 'R50M+', label: 'Capital Raised' },
              { number: '150+', label: 'Businesses Funded' },
              { number: '1.5x', label: 'Avg. Return' }
            ].map((stat, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className="text-center p-6 bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl border-2 border-slate-200/50 dark:border-slate-700/50 shadow-lg"
              >
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works - Interactive Timeline */}
      <section className="py-20 bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 dark:from-slate-900 dark:via-indigo-950 dark:to-slate-950 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-20 dark:opacity-20">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-slate-900 dark:text-white">
              How It Works
            </h2>
            <p className="text-xl md:text-2xl text-slate-700 dark:text-blue-200">Simple, transparent, and effective</p>
          </motion.div>

          <div className="max-w-7xl mx-auto">
            {/* Split View - Investors & Businesses */}
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
              
              {/* For Investors Side */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
              >
                <div className="text-center mb-10">
                  <motion.div
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="inline-block mb-4"
                  >
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-2xl">
                      <TrendingUp className="w-8 h-8 text-white" />
                    </div>
                  </motion.div>
                  <h3 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">For Investors</h3>
                  <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 mx-auto rounded-full"></div>
                </div>

                <div className="space-y-8">
                  {[
                    { 
                      num: '01', 
                      title: 'Sign Up', 
                      desc: 'Create your investor account in minutes with simple KYC verification',
                      icon: '👤',
                      delay: 0.1
                    },
                    { 
                      num: '02', 
                      title: 'Browse Deals', 
                      desc: 'Explore verified businesses with detailed financials and growth plans',
                      icon: '🔍',
                      delay: 0.2
                    },
                    { 
                      num: '03', 
                      title: 'Invest Smart', 
                      desc: 'Choose your amount starting from R1,000 and confirm with secure payment',
                      icon: '💰',
                      delay: 0.3
                    },
                    { 
                      num: '04', 
                      title: 'Earn Returns', 
                      desc: 'Receive automated monthly revenue share payments up to 1.7× your investment',
                      icon: '📈',
                      delay: 0.4
                    },
                  ].map((step, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: step.delay }}
                      whileHover={{ x: 10, transition: { duration: 0.2 } }}
                      className="relative"
                    >
                      <div className="flex items-start gap-4 bg-white/80 dark:bg-white/5 backdrop-blur-sm border border-blue-500/30 dark:border-blue-500/30 rounded-2xl p-6 hover:bg-white/90 dark:hover:bg-white/10 hover:border-blue-500/50 dark:hover:border-blue-400/50 transition-all duration-300 group">
                        <div className="flex-shrink-0">
                          <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-110 transition-transform">
                            {step.num}
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-2xl">{step.icon}</span>
                            <h4 className="text-xl font-bold text-slate-900 dark:text-white">{step.title}</h4>
                          </div>
                          <p className="text-slate-700 dark:text-blue-100 leading-relaxed">{step.desc}</p>
                        </div>
                        <motion.div
                          animate={{ x: [0, 5, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                          className="flex-shrink-0"
                        >
                          <ArrowRight className="w-5 h-5 text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </motion.div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="mt-8 text-center"
                >
                  <Link href="/register">
                    <Button size="lg" className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-8 py-6 text-lg shadow-2xl hover:shadow-blue-500/50 transition-all">
                      Start Investing Today
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </Link>
                </motion.div>
              </motion.div>

              {/* Vertical Divider */}
              <div className="hidden lg:block absolute left-1/2 top-32 bottom-32 w-px bg-gradient-to-b from-transparent via-slate-300/50 dark:via-white/30 to-transparent"></div>

              {/* For Businesses Side */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
              >
                <div className="text-center mb-10">
                  <motion.div
                    animate={{ rotate: [0, -5, 5, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="inline-block mb-4"
                  >
                    <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-2xl">
                      <Users className="w-8 h-8 text-white" />
                    </div>
                  </motion.div>
                  <h3 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">For Businesses</h3>
                  <div className="w-24 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto rounded-full"></div>
                </div>

                <div className="space-y-8">
                  {[
                    { 
                      num: '01', 
                      title: 'Apply Fast', 
                      desc: 'Submit your business details, financials, and growth plans online',
                      icon: '📝',
                      delay: 0.1
                    },
                    { 
                      num: '02', 
                      title: 'Get Verified', 
                      desc: 'Complete KYC, FICA compliance and business verification checks',
                      icon: '✅',
                      delay: 0.2
                    },
                    { 
                      num: '03', 
                      title: 'Get Funded', 
                      desc: 'Launch your deal and receive investments from verified investors',
                      icon: '🚀',
                      delay: 0.3
                    },
                    { 
                      num: '04', 
                      title: 'Share Revenue', 
                      desc: 'Report monthly revenue transparently and share profits with investors',
                      icon: '💼',
                      delay: 0.4
                    },
                  ].map((step, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: step.delay }}
                      whileHover={{ x: -10, transition: { duration: 0.2 } }}
                      className="relative"
                    >
                      <div className="flex items-start gap-4 bg-white/80 dark:bg-white/5 backdrop-blur-sm border border-indigo-500/30 dark:border-indigo-500/30 rounded-2xl p-6 hover:bg-white/90 dark:hover:bg-white/10 hover:border-indigo-400/50 transition-all duration-300 group">
                        <motion.div
                          animate={{ x: [0, -5, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                          className="flex-shrink-0"
                        >
                          <ArrowRight className="w-5 h-5 text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity rotate-180" />
                        </motion.div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-2xl">{step.icon}</span>
                            <h4 className="text-xl font-bold text-slate-900 dark:text-white">{step.title}</h4>
                          </div>
                          <p className="text-slate-700 dark:text-indigo-100 leading-relaxed">{step.desc}</p>
                        </div>
                        <div className="flex-shrink-0">
                          <div className="w-14 h-14 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-110 transition-transform">
                            {step.num}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="mt-8 text-center"
                >
                  <Link href="/register">
                    <Button size="lg" className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-6 text-lg shadow-2xl hover:shadow-purple-500/50 transition-all">
                      Apply for Funding
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </Link>
                </motion.div>
              </motion.div>

            </div>

            {/* Bottom CTA - Premium Redesign */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-24"
            >
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700 dark:from-indigo-700 dark:via-purple-700 dark:to-blue-800 p-[2px] shadow-2xl">
                <div className="relative bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-3xl p-8 md:p-16">
                  {/* Decorative Background Elements */}
                  <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full blur-3xl"></div>
                  <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-blue-500/10 to-indigo-500/10 rounded-full blur-3xl"></div>
                  
                  <div className="relative z-10 max-w-4xl mx-auto text-center">
                    {/* Badge */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className="inline-block mb-6"
                    >
                      <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 dark:border-indigo-400/30">
                        <Zap className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                        <span className="text-sm font-semibold text-indigo-900 dark:text-indigo-300">Start Building Wealth Today</span>
                      </div>
                    </motion.div>
                    
                    {/* Heading */}
                    <motion.h3
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                      className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-900 dark:from-white dark:via-indigo-200 dark:to-white bg-clip-text text-transparent leading-tight"
                    >
                      Ready to get started?
                    </motion.h3>
                    
                    {/* Description */}
                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                      className="text-lg md:text-xl text-slate-600 dark:text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed"
                    >
                      Join thousands of South Africans building wealth together through community investing
                    </motion.p>
                    
                    {/* CTA Buttons */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.5 }}
                      className="flex flex-col sm:flex-row items-center justify-center gap-4"
                    >
                      <Link href="/register">
                        <Button 
                          size="lg"
                          className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-6 text-base md:text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl group"
                        >
                          Get Started Now
                          <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
                      
                      <Link href="/how-it-works">
                        <Button 
                          size="lg"
                          variant="outline"
                          className="w-full sm:w-auto border-2 border-slate-300 dark:border-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 bg-white/50 dark:bg-slate-800/80 text-slate-900 dark:text-white px-8 py-6 text-base md:text-lg font-semibold rounded-xl transition-all duration-300 shadow-md dark:shadow-slate-900"
                        >
                          Learn How It Works
                        </Button>
                      </Link>
                    </motion.div>
                    
                    {/* Trust Indicators */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.6 }}
                      className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-700"
                    >
                      <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-slate-500 dark:text-slate-400">
                        <div className="flex items-center gap-2">
                          <Shield className="w-5 h-5 text-green-600 dark:text-green-400" />
                          <span className="font-medium">Bank-Level Security</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                          <span className="font-medium">5,000+ Active Investors</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                          <span className="font-medium">R50M+ Funded</span>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Live Deals - Image Card Style */}
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
              <Button variant="outline" className="hidden md:flex group">
                View All Deals
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {fakeDealss.map((deal, index) => {
              const percentFunded = (deal.funded / deal.fundingGoal) * 100;
              
              return (
                <div
                  key={deal.id}
                  className="group bg-white dark:bg-slate-800 rounded-2xl shadow-lg hover:shadow-2xl border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 hover:-translate-y-2 transition-all duration-300 overflow-hidden"
                >
                  {/* Business Image Header */}
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={deal.image}
                      alt={deal.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                    
                    {/* Logo and Name Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-white dark:bg-slate-900 rounded-full flex items-center justify-center text-xl shadow-xl ring-2 ring-white/50">
                          {deal.logo}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-base text-white leading-tight line-clamp-1">
                            {deal.name}
                          </h3>
                          <p className="text-xs text-white/90">{deal.industry}</p>
                        </div>
                      </div>
                    </div>

                    {/* Return Badge */}
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-emerald-500 text-white font-bold text-sm px-2.5 py-1 shadow-lg">
                        {deal.targetReturn}x
                      </Badge>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-4 space-y-3">
                    {/* Description */}
                    <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                      {deal.description}
                    </p>

                    {/* Progress Bar */}
                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                          Progress
                        </span>
                        <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                          {percentFunded.toFixed(0)}%
                        </span>
                      </div>
                      <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full transition-all duration-500"
                          style={{ width: `${Math.min(percentFunded, 100)}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          R{(deal.funded / 1000).toFixed(0)}k / R{(deal.fundingGoal / 1000).toFixed(0)}k
                        </span>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex justify-between items-center pt-2 text-xs text-slate-500 dark:text-slate-400">
                      <div className="flex items-center">
                        <Users className="h-3 w-3 mr-1" />
                        {deal.investors}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {deal.daysLeft}d left
                      </div>
                      <div className="flex items-center text-emerald-600 dark:text-emerald-400">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        {deal.revenueGrowth}%
                      </div>
                    </div>

                    {/* CTA Button */}
                    <Link href={`/deals/${deal.id}`} className="block">
                      <Button 
                        size="sm" 
                        className="w-full shadow-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 group-hover:shadow-xl transition-all font-semibold"
                      >
                        View Details
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
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
              <div className="flex items-center space-x-3 mb-4">
                <div className="relative w-10 h-10">
                  <Image
                    src="/assets/logo.png"
                    alt="Octrivium Logo"
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-bold bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent leading-tight tracking-tight">
                    Octrivium
                  </span>
                  <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase leading-tight">
                    Funding
                  </span>
                </div>
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
