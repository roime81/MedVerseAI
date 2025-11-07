
'use client';

import { useUser } from '@/firebase';
import { redirect } from 'next/navigation';
import Login from '@/components/auth/login';

export default function Home() {
  const { user, isUserLoading } = useUser();

  if (isUserLoading) {
    return <div>Loading...</div>;
  }

  if (user) {
    redirect('/dashboard');
  }

  return <Login />;
}
