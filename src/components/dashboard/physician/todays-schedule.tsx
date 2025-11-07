'use client';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import type { Appointment } from '@/lib/types';
import { useCollection, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { collection, query, where, Timestamp, getDocs, doc, getDoc, collectionGroup, orderBy } from 'firebase/firestore';
import type { Patient as PatientSchema } from '@/lib/schemas';
import { useEffect, useState } from 'react';
import { Patient } from '@/lib/types';


const getStatusClass = (status: Appointment['status']) => {
  switch (status) {
    case 'Completed': return 'bg-gray-800 text-white';
    case 'In Progress': return 'bg-blue-100 text-blue-800';
    case 'Waiting': return 'bg-yellow-100 text-yellow-800';
    case 'Scheduled': return 'bg-gray-100 text-gray-800';
    default: return '';
  }
}

export function TodaysSchedule() {
  const { user } = useUser();
  const firestore = useFirestore();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      if (!firestore || !user) return;
      setIsLoading(true);

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const todayTimestamp = Timestamp.fromDate(today);
      const tomorrowTimestamp = Timestamp.fromDate(tomorrow);

      const encountersQuery = query(
        collectionGroup(firestore, 'encounters'),
        where('attendingProviderId', '==', user.uid),
        where('admissionDatetime', '>=', todayTimestamp),
        where('admissionDatetime', '<', tomorrowTimestamp),
        orderBy('admissionDatetime', 'asc')
      );
      
      const encounterSnapshots = await getDocs(encountersQuery);
      const appointmentsData: Appointment[] = [];
      
      for (const encounterDoc of encounterSnapshots.docs) {
          const encounter = encounterDoc.data();
          const patientRef = doc(firestore, 'patients', encounter.personId);
          const patientDoc = await getDoc(patientRef);

          if (patientDoc.exists()) {
              const patientData = patientDoc.data() as Patient;
              const admissionTime = (encounter.admissionDatetime as Timestamp).toDate();

              const getInitials = (name: string) => {
                return name.split(' ').map(n => n[0]).join('');
              }

              const calculateAge = (dob: string) => {
                  const birthDate = new Date(dob);
                  const today = new Date();
                  let age = today.getFullYear() - birthDate.getFullYear();
                  const m = today.getMonth() - birthDate.getMonth();
                  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                      age--;
                  }
                  return age;
              }

              appointmentsData.push({
                time: admissionTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
                patient: {
                  name: patientData.fullName,
                  initials: getInitials(patientData.fullName),
                  age: calculateAge(patientData.dateOfBirth),
                  reason: encounter.visitReason,
                },
                status: encounter.visitStatus === 'Discharged' ? 'Completed' : 'Scheduled',
              });
          }
      }

      setAppointments(appointmentsData);
      setIsLoading(false);
    };

    fetchAppointments();
  }, [firestore, user]);


  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="font-grotesk text-lg">Today's Schedule</CardTitle>
        <Button variant="outline" size="sm">
          <Calendar className="mr-2 h-4 w-4" />
          View Full Calendar
        </Button>
      </CardHeader>
      <CardContent>
         {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <p>Loading schedule...</p>
          </div>
        ) : appointments.length === 0 ? (
          <div className="flex justify-center items-center h-40">
            <p>No appointments scheduled for today.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {appointments.map((appt, index) => (
              <div key={index} className="flex items-center space-x-4 rounded-lg p-3 hover:bg-gray-50">
                <div className="w-14 text-sm text-muted-foreground">{appt.time}</div>
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-blue-100 text-blue-800 font-semibold">{appt.patient.initials}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">{appt.patient.name}</p>
                  <p className="text-sm text-muted-foreground">{`${appt.patient.age} yrs • ${appt.patient.reason}`}</p>
                </div>
                <Badge className={`font-semibold ${getStatusClass(appt.status)}`}>{appt.status}</Badge>
                <Button variant="ghost" size="sm">Open Chart</Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
