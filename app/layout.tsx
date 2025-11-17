import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from '@/components/providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Octrivium Funding | Revenue-Based Crowdfunding for South African Businesses',
  description: 'Invest in South African small businesses and earn revenue-based returns. Octrivium connects verified SA businesses with community investors. Start investing from R1,000 or raise capital for your business.',
  keywords: 'South African crowdfunding, invest in SA businesses, revenue-based financing, South Africa small business funding, community investment, equity crowdfunding South Africa, SME funding, startup investment SA, black-owned businesses, Cape Town businesses, Johannesburg investment, business loans alternative',
  openGraph: {
    title: 'Octrivium Funding - Empower South African Small Businesses',
    description: 'Support local SA businesses and earn returns. Transparent revenue-based crowdfunding platform.',
    url: 'https://octrivium.co.za',
    siteName: 'Octrivium Funding',
    locale: 'en_ZA',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Octrivium Funding - Revenue-Based Crowdfunding for SA Businesses',
    description: 'Invest in South African businesses, earn as they grow. Start from R1,000.',
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
