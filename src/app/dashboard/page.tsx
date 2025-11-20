
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

        let path = '';

        if (role === 'admin') {
          switch (department) {
            case 'System':
              path = '/dashboard/super-admin';
              break;
            case 'Medical Affairs/Clinical Gov':
              path = '/dashboard/admin/medical-affairs-clinical-gov';
              break;
            case 'IT/IAM':
              path = '/dashboard/admin/it-iam';
              break;
            case 'Cybersecurity':
              path = '/dashboard/admin/cybersecurity';
              break;
            case 'Compliance/Audit':
              path = '/dashboard/admin/compliance-audit';
              break;
            // Add other specific admin department routes here
            default:
              // Fallback for general admins or unhandled departments
              path = '/dashboard/admin';
              break;
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
              // Default redirect for any other roles
              path = '/dashboard/directory';
              break;
          }
        }
        
        if (path) {
          router.push(path);
        } else {
          // If no path is determined, go to a safe default
          router.push('/dashboard/directory');
        }

      } else {
        // Handle case where user document doesn't exist
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
