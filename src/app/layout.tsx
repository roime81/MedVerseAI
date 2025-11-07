import type { Metadata } from 'next';
import { PT_Sans, Space_Grotesk } from 'next/font/google';
import { FirebaseClientProvider } from '@/firebase';
import './globals.css';
import { cn } from '@/lib/utils';

const ptSans = PT_Sans({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-sans',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-grotesk',
});

export const metadata: Metadata = {
  title: 'MedVerseAI - Clinical Dashboard',
  description: 'An AI-powered dashboard for medical professionals.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn('font-sans', ptSans.variable, spaceGrotesk.variable)}>
        <FirebaseClientProvider>{children}</FirebaseClientProvider>
      </body>
    </html>
  );
}
