
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
  { href: '/orders', icon: FileText, label: 'Orders', roles: [] },
  { href: '/medications', icon: Pill, label: 'Medications', roles: [] },
  { href: '/summarize', icon: BrainCircuit, label: 'Summarize', roles: [] },
  { href: '/imaging', icon: Hospital, label: 'Imaging', roles: [] },
  { href: '/schedule', icon: CalendarDays, label: 'Scheduling', roles: [] },
  { href: '/telehealth', icon: Video, label: 'Telehealth', roles: [] },
  { href: '/billing', icon: CreditCard, label: 'Billing', roles: [] },
  { href: '/analytics', icon: BarChart3, label: 'Analytics', roles: [] },
  { href: '/admin', icon: Settings, label: 'Admin', roles: [] },
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
    if (item.href === '/') return true; // Always show dashboard link initially
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
          {menuItems.map((item) => {
            const isDashboard = item.href === '/';
            const isPhysician = user?.role === 'Physician';
            
            // For physicians, only show the dashboard
            if (isPhysician && !isDashboard) {
                return null;
            }

            const label = isDashboard && isPhysician && user.name
              ? `${user.name.split(' ').slice(0, 2).join(' ')}'s Dashboard`
              : item.label;

            return (
                <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                    onClick={() => router.push(item.href)}
                    isActive={pathname === item.href}
                    icon={<item.icon />}
                    tooltip={label}
                >
                    <span>{label}</span>
                </SidebarMenuButton>
                </SidebarMenuItem>
            );
          })}
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
