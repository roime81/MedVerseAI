
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
    <Card className="w-full max-w-sm bg-card text-card-foreground shadow-2xl">
        <CardHeader className="text-center">
            <div className="mb-4 flex justify-center">
                <svg
                    width="48"
                    height="48"
                    viewBox="0 0 48 48"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <defs>
                        <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" style={{stopColor: '#FF8A00', stopOpacity: 1}} />
                            <stop offset="100%" style={{stopColor: '#E52E71', stopOpacity: 1}} />
                        </linearGradient>
                    </defs>
                    <g stroke="url(#logo-gradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11,1H5.6A4.6,4.6,0,0,0,1,5.6V11" transform="translate(18 18)"/>
                        <path d="M1,23h5.4A4.6,4.6,0,0,0,11,18.4V13" transform="translate(18 18)"/>
                        <path d="M23,13v5.4A4.6,4.6,0,0,1,18.4,23H13" transform="translate(18 18)"/>
                        <path d="M13,1h5.4A4.6,4.6,0,0,1,23,5.6V11" transform="translate(18 18)"/>
                        
                        <path d="M13,8.5v-2a3,3,0,0,0-3-3H7.5a4.5,4.5,0,1,0,0,9H10a3,3,0,0,1,3,3v2" transform="translate(-1 -1) scale(1.5) translate(4 4)" />
                        <path d="M8,12a4,4,0,1,0-4-4" transform="translate(-1 -1) scale(1.5) translate(4 4)" />
                        <path d="M13,15.5H22" transform="translate(-1 -1) scale(1.5) translate(4 4)" />
                        <path d="M13,12.5H22" transform="translate(-1 -1) scale(1.5) translate(4 4)" />
                        <path d="M13,9.5H22" transform="translate(-1 -1) scale(1.5) translate(4 4)" />
                        <circle cx="22" cy="9.5" r="1.5" fill="url(#logo-gradient)" stroke="none" transform="translate(-1 -1) scale(1.5) translate(4 4)" />
                        <circle cx="22" cy="12.5" r="1.5" fill="url(#logo-gradient)" stroke="none" transform="translate(-1 -1) scale(1.5) translate(4 4)" />
                        <circle cx="22" cy="15.5" r="1.5" fill="url(#logo-gradient)" stroke="none" transform="translate(-1 -1) scale(1.5) translate(4 4)" />
                    </g>
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
