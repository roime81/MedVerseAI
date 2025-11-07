'use client';
import * as React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  BrainCircuit, Bed, Stethoscope, Calendar, Pill, Video, FolderArchive, LogOut,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarInset, SidebarTrigger
} from '@/components/ui/sidebar';
import { placeholderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { useUser } from '@/firebase';
import { signOut } from 'firebase/auth';
import { useAuth } from '@/firebase';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const navItems = [
  { href: '/', label: 'Bed Management', icon: Bed, tooltip: 'Bed Management' },
  { href: '/summarize', label: 'Record Summary', icon: Stethoscope, tooltip: 'Record Summary' },
  { href: '/schedule', label: 'Scheduling', icon: Calendar, tooltip: 'Scheduling' },
  { href: '/medications', label: 'Medication', icon: Pill, tooltip: 'Medication' },
  { href: '/telehealth', label: 'Telehealth', icon: Video, tooltip: 'Telehealth' },
  { href: '/imaging', label: 'Imaging Archive', icon: FolderArchive, tooltip: 'Imaging Archive' },
];

function AppHeader() {
  const userAvatar = placeholderImages.find(p => p.id === 'user-avatar');
  const { user } = useUser();
  const auth = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };


  return (
    <header className="sticky top-0 z-10 flex h-[57px] items-center gap-1 border-b bg-background/80 px-4 backdrop-blur-sm">
      <SidebarTrigger className="sm:hidden" />
      <div className="flex-1" />
      <h1 className="font-headline text-xl font-semibold sm:hidden text-primary">MedVerseAI</h1>
      <div className="flex-1" />
       <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="cursor-pointer">
            <AvatarImage src={userAvatar?.imageUrl} data-ai-hint="person face" />
            <AvatarFallback>{user?.email?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
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
  const { user, isUserLoading } = useUser();

  React.useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || !user) {
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
                  tooltip={item.tooltip}
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
