
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
    GitPullRequest,
    AlertCircle,
    Monitor,
    ShieldCheck,
} from 'lucide-react';
import { Logo } from '@/components/core/logo';
import { doc, getDoc } from 'firebase/firestore';
import type { User as AppUser } from '@/lib/schemas';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const formatDepartmentToSlug = (department: string) => {
    if (department === 'System') return 'system';
    return department.toLowerCase().replace(/[\s/]+/g, '-');
}

const getNavItems = (role: string, department?: string) => {

    if (role === 'admin') {
        // Super admin has a unique sidebar
        if (department === 'System') {
            return [
                { href: `/dashboard/admin/system`, label: "Home / Overview", icon: Home, section: 'main' },
                { href: "/dashboard/directory", label: "User Directory", icon: Users, section: 'main' },
                { href: "/dashboard/admin/requests", label: "Requests & Approvals", icon: GitPullRequest, section: 'main' },
                { href: "/dashboard/admin/escalations", label: "Escalations", icon: AlertCircle, section: 'main' },
                { href: "/dashboard/admin/monitoring", label: "Monitoring & Alerts", icon: Monitor, section: 'main' },
                { href: "/dashboard/admin/reports", label: "Reports", icon: FileText, section: 'main' },
                { href: "/dashboard/admin/config", label: "Admins & Config", icon: ShieldCheck, section: 'administration' },
            ];
        }

        // Other admins
        if (department) {
            const departmentSlug = formatDepartmentToSlug(department);
            const departmentNameMap: Record<string, string> = {
                'hr-credentialing': 'HR Dashboard',
            };
            const label = departmentNameMap[departmentSlug] || 'Admin Dashboard';
            return [ { href: `/dashboard/admin/${departmentSlug}`, label: label, icon: Shield, section: 'main' } ];
        }
        return []; // No items if admin has no department
    }
    
    // Non-admin roles
    const baseNav = [
        { href: "/dashboard/directory", label: "User Directory", icon: Users, section: 'main' },
    ];
    
    switch(role) {
        case 'physician':
            return [ { href: "/dashboard/physician", label: "Clinician Workbench", icon: Stethoscope, section: 'main' }, ...baseNav];
        case 'nurse':
            return [ { href: "/dashboard/nurse", label: "Nurse Station", icon: Stethoscope, section: 'main' }, ...baseNav];
        case 'radiology':
            return [{ href: "/dashboard/radiology", label: "Radiology Worklist", icon: Scan, section: 'main' }, ...baseNav];
        case 'lab':
             return [{ href: "/dashboard/lab", label: "Lab Worklist", icon: FlaskConical, section: 'main' }, ...baseNav];
        case 'billing':
             return [{ href: "/dashboard/billing", label: "Billing Dashboard", icon: CreditCard, section: 'main' }, ...baseNav];
        case 'pharmacist':
            return [{ href: "/dashboard/pharmacist", label: "Pharmacy Queue", icon: Pill, section: 'main' }, ...baseNav];
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

  const mainNavItems = navItems.filter(item => item.section === 'main');
  const adminNavItems = navItems.filter(item => item.section === 'administration');


  if (isUserLoading || !user || !appUser) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full font-sans bg-slate-100">
      <aside className={cn("flex flex-col border-r text-foreground", isSuperAdmin ? "w-64 bg-gray-900 text-white" : "w-64 bg-white")}>
        <div className="p-4 border-b h-[65px] flex items-center" style={{ borderColor: isSuperAdmin ? 'rgba(255, 255, 255, 0.1)' : '' }}>
            <Logo variant={isSuperAdmin ? 'dark' : 'light'} isSuperAdmin={isSuperAdmin} />
        </div>
        <nav className="flex-1 p-2 space-y-1">
            {mainNavItems.map((item) => {
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
        {isSuperAdmin && adminNavItems.length > 0 && (
            <div className="p-2">
                <h3 className="px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Administration</h3>
                <nav className="space-y-1">
                     {adminNavItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname.startsWith(item.href);
                        return (
                            <Button
                                key={item.href}
                                variant={isActive ? 'secondary' : 'ghost'}
                                className="w-full justify-start text-sm text-slate-300 hover:bg-slate-800 hover:text-white"
                                asChild
                            >
                                <Link href={item.href}>
                                    <Icon className="mr-3 h-5 w-5 text-slate-400" />
                                    {item.label}
                                </Link>
                            </Button>
                        )
                    })}
                </nav>
            </div>
        )}
      </aside>
      
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className={cn("flex h-[65px] items-center justify-between border-b px-6 bg-white")}>
            <div className="flex-1">
                 <div className="relative w-full max-w-md">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input placeholder="Search people, roles, emails, staff ID..." className={cn("pl-10 border-border bg-slate-100 border-slate-200" )}/>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <div className="text-right">
                    <p className={cn("text-sm font-semibold", "text-foreground")}>{appUser.displayName}</p>
                    <p className="text-xs text-muted-foreground">{appUser.email}</p>
                </div>
                {appUser.department && <Badge variant={"outline"} className={cn(isSuperAdmin && "bg-primary")}>{appUser.role === 'admin' ? appUser.department : appUser.department}</Badge>}
                <Button variant="ghost" size="icon" className={cn(isSuperAdmin && "text-slate-400 hover:text-white hover:bg-slate-800")}>
                    <Bell className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className={cn(isSuperAdmin && "text-slate-400 hover:text-white hover:bg-slate-800")}>
                    <Settings className="h-5 w-5" />
                </Button>
                <Button variant={"outline"} onClick={handleSignOut}>
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
