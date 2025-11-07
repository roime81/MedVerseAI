'use client';

import { useUser, useFirebase } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { getAuth, signOut } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import { Sidebar } from '@/components/dashboard/sidebar';
import { Input } from '@/components/ui/input';
import { Search, ChevronsUpDown } from 'lucide-react';

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
    <div className="flex min-h-screen w-full bg-background font-sans">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-6">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search Patient..."
              className="w-full rounded-full bg-card pl-10"
            />
          </div>
          <div className="ml-auto flex items-center gap-4">
            <Button variant="outline" className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              City General
              <ChevronsUpDown className="h-4 w-4 text-muted-foreground" />
            </Button>
            <Avatar className="h-9 w-9">
              <AvatarImage src={user.photoURL || ''} alt={user.displayName || user.email || ''} />
              <AvatarFallback>{user.displayName?.[0] || user.email?.[0]}</AvatarFallback>
            </Avatar>
          </div>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
