
'use client';
import { useUser, useDoc, useFirebase } from '@/firebase';
import AdminDashboard from './admin-dashboard';
import PhysicianDashboard from './physician-dashboard';
import NurseDashboard from './nurse-dashboard';
import { Skeleton } from '@/components/ui/skeleton';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { doc } from 'firebase/firestore';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";


const PlaceholderDashboard = ({ role }: { role: string }) => (
    <div className="space-y-6 animate-fade-in">
        <header>
            <h1 className="font-headline text-3xl font-bold tracking-tight">
            {role} Dashboard
            </h1>
            <p className="text-muted-foreground">
            Welcome to your dedicated workspace.
            </p>
        </header>
        <Card>
            <CardHeader>
            <CardTitle>{role} Workspace</CardTitle>
            <CardDescription>This dashboard is currently under construction.</CardDescription>
            </CardHeader>
            <CardContent>
            <p className="text-muted-foreground">
                Role-specific components and data visualizations will be available here soon.
            </p>
            </CardContent>
        </Card>
    </div>
);


export default function Home() {
  const { user, isUserLoading } = useUser();
  const { firestore } = useFirebase();
  const router = useRouter();

  const profileRef = useMemo(() => {
    if (!user?.email || !firestore) return null;
    return doc(firestore, 'staffProfiles', user.email);
  }, [user?.email, firestore]);

  const { data: profile, isLoading: isProfileLoading } = useDoc(profileRef);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [isUserLoading, user, router]);

  const isLoading = isUserLoading || isProfileLoading;

  if (isLoading || !user || !profile) {
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

  const role = (profile as any)?.role || 'Physician';

  switch (role) {
    case 'Admin':
      return <AdminDashboard />;
    case 'Physician':
      return <PhysicianDashboard />;
    case 'Nurse':
      return <NurseDashboard />;
    case 'Business':
    case 'Lab':
    case 'Radiology':
    case 'Pharmacist':
    case 'Scheduler':
    case 'Billing':
      return <PlaceholderDashboard role={role} />;
    default:
      // Default to the Admin dashboard for other roles for now
      return <AdminDashboard />;
  }
}

    