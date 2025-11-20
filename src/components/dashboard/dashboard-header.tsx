
'use client';

import { useUser } from '@/firebase';
import { Clock } from 'lucide-react';
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

  return (
    <div className={cn("flex-shrink-0 border-b bg-white p-6", className)}>
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
                <div>
                    <h1 className="text-xl font-bold text-foreground">{title || user?.displayName}</h1>
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
            </div>
        </div>
    </div>
  );
}

    