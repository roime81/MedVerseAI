'use client';

import { useUser, useFirebase } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { getAuth, signOut } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { LogOut } from 'lucide-react';
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
      <div className="flex h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-background">
      <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
         <div className="flex items-center gap-2">
            <Image
                src="https://firebase.google.com/static/images/brand-guidelines/logo-logomark.png"
                alt="Medverse Logo"
                width={32}
                height={32}
            />
            <h1 className="text-xl font-semibold text-primary">
                Clinical Dashboard
            </h1>
        </div>
        <div className="relative ml-auto flex-1 md:grow-0"></div>
          <Avatar>
            <AvatarImage src={user.photoURL || ''} alt={user.displayName || user.email || ''} />
            <AvatarFallback>{user.displayName?.[0] || user.email?.[0]}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-semibold">{user.displayName || user.email}</span>
            <span className="text-xs text-muted-foreground">{user.email}</span>
          </div>
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={handleSignOut}>
            <LogOut className="h-4 w-4" />
            <span className="sr-only">Sign Out</span>
          </Button>
      </header>
      <main className="p-4 sm:px-6 sm:py-0">{children}</main>
    </div>
  );
}
