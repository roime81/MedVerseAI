'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { useUser, useFirestore } from '@/firebase';

export default function DashboardRedirect() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();

  useEffect(() => {
    if (isUserLoading) return;

    if (!user) {
      router.push('/login');
      return;
    }
    
    if (firestore && user) {
        const fetchUserRole = async () => {
        const userRef = doc(firestore, 'users', user.uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          const role = userData.role;
          if (role) {
            router.push(`/dashboard/${role}`);
          } else {
            console.error('User role not found.');
            router.push('/login');
          }
        } else {
            console.log('User document does not exist yet, waiting for creation.');
        }
      };

      fetchUserRole();
    }
  }, [user, isUserLoading, firestore, router]);

  return (
    <div className="flex h-full items-center justify-center">
      <p>Loading your dashboard...</p>
    </div>
  );
}
