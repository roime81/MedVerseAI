
'use client';

import * as React from 'react';
import { useUser, useFirestore, useMemoFirebase } from '@/firebase';
import { useCollection } from '@/firebase/firestore/use-collection';
import { collection, query, where, limit } from 'firebase/firestore';
import type { Patient, Condition, DrugExposure } from '@/lib/types';
import { ActionCard } from '@/components/dashboard/patient-portal/ActionCard';
import { UpcomingAppointments } from '@/components/dashboard/patient-portal/UpcomingAppointments';
import { RecentActivity } from '@/components/dashboard/patient-portal/RecentActivity';
import { HealthSummary } from '@/components/dashboard/patient-portal/HealthSummary';
import { Calendar, FileText, CreditCard, MessageSquare, Loader2 } from 'lucide-react';

export default function PatientPortalPage() {
    const { user, isUserLoading } = useUser();
    const firestore = useFirestore();

    // For this demo, we'll find the patient record for 'Leila Richardson'
    // In a real app, you'd likely have a direct link from the user to their patient profile.
    const patientQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return query(
            collection(firestore, 'patients'),
            where('fullName', '==', 'Leila Richardson'),
            limit(1)
        );
    }, [firestore]);

    const { data: patientData, isLoading: isLoadingPatient } = useCollection<Patient>(patientQuery);
    const patient = patientData?.[0];

    const conditionsQuery = useMemoFirebase(() => {
        if (!firestore || !patient) return null;
        return collection(firestore, 'patients', patient.personId, 'conditions');
    }, [firestore, patient]);

    const { data: conditions, isLoading: isLoadingConditions } = useCollection<Condition>(conditionsQuery);

    const medicationsQuery = useMemoFirebase(() => {
        if (!firestore || !patient) return null;
        return collection(firestore, 'patients', patient.personId, 'drugExposures');
    }, [firestore, patient]);

    const { data: medications, isLoading: isLoadingMedications } = useCollection<DrugExposure>(medicationsQuery);

    if (isUserLoading || isLoadingPatient || isLoadingConditions || isLoadingMedications) {
        return (
            <div className="flex h-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    const patientName = patient?.fullName?.split(' ')[0] || user?.displayName?.split(' ')[0] || 'User';

    return (
        <div className="p-8 space-y-8 bg-background text-foreground">
            <div>
                <h1 className="text-3xl font-bold text-foreground">Welcome back, {patientName}</h1>
                <p className="text-muted-foreground">Manage your health, your way</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                <ActionCard icon={Calendar} title="Book" subtitle="Appointment" />
                <ActionCard icon={FileText} title="View" subtitle="Results" />
                <ActionCard icon={CreditCard} title="Pay" subtitle="Bills" />
                <ActionCard icon={MessageSquare} title="Message" subtitle="My Doctor" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <UpcomingAppointments />
                </div>
                <div>
                    <RecentActivity />
                </div>
            </div>

            <div>
                <HealthSummary
                    conditions={conditions}
                    medications={medications}
                    allergies={patient?.allergyFlag}
                />
            </div>
        </div>
    );
}
