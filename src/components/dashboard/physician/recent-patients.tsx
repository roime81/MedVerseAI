'use client';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import type { Patient, Condition } from '@/lib/types';
import { useEffect, useState } from 'react';

const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('');
}


export function RecentPatients() {
  const firestore = useFirestore();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecentPatients = async () => {
        if (!firestore) return;
        setIsLoading(true);

        const patientsQuery = query(collection(firestore, 'patients'), limit(3));
        const patientSnapshots = await getDocs(patientsQuery);
        
        const patientsData: Patient[] = [];
        for (const doc of patientSnapshots.docs) {
            const patient = doc.data() as Patient;
            patient.id = doc.id;
            
            const encountersQuery = query(collection(firestore, `patients/${patient.id}/encounters`), orderBy('admissionDatetime', 'desc'), limit(1));
            const encounterSnapshots = await getDocs(encountersQuery);
            if (!encounterSnapshots.empty) {
                const lastEncounter = encounterSnapshots.docs[0].data();
                const lastSeenDate = (lastEncounter.admissionDatetime as any).toDate();
                const now = new Date();
                const diffTime = Math.abs(now.getTime() - lastSeenDate.getTime());
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                patient.lastSeen = `${diffDays} day(s) ago`;
            } else {
                patient.lastSeen = 'N/A';
            }

            const conditionsQuery = query(collection(firestore, `patients/${patient.id}/conditions`), where('status', '==', 'Active'));
            const conditionSnapshots = await getDocs(conditionsQuery);
            patient.conditions = conditionSnapshots.docs.map(d => d.data() as Condition);


            patientsData.push(patient);
        }
        
        setPatients(patientsData);
        setIsLoading(false);
    };

    fetchRecentPatients();
  }, [firestore]);


  return (
    <Card>
        <CardHeader>
            <CardTitle className="font-grotesk text-lg">Recent Patients</CardTitle>
        </CardHeader>
        <CardContent>
            {isLoading ? (
                <div className="flex justify-center items-center h-40">
                    <p>Loading patients...</p>
                </div>
            ) : patients.length === 0 ? (
                <div className="flex justify-center items-center h-40">
                    <p>No recent patients found.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {patients.map((patient, index) => (
                    <Card key={index} className="p-4">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center space-x-4">
                                <Avatar className="h-10 w-10">
                                    <AvatarFallback className="bg-gray-200 text-gray-800 font-semibold">{getInitials(patient.fullName)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-semibold text-gray-800">{patient.fullName}</p>
                                    <p className="text-sm text-muted-foreground">{patient.lastSeen}</p>
                                </div>
                            </div>
                            {patient.alerts && patient.alerts > 0 && (
                                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                                    {patient.alerts}
                                </div>
                            )}
                        </div>
                        <div className="mt-4 flex flex-wrap gap-2">
                             {patient.conditions && patient.conditions.slice(0, 2).map((condition, i) => (
                                <Badge key={i} variant="outline" className="font-normal">{(condition as any).icd10Code}</Badge>
                            ))}
                            {patient.conditions && patient.conditions.length > 2 && (
                                <Badge variant="outline" className="font-normal">+{patient.conditions.length - 2} more</Badge>
                            )}
                        </div>
                    </Card>
                ))}
                </div>
            )}
        </CardContent>
    </Card>
  );
}
