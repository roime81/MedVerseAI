'use client';

import { useUser, useFirebase } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { getAuth, signOut } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { LogOut, Stethoscope } from 'lucide-react';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const { firebaseApp } = useFirebase();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  const handleSignOut = () => {
    const auth = getAuth(firebaseApp);
    signOut(auth).then(() => {
      router.push('/login');
    });
  };

  if (isUserLoading || !user) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-background font-sans">
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/95 px-4 backdrop-blur sm:px-6">
         <div className="flex items-center gap-2">
            <Stethoscope className="h-6 w-6 text-primary" />
            <h1 className="font-grotesk text-xl font-semibold text-primary">
                MedVerseAI
            </h1>
        </div>
        <div className="relative ml-auto flex-1 md:grow-0"></div>
          <Avatar>
            <AvatarImage src={user.photoURL || ''} alt={user.displayName || user.email || ''} />
            <AvatarFallback>{user.displayName?.[0] || user.email?.[0]}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-semibold text-sm">{user.displayName || user.email}</span>
            <span className="text-xs text-muted-foreground">{user.email}</span>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleSignOut}>
            <LogOut className="h-4 w-4" />
            <span className="sr-only">Sign Out</span>
          </Button>
      </header>
      <main className="p-4 sm:px-6 sm:py-4">{children}</main>
    </div>
  );
}
