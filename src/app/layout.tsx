import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import './globals.css';
import { Provider } from '@/providers';
import { ThemeProvider } from '@/components/theme-provider';
import { siteConfig } from '@/config/site';

const inter = Roboto({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
});

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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" forcedTheme="dark" enableSystem>
          <Provider>{children}</Provider>
        </ThemeProvider>
      </body>
    </html>
  );
}
