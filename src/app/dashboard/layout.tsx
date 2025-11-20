
'use client';

import { useUser } from '@/firebase';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { signOut, User as FirebaseUser } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { useAuth, useFirestore } from '@/firebase';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { 
    Home,
    Users, 
    LogOut, 
    Stethoscope, 
    FlaskConical, 
    Scan, 
    Pill, 
    CreditCard,
    Bell,
    Settings,
    Search,
    Loader2,
} from 'lucide-react';
import { Logo } from '@/components/core/logo';
import { doc, getDoc } from 'firebase/firestore';
import type { User as AppUser } from '@/lib/schemas';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const getNavItems = (role: string) => {
    const baseNav = [
        { href: "/dashboard/directory", label: "User Directory", icon: Users },
    ];
    
    switch(role) {
        case 'physician':
            return [ { href: "/dashboard/physician", label: "Clinician Workbench", icon: Stethoscope }, ...baseNav];
        case 'nurse':
            return [ { href: "/dashboard/nurse", label: "Nurse Station", icon: Stethoscope }, ...baseNav];
        case 'radiology':
            return [{ href: "/dashboard/radiology", label: "Radiology Worklist", icon: Scan }, ...baseNav];
        case 'lab':
             return [{ href: "/dashboard/lab", label: "Lab Worklist", icon: FlaskConical }, ...baseNav];
        case 'billing':
             return [{ href: "/dashboard/billing", label: "Billing Dashboard", icon: CreditCard }, ...baseNav];
        case 'pharmacist':
            return [{ href: "/dashboard/pharmacist", label: "Pharmacy Queue", icon: Pill }, ...baseNav];
        case 'admin':
            return baseNav; // Admins just get the base navigation
        default:
            return [{ href: "/dashboard/patient-portal", label: "Patient Portal", icon: Home }];
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
  const [isAppUserLoading, setIsAppUserLoading] = useState(true);


  useEffect(() => {
    // If Firebase auth is still loading, do nothing.
    if (isUserLoading) return;
    
    // If Firebase auth has loaded and there's no user, redirect to login.
    if (!user) {
      router.push('/login');
      return;
    }

    // If we have a user but haven't fetched their Firestore profile yet.
    if (user && !appUser) {
        const fetchUserRole = async (firebaseUser: FirebaseUser) => {
            if (!firestore) return;
            setIsAppUserLoading(true);
            const userDocRef = doc(firestore, 'users', firebaseUser.uid);
            try {
                const userDoc = await getDoc(userDocRef);
                if (userDoc.exists()) {
                    setAppUser(userDoc.data() as AppUser);
                } else {
                    console.error("Could not find user document in Firestore for logged in user.");
                    if (auth) {
                        await signOut(auth);
                    }
                    router.push('/login');
                }
            } catch (error) {
                console.error("Error fetching user document:", error);
                 if (auth) {
                    await signOut(auth);
                }
                router.push('/login');
            } finally {
                setIsAppUserLoading(false);
            }
        };

        fetchUserRole(user);
    } else if (appUser) {
        setIsAppUserLoading(false);
    }
  }, [user, appUser, isUserLoading, firestore, auth, router]);


  const handleSignOut = async () => {
    if (!auth) return;
    await signOut(auth);
    router.push('/login');
  };

  // Do not render anything until both Firebase Auth and Firestore Profile are loaded
  if (isUserLoading || isAppUserLoading || !appUser) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Now we are sure appUser is loaded
  const navItems = getNavItems(appUser.role);

  return (
    <div className="flex h-screen w-full font-sans bg-slate-100">
      <aside className="flex flex-col border-r text-foreground w-64 bg-white">
        <div className="p-4 border-b h-[65px] flex items-center">
            <Logo />
        </div>
        <nav className="flex-1 p-2 space-y-1">
            {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                    <Button
                        key={item.href}
                        variant={isActive ? 'secondary' : 'ghost'}
                        className={cn("w-full justify-start text-sm", 
                            isActive ? "bg-primary/10 text-primary font-semibold" : "text-muted-foreground hover:bg-slate-100 hover:text-foreground"
                        )}
                        asChild
                    >
                        <Link href={item.href}>
                            <Icon className={cn("mr-3 h-5 w-5", 
                                isActive ? "text-primary": "text-muted-foreground"
                            )} />
                            {item.label}
                        </Link>
                    </Button>
                )
            })}
        </nav>
      </aside>
      
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-[65px] items-center justify-between border-b px-6 bg-white">
            <div className="flex-1">
                 <div className="relative w-full max-w-md">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input placeholder="Search people, roles, emails, staff ID..." className="pl-10 bg-slate-100 border-slate-200"/>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <div className="text-right">
                    <p className="text-sm font-semibold text-foreground">{appUser.displayName}</p>
                    <p className="text-xs text-muted-foreground">{appUser.email}</p>
                </div>
                {appUser.department && <Badge variant="outline">{appUser.role === 'admin' ? appUser.department : appUser.role}</Badge>}
                <Button variant="ghost" size="icon">
                    <Bell className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon">
                    <Settings className="h-5 w-5" />
                </Button>
                <Button variant="default" onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                </Button>
            </div>
        </header>

        <main className="flex-1 overflow-y-auto">
            {children}
        </main>
      </div>
    </div>
  );
}
