
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { useUser, useFirestore } from '@/firebase';
import { Loader2 } from 'lucide-react';
import type { User as AppUser } from '@/lib/schemas';

const formatDepartmentToSlug = (department: string) => {
    // This function must be consistent with the one in layout.tsx
    if (!department) return '';
    if (department === 'System') return 'system';
    return department.toLowerCase().replace(/[\s/]+/g, '-');
}

export default function DashboardRedirect() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();

  useEffect(() => {
    if (isUserLoading || !firestore) {
      return; // Wait until Firebase is ready
    }

    if (!user) {
      router.push('/login');
      return;
    }

    const fetchUserRoleAndRedirect = async () => {
      try {
        const userDocRef = doc(firestore, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data() as AppUser;
          const role = userData.role;
          let path = '/dashboard/directory'; // A safe default

          if (role === 'admin') {
            // ** CRITICAL: Handle Super Admin FIRST **
            if (userData.department === 'System') {
              path = '/dashboard/admin/system';
            } else if (userData.department) {
              const departmentSlug = formatDepartmentToSlug(userData.department);
              path = `/dashboard/admin/${departmentSlug}`;
            }
            // If admin has no department, they will go to the default '/dashboard/directory'
          } else {
            // Handle non-admin roles
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
                    // This will catch patient portal users or any other role without a specific dashboard
                    path = '/dashboard/patient-portal';
                    break;
            }
          }
          
          router.replace(path);

        } else {
          console.error("User document not found in Firestore. Redirecting to login.");
          // Attempt to sign out the user if their firestore doc is missing.
          // This can happen if the auth user was created but the firestore doc failed.
          router.push('/login');
        }
      } catch (error) {
          console.error("Error fetching user data:", error);
          router.push('/login');
      }
    };

    fetchUserRoleAndRedirect();
  }, [user, isUserLoading, firestore, router]);

  return (
    <div className="flex h-full w-full items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Loading your dashboard...</p>
      </div>
    </div>
  );
}

