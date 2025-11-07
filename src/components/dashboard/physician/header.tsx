'use client';
import { Button } from '@/components/ui/button';
import { useUser } from '@/firebase';
import { PlusCircle } from 'lucide-react';

export function PhysicianHeader() {
  const { user } = useUser();

  return (
    <div className="flex items-start justify-between">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Welcome back, {user?.displayName || 'Doctor'}
        </h1>
        <p className="text-muted-foreground">Here's what's happening today</p>
      </div>
      <Button className="bg-primary hover:bg-primary/90">
        <PlusCircle className="mr-2 h-4 w-4" />
        New Patient Record
      </Button>
    </div>
  );
}
