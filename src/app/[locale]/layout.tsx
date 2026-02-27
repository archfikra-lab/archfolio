import './globals.css';
import { Inter, IBM_Plex_Sans_Arabic, Architects_Daughter } from 'next/font/google';
import UserSelector from '@/components/UserSelector';
import { Providers } from '@/components/Providers';

import FeedbackWidget from '@/components/FeedbackWidget';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const ibmPlexSansArabic = IBM_Plex_Sans_Arabic({
  subsets: ['arabic'],
  weight: ['300', '400', '600', '700'],
  variable: '--font-ibm'
});
const architectsDaughter = Architects_Daughter({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-architects'
});

export const metadata = {
  title: 'Archfolio | Archiving the Built Environment',
  description: 'A specialized repository of high-performance architectural case studies and structural engineering breakthroughs.',
  icons: {
    icon: '/app-logo.png',
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
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet" />
      </head>
      <body className={`${inter.variable} ${ibmPlexSansArabic.variable} ${architectsDaughter.variable} selection:bg-secondary/30`} suppressHydrationWarning>
        <Providers>
          <div className="relative min-h-screen flex flex-col">
            <div className="theme-overlay paper-texture pointer-events-none z-[-1]"></div>
            <div className="theme-overlay scratches pointer-events-none z-[-1]"></div>
            <Header />
            <main className="flex-1 w-full flex flex-col">
              {children}
            </main>
            <Footer />
            <UserSelector />
            <FeedbackWidget />
          </div>
        </Providers>
      </body>
    </html>
  );
}
