import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from '@/components/providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Octrivium Funding | Revenue-Based Crowdfunding for South African Businesses',
  description: 'Invest in South African small businesses and earn revenue-based returns. Octrivium connects verified SA businesses with community investors. Start investing from R1,000 or raise capital for your business.',
  keywords: 'South African crowdfunding, invest in SA businesses, revenue-based financing, South Africa small business funding, community investment, equity crowdfunding South Africa, SME funding, startup investment SA, black-owned businesses, Cape Town businesses, Johannesburg investment, business loans alternative',
  authors: [{ name: 'Octrivium Funding' }],
  creator: 'Octrivium Funding',
  publisher: 'Octrivium Funding',
  robots: {
    index: true,
    follow: true,
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
        url: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&h=630&fit=crop',
        width: 1200,
        height: 630,
        alt: 'Octrivium Funding - South African Business Investment Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Octrivium Funding - Revenue-Based Crowdfunding for SA Businesses',
    description: 'Invest in South African businesses, earn as they grow. Start from R1,000.',
    images: ['https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&h=630&fit=crop'],
  },
  verification: {
    google: 'your-google-verification-code',
  },
  alternates: {
    canonical: 'https://octrivium.co.za',
  },
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
