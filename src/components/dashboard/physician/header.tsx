'use client';
import { Button } from '@/components/ui/button';
import { useUser } from '@/firebase';
import { PlusCircle } from 'lucide-react';
import { useState } from 'react';
import { NewPatientForm } from '@/components/dashboard/physician/new-patient-form';

export function PhysicianHeader() {
  const { user } = useUser();
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <>
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-grotesk text-2xl font-bold text-gray-800">
            Welcome back, {user?.displayName || 'Doctor'}
          </h1>
          <p className="text-muted-foreground">Here's what's happening today</p>
        </div>
        <Button
          className="bg-primary hover:bg-primary/90"
          onClick={() => setIsFormOpen(true)}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          New Patient Record
        </Button>
      </div>
      <NewPatientForm open={isFormOpen} onOpenChange={setIsFormOpen} />
    </>
  );
}
