import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'How It Works | Invest in SA Businesses or Raise Capital | Octrivium',
  description: 'Step-by-step guide to revenue-based crowdfunding in South Africa. Learn how to invest from R1,000 or raise capital for your business with Octrivium Funding.',
  keywords: [
    'how to invest in SA businesses',
    'raise capital South Africa',
    'crowdfunding process',
    'revenue-based financing explained',
    'invest R1000',
  ],
  openGraph: {
    title: 'How Octrivium Works - Invest or Raise Capital',
    description: 'Simple, transparent revenue-based crowdfunding for South Africans',
    url: 'https://octrivium.co.za/how-it-works',
    type: 'website',
  },
};

export default function HowItWorksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
