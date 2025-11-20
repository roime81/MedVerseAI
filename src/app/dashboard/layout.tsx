
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
    FileClock,
    FileWarning,
    BarChart,
    Shield,
} from 'lucide-react';
import { Logo } from '@/components/core/logo';
import { doc, getDoc } from 'firebase/firestore';
import type { User as AppUser } from '@/lib/schemas';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const getNavItems = (appUser: AppUser | null) => {
    if (!appUser) return [];

    const role = appUser.role;
    const department = appUser.department;

    if (role === 'admin' && department === 'System') {
        return [
            { href: `/dashboard/admin/system`, label: "Home / Overview", icon: Home },
            { href: "/dashboard/directory", label: "User Directory", icon: Users },
            { href: "#", label: "Requests & Approvals", icon: FileClock },
            { href: "#", label: "Escalations", icon: FileWarning },
            { href: "#", label: "Monitoring & Alerts", icon: Bell },
            { href: "#", label: "Reports", icon: BarChart },
        ];
    }
    
    switch(role) {
        case 'physician':
            return [ { href: "/dashboard/physician", label: "Clinician Workbench", icon: Stethoscope }, { href: "/dashboard/directory", label: "User Directory", icon: Users }];
        case 'nurse':
            return [ { href: "/dashboard/nurse", label: "Nurse Station", icon: Stethoscope }, { href: "/dashboard/directory", label: "User Directory", icon: Users }];
        case 'radiology':
            return [{ href: "/dashboard/radiology", label: "Radiology Worklist", icon: Scan }, { href: "/dashboard/directory", label: "User Directory", icon: Users }];
        case 'lab':
             return [{ href: "/dashboard/lab", label: "Lab Worklist", icon: FlaskConical }, { href: "/dashboard/directory", label: "User Directory", icon: Users }];
        case 'billing':
             return [{ href: "/dashboard/billing", label: "Billing Dashboard", icon: CreditCard }, { href: "/dashboard/directory", label: "User Directory", icon: Users }];
        case 'pharmacist':
            return [{ href: "/dashboard/pharmacist", label: "Pharmacy Queue", icon: Pill }, { href: "/dashboard/directory", label: "User Directory", icon: Users }];
        case 'admin':
             return [{ href: "/dashboard/directory", label: "User Directory", icon: Users }];
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
    if (isUserLoading) return;
    
    if (!user) {
      router.push('/login');
      return;
    }

    const fetchAppUser = async (firebaseUser: FirebaseUser) => {
        if (!firestore) return;
        setIsAppUserLoading(true);
        try {
            const userDocRef = doc(firestore, 'users', firebaseUser.uid);
            const userDoc = await getDoc(userDocRef);
            if (userDoc.exists()) {
                setAppUser(userDoc.data() as AppUser);
            } else {
                console.error("Could not find user document in Firestore for logged in user.");
                if (auth) await signOut(auth);
                router.push('/login');
            }
        } catch (error) {
            console.error("Error fetching user document:", error);
            if (auth) await signOut(auth);
            router.push('/login');
        } finally {
            setIsAppUserLoading(false);
        }
    };

    if (user) {
        fetchAppUser(user);
    } else {
        setIsAppUserLoading(false);
    }
  }, [user, isUserLoading, firestore, auth, router]);


  const handleSignOut = async () => {
    if (!auth) return;
    await signOut(auth);
    router.push('/login');
  };

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

  const navItems = getNavItems(appUser);
  const isSuperAdmin = appUser.role === 'admin' && appUser.department === 'System';

  return (
    <div className={cn("flex h-screen w-full font-sans", isSuperAdmin ? "bg-[#F8F9FA]" : "bg-slate-100")}>
      <aside className={cn("flex flex-col border-r text-foreground w-64", isSuperAdmin ? "bg-gray-800 text-gray-300" : "bg-white")}>
        <div className={cn("p-4 border-b h-[65px] flex items-center", isSuperAdmin ? "border-gray-700" : "border-border")}>
            <Logo variant={isSuperAdmin ? 'dark' : 'light'} isSuperAdmin={isSuperAdmin} />
        </div>
        <nav className="flex-1 p-2 space-y-1">
            {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                    <Button
                        key={item.label}
                        variant={isActive ? 'secondary' : 'ghost'}
                        className={cn("w-full justify-start text-sm", 
                           isSuperAdmin 
                           ? (isActive ? "bg-gray-700 text-white" : "text-gray-400 hover:bg-gray-700 hover:text-white")
                           : (isActive ? "bg-primary/10 text-primary font-semibold" : "text-muted-foreground hover:bg-slate-100 hover:text-foreground")
                        )}
                        asChild
                    >
                        <Link href={item.href}>
                            <Icon className={cn("mr-3 h-5 w-5", 
                               isSuperAdmin
                               ? (isActive ? "text-white" : "text-gray-400")
                               : (isActive ? "text-primary": "text-muted-foreground")
                            )} />
                            {item.label}
                        </Link>
                    </Button>
                )
            })}
             {isSuperAdmin && (
                <div className="p-2 mt-auto">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Administration</p>
                    <Button
                        variant={pathname.startsWith('/dashboard/admin/config') ? 'secondary' : 'ghost'}
                        className={cn("w-full justify-start text-sm mt-1", 
                           pathname.startsWith('/dashboard/admin/config') ? "bg-gray-700 text-white" : "text-gray-400 hover:bg-gray-700 hover:text-white"
                        )}
                        asChild
                    >
                        <Link href="#">
                            <Settings className="mr-3 h-5 w-5" />
                            Admin &amp; Config
                        </Link>
                    </Button>
                </div>
            )}
        </nav>
      </aside>
      
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className={cn("flex h-[65px] items-center justify-between border-b px-6", isSuperAdmin ? "bg-white" : "bg-white")}>
            <div className="flex-1">
                 <div className="relative w-full max-w-md">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input placeholder="Search people, roles, emails, staff ID..." className={cn("pl-10 border-slate-200", isSuperAdmin ? "bg-slate-100" : "bg-slate-100")}/>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <div className="text-right">
                    <p className="text-sm font-semibold text-foreground">{appUser.displayName}</p>
                    <p className="text-xs text-muted-foreground">{appUser.email}</p>
                </div>
                 <Badge variant={isSuperAdmin ? 'default' : 'outline'} className={cn(isSuperAdmin && 'bg-gray-800 text-white')}>
                    {isSuperAdmin ? 'Super Admin' : appUser.department}
                 </Badge>
                <Button variant="ghost" size="icon">
                    <Bell className="h-5 w-5" />
                </Button>
                 {isSuperAdmin &&
                    <Button variant="ghost" size="icon">
                        <Settings className="h-5 w-5" />
                    </Button>
                 }
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
