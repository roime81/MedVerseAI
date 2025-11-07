'use client';

import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { redirect } from 'next/navigation';
import PhysicianDashboard from '@/components/dashboard/physician-dashboard';
import AdminDashboard from '@/components/dashboard/admin-dashboard';
import { doc } from 'firebase/firestore';
import { useEffect } from 'react';

export default function DashboardPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  // The user profile won't be available until the user object is.
  // This reference depends on user.uid.
  const userDocRef = useMemoFirebase(
    () => (user ? doc(firestore, 'users', user.uid) : null),
    [firestore, user]
  );
  
  const { data: userProfile, isLoading: isProfileLoading } = useDoc(userDocRef);

  useEffect(() => {
    // If auth state is resolved and there's no user, it's safe to redirect.
    if (!isUserLoading && !user) {
      redirect('/');
    }
  }, [user, isUserLoading]);

  // The overall loading state depends on both auth and Firestore profile fetch.
  const isLoading = isUserLoading || isProfileLoading;

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading dashboard...</div>;
  }
  
  // If loading is finished but there's no user, redirect will have been triggered.
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
      // If we are done loading but the role is still undefined, it means the 
      // user document might be missing in Firestore.
      if (!role) {
         console.error(`No user profile/role found in Firestore for UID: ${user.uid}.`);
         return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <h1 className="text-2xl font-bold">Configuration Error</h1>
                <p>Your user profile could not be found. Please contact an administrator.</p>
            </div>
         );
      }
      // A role exists, but we don't have a specific dashboard for it.
      console.warn(`No dashboard component found for role: "${role}". Defaulting to Physician view.`);
      return <PhysicianDashboard />;
  }
}
