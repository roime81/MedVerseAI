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
    
    // Always redirect to the physician dashboard for now
    router.push('/dashboard/physician');

  }, [user, isUserLoading, firestore, router]);

  return (
    <div className="flex h-full items-center justify-center">
      <p>Loading your dashboard...</p>
    </div>
  );
}
