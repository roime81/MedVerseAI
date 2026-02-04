'use client';

import { useUser } from '@/firebase';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react';
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
    Sparkles,
} from 'lucide-react';
import { Logo } from '@/components/core/logo';
import { doc, getDoc } from 'firebase/firestore';
import type { User as AppUser } from '@/lib/schemas';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { AiChatDialog } from '@/components/dashboard/ai/ai-chat-dialog';


const getNavItems = (appUser: AppUser | null) => {
    if (!appUser) return [];

    const role = appUser.role;
    const department = appUser.department;
    const aiAssistantItem = { id: "ai-assistant", label: "AI Assistant", icon: Sparkles };

    if (role === 'admin') {
        if (department === 'System' || department === 'HR/Credentialing' || department === 'Medical Affairs/Clinical Gov' || department === 'Department Head' || department === 'IT/IAM' || department === 'Cybersecurity' || department === 'HIS/EMR' || department === 'Compliance/Audit') {
            let homePath = '/dashboard/directory'; // Default for admins
             if (department === 'System') homePath = '/dashboard/admin/system';
             if (department === 'HR/Credentialing') homePath = '/dashboard/hr';
             if (department === 'Medical Affairs/Clinical Gov') homePath = '/dashboard/medical-affairs';
             if (department === 'Department Head') homePath = '/dashboard/hod';
             if (department === 'IT/IAM') homePath = '/dashboard/admin/it';
             if (department === 'Cybersecurity') homePath = '/dashboard/admin/cybersecurity';
             if (department === 'HIS/EMR') homePath = '/dashboard/admin/his-emr';
             if (department === 'Compliance/Audit') homePath = '/dashboard/admin/compliance';


            return [
                { href: homePath, label: "Home / Overview", icon: Home },
                { href: "/dashboard/directory", label: "User Directory", icon: Users },
                aiAssistantItem,
                { href: "#", label: "Requests & Approvals", icon: FileClock },
                { href: "#", label: "Escalations", icon: FileWarning },
                { href: "#", label: "Monitoring & Alerts", icon: Bell },
                { href: "#", label: "Reports", icon: BarChart },
            ];
        }
    }
    
    switch(role) {
        case 'physician':
            return [ { href: "/dashboard/physician", label: "Clinician Workbench", icon: Stethoscope }, { href: "/dashboard/directory", label: "User Directory", icon: Users }, aiAssistantItem];
        case 'nurse':
            return [ { href: "/dashboard/nurse", label: "Nurse Station", icon: Stethoscope }, { href: "/dashboard/directory", label: "User Directory", icon: Users }, aiAssistantItem];
        case 'radiology':
            return [{ href: "/dashboard/radiology", label: "Radiology Worklist", icon: Scan }, { href: "/dashboard/directory", label: "User Directory", icon: Users }, aiAssistantItem];
        case 'lab':
             return [{ href: "/dashboard/lab", label: "Lab Worklist", icon: FlaskConical }, { href: "/dashboard/directory", label: "User Directory", icon: Users }, aiAssistantItem];
        case 'billing':
             return [{ href: "/dashboard/billing", label: "Billing Dashboard", icon: CreditCard }, { href: "/dashboard/directory", label: "User Directory", icon: Users }, aiAssistantItem];
        case 'pharmacist':
            return [{ href: "/dashboard/pharmacist", label: "Pharmacy Queue", icon: Pill }, { href: "/dashboard/directory", label: "User Directory", icon: Users }, aiAssistantItem];
        case 'admin':
             return [{ href: "/dashboard/directory", label: "User Directory", icon: Users }, aiAssistantItem];
        default:
            return [{ href: "/dashboard/patient-portal", label: "Patient Portal", icon: Home }, aiAssistantItem];
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
  const [isRedirecting, setIsRedirecting] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    if (isUserLoading || !firestore) return;
    
    if (!user) {
      router.replace('/login');
      return;
    }

    const fetchUserAndRedirect = async (firebaseUser: FirebaseUser) => {
        setIsAppUserLoading(true);
        try {
            const userDocRef = doc(firestore, 'users', firebaseUser.uid);
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {
                const userData = userDoc.data() as AppUser;
                setAppUser(userData);

                const currentPath = pathname;
                
                let targetPath;

                // Explicit email checks for special admins
                if (firebaseUser.email === 'super.admin@medverse.com') {
                    targetPath = '/dashboard/admin/system';
                } else if (firebaseUser.email === 'hr.credentialing@medverse.com') {
                    targetPath = '/dashboard/hr';
                } else if (firebaseUser.email === 'medical.affairs@medverse.com') {
                    targetPath = '/dashboard/medical-affairs';
                } else if (firebaseUser.email === 'department.head@medverse.com') {
                    targetPath = '/dashboard/hod';
                } else if (firebaseUser.email === 'it.iam@medverse.com') {
                    targetPath = '/dashboard/admin/it';
                } else if (firebaseUser.email === 'cybersecurity@medverse.com') {
                    targetPath = '/dashboard/admin/cybersecurity';
                } else if (firebaseUser.email === 'his.emr@medverse.com') {
                    targetPath = '/dashboard/admin/his-emr';
                } else if (firebaseUser.email === 'compliance.audit@medverse.com') {
                    targetPath = '/dashboard/admin/compliance';
                } else {
                    // Role-based routing for everyone else
                    switch (userData.role) {
                        case 'admin':
                            targetPath = '/dashboard/directory';
                            break;
                        case 'physician':
                            targetPath = '/dashboard/physician';
                            break;
                        case 'nurse':
                            targetPath = '/dashboard/nurse';
                            break;
                        case 'radiology':
                            targetPath = '/dashboard/radiology';
                            break;
                        case 'lab':
                            targetPath = '/dashboard/lab';
                            break;
                        case 'billing':
                            targetPath = '/dashboard/billing';
                            break;
                        case 'pharmacist':
                            targetPath = '/dashboard/pharmacist';
                            break;
                        default:
                            targetPath = '/dashboard/patient-portal';
                            break;
                    }
                }
                
                if (currentPath === '/dashboard' || currentPath === '/dashboard/') {
                    router.replace(targetPath);
                } else {
                    setIsRedirecting(false);
                }

            } else {
                console.error("Could not find user document in Firestore.");
                if (auth) await signOut(auth);
                router.replace('/login');
            }
        } catch (error) {
            console.error("Error fetching user document:", error);
            if (auth) await signOut(auth);
            router.replace('/login');
        } finally {
            setIsAppUserLoading(false);
        }
    };

    if (user) {
        fetchUserAndRedirect(user);
    } else {
        setIsAppUserLoading(false);
        setIsRedirecting(false);
    }
  }, [user, isUserLoading, firestore, auth, router, pathname]);
  
  useEffect(() => {
    // If the path is not the base dashboard path, we can stop the redirecting state
    if (pathname !== '/dashboard' && pathname !== '/dashboard/') {
      setIsRedirecting(false);
    }
  }, [pathname]);

  const handleSignOut = async () => {
    if (!auth) return;
    await signOut(auth);
    router.push('/login');
  };

  const navItems = useMemo(() => getNavItems(appUser), [appUser]);
  
  const isSpecialAdmin = appUser?.role === 'admin' && 
    (appUser?.department === 'System' || 
     appUser?.department === 'HR/Credentialing' || 
     appUser?.department === 'Medical Affairs/Clinical Gov' ||
     appUser?.department === 'Department Head' ||
     appUser?.department === 'IT/IAM' ||
     appUser?.department === 'Cybersecurity' ||
     appUser?.department === 'Compliance/Audit' ||
     appUser?.department === 'HIS/EMR');
  
  const isSuperAdmin = appUser?.department === 'System';

  if (isUserLoading || isAppUserLoading || isRedirecting || !appUser) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <>
    <div className={cn("flex h-screen w-full font-sans", isSpecialAdmin ? "bg-[#F8F9FA]" : "bg-slate-100")}>
      <aside className={cn("flex flex-col border-r text-foreground w-64", isSpecialAdmin ? "bg-gray-800 text-gray-300" : "bg-white")}>
        <div className={cn("p-4 border-b h-[65px] flex items-center", isSpecialAdmin ? "border-gray-700" : "border-border")}>
            <Logo variant={isSpecialAdmin ? 'dark' : 'light'} isSuperAdmin={isSuperAdmin} appUser={appUser} />
        </div>
        <nav className="flex-1 p-2 space-y-1">
            {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = item.href ? pathname === item.href : false;

                if (item.id === 'ai-assistant') {
                    return (
                        <Button
                            key={item.label}
                            variant={'ghost'}
                            className={cn("w-full justify-start text-sm", 
                               isSpecialAdmin 
                               ? "text-gray-400 hover:bg-gray-700 hover:text-white"
                               : "text-muted-foreground hover:bg-slate-100 hover:text-foreground"
                            )}
                            onClick={() => setIsChatOpen(true)}
                        >
                            <Icon className={cn("mr-3 h-5 w-5", 
                               isSpecialAdmin
                               ? "text-gray-400"
                               : "text-muted-foreground"
                            )} />
                            {item.label}
                        </Button>
                    )
                }

                return (
                    <Button
                        key={item.label}
                        variant={isActive ? 'secondary' : 'ghost'}
                        className={cn("w-full justify-start text-sm", 
                           isSpecialAdmin 
                           ? (isActive ? "bg-gray-700 text-white" : "text-gray-400 hover:bg-gray-700 hover:text-white")
                           : (isActive ? "bg-primary/10 text-primary font-semibold" : "text-muted-foreground hover:bg-slate-100 hover:text-foreground")
                        )}
                        asChild
                    >
                        <Link href={item.href || '#'}>
                            <Icon className={cn("mr-3 h-5 w-5", 
                               isSpecialAdmin
                               ? (isActive ? "text-white" : "text-gray-400")
                               : (isActive ? "text-primary": "text-muted-foreground")
                            )} />
                            {item.label}
                        </Link>
                    </Button>
                )
            })}
             {isSpecialAdmin && (
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
        <header className={cn("flex h-[65px] items-center justify-between border-b px-6", isSpecialAdmin ? "bg-white" : "bg-white")}>
            <div className="flex-1">
                 <div className="relative w-full max-w-md">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input placeholder="Search people, roles, emails, staff ID..." className={cn("pl-10 border-slate-200", isSpecialAdmin ? "bg-slate-100" : "bg-slate-100")}/>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <div className="text-right">
                    <p className="text-sm font-semibold text-foreground">{appUser.displayName}</p>
                    <p className="text-xs text-muted-foreground">{appUser.email}</p>
                </div>
                 <Badge variant={isSpecialAdmin ? 'default' : 'outline'} className={cn(isSpecialAdmin && 'bg-gray-800 text-white')}>
                    {appUser.department === 'Department Head' ? 'HOD' : appUser.department}
                 </Badge>
                <Button variant="ghost" size="icon">
                    <Bell className="h-5 w-5" />
                </Button>
                 {isSpecialAdmin &&
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
    <AiChatDialog open={isChatOpen} onOpenChange={setIsChatOpen} />
    </>
  );
}
