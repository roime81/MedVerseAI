
'use client';

import { useUser, useAuth } from '@/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { User as UserIcon, Clock, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import React from 'react';

interface DashboardHeaderProps {
  title: string;
  description: string;
  showShiftTime?: boolean;
  children?: React.ReactNode;
  className?: string;
}

export function DashboardHeader({ title, description, showShiftTime = false, children, className }: DashboardHeaderProps) {
  const { user } = useUser();
  const auth = useAuth();
  const router = useRouter();

  const handleSignOut = () => {
    signOut(auth).then(() => {
      router.push('/login');
    });
  };

  return (
    <div className={cn("flex-shrink-0 border-b bg-white p-4", className)}>
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <UserIcon className="h-6 w-6 text-primary" />
                </div>
                <div>
                    <h2 className="font-semibold text-foreground">{title || user?.displayName}</h2>
                    <p className="text-sm text-muted-foreground">{description}</p>
                </div>
                {showShiftTime && (
                    <>
                        <div className="h-8 border-l border-border"></div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span>Shift: 08:00 - 16:00</span>
                        </div>
                    </>
                )}
            </div>
             <div className="flex items-center gap-4">
              {children}
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </Button>
            </div>
        </div>
    </div>
  );
}
