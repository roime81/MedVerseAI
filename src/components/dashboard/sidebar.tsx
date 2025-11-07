
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  User,
  Package,
  Pill,
  Calendar,
  CreditCard,
  BarChart,
  BrainCircuit,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/dashboard/patient-360', icon: User, label: 'Patient 360' },
  { href: '/dashboard/orders', icon: Package, label: 'Orders' },
  { href: '/dashboard/medications', icon: Pill, label: 'Medications' },
  { href: '/dashboard/scheduling', icon: Calendar, label: 'Scheduling' },
  { href: '/dashboard/billing', icon: CreditCard, label: 'Billing' },
  { href: '/dashboard/analytics', icon: BarChart, label: 'Analytics' },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="hidden w-64 flex-col border-r bg-card md:flex">
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold font-grotesk">
          <BrainCircuit className="h-6 w-6 text-primary" />
          <span>MedVerseAI</span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-4">
        <nav className="grid items-start px-4 text-sm font-medium">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
                {
                  'bg-muted text-primary': pathname.startsWith(item.href) && (item.href !== '/dashboard' || pathname === '/dashboard'),
                }
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
