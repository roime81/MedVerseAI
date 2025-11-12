'use client';

import { useUser } from '@/firebase';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { signOut } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Bell, LogOut, LayoutDashboard, User, BarChart } from 'lucide-react';
import { useAuth } from '@/firebase';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import { cn } from '@/lib/utils';


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const pathname = usePathname();
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
    <div className="flex h-screen w-full flex-col bg-slate-50 font-sans text-foreground">
      <header className="sticky top-0 z-40 flex h-16 flex-shrink-0 items-center justify-between gap-4 border-b bg-card px-6 text-card-foreground">
        <div className="flex items-center gap-6">
          <h1 className="font-grotesk text-xl font-bold">MedVerseAI</h1>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant={pathname === '/dashboard/physician' ? 'secondary' : 'ghost'}
              className={cn(pathname === '/dashboard/physician' && 'bg-primary/10 text-primary')}
              asChild
            >
                <Link href="/dashboard/physician">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Clinician Workbench
                </Link>
            </Button>
            <Button 
                size="sm" 
                variant={pathname === '/dashboard/patient-portal' ? 'secondary' : 'ghost'}
                className={cn(pathname === '/dashboard/patient-portal' ? 'bg-primary/10 text-primary' : 'text-muted-foreground')}
                asChild
            >
               <Link href="/dashboard/patient-portal">
                <User className="mr-2 h-4 w-4" />
                Patient Portal
               </Link>
            </Button>
            <Button size="sm" variant="ghost" className="text-muted-foreground">
               <BarChart className="mr-2 h-4 w-4" />
              Command Center
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search patients..."
              className="w-full rounded-md bg-background/10 pl-10 border-border/50 placeholder:text-muted-foreground"
            />
          </div>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="sm" onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </header>
      
      <div className="flex flex-1 overflow-hidden">
        <main className="flex-1 overflow-y-auto bg-background text-foreground">
            {children}
        </main>
      </div>
    </div>
  );
}
