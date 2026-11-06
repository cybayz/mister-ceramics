import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import FloatingWhatsApp from '@/components/ui/FloatingWhatsApp';
import { BUSINESS_INFO } from '@/lib/constants';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://misterceramic.com'),
  title: {
    default: 'Mister Ceramic | Premium Automotive Detailing & Paint Protection Studio, Kottarakkara',
    template: '%s | Mister Ceramic Studio',
  },
  description:
    'Mister Ceramic is a premier car and superbike detailing, Paint Protection Film (PPF), Borophene, Graphene and 9H Ceramic coating studio in Chegamanadu, Kottarakkara, Kollam, Kerala.',
  keywords: [
    'Car detailing in Kottarakkara',
    'PPF installation in Kottarakkara',
    'Ceramic coating in Kollam',
    'Borophene coating in Kollam',
    'Bike detailing in Kollam',
    'Car painting in Kottarakkara',
    'Paint Protection Film Kerala',
    'Mister Ceramic Chegamanadu',
  ],
  authors: [{ name: 'Mister Ceramic Studio' }],
  creator: 'Mister Ceramic',
  publisher: 'Mister Ceramic',
  openGraph: {
    title: 'Mister Ceramic | Beyond Shine. Beyond Protection.',
    description:
      'Precision automotive detailing, advanced self-healing PPF, and nanotech coatings in Chegamanadu, Kottarakkara, Kollam, Kerala.',
    url: 'https://misterceramic.com',
    siteName: 'Mister Ceramic Studio',
    locale: 'en_IN',
    type: 'website',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=85',
        width: 1200,
        height: 630,
        alt: 'Mister Ceramic Premium Automotive Detailing Studio',
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Structured Data Schema for LocalBusiness / AutoRepair
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AutoRepair',
    name: 'Mister Ceramic',
    image: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=85',
    telephone: BUSINESS_INFO.phone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Chegamanadu',
      addressLocality: 'Kottarakkara',
      addressRegion: 'Kerala',
      postalCode: '691506',
      addressCountry: 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '9.00632',
      longitude: '76.77259',
    },
    url: 'https://misterceramic.com',
    hasMap: BUSINESS_INFO.googleMapsUrl,
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '09:00',
        closes: '19:00',
      },
    ],
    priceRange: '₹₹₹',
    areaServed: ['Kottarakkara', 'Kollam', 'Adoor', 'Kundara', 'Pathanamthitta', 'Kerala'],
  };

  return (
    <html lang="en" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-brand-dark text-zinc-100 flex flex-col antialiased selection:bg-brand-gold selection:text-black">
        {/* We use an application wrapper that handles navbar/footer display */}
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <FloatingWhatsApp />
      </body>
    </html>
  );
}

