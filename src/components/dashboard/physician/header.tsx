'use client';
import { Button } from '@/components/ui/button';
import { useUser } from '@/firebase';
import { PlusCircle } from 'lucide-react';

export function PhysicianHeader() {
  const { user } = useUser();
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="font-grotesk text-3xl font-bold">
          Welcome back, {user?.displayName || 'Doctor'}
        </h1>
        <p className="text-muted-foreground">{currentDate}</p>
      </div>
      <Button>
        <PlusCircle className="mr-2 h-4 w-4" />
        New Patient Record
      </Button>
    </div>
  );
}
