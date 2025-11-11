'use client';

import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { signOut } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Bell, LogOut, User as UserIcon, Briefcase, LayoutGrid } from 'lucide-react';
import { useAuth } from '@/firebase';
import Link from 'next/link';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const auth = useAuth();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  const handleSignOut = () => {
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
    <div className="flex min-h-screen w-full flex-col bg-background font-sans">
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between gap-4 border-b bg-white px-6">
        <div className="flex items-center gap-8">
            <div className="font-bold font-grotesk text-xl">
                <span className="text-gray-800">MedVerseAI</span>
            </div>
            <div className="flex items-center gap-1 rounded-lg bg-gray-100 p-1">
                <Button size="sm" className="bg-white shadow-sm text-primary">
                    <Briefcase className="mr-2 h-4 w-4" />
                    Clinician Workbench
                </Button>
                <Button size="sm" variant="ghost" className="text-muted-foreground">
                    <UserIcon className="mr-2 h-4 w-4" />
                    Patient Portal
                </Button>
                <Button size="sm" variant="ghost" className="text-muted-foreground">
                    <LayoutGrid className="mr-2 h-4 w-4" />
                    Command Center
                </Button>
            </div>
        </div>

        <div className="flex items-center gap-4">
            <div className="relative w-full max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                placeholder="Search patients..."
                className="w-full rounded-md bg-background pl-10"
                />
            </div>
            <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
            </Button>
        </div>
      </header>
      <div className="flex flex-1">
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
