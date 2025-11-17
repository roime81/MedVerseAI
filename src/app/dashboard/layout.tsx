
'use client';

import { useUser } from '@/firebase';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { signOut } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/firebase';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { LayoutDashboard, User, BarChart, Users } from 'lucide-react';
import { Logo } from '@/components/core/logo';


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
    <div className="flex h-screen w-full flex-col font-sans">
      <header className="sticky top-0 z-40 flex h-16 flex-shrink-0 items-center justify-between gap-4 border-b bg-card px-6 text-card-foreground">
        <div className="flex items-center gap-6">
          <Logo />
        </div>
        <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant={pathname === '/dashboard/physician' ? 'secondary' : 'ghost'}
              className={cn(pathname === '/dashboard/physician' && 'bg-primary/10 text-primary', pathname !== '/dashboard/physician' && 'text-muted-foreground hover:text-card-foreground')}
              asChild
            >
                <Link href="/dashboard/physician">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Clinician Workbench
                </Link>
            </Button>
            <Button 
                size="sm" 
                variant={pathname.startsWith('/dashboard/patient-portal') ? 'secondary' : 'ghost'}
                className={cn(pathname.startsWith('/dashboard/patient-portal') ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-card-foreground')}
                asChild
            >
               <Link href="/dashboard/patient-portal">
                <User className="mr-2 h-4 w-4" />
                Patient Portal
               </Link>
            </Button>
            <Button 
                size="sm" 
                variant={pathname.startsWith('/dashboard/patient-360') ? 'secondary' : 'ghost'}
                className={cn(pathname.startsWith('/dashboard/patient-360') ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-card-foreground')}
                asChild
            >
               <Link href="/dashboard/patient-360">
                <Users className="mr-2 h-4 w-4" />
                Patient 360
               </Link>
            </Button>
            <Button 
              size="sm" 
              variant={pathname.startsWith('/dashboard/directory') ? 'secondary' : 'ghost'}
              className={cn(pathname.startsWith('/dashboard/directory') ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-card-foreground')}
              asChild
            >
               <Link href="/dashboard/directory">
                <BarChart className="mr-2 h-4 w-4" />
                Command Center
               </Link>
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
