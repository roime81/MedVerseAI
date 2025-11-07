'use client';
import * as React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  BrainCircuit,
  LayoutDashboard,
  User,
  ClipboardList,
  Pill,
  Calendar,
  Banknote,
  AreaChart,
  Shield,
  LogOut,
  Search,
  ChevronDown,
  Building,
  HeartPulse,
  Video,
  FileImage,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { placeholderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { useAuth, User as AuthUser } from '@/hooks/use-mock-auth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';

const navConfig = {
  Admin: [
    { href: '/', label: 'KPI Dashboard', icon: LayoutDashboard },
    { href: '/analytics', label: 'Analytics', icon: AreaChart },
    { href: '/billing', label: 'Billing', icon: Banknote },
    { href: '/admin', label: 'System Admin', icon: Shield },
  ],
  Physician: [
    { href: '/', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/patient-360', label: 'Patient 360', icon: User },
    { href: '/orders', label: 'Orders', icon: ClipboardList },
    { href: '/medications', label: 'Medications', icon: Pill },
    { href: '/summarize', label: 'Summarization', icon: BrainCircuit },
    { href: '/schedule', label: 'Scheduling', icon: Calendar },
    { href: '/telehealth', label: 'Telehealth', icon: Video },
    { href: '/imaging', label: 'Imaging', icon: FileImage },
  ],
  Nurse: [
    { href: '/', label: 'My Tasks', icon: ClipboardList },
    { href: '/patient-360', label: 'Patient 360', icon: User },
    { href: '/medications', label: 'MAR', icon: Pill },
    { href: '/vitals', label: 'Vitals', icon: HeartPulse },
    { href: '/schedule', label: 'Schedule', icon: Calendar },
  ],
  Default: [
    { href: '/', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/patient-360', label: 'Patient 360', icon: User },
    { href: '/orders', label: 'Orders', icon: ClipboardList },
    { href: '/medications', label: 'Medications', icon: Pill },
    { href: '/schedule', label: 'Scheduling', icon: Calendar },
    { href: '/billing', label: 'Billing', icon: Banknote },
    { href: '/analytics', label: 'Analytics', icon: AreaChart },
  ]
};

function getNavItems(user: AuthUser | null) {
    if (!user) return navConfig.Default;
    let items = navConfig[user.role as keyof typeof navConfig] || navConfig.Default;
    if (user.isAdmin) {
        const adminItem = { href: '/admin', label: 'Admin', icon: Shield };
        if (!items.find(i => i.href === '/admin')) {
            items = [...items, adminItem];
        }
    }
    return items;
}


function AppHeader() {
  const userAvatar = placeholderImages.find(p => p.id === 'user-avatar');
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-10 flex h-[57px] items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm">
      <SidebarTrigger className="sm:hidden" />
      <div className="relative flex-1 md:grow-0">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search Patient..."
          className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]"
        />
      </div>
      <div className="flex flex-1 items-center justify-end gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="flex items-center gap-2"
            >
              <Building className="h-4 w-4" />
              <span>City General</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Select Facility</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>City General Hospital</DropdownMenuItem>
            <DropdownMenuItem>St. Jude's Medical Center</DropdownMenuItem>
            <DropdownMenuItem>Northside Regional</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="cursor-pointer h-9 w-9">
              <AvatarImage src={userAvatar?.imageUrl} data-ai-hint="person face" />
              <AvatarFallback>{user?.email?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
             <DropdownMenuLabel>{user?.name}</DropdownMenuLabel>
             <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">{user?.role}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const navItems = getNavItems(user);

  React.useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <BrainCircuit className="size-12 text-primary animate-pulse" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider defaultOpen>
      <Sidebar variant="sidebar" collapsible="icon">
        <SidebarHeader>
          <Link href="/" className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="shrink-0" asChild>
              <BrainCircuit className="size-6 text-primary" />
            </Button>
            <span className="font-headline text-xl font-bold text-primary">MedVerseAI</span>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))}
                  tooltip={item.label}
                >
                  <Link href={item.href}>
                    <item.icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <AppHeader />
        <main className="p-4 sm:p-6 md:p-8">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
