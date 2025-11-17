
'use client';

import * as React from 'react';
import { useFirestore, useMemoFirebase } from '@/firebase';
import { useCollection } from '@/firebase/firestore/use-collection';
import { collection, query, where } from 'firebase/firestore';
import type { User as UserType } from '@/lib/schemas';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Loader2, Shield } from 'lucide-react';

export default function AdminDirectoryPage() {
    const firestore = useFirestore();

    const adminsQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return query(collection(firestore, 'users'), where('role', '==', 'admin'));
    }, [firestore]);

    const { data: admins, isLoading: isLoadingAdmins } = useCollection<UserType>(adminsQuery);

    const getInitials = (name: string = '') => {
        return name
            .split(' ')
            .slice(0, 2)
            .map(n => n[0])
            .join('')
            .toUpperCase();
    };

    return (
        <div className="p-8 space-y-8 bg-background text-foreground">
            <div>
                <h1 className="text-3xl font-bold text-foreground">Admin Directory</h1>
                <p className="text-muted-foreground">Browse all administrative users and their departments.</p>
            </div>

            <Card className="bg-white">
                <CardHeader>
                    <CardTitle>All Administrators</CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoadingAdmins ? (
                        <div className="flex justify-center items-center h-40">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {admins?.map(admin => (
                                <div key={admin.uid} className="flex items-center justify-between p-4 rounded-lg border">
                                    <div className="flex items-center gap-4">
                                        <Avatar className="h-12 w-12">
                                            <AvatarFallback className="bg-primary/10 text-primary font-bold">
                                                {getInitials(admin.displayName)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-semibold text-lg">{admin.displayName}</p>
                                            <p className="text-sm text-muted-foreground">{admin.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Shield className="h-4 w-4" />
                                        <span>Administrator</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
