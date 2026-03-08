import type { Metadata } from 'next';
import { DM_Serif_Display, Montserrat, IBM_Plex_Mono } from 'next/font/google';
import './globals.css';
import Providers from '@/components/layout/Providers';
import Navbar from '@/components/layout/Navbar';

const dmSerifDisplay = DM_Serif_Display({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-display',
  display: 'swap',
});

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'TLA — Learn Industry Jargon',
  description: 'Master the insider language of any industry through spaced repetition and gamified exercises.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${dmSerifDisplay.variable} ${montserrat.variable} ${ibmPlexMono.variable}`}
    >
      <body className="min-h-screen bg-obsidian text-ivory font-body antialiased">
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
