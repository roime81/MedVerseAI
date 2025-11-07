
'use client';
import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarContent,
  SidebarFooter,
  useSidebar,
} from '@/components/ui/sidebar';
import {
  BarChart3,
  BrainCircuit,
  CreditCard,
  FileText,
  LayoutDashboard,
  Pill,
  Settings,
  LogOut,
  CalendarDays,
  Scan,
  Video,
  Hospital,
} from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useUser, useAuth as useFirebaseAuth, useDoc, useFirebase, useMemoFirebase } from '@/firebase';
import { signOut } from 'firebase/auth';
import { doc } from 'firebase/firestore';

const allMenuItems = [
  { href: '/', icon: LayoutDashboard, label: 'Dashboard', roles: ['Admin', 'Physician', 'Nurse'] },
  { href: '/patient-360', icon: Scan, label: 'Patient 360', roles: ['Admin'] },
  { href: '/orders', icon: FileText, label: 'Orders', roles: ['Physician'] },
  { href: '/medications', icon: Pill, label: 'Medications', roles: ['Physician', 'Pharmacist'] },
  { href: '/summarize', icon: BrainCircuit, label: 'Summarize', roles: ['Physician'] },
  { href: '/imaging', icon: Hospital, label: 'Imaging', roles: ['Physician', 'Radiologist'] },
  { href: '/schedule', icon: CalendarDays, label: 'Scheduling', roles: ['Scheduler'] },
  { href: '/telehealth', icon: Video, label: 'Telehealth', roles: ['Physician'] },
  { href: '/billing', icon: CreditCard, label: 'Billing', roles: ['Billing'] },
  { href: '/analytics', icon: BarChart3, label: 'Analytics', roles: ['Admin'] },
  { href: '/admin', icon: Settings, label: 'Admin', roles: ['Admin'] },
];

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useUser();
  const auth = useFirebaseAuth();
  const { state } = useSidebar();
  const { firestore } = useFirebase();

  const profileRef = useMemoFirebase(() => {
    if (!user?.email || !firestore) return null;
    return doc(firestore, 'staffProfiles', user.email);
  }, [user?.email, firestore]);

  const { data: profile } = useDoc(profileRef);

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };
  
  const userRole = (profile as any)?.role || 'Patient';

  let menuItems = allMenuItems.filter(item => {
    if (!item.roles || !userRole) return false;
    return item.roles.includes(userRole);
  });

  if (userRole === 'Physician') {
    menuItems = [
        { 
            href: '/', 
            icon: LayoutDashboard, 
            label: `${user?.displayName || 'Physician'}'s Dashboard`, 
            roles: ['Physician'] 
        }
    ];
  }


  return (
    <>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <BrainCircuit className="size-6 text-primary" />
          <div
            className="text-xl font-bold text-primary transition-[transform,opacity] duration-200 ease-in-out"
            style={{
              transform: state === 'collapsed' ? 'translateX(-150%)' : 'none',
              opacity: state === 'collapsed' ? 0 : 1,
            }}
          >
            MedVerseAI
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
            <SidebarMenuButton
                onClick={() => router.push(item.href)}
                isActive={pathname === item.href}
                icon={<item.icon />}
                tooltip={item.label}
            >
                <span>{item.label}</span>
            </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout} icon={<LogOut />}>
              Logout
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </>
  );
}
