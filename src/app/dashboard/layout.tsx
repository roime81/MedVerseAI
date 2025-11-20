
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
    Shield,
    FileText,
    BarChart,
    AlertTriangle,
    FileCheck,
} from 'lucide-react';
import { Logo } from '@/components/core/logo';
import { doc, getDoc } from 'firebase/firestore';
import type { User as AppUser } from '@/lib/schemas';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';


const getNavItems = (role: string, department?: string) => {
    const baseNav = [
        { href: "/dashboard/directory", label: "User Directory", icon: Users },
    ];

    if (role === 'admin') {
        if (department === 'System') {
            return [ 
                { href: "/dashboard/super-admin", label: "Home / Overview", icon: Home },
                { href: "/dashboard/directory", label: "User Directory", icon: Users },
                { href: "/dashboard/requests-approvals", label: "Requests & Approvals", icon: FileCheck },
                { href: "/dashboard/escalations", label: "Escalations", icon: AlertTriangle },
                { href: "/dashboard/monitoring-alerts", label: "Monitoring & Alerts", icon: BarChart },
                { href: "/dashboard/reports", label: "Reports", icon: FileText },
                { isSeparator: true, label: "ADMINISTRATION" },
                { href: "/dashboard/admins-config", label: "Admins & Config", icon: Shield },
            ];
        }
        if (department === 'HR/Credentialing') {
             return [{ href: "/dashboard/hr-credentialing", label: "HR & Credentialing", icon: Stethoscope }, ...baseNav];
        }
    }
    
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
  const isSuperAdmin = appUser?.department === 'System';


  if (isUserLoading || !user || !appUser) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full font-sans bg-slate-50">
      <aside className={cn("flex flex-col border-r text-foreground", isSuperAdmin ? "w-64 bg-black text-white" : "w-64 bg-white")}>
        <div className="p-4 border-b h-[65px] flex items-center" style={{ borderColor: isSuperAdmin ? 'rgba(255, 255, 255, 0.1)' : '' }}>
            <Logo variant={isSuperAdmin ? 'dark' : 'light'} isSuperAdmin={isSuperAdmin} />
        </div>
        <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item, index) => {
                if(item.isSeparator) {
                    return <p key={index} className="px-2 pt-4 pb-2 text-xs font-semibold uppercase text-slate-400 tracking-wider">{item.label}</p>
                }
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                    <Button
                        key={item.href}
                        variant={isActive ? 'secondary' : 'ghost'}
                        className={cn("w-full justify-start text-sm", 
                            isSuperAdmin ? 
                            (isActive ? "bg-slate-700 text-white font-semibold" : "text-slate-300 hover:bg-slate-800 hover:text-white")
                            : (isActive ? "bg-primary/10 text-primary font-semibold" : "text-muted-foreground hover:bg-slate-100 hover:text-foreground")
                        )}
                        asChild
                    >
                        <Link href={item.href}>
                            <Icon className={cn("mr-3 h-5 w-5", 
                                isSuperAdmin ? (isActive ? "text-white" : "text-slate-400")
                                : (isActive ? "text-primary": "text-muted-foreground")
                            )} />
                            {item.label}
                        </Link>
                    </Button>
                )
            })}
        </nav>
      </aside>
      
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className={cn("flex h-[65px] items-center justify-between border-b px-6", isSuperAdmin ? "bg-black" : "bg-white")}>
            <div className="flex-1">
                 <div className="relative w-full max-w-md">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input placeholder="Search people, roles, emails, staff ID..." className={cn("pl-10 border-border", isSuperAdmin ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-100 border-slate-200" )}/>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <div className="text-right">
                    <p className={cn("text-sm font-semibold", isSuperAdmin ? "text-white" : "text-foreground")}>{appUser.displayName}</p>
                    <p className="text-xs text-muted-foreground">{appUser.email}</p>
                </div>
                {appUser.department && <Badge variant={isSuperAdmin ? "default" : "outline"} className={cn(isSuperAdmin && "bg-primary")}>{appUser.role === 'admin' ? appUser.department : appUser.department}</Badge>}
                <Button variant="ghost" size="icon" className={cn(isSuperAdmin && "text-slate-400 hover:text-white hover:bg-slate-800")}>
                    <Bell className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className={cn(isSuperAdmin && "text-slate-400 hover:text-white hover:bg-slate-800")}>
                    <Settings className="h-5 w-5" />
                </Button>
                <Button variant={isSuperAdmin ? "outline" : "outline"} onClick={handleSignOut} className={cn(isSuperAdmin && "border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white")}>
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
