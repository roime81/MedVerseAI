'use client';
import { useUser } from '@/firebase';
import AdminDashboard from './admin-dashboard';
import PhysicianDashboard from './physician-dashboard';
import NurseDashboard from './nurse-dashboard';
import { Skeleton } from '@/components/ui/skeleton';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const emailToRole: { [key: string]: string } = {
    'admin@medverse.com': 'Admin',
    'physician@medverse.com': 'Physician',
    'nurse@medverse.com': 'Nurse',
    'roimepuniran@gmail.com': 'Admin',
};

export default function Home() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [isUserLoading, user, router]);

  if (isUserLoading || !user) {
    return (
      <div className="space-y-6">
        <header>
          <Skeleton className="h-8 w-1/2" />
          <Skeleton className="mt-2 h-4 w-3/4" />
        </header>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-32 rounded-lg" />
          <Skeleton className="h-32 rounded-lg" />
          <Skeleton className="h-32 rounded-lg" />
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Skeleton className="h-96 rounded-lg" />
          <Skeleton className="h-96 rounded-lg" />
        </div>
      </div>
    );
  }

  const role = user.email ? emailToRole[user.email] || 'Physician' : 'Physician';

  switch (role) {
    case 'Admin':
      return <AdminDashboard />;
    case 'Physician':
      return <PhysicianDashboard />;
    case 'Nurse':
      return <NurseDashboard />;
    default:
      // Default to the Admin dashboard for other roles for now
      return <AdminDashboard />;
  }
}
