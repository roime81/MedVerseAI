
'use client';

import { useUser } from '@/firebase';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { signOut, User as FirebaseUser } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { useAuth, useFirestore } from '@/firebase';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { LayoutDashboard, User as UserIcon, BarChart, Users, Shield, LogOut, Hospital, Briefcase, Stethoscope, FlaskConical, Scan, Pill, CreditCard } from 'lucide-react';
import { Logo } from '@/components/core/logo';
import { doc, getDoc } from 'firebase/firestore';
import type { User as AppUser } from '@/lib/schemas';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';


const getNavItems = (role: string, department?: string) => {
    const baseNav = [
        { href: "/dashboard/directory", label: "Doctor Directory", icon: Users },
        { href: "/dashboard/admin-directory", label: "Admin Directory", icon: Shield },
    ];
    
    switch(role) {
        case 'physician':
            return [ { href: "/dashboard/physician", label: "Clinician Workbench", icon: Stethoscope }, ...baseNav];
        case 'nurse':
            return [ { href: "/dashboard/nurse", label: "Nurse Station", icon: HeartPulse }, ...baseNav];
        case 'admin':
            if (department === 'Medical Affairs/Clinical Gov') {
                 return [{ href: "/dashboard/admin/medical-affairs-clinical-gov", label: "Access Management", icon: LayoutDashboard }, ...baseNav]
            }
             if (department === 'IT/IAM') {
                 return [{ href: "/dashboard/admin/it-iam", label: "IT/IAM Dashboard", icon: LayoutDashboard }, ...baseNav]
            }
            if (department === 'Cybersecurity') {
                 return [{ href: "/dashboard/admin/cybersecurity", label: "Security Ops", icon: LayoutDashboard }, ...baseNav]
            }
            if (department === 'Compliance/Audit') {
                 return [{ href: "/dashboard/admin/compliance-audit", label: "Compliance", icon: LayoutDashboard }, ...baseNav]
            }
            return [{ href: "/dashboard/admin", label: "Admin Overview", icon: LayoutDashboard }, ...baseNav];
        case 'radiology':
            return [{ href: "/dashboard/radiology", label: "Radiology Worklist", icon: Scan }, ...baseNav];
        case 'lab':
             return [{ href: "/dashboard/lab", label: "Lab Worklist", icon: FlaskConical }, ...baseNav];
        case 'billing':
             return [{ href: "/dashboard/billing", label: "Billing Dashboard", icon: CreditCard }, ...baseNav];
        case 'pharmacist':
            return [{ href: "/dashboard/pharmacist", label: "Pharmacy Queue", icon: Pill }, ...baseNav];
        default:
            return baseNav;
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
    if (!auth) return;
    signOut(auth).then(() => {
      router.push('/login');
    });
  };

  const navItems = appUser ? getNavItems(appUser.role, appUser.department) : [];

  if (isUserLoading || !user || !appUser) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <p>Loading...</p>
      </div>
    );
  }
  
  const getInitials = (name: string = '') => {
    return name
        .split(' ')
        .slice(0, 2)
        .map(n => n[0])
        .join('')
        .toUpperCase();
  };


  return (
    <div className="flex h-screen w-full font-sans bg-slate-50">
      <aside className="w-64 flex flex-col border-r bg-white">
        <div className="p-4 border-b">
            <Logo />
        </div>
        <nav className="flex-1 p-4 space-y-2">
            {navItems.map((item) => {
                const Icon = item.icon;
                return (
                    <Button
                        key={item.href}
                        variant={pathname.startsWith(item.href) ? 'secondary' : 'ghost'}
                        className="w-full justify-start"
                        asChild
                    >
                        <Link href={item.href}>
                            <Icon className="mr-3 h-5 w-5" />
                            {item.label}
                        </Link>
                    </Button>
                )
            })}
        </nav>
        <div className="p-4 border-t">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                    <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                            {getInitials(appUser?.displayName || '')}
                            </AvatarFallback>
                        </Avatar>
                        <span className="truncate max-w-[120px] text-sm font-medium">{appUser?.displayName}</span>
                    </div>
                    <LogOut className="h-4 w-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{appUser?.displayName}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {appUser?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
        </div>
      </aside>
      
      <div className="flex flex-1 flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto bg-slate-50">
            {children}
        </main>
      </div>
    </div>
  );
}
