
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, LogIn } from 'lucide-react';
import { useAuth, useFirebase } from '@/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import type { staffProfiles } from '@/lib/sample-data';


export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('password'); // Default password for mock users
  const [isLoading, setIsLoading] = useState(false);
  const auth = useAuth();
  const { firestore } = useFirebase();
  const router = useRouter();
  const { toast } = useToast();

  const updateUserProfile = async (user: User) => {
    if (!firestore) return;
    try {
      const profileDoc = await getDoc(doc(firestore, 'staffProfiles', user.email!));
      if (profileDoc.exists()) {
        const profileData = profileDoc.data();
        await updateProfile(user, { displayName: profileData.name });
        console.log("User profile updated with displayName:", profileData.name);
      }
    } catch (e) {
      console.error("Could not update user profile", e);
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        await updateUserProfile(userCredential.user);
        toast({
          title: `Login Successful`,
          description: `Welcome back!`,
        });
        router.push('/');
    } catch (error: any) {
        if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found') {
            try {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                await updateUserProfile(userCredential.user);
                toast({
                  title: `Account Created & Logged In`,
                  description: `Welcome to MedVerseAI!`,
                });
                router.push('/');
            } catch (creationError: any) {
                 toast({
                    title: 'Registration Failed',
                    description: creationError.message,
                    variant: 'destructive',
                });
            }
        } else {
            toast({
                title: 'Login Failed',
                description: error.message,
                variant: 'destructive',
            });
        }
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-headline">MedVerseAI Login</CardTitle>
          <CardDescription>Enter your hospital network credentials</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="e.g., physician@medverse.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                placeholder="Enter password"
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                <>
                  <LogIn className="mr-2 h-4" />
                  Sign In
                </>
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-4 text-sm text-center">
            <p className="text-muted-foreground">
                Use `physician@medverse.com`, `physician2@medverse.com`, `physician3@medverse.com`, `nurse@medverse.com`, or `admin@medverse.com`. The default password is `password`.
            </p>
        </CardFooter>
      </Card>
    </div>
  );
}
