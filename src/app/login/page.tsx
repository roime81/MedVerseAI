'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, LogIn } from 'lucide-react';
import { useAuth, User } from '@/hooks/use-mock-auth';

const mockUsers: { [key: string]: User } = {
    'admin@medverse.com': { email: 'admin@medverse.com', isAdmin: true, role: 'Admin', name: 'Admin User' },
    'physician@medverse.com': { email: 'physician@medverse.com', isAdmin: false, role: 'Physician', name: 'Dr. Emily Carter' },
    'nurse@medverse.com': { email: 'nurse@medverse.com', isAdmin: false, role: 'Nurse', name: 'Nurse Michael Smith' },
    'roimepuniran@gmail.com': { email: 'roimepuniran@gmail.com', isAdmin: true, role: 'Admin', name: 'Roi Mepuniran' },
};

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const user = mockUsers[email];

    if (user && (user.email !== 'roimepuniran@gmail.com' || password === 'Pudina@81')) {
        login(user);
        toast({
          title: `Login Successful`,
          description: `Welcome back, ${user.name}!`,
        });
        router.push('/');
    } else if (email === 'roimepuniran@gmail.com' && password !== 'Pudina@81') {
        toast({
            title: 'Login Failed',
            description: 'Invalid password for admin user.',
            variant: 'destructive',
        });
    } else if (!user) {
        // Fallback for any other user
        login({ email, isAdmin: false, role: 'Physician', name: 'Guest User' });
        toast({
            title: 'Login Successful',
            description: `Welcome back!`,
        });
        router.push('/');
    } else {
        toast({
            title: 'Login Failed',
            description: 'Please check your credentials.',
            variant: 'destructive',
        });
    }

    setIsLoading(false);
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
                Use `physician@medverse.com`, `nurse@medverse.com`, or `admin@medverse.com`. Password can be anything (except for `roimepuniran@gmail.com`).
            </p>
        </CardFooter>
      </Card>
    </div>
  );
}
