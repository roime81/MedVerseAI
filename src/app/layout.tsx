import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { FirebaseClientProvider } from '@/firebase';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Clinical Dashboard',
  description: 'A dashboard for medical professionals.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <FirebaseClientProvider>{children}</FirebaseClientProvider>
      </body>
    </html>
  );
}
