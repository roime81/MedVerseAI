
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { useUser, useFirestore } from '@/firebase';
import { Loader2 } from 'lucide-react';
import type { User as AppUser } from '@/lib/schemas';

export default function DashboardRedirect() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();

  useEffect(() => {
    if (isUserLoading || !firestore) return;

    if (!user) {
      router.push('/login');
      return;
    }

    const fetchUserRoleAndRedirect = async () => {
      const userDocRef = doc(firestore, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data() as AppUser;
        const role = userData.role;
        const department = userData.department;

        if (role === 'admin') {
            if (department === 'System') {
                router.push('/dashboard/super-admin');
                return;
            }
             if (department === 'Medical Affairs/Clinical Gov') {
                router.push('/dashboard/admin/medical-affairs-clinical-gov');
                return;
            }
            if (department) {
                const departmentPath = department.toLowerCase().replace(/[\s/]+/g, '-');
                router.push(`/dashboard/admin/${departmentPath}`);
                return;
            }
        }

        switch (role) {
          case 'physician':
            router.push('/dashboard/physician');
            break;
          case 'nurse':
            router.push('/dashboard/nurse');
            break;
          case 'admin':
            router.push('/dashboard/admin');
            break;
          case 'radiology':
            router.push('/dashboard/radiology');
            break;
          case 'lab':
            router.push('/dashboard/lab');
            break;
          case 'billing':
            router.push('/dashboard/billing');
            break;
          case 'pharmacist':
            router.push('/dashboard/pharmacist');
            break;
          default:
            // Default redirect for unknown roles
            router.push('/dashboard/physician');
            break;
        }
      } else {
        // Handle case where user document doesn't exist, maybe redirect to an error page or default
        console.error("User document not found in Firestore.");
        router.push('/login');
      }
    };

    fetchUserRoleAndRedirect();
  }, [user, isUserLoading, firestore, router]);

  return (
    <div className="flex h-full items-center justify-center">
      <Loader2 className="mr-2 h-6 w-6 animate-spin" />
      <p>Loading your dashboard...</p>
    </div>
  );
}
