
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
          const department = userData.department;
          let path = '/dashboard/directory'; // A safe default

          if (role === 'admin') {
            if (department === 'System') {
                path = '/dashboard/admin/system';
            } else {
                 // All other admins go to the directory for now
                 path = '/dashboard/directory';
            }
          } else {
            // Handle non-admin roles with specific dashboards
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
                    // This will catch patient portal users or any other role
                    path = '/dashboard/patient-portal';
                    break;
            }
          }
          
          router.replace(path);

        } else {
          console.error("User document not found in Firestore. Redirecting to login.");
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
