'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, LogIn } from 'lucide-react';
import { useAuth } from '@/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('password'); // Default for prototype
  const [isLoading, setIsLoading] = useState(false);
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({
        title: 'Login Successful',
        description: `Welcome back!`,
      });
      router.push('/');
    } catch (error: any) {
      // Create a user if they don't exist for prototype purposes
      if (error.code === 'auth/user-not-found') {
        try {
            await auth.createUserWithEmailAndPassword(email, password);
             toast({
                title: 'Account Created',
                description: `Welcome! A new account has been created for ${email}.`,
            });
            router.push('/');
        } catch (creationError: any) {
             toast({
                title: 'Login Failed',
                description: creationError.message || 'An unexpected error occurred.',
                variant: 'destructive',
            });
        }
      } else {
         toast({
            title: 'Login Failed',
            description: error.message || 'An unexpected error occurred.',
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
                placeholder="e.g., a.khan@hospital.org"
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
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign In
                </>
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-4 text-sm">
            <p className="text-muted-foreground">
                For prototype: any email will work. Default password is "password".
            </p>
        </CardFooter>
      </Card>
    </div>
  );
}
