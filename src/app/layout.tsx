import './globals.css';
import { Inter, IBM_Plex_Sans_Arabic } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const ibmPlexSansArabic = IBM_Plex_Sans_Arabic({
  subsets: ['arabic'],
  weight: ['300', '400', '600', '700'],
  variable: '--font-ibm'
});

export const metadata = {
  title: 'Archfolio | Archiving the Built Environment',
  description: 'A specialized repository of high-performance architectural case studies and structural engineering breakthroughs.',
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
      <body className={`${inter.variable} ${ibmPlexSansArabic.variable} selection:bg-secondary/30`} suppressHydrationWarning>
        <div className="relative min-h-screen flex flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
