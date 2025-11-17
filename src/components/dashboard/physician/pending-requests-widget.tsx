
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Hourglass, Loader2 } from 'lucide-react';
import { useUser, useFirestore, useMemoFirebase } from '@/firebase';
import { useCollection } from '@/firebase/firestore/use-collection';
import { collection, query, where } from 'firebase/firestore';
import type { PendingTask } from '@/lib/schemas';

export function PendingRequestsWidget() {
    const { user } = useUser();
    const firestore = useFirestore();

    const pendingTasksQuery = useMemoFirebase(() => {
        if (!firestore || !user) return null;
        // This is a placeholder query. In a real scenario, this would query a dedicated 'requests' collection.
        return query(collection(firestore, 'users', user.uid, 'tasks'), where('status', '==', 'Pending'));
    }, [firestore, user]);

    const { data: tasks, isLoading } = useCollection<PendingTask>(pendingTasksQuery);

    const pendingRequestsCount = tasks?.length ?? 0;

    return (
        <Card className="bg-white hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
                <Hourglass className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                ) : (
                    <div className="text-2xl font-bold">{pendingRequestsCount}</div>
                )}
                <p className="text-xs text-muted-foreground">Track HOD/HR/Medical Affairs approvals</p>
            </CardContent>
        </Card>
    );
}
