import './globals.css';
import { Inter, Architects_Daughter, Cairo } from 'next/font/google';
import AuthWidget from '@/components/AuthWidget';
import { Providers } from '@/components/Providers';

import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import FeedbackWidget from '@/components/FeedbackWidget';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';
import WelcomeTutorial from '@/components/WelcomeTutorial';
import HelpOverlay from '@/components/HelpOverlay';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

const architectsDaughter = Architects_Daughter({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-architects'
});

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  variable: '--font-cairo',
  display: 'swap',
});

export const metadata = {
  title: 'Archfolio | Archiving the Built Environment',
  description: 'A specialized repository of high-performance architectural case studies and structural engineering breakthroughs.',
  icons: {
    icon: '/app-logo.png',
  },
};

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }> | { locale: string };
}) {
  // Await params to avoid the Next.js 15+ "params is now a promise" warning, although we're using generic await
  const locale = 'locale' in params ? params.locale : (await params).locale;
  const messages = await getMessages();

  return (
    <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'} suppressHydrationWarning>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet" />
      </head>
      <body className={`${inter.variable} ${architectsDaughter.variable} ${cairo.variable} selection:bg-secondary/30`} suppressHydrationWarning>
        <NextIntlClientProvider messages={messages}>
          <Providers>
            <div className="relative min-h-screen flex flex-col">
              <div className="theme-overlay paper-texture pointer-events-none z-[-1]"></div>
              <div className="theme-overlay scratches pointer-events-none z-[-1]"></div>
              <main className="flex-1 w-full flex flex-col">
                {children}
              </main>
              <AuthWidget />
              <FeedbackWidget />
              <ScrollToTop />
              <WelcomeTutorial />
              <HelpOverlay />
            </div>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
