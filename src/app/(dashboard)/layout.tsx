'use client';
import { BrainCircuit } from 'lucide-react';
import * as React from 'react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm">
        <BrainCircuit className="size-6 text-primary" />
        <h1 className="font-headline text-xl font-bold text-primary">
          MedVerseAI
        </h1>
      </header>
      <main className="flex-1 p-4 sm:p-6 md:p-8">{children}</main>
    </div>
  );
}
