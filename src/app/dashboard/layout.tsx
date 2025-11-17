
'use client';

import { useUser } from '@/firebase';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { signOut, User as FirebaseUser } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { useAuth, useFirestore } from '@/firebase';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { LayoutDashboard, User, BarChart, Users, Shield } from 'lucide-react';
import { Logo } from '@/components/core/logo';
import { doc, getDoc } from 'firebase/firestore';
import type { User as AppUser } from '@/lib/schemas';


const getNavItems = (role: string) => {
    const physicianNav = [
        { href: "/dashboard/physician", label: "Clinician Workbench", icon: LayoutDashboard },
        { href: "/dashboard/directory", label: "Command Center", icon: BarChart },
    ];
    
    const adminNav = [
        { href: "/dashboard/admin-directory", label: "Admin Directory", icon: Shield },
    ];

    switch(role) {
        case 'physician':
            return physicianNav;
        case 'admin':
             return [...physicianNav.slice(1), ...adminNav]; // Admins get Command Center, and Admin Directory
        default:
            return []; // Other roles like nurse, billing etc. have no special nav links for now
    }
}


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const auth = useAuth();
  const firestore = useFirestore();
  const [appUser, setAppUser] = useState<AppUser | null>(null);


  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  useEffect(() => {
    const fetchUserRole = async (firebaseUser: FirebaseUser) => {
        if (!firestore) return;
        const userDocRef = doc(firestore, 'users', firebaseUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
            setAppUser(userDoc.data() as AppUser);
        }
    };

    if(user) {
        fetchUserRole(user);
    }
  }, [user, firestore]);


  const handleSignOut = () => {
    signOut(auth).then(() => {
      router.push('/login');
    });
  };

  const navItems = appUser ? getNavItems(appUser.role) : [];

  if (isUserLoading || !user || !appUser) {
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
            {navItems.map((item) => {
                const Icon = item.icon;
                return (
                    <Button
                        key={item.href}
                        size="sm"
                        variant={pathname.startsWith(item.href) ? 'secondary' : 'ghost'}
                        className={cn(
                            pathname.startsWith(item.href) && 'bg-primary/10 text-primary',
                            !pathname.startsWith(item.href) && 'text-muted-foreground hover:text-card-foreground'
                        )}
                        asChild
                    >
                        <Link href={item.href}>
                            <Icon className="mr-2 h-4 w-4" />
                            {item.label}
                        </Link>
                    </Button>
                )
            })}
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
