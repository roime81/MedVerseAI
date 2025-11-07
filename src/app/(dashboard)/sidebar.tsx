
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
import { useAuth } from '@/hooks/use-mock-auth';

const allMenuItems = [
  { href: '/', icon: LayoutDashboard, label: 'Dashboard', roles: ['Admin', 'Physician', 'Nurse'] },
  { href: '/patient-360', icon: Scan, label: 'Patient 360', roles: ['Admin'] },
  { href: '/orders', icon: FileText, label: 'Orders', roles: ['Nurse', 'Admin'] },
  { href: '/medications', icon: Pill, label: 'Medications', roles: ['Nurse', 'Admin'] },
  { href: '/summarize', icon: BrainCircuit, label: 'Summarize', roles: ['Nurse', 'Admin'] },
  { href: '/imaging', icon: Hospital, label: 'Imaging', roles: ['Nurse', 'Admin', 'Radiologist'] },
  { href: '/schedule', icon: CalendarDays, label: 'Scheduling', roles: ['Scheduler', 'Admin', 'Nurse'] },
  { href: '/telehealth', icon: Video, label: 'Telehealth', roles: ['Patient'] },
  { href: '/billing', icon: CreditCard, label: 'Billing', roles: ['Billing', 'Admin'] },
  { href: '/analytics', icon: BarChart3, label: 'Analytics', roles: ['Admin'] },
  { href: '/admin', icon: Settings, label: 'Admin', roles: ['Admin'] },
];

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const { state } = useSidebar();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };
  
  const menuItems = allMenuItems.filter(item => {
    if (!item.roles || !user?.role) return false;
    return item.roles.includes(user.role);
  });


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
