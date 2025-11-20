
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
    Users, 
    FileText,
    BarChart, 
    Shield, 
    LogOut, 
    Stethoscope, 
    FlaskConical, 
    Scan, 
    Pill, 
    CreditCard,
    Home,
    FolderClock,
    ShieldAlert,
    Bell,
    Settings,
    Search
} from 'lucide-react';
import { Logo } from '@/components/core/logo';
import { doc, getDoc } from 'firebase/firestore';
import type { User as AppUser } from '@/lib/schemas';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';


const getNavItems = (role: string, department?: string) => {
    const baseNav = [
        { href: "/dashboard/directory", label: "User Directory", icon: Users },
        { href: "/dashboard/admin-directory", label: "All Administrators", icon: Shield },
    ];
    
    switch(role) {
        case 'physician':
            return [ { href: "/dashboard/physician", label: "Clinician Workbench", icon: Stethoscope }, ...baseNav];
        case 'nurse':
            return [ { href: "/dashboard/nurse", label: "Nurse Station", icon: Stethoscope }, ...baseNav];
        case 'admin':
            if (department === 'Medical Affairs/Clinical Gov') {
                 return [
                    { href: "/dashboard/admin/medical-affairs-clinical-gov", label: "Home / Overview", icon: Home },
                    { href: "/dashboard/directory", label: "User Directory", icon: Users },
                    { href: "/dashboard/admin/medical-affairs-clinical-gov/requests", label: "Requests & Approvals", icon: FileText },
                    { href: "/dashboard/admin/medical-affairs-clinical-gov/escalations", label: "Escalations", icon: FolderClock },
                    { href: "/dashboard/admin/medical-affairs-clinical-gov/monitoring", label: "Monitoring & Alerts", icon: ShieldAlert },
                    { href: "/dashboard/admin/medical-affairs-clinical-gov/reports", label: "Reports", icon: BarChart },
                 ]
            }
            if (department === 'System') {
                 return [
                    { href: "/dashboard/super-admin", label: "Home / Overview", icon: Home, section: 'main' },
                    { href: "/dashboard/directory", label: "User Directory", icon: Users, section: 'main' },
                    { href: "/dashboard/admin/medical-affairs-clinical-gov/requests", label: "Requests & Approvals", icon: FileText, section: 'main' },
                    { href: "/dashboard/admin/medical-affairs-clinical-gov/escalations", label: "Escalations", icon: FolderClock, section: 'main' },
                    { href: "/dashboard/admin/medical-affairs-clinical-gov/monitoring", label: "Monitoring & Alerts", icon: ShieldAlert, section: 'main' },
                    { href: "/dashboard/admin/medical-affairs-clinical-gov/reports", label: "Reports", icon: BarChart, section: 'main' },
                    { href: "/dashboard/super-admin/config", label: "Admin & Config", icon: Settings, section: 'admin' },
                 ]
            }
             if (department === 'IT/IAM') {
                 return [{ href: "/dashboard/admin/it-iam", label: "IT/IAM Dashboard", icon: Stethoscope }, ...baseNav]
            }
            if (department === 'Cybersecurity') {
                 return [{ href: "/dashboard/admin/cybersecurity", label: "Security Ops", icon: Stethoscope }, ...baseNav]
            }
            if (department === 'Compliance/Audit') {
                 return [{ href: "/dashboard/admin/compliance-audit", label: "Compliance", icon: Stethoscope }, ...baseNav]
            }
            return [{ href: "/dashboard/admin", label: "Admin Overview", icon: Stethoscope }, ...baseNav];
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
  const mainNavItems = navItems.filter(item => item.section === 'main' || item.section === undefined);
  const adminNavItems = navItems.filter(item => item.section === 'admin');


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
    <div className="flex h-screen w-full font-sans bg-slate-100">
      <aside className="w-64 flex flex-col border-r bg-black text-white">
        <div className="p-4 border-b border-gray-800 h-[65px] flex items-center">
            <Logo variant="light" />
        </div>
        <nav className="flex-1 p-4 space-y-2">
            {mainNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname.startsWith(item.href);
                return (
                    <Button
                        key={item.href}
                        variant={isActive ? 'secondary' : 'ghost'}
                        className={cn("w-full justify-start text-sm", 
                            isActive ? "bg-gray-700 text-white font-semibold" : "text-gray-300 hover:bg-gray-800 hover:text-white"
                        )}
                        asChild
                    >
                        <Link href={item.href}>
                            <Icon className={cn("mr-3 h-5 w-5", isActive ? "text-white": "text-gray-400")} />
                            {item.label}
                        </Link>
                    </Button>
                )
            })}

            {adminNavItems.length > 0 && (
                <div className="pt-4">
                    <p className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Administration</p>
                    <div className="mt-2 space-y-2">
                        {adminNavItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname.startsWith(item.href);
                            return (
                                <Button
                                    key={item.href}
                                    variant={isActive ? 'secondary' : 'ghost'}
                                    className={cn("w-full justify-start text-sm", 
                                        isActive ? "bg-gray-700 text-white font-semibold" : "text-gray-300 hover:bg-gray-800 hover:text-white"
                                    )}
                                    asChild
                                >
                                    <Link href={item.href}>
                                        <Icon className={cn("mr-3 h-5 w-5", isActive ? "text-white": "text-gray-400")} />
                                        {item.label}
                                    </Link>
                                </Button>
                            )
                        })}
                    </div>
                </div>
            )}
        </nav>
      </aside>
      
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-[65px] items-center justify-between border-b bg-white px-6">
            <div className="flex-1">
                <div className="relative w-full max-w-md">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input placeholder="Search people, roles, emails, MRN, staff ID..." className="pl-10 bg-slate-100 border-slate-200" />
                </div>
            </div>
            <div className="flex items-center gap-4">
                <div className="text-right">
                    <p className="text-sm font-semibold">{appUser.displayName}</p>
                    <p className="text-xs text-muted-foreground">{appUser.email}</p>
                </div>
                {appUser.department && <Badge variant="outline">{appUser.department}</Badge>}
                <Button variant="ghost" size="icon">
                    <Bell className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon">
                    <Settings className="h-5 w-5" />
                </Button>
                <Button variant="outline" onClick={handleSignOut}>
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
