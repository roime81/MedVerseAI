'use client';
import { useAuth } from '@/hooks/use-mock-auth';
import AdminDashboard from './admin-dashboard';
import PhysicianDashboard from './physician-dashboard';
import NurseDashboard from './nurse-dashboard';
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-4 w-3/4" />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Skeleton className="h-96" />
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Or a message encouraging login
  }

  switch (user.role) {
    case 'Admin':
      return <AdminDashboard />;
    case 'Physician':
      return <PhysicianDashboard />;
    case 'Nurse':
      return <NurseDashboard />;
    default:
      return <PhysicianDashboard />; // Default to physician view
  }
}
