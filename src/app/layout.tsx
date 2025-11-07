import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { FirebaseClientProvider } from '@/firebase';
import './globals.css';
import { cn } from '@/lib/utils';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
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
      <body className={cn('font-sans', inter.variable)}>
        <FirebaseClientProvider>{children}</FirebaseClientProvider>
      </body>
    </html>
  );
}
