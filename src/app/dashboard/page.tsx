
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { useUser, useFirestore } from '@/firebase';
import { Loader2 } from 'lucide-react';
import type { User as AppUser } from '@/lib/schemas';

// Helper to convert department name to a URL slug
const departmentToPath = (department: string): string => {
  return department.toLowerCase().replace(/[\s/&]+/g, '-');
};

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

        let path = '';

        if (role === 'admin' && department) {
            if (department === 'System') {
                path = '/dashboard/super-admin';
            } else {
                // Generate path from department name
                path = `/dashboard/admin/${departmentToPath(department)}`;
            }
        } else {
          switch (role) {
            case 'physician':
              path = '/dashboard/physician';
              break;
            case 'nurse':
              path = '/dashboard/nurse';
              break;
            case 'radiology':
              path = '/dashboard/radiology';
              break;
            case 'lab':
              path = '/dashboard/lab';
              break;
            case 'billing':
              path = '/dashboard/billing';
              break;
            case 'pharmacist':
              path = '/dashboard/pharmacist';
              break;
            default:
              path = '/dashboard/directory';
              break;
          }
        }
        
        if (path) {
          router.push(path);
        } else {
          router.push('/dashboard/directory');
        }

      } else {
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
