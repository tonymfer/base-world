import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import './globals.css';
import { Provider } from '@/providers';
import { ThemeProvider } from '@/components/theme-provider';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
    images: siteConfig.ogImage,
    creator: '@base',
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: `${siteConfig.url}/site.webmanifest`,
  other: {
    'fc:frame': 'vNext',
    'fc:frame:image': 'https://baseworld.org/og.jpg',
    'fc:frame:button:1': 'Visit Base World',
    'fc:frame:button:1:action': 'link',
    'fc:frame:button:1:target': 'https://baseworld.org',
  },
};

const inter = Roboto({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} `}>
        <ThemeProvider attribute="class" forcedTheme="dark" enableSystem>
          <Provider>{children}</Provider>
        </ThemeProvider>
      </body>
    </html>
  );
}
