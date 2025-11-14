
'use client';

import { useState } from 'react';
import {
  getAuth,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { doc, setDoc, getFirestore, getDoc } from 'firebase/firestore';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useFirebase } from '@/firebase';
import { sampleUsers } from '@/lib/sample-data';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const router = useRouter();
  const { firebaseApp } = useFirebase();
  const auth = getAuth(firebaseApp);
  const firestore = getFirestore(firebaseApp);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSigningIn(true);
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/dashboard');
    } catch (error: any) {
      if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
        const sampleUser = sampleUsers.find((u) => u.email === email);
        if (sampleUser && password === sampleUser.password) {
          try {
            const userCredential = await createUserWithEmailAndPassword(
              auth,
              email,
              password
            );
            const user = userCredential.user;

            await updateProfile(user, { displayName: sampleUser.displayName });

            await setDoc(doc(firestore, 'users', user.uid), {
              uid: user.uid,
              email: user.email,
              displayName: sampleUser.displayName,
              role: sampleUser.role,
            });
            
            router.push('/dashboard');
            return;
          } catch (creationError: any) {
            setError(`Failed to create account: ${creationError.message}`);
          }
        } else {
           setError('Invalid email or password.');
        }
      } else {
        setError(error.message);
      }
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsSigningIn(true);
    setError(null);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userRef = doc(firestore, 'users', user.uid);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        const sampleUser = sampleUsers.find(u => u.email.split('@')[0].includes(user.displayName?.split(' ')[0].toLowerCase() || ''))
        const role = sampleUser ? sampleUser.role : 'physician';

        await setDoc(userRef, {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          role: role,
        });
      }

      router.push('/dashboard');
    } catch (error: any) {
      setError('Failed to sign in with Google. Please try again.');
      console.error('Google Sign-In Error:', error);
    } finally {
      setIsSigningIn(false);
    }
  };

  return (
    <Card className="w-full max-w-sm bg-white text-foreground border-0 sm:border shadow-2xl">
        <CardHeader className="text-center">
            <div className="mb-4 flex justify-center">
                <svg
                    width="64"
                    height="64"
                    viewBox="0 0 64 64"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <defs>
                        <linearGradient id="logo-gradient" x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0%" stopColor="#F97316"/>
                            <stop offset="100%" stopColor="#D946EF"/>
                        </linearGradient>
                    </defs>
                    <rect width="64" height="64" rx="14" fill="black"/>
                    <path 
                        d="M36.62,19.34c-1.3-1.03-2.88-1.57-4.62-1.57h-0.03c-2.45,0-4.63,1.01-6.19,2.67c-1.7,1.8-2.65,4.2-2.65,6.82v0.02c0,3.31,1.52,6.23,3.88,8.12c1.23,0.99,2.69,1.68,4.27,1.96c0.05,0.01,0.1,0.02,0.15,0.02c0.75,0,1.47-0.18,2.13-0.5c0.4-0.19,0.78-0.42,1.13-0.69c1.94-1.51,3.1-3.86,3.1-6.49v-0.02C41.2,25.43,39.54,21.83,36.62,19.34z M27.81,25.4c0-2.4,1.43-4.43,3.58-4.43h0.03c1.07,0,2.05,0.44,2.77,1.2c0.82,0.87,1.29,2.07,1.29,3.3v0.02c0,2.4-1.43,4.43-3.58,4.43h-0.03c-1.07,0-2.05-0.44-2.77-1.2C28.27,28.84,27.81,27.18,27.81,25.4z M39.5,31.75h-5.25v4.5c0,0.83-0.67,1.5-1.5,1.5s-1.5-0.67-1.5-1.5v-4.5h-4.5c-0.83,0-1.5-0.67-1.5-1.5s0.67-1.5,1.5-1.5h4.5v-4.5c0-0.83,0.67-1.5,1.5-1.5s1.5,0.67,1.5,1.5v4.5h5.25c0.83,0,1.5,0.67,1.5,1.5S40.33,31.75,39.5,31.75z" 
                        fill="white"
                    />
                    <path
                        d="M43 24.5H50V21.5H43V24.5ZM43 33.5H50V30.5H43V33.5ZM43 42.5H50V39.5H43V42.5Z"
                        fill="white"
                    />
                </svg>
            </div>
            <CardTitle className="font-grotesk text-2xl font-bold">MedVerseAI</CardTitle>
            <CardDescription className="text-muted-foreground">The AI-powered clinical dashboard</CardDescription>
        </CardHeader>
        <CardContent>
            <form onSubmit={handleSignIn}>
                <div className="grid gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                    id="email"
                    type="email"
                    placeholder="emily.carter@medverse.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-white"
                    />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-white"
                    />
                </div>
                {error && <p className="text-sm text-destructive">{error}</p>}
                <Button type="submit" className="w-full" disabled={isSigningIn}>
                    {isSigningIn ? 'Logging in...' : 'Login'}
                </Button>
                <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={isSigningIn} type="button">
                    Login with Google
                </Button>
                </div>
            </form>
        </CardContent>
    </Card>
  );
}
