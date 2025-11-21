import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Investment Opportunities | Browse SA Business Deals | Octrivium',
  description: 'Invest in verified South African businesses from R1,000. Browse active funding deals, view revenue data, and earn returns through revenue-sharing. FICA compliant platform.',
  keywords: [
    'invest in SA businesses',
    'South African investment opportunities',
    'crowdfunding deals',
    'business investment R1000',
    'revenue-based investment',
    'small business funding SA',
  ],
  openGraph: {
    title: 'Investment Opportunities - Octrivium',
    description: 'Browse and invest in South African businesses from R1,000',
    url: 'https://octrivium.co.za/deals',
    type: 'website',
  },
};

export default function DealsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
