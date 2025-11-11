'use client';

import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { signOut } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Bell, LogOut, User as UserIcon, Settings, BarChart3, Calendar, LayoutDashboard, Briefcase, Users } from 'lucide-react';
import { useAuth } from '@/firebase';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';


const navItems = [
    { href: '/dashboard/physician', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/dashboard/patient-360', icon: Users, label: 'Patients' },
    { href: '#', icon: Calendar, label: 'Appointments' },
    { href: '#', icon: Briefcase, label: 'Tasks' },
    { href: '#', icon: BarChart3, label: 'Reports' },
    { href: '#', icon: Settings, label: 'Settings' },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const auth = useAuth();
  const pathname = usePathname();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  const handleSignOut = () => {
    signOut(auth).then(() => {
      router.push('/login');
    });
  };

  if (isUserLoading || !user) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full bg-background font-sans">
      <aside className="w-64 flex-shrink-0 border-r bg-card p-6">
          <div className="flex flex-col h-full">
              <div className="font-bold font-grotesk text-2xl mb-10">
                  <span className="text-white">MedVerseAI</span>
              </div>
              <nav className="flex flex-col gap-2">
                  {navItems.map((item) => (
                      <Link key={item.label} href={item.href}>
                          <Button 
                              variant={pathname === item.href ? 'secondary' : 'ghost'} 
                              className="w-full justify-start"
                          >
                              <item.icon className="mr-3 h-5 w-5" />
                              {item.label}
                          </Button>
                      </Link>
                  ))}
              </nav>
              <div className="mt-auto">
                   <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                            <AvatarImage src={user?.photoURL || ''} alt={user?.displayName || ''} />
                            <AvatarFallback>{user?.displayName?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-semibold text-sm text-white">{user?.displayName}</p>
                            <p className="text-xs text-muted-foreground">{user?.email}</p>
                        </div>
                    </div>
              </div>
          </div>
      </aside>
      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-40 flex h-20 items-center justify-between gap-4 border-b bg-card px-8">
            <div>
                {/* This could be a dynamic title based on the page */}
            </div>
            <div className="flex items-center gap-4">
                <div className="relative w-full max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                    placeholder="Search anything..."
                    className="w-full rounded-full bg-background pl-10 border-transparent focus:border-primary focus:ring-primary"
                    />
                </div>
                <Button variant="ghost" size="icon" className="rounded-full">
                    <Bell className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full" onClick={handleSignOut}>
                    <LogOut className="h-5 w-5" />
                </Button>
            </div>
        </header>
        <main className="flex-1 p-8 overflow-y-auto">
            {children}
        </main>
      </div>
    </div>
  );
}
