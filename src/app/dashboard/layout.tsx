
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
    Search,
    ClipboardCheck,
    BadgeCheck,
    UserCog,
    Database,
} from 'lucide-react';
import { Logo } from '@/components/core/logo';
import { doc, getDoc } from 'firebase/firestore';
import type { User as AppUser } from '@/lib/schemas';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

// Explicit mapping for admin department paths
const adminDepartmentPaths: { [key: string]: string } = {
  'System': '/dashboard/admin/system',
  'HR/Credentialing': '/dashboard/admin/hr-credentialing',
  'Medical Affairs/Clinical Gov': '/dashboard/admin/medical-affairs-clinical-gov',
  'Department Head': '/dashboard/admin/department-head',
  'IT/IAM': '/dashboard/admin/it-iam',
  'Cybersecurity': '/dashboard/admin/cybersecurity',
  'HIS/EMR': '/dashboard/admin/his-emr',
  'Compliance/Audit': '/dashboard/admin/compliance-audit',
};

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
            if (department && adminDepartmentPaths[department]) {
                const departmentPath = adminDepartmentPaths[department];
                const departmentLabel = department; // Keep the full name for display
                
                // Special case for System Admin's comprehensive nav
                if (department === 'System') {
                     return [
                        { href: "/dashboard/admin/system", label: 'Access Management', icon: Home },
                        { href: "/dashboard/admin/hr-credentialing", label: "HR & Credentialing", icon: UserCog },
                        { href: "/dashboard/admin-directory", label: "Admin Directory", icon: Shield },
                        { href: "/dashboard/directory", label: "User Directory", icon: Database },
                    ];
                }

                // Generic case for other admins
                const specificAdminNav = { href: departmentPath, label: `${departmentLabel} Dashboard`, icon: Shield };
                return [specificAdminNav, ...baseNav];
            }
            // Fallback for admin with no/unknown department
            return [{ href: "/dashboard/admin/system", label: "Admin Overview", icon: Shield }, ...baseNav];
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

  const isSuperAdmin = appUser?.department === 'System';

  return (
    <div className="flex h-screen w-full font-sans bg-slate-50">
      <aside className="w-64 flex flex-col border-r bg-white text-foreground">
        <div className="p-4 border-b h-[65px] flex items-center">
            <Logo variant="light" isSuperAdmin={isSuperAdmin} />
        </div>
        <nav className="flex-1 p-4 space-y-2">
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
                            <Icon className={cn("mr-3 h-5 w-5", isActive ? "text-primary": "text-muted-foreground")} />
                            {item.label}
                        </Link>
                    </Button>
                )
            })}
        </nav>
      </aside>
      
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-[65px] items-center justify-between border-b bg-white px-6">
            <div className="flex-1">
                 <div className="relative w-full max-w-md">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input placeholder="Search people, roles, emails, staff ID..." className="pl-10 bg-slate-100 border-slate-200" />
                </div>
            </div>
            <div className="flex items-center gap-4">
                <div className="text-right">
                    <p className="text-sm font-semibold">{appUser.displayName}</p>
                    <p className="text-xs text-muted-foreground">{appUser.email}</p>
                </div>
                {appUser.department && <Badge variant="outline">{appUser.department === 'System' ? 'Super Admin' : appUser.department}</Badge>}
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
