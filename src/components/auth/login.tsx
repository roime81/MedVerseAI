'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useAuth, useUser } from '@/firebase';
import {
  initiateGoogleSignIn,
  initiateSignOut,
} from '@/firebase/non-blocking-login';
import { Stethoscope } from 'lucide-react';
import { setDoc, doc, getDoc } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { useEffect } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { redirect } from 'next/navigation';

function UserProfile({ user, auth }) {
  const handleSignOut = () => {
    initiateSignOut(auth);
  };
  
  redirect('/dashboard');

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>Welcome!</CardTitle>
          <CardDescription>You are signed in.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center space-y-4">
            <img
              src={user.photoURL || '/default-avatar.png'}
              alt="User Avatar"
              className="w-24 h-24 rounded-full"
            />
            <p className="text-lg font-semibold">{user.displayName}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSignOut} className="w-full" variant="outline">
            Sign Out
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default function Login() {
  const auth = useAuth();
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();

  const handleGoogleSignIn = () => {
    initiateGoogleSignIn(auth);
  };

  useEffect(() => {
    if (!auth || !firestore) return;
  
    const unsubscribe = onAuthStateChanged(auth, async (user: User | null) => {
      if (user) {
        const userRef = doc(firestore, 'users', user.uid);
        const userDoc = await getDoc(userRef);
  
        if (!userDoc.exists()) {
          // This is a simplified example. In a real app, you'd have a
          // more robust way of assigning roles, perhaps through a backend
          // function or a dedicated user management UI for admins.
          // Here, we default to 'physician' for any new user.
          await setDoc(
            userRef,
            {
              uid: user.uid,
              email: user.email,
              displayName: user.displayName,
              photoURL: user.photoURL,
              role: 'physician', // Default role for new sign-ups
            },
            { merge: true }
          );
        }
      }
    });
  
    return () => unsubscribe();
  }, [auth, firestore]);

  if (isUserLoading) {
    return <div>Loading...</div>;
  }

  if (user) {
    return <UserProfile user={user} auth={auth} />;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-sm shadow-xl">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center">
            <Stethoscope className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-grotesk">MedVerseAI</CardTitle>
          <CardDescription>
            Sign in to access your dashboard
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Button onClick={handleGoogleSignIn} variant="outline" className="w-full">
            <svg
              className="w-4 h-4 mr-2"
              aria-hidden="true"
              focusable="false"
              data-prefix="fab"
              data-icon="google"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 488 512"
            >
              <path
                fill="currentColor"
                d="M488 261.8C488 403.3 381.5 512 244 512 109.8 512 0 402.2 0 256S109.8 0 244 0c73.2 0 136 29.3 181.9 76.5l-64.4 64.2C335.5 113.5 293.6 96 244 96 156.4 96 86.1 166.3 86.1 254s70.3 158 157.9 158c90.5 0 131.3-61.9 135.8-93.1H244v-75.5h236.4c2.5 12.9 3.6 27.4 3.6 42.4z"
              ></path>
            </svg>
            Sign in with Google
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

    