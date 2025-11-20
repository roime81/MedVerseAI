
'use client';

import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase';

// This component now only serves to show a loading screen while the layout handles redirection.
export default function DashboardPage() {
    const router = useRouter();
    const { isUserLoading, user } = useUser();
    
    useEffect(() => {
        // If auth state is resolved and there's no user, redirect to login
        if (!isUserLoading && !user) {
            router.replace('/login');
        }
    }, [isUserLoading, user, router]);

    // The actual redirection logic is now in DashboardLayout.
    // This page will be replaced by the correct dashboard page once redirection is complete.
    // We just show a loading spinner here to avoid a flash of unstyled content.
    return (
        <div className="flex h-full w-full items-center justify-center bg-background">
            <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-muted-foreground">Loading your dashboard...</p>
            </div>
        </div>
    );
}
