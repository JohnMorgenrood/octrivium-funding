import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from '@/components/providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://octrivium.co.za'),
  title: {
    default: 'Octrivium Funding | Revenue-Based Crowdfunding for South African Businesses',
    template: '%s | Octrivium Funding',
  },
  description: 'Invest in South African small businesses and earn revenue-based returns. Octrivium connects verified SA businesses with community investors. Start investing from R1,000 or raise capital for your business.',
  keywords: [
    'South African crowdfunding',
    'invest in SA businesses',
    'revenue-based financing',
    'South Africa small business funding',
    'community investment',
    'SME funding',
    'startup investment SA',
    'Cape Town businesses',
    'Johannesburg investment',
    'business loans alternative',
    'accounting software South Africa',
    'FICA compliant platform',
    'Yoco payments',
  ],
  authors: [{ name: 'Octrivium Funding', url: 'https://octrivium.co.za' }],
  creator: 'Octrivium Funding',
  publisher: 'Octrivium Funding',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'Octrivium Funding - Empower South African Small Businesses',
    description: 'Support local SA businesses and earn returns. Transparent revenue-based crowdfunding platform.',
    url: 'https://octrivium.co.za',
    siteName: 'Octrivium Funding',
    locale: 'en_ZA',
    type: 'website',
    images: [
      {
        url: '/assets/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Octrivium Funding - South African Business Investment Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@octriviumza',
    creator: '@octriviumza',
    title: 'Octrivium Funding - Revenue-Based Crowdfunding for SA Businesses',
    description: 'Invest in South African businesses, earn as they grow. Start from R1,000.',
    images: ['/assets/og-image.png'],
  },
  verification: {
    google: 'ADD_YOUR_GOOGLE_SEARCH_CONSOLE_CODE_HERE',
    // yandex: 'your-yandex-verification-code',
    // bing: 'your-bing-verification-code',
  },
  alternates: {
    canonical: 'https://octrivium.co.za',
  },
  category: 'Financial Services',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
