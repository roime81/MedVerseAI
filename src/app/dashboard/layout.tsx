'use client';

import { useUser, useFirebase } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { getAuth, signOut } from 'firebase/auth';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const { firebaseApp } = useFirebase();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  const handleSignOut = () => {
    const auth = getAuth(firebaseApp);
    signOut(auth).then(() => {
      router.push('/login');
    });
  };

  if (isUserLoading || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-lg font-semibold text-gray-900">
            Clinical Dashboard
          </h1>
          <div>
            <span className="mr-4">Welcome, {user.displayName || user.email}</span>
            <button
              onClick={handleSignOut}
              className="text-sm text-blue-600 hover:underline"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
