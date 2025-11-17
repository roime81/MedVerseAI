
'use client';

import * as React from 'react';
import { useFirestore, useMemoFirebase } from '@/firebase';
import { useCollection } from '@/firebase/firestore/use-collection';
import { collection, query, where } from 'firebase/firestore';
import type { User as UserType } from '@/lib/schemas';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Loader2, Building } from 'lucide-react';
import { CareSite } from '@/lib/types';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';


interface Doctor extends UserType {
    id: string;
    careSiteNames?: string[];
}

export default function DirectoryPage() {
    const firestore = useFirestore();

    const doctorsQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return query(collection(firestore, 'users'), where('role', '==', 'physician'));
    }, [firestore]);

    const careSitesQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return collection(firestore, 'careSites');
    }, [firestore]);

    const { data: doctorsData, isLoading: isLoadingDoctors } = useCollection<UserType>(doctorsQuery);
    const { data: careSitesData, isLoading: isLoadingCareSites } = useCollection<CareSite>(careSitesQuery);

    const careSiteMap = React.useMemo(() => {
        if (!careSitesData) return new Map<string, string>();
        return careSitesData.reduce((acc, site) => {
            acc.set(site.careSiteId, site.careSiteName);
            return acc;
        }, new Map<string, string>());
    }, [careSitesData]);


    const doctors: Doctor[] | null = React.useMemo(() => {
        if (!doctorsData || !careSiteMap) return null;
        return doctorsData.map(doc => ({
            ...doc,
            careSiteNames: doc.associatedCareSites?.map(id => careSiteMap.get(id)).filter(Boolean) as string[] || []
        }));
    }, [doctorsData, careSiteMap]);

    const isLoading = isLoadingDoctors || isLoadingCareSites;

    return (
        <div className="bg-slate-50 text-foreground h-full flex flex-col">
            <DashboardHeader title="Doctor Directory" description="Browse all physicians and their associated departments." />

            <div className="flex-1 overflow-y-auto p-8">
                <Card className="bg-white">
                    <CardHeader>
                        <CardTitle>All Physicians</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="flex justify-center items-center h-40">
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {doctors?.map(doctor => (
                                    <div key={doctor.id} className="flex items-center justify-between p-4 rounded-lg border">
                                        <div className="flex items-center gap-4">
                                            <Avatar className="h-12 w-12">
                                                <AvatarFallback className="bg-primary/10 text-primary font-bold">
                                                    {doctor.displayName?.split(' ').slice(-2).map(n => n[0]).join('')}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-semibold text-lg">{doctor.displayName}</p>
                                                <p className="text-sm text-muted-foreground">{doctor.email}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Building className="h-4 w-4 text-muted-foreground" />
                                            <div className="flex flex-wrap gap-2">
                                                {doctor.careSiteNames && doctor.careSiteNames.length > 0 ? (
                                                    doctor.careSiteNames.map(name => (
                                                        <Badge key={name} variant="secondary">{name}</Badge>
                                                    ))
                                                ) : (
                                                    <Badge variant="outline">No department assigned</Badge>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
