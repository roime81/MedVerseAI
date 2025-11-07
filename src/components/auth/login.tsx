'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth, useUser } from '@/firebase';
import {
  initiateGoogleSignIn,
  initiateEmailSignIn,
} from '@/firebase/non-blocking-login';
import { Stethoscope } from 'lucide-react';
import { useState, useEffect } from 'react';
import { redirect } from 'next/navigation';

export default function Login() {
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!auth) {
        setError('Authentication service is not available.');
        return;
    }
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    initiateEmailSignIn(auth, email, password, (err) => {
      setError(err || 'Failed to sign in. Please check your credentials.');
    });
  };

  const handleGoogleSignIn = () => {
    if (!auth) {
        setError('Authentication service is not available.');
        return;
    }
    initiateGoogleSignIn(auth);
  };
  
  useEffect(() => {
    if (user) {
      redirect('/dashboard');
    }
  }, [user]);

  if (isUserLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  
  if (user) {
    return null;
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
          <form onSubmit={handleEmailSignIn} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
             {error && <p className="text-sm text-center text-red-500">{error}</p>}
            <Button type="submit" className="w-full">
              Sign In
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

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
