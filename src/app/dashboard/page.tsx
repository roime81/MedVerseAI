
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { useUser, useFirestore } from '@/firebase';
import { Loader2 } from 'lucide-react';
import type { User as AppUser } from '@/lib/schemas';

const departmentToPathMap: Record<string, string> = {
    'System': '/dashboard/super-admin',
    'HR/Credentialing': '/dashboard/hr-credentialing',
    'Medical Affairs/Clinical Gov': '/dashboard/medical-affairs-clinical-gov',
    'Department Head': '/dashboard/department-head',
    'IT/IAM': '/dashboard/it-iam',
    'Cybersecurity': '/dashboard/cybersecurity',
    'HIS/EMR': '/dashboard/his-emr',
    'Compliance/Audit': '/dashboard/compliance-audit',
};

const getAdminPath = (department: string | undefined): string => {
    if (!department) return '/dashboard/directory'; // Default for admins with no department
    return departmentToPathMap[department] || '/dashboard/directory';
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
      try {
        const userDocRef = doc(firestore, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data() as AppUser;
          const role = userData.role;
          
          let path = '/dashboard/directory'; // A safe default

          if (role === 'admin') {
              path = getAdminPath(userData.department);
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
              }
          }
          
          router.push(path);

        } else {
          console.error("User document not found in Firestore. Redirecting to login.");
          // If user doc doesn't exist, we can't determine role, maybe sign out and redirect
          router.push('/login');
        }
      } catch (error) {
          console.error("Error fetching user data:", error);
          router.push('/login'); // Redirect to login on error
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
