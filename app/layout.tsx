import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'K.L. International School | Gwalior',
    template: '%s | K.L. International School',
  },
  description: 'K.L. International School — Premier CBSE school in Gwalior, Madhya Pradesh. Excellence in education, values, and holistic development.',
  keywords: ['KL International School', 'Gwalior school', 'CBSE school Gwalior', 'K.L. International'],
  authors: [{ name: 'K.L. International School' }],
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://klinternational.space'),
  openGraph: {
    type: 'website',
    siteName: 'K.L. International School',
    title: 'K.L. International School | Gwalior',
    description: 'Premier CBSE school in Gwalior, Madhya Pradesh.',
    url: 'https://klinternational.space',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'K.L. International School | Gwalior',
    description: 'Premier CBSE school in Gwalior, Madhya Pradesh.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Playfair+Display:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
