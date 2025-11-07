'use client';
import { useAuth } from '@/hooks/use-mock-auth';
import AdminDashboard from './admin-dashboard';
import PhysicianDashboard from './physician-dashboard';
import NurseDashboard from './nurse-dashboard';
import { Skeleton } from '@/components/ui/skeleton';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [isLoading, user, router]);

  if (isLoading || !user) {
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

  switch (user.role) {
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
