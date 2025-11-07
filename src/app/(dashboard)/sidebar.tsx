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
  User,
  Settings,
  LogOut,
  CalendarDays,
  Scan,
} from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-mock-auth';

const menuItems = [
  { href: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/patient-360', icon: Scan, label: 'Patient 360' },
  { href: '/orders', icon: FileText, label: 'Orders' },
  { href: '/medications', icon: Pill, label: 'Medications' },
  { href: '/schedule', icon: CalendarDays, label: 'Scheduling' },
  { href: '/billing', icon: CreditCard, label: 'Billing' },
  { href: '/analytics', icon: BarChart3, label: 'Analytics' },
  { href: '/admin', icon: Settings, label: 'Admin' },
];

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();
  const { state } = useSidebar();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

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
