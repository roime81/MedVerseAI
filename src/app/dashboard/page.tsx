'use client';

import { useUser } from '@/firebase';
import { redirect } from 'next/navigation';
import PhysicianDashboard from '@/components/dashboard/physician-dashboard';
import AdminDashboard from '@/components/dashboard/admin-dashboard';
import { doc } from 'firebase/firestore';
import { useFirestore, useDoc } from '@/firebase';
import { useEffect } from 'react';

export default function DashboardPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  
  // Create a memoized reference to the user document
  const userDocRef = user ? doc(firestore, 'users', user.uid) : null;
  const { data: userProfile, isLoading: isProfileLoading } = useDoc(userDocRef);

  useEffect(() => {
    // If the auth state is resolved and there's no user, redirect to login
    if (!isUserLoading && !user) {
      redirect('/');
    }
  }, [user, isUserLoading]);

  // Combined loading state
  const isLoading = isUserLoading || isProfileLoading;

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading dashboard...</div>;
  }
  
  // If loading is finished and there's still no user, redirect (or render null as redirect will happen)
  if (!user) {
    return null;
  }
  
  const role = userProfile?.role;

  switch (role) {
    case 'physician':
      return <PhysicianDashboard />;
    case 'admin':
      return <AdminDashboard />;
    // Add cases for other roles here as they are built
    // case 'nurse':
    //   return <NurseDashboard />;
    // etc.
    default:
      // If role is not defined or doesn't match, default to a view or show an error/message
      // Defaulting to physician for now, but could be a generic dashboard or access-denied page.
      if (role) {
         console.warn(`No dashboard found for role: ${role}. Defaulting to Physician view.`);
      }
      return <PhysicianDashboard />;
  }
}
