'use client';
import { Button } from '@/components/ui/button';
import { useUser } from '@/firebase';

export function PhysicianHeader() {
  const { user } = useUser();

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold">
          Welcome back, {user?.displayName || 'Doctor'}
        </h1>
        <p className="text-muted-foreground">Here's what's happening today</p>
      </div>
      <Button>New Patient Record</Button>
    </div>
  );
}
