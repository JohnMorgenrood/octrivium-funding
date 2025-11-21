import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Octrivium | South African Revenue-Based Crowdfunding Platform',
  description: 'Learn about Octrivium Funding - connecting South African businesses with community investors through revenue-based financing. FICA compliant, transparent, and built for SA SMEs.',
  keywords: [
    'about Octrivium',
    'South African crowdfunding',
    'revenue-based financing SA',
    'community investment platform',
    'FICA compliant crowdfunding',
  ],
  openGraph: {
    title: 'About Octrivium Funding',
    description: 'South Africa\'s trusted revenue-based crowdfunding platform for SMEs',
    url: 'https://octrivium.co.za/about',
    type: 'website',
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
