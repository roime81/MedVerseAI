'use client';

import { useUser } from '@/firebase';
import { redirect } from 'next/navigation';
import PhysicianDashboard from '@/components/dashboard/physician-dashboard';
import { doc, getDoc } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { useEffect, useState } from 'react';

export default function DashboardPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      const getUserRole = async () => {
        const userDocRef = doc(firestore, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setRole(userDoc.data().role);
        } else {
          // Handle case where user doc doesn't exist
          setRole('default'); 
        }
        setLoading(false);
      };
      getUserRole();
    } else if (!isUserLoading) {
       redirect('/');
    }
  }, [user, isUserLoading, firestore]);

  if (isUserLoading || loading) {
    return <div>Loading dashboard...</div>;
  }
  
  if (!user) {
    return null;
  }

  switch (role) {
    case 'physician':
      return <PhysicianDashboard />;
    // Add cases for other roles here
    // case 'nurse':
    //   return <NurseDashboard />;
    // case 'radiology':
    //   return <RadiologyDashboard />;
    // case 'lab':
    //   return <LabDashboard />;
    // case 'billing':
    //   return <BillingDashboard />;
    default:
      return <PhysicianDashboard />; // Default to physician for now
  }
}
