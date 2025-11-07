'use client';
import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BrainCircuit, Bed, Stethoscope, Calendar, Pill, Video, FolderArchive,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarInset, SidebarTrigger
} from '@/components/ui/sidebar';
import { placeholderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';

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

  return (
    <header className="sticky top-0 z-10 flex h-[57px] items-center gap-1 border-b bg-background/80 px-4 backdrop-blur-sm">
      <SidebarTrigger className="sm:hidden" />
      <div className="flex-1" />
      <h1 className="font-headline text-xl font-semibold sm:hidden text-primary">MedVerseAI</h1>
      <div className="flex-1" />
      <Avatar>
        <AvatarImage src={userAvatar?.imageUrl} data-ai-hint="person face" />
        <AvatarFallback>AK</AvatarFallback>
      </Avatar>
    </header>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

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
