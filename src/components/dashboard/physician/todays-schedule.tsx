
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
import { useFirestore, useUser } from '@/firebase';
import { collection, query, where, Timestamp, getDocs, doc, getDoc, orderBy } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Patient } from '@/lib/types';
import { generatedData } from '@/lib/sample-data';
import { PatientChartSheet } from '../patient-chart/patient-chart-sheet';


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
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isChartOpen, setIsChartOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    setCurrentDate(new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }));
  }, []);

  const handleOpenChart = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsChartOpen(true);
  }

  const handleAppointmentComplete = () => {
    if (!selectedAppointment) return;

    setAppointments(prev => {
        const completedIndex = prev.findIndex(appt => appt.time === selectedAppointment.time);
        if (completedIndex === -1) return prev;

        const newAppointments = [...prev];
        // Mark current as completed
        newAppointments[completedIndex] = { ...newAppointments[completedIndex], status: 'Completed' };
        
        // Find the next 'Scheduled' appointment and mark it as 'In Progress'
        const nextScheduledIndex = newAppointments.findIndex((appt, index) => index > completedIndex && appt.status === 'Scheduled');
        if (nextScheduledIndex !== -1) {
            newAppointments[nextScheduledIndex] = { ...newAppointments[nextScheduledIndex], status: 'In Progress' };
        }
        
        return newAppointments;
    });
  };

  useEffect(() => {
    const fetchAppointments = async () => {
      if (!firestore || !user) {
        // Fallback for when firebase is not available
        if (user) {
            const today = new Date();
            const sampleAppointments = generatedData.sampleProcedures
                .filter(p => {
                    const procDate = new Date(p.procedureDateTime);
                    return p.performingClinicianId === 'dr_emily_carter' &&
                           procDate.getFullYear() === today.getFullYear() &&
                           procDate.getMonth() === today.getMonth() &&
                           procDate.getDate() === today.getDate();
                })
                .map((p, index) => {
                    const patient = generatedData.samplePatients.find(pat => pat.personId === p.personId);
                    if (!patient) return null;
                     const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('');
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

                    return {
                        time: new Date(p.procedureDateTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
                        patient: {
                            ...(patient as Patient),
                            name: patient.fullName,
                            initials: getInitials(patient.fullName),
                            age: calculateAge(patient.dateOfBirth),
                            reason: p.procedureName,
                        },
                        status: 'Scheduled' as Appointment['status'],
                    }
                })
                .filter(Boolean) as Appointment[];
            
            sampleAppointments.sort((a, b) => a.time.localeCompare(b.time));
            if (sampleAppointments.length > 0) {
              const inProgressIndex = sampleAppointments.findIndex(a => a.time > new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }));
              if (inProgressIndex > -1) {
                sampleAppointments[inProgressIndex].status = 'In Progress';
              } else {
                 sampleAppointments[0].status = 'In Progress';
              }
            }
            setAppointments(sampleAppointments);
        }
        setIsLoading(false);
        return;
      };

      setIsLoading(true);

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const proceduresQuery = query(
        collection(firestore, 'procedures'),
        where('performingClinicianId', '==', user.uid)
      );
      
      const procedureSnapshots = await getDocs(proceduresQuery);
      const appointmentsData: Appointment[] = [];
      
      if (procedureSnapshots.empty && user) {
        // No data in DB, use sample data
        const today = new Date();
        const sampleAppointments = generatedData.sampleProcedures
            .filter(p => {
                const procDate = new Date(p.procedureDateTime);
                return p.performingClinicianId === 'dr_emily_carter' &&
                       procDate.getFullYear() === today.getFullYear() &&
                       procDate.getMonth() === today.getMonth() &&
                       procDate.getDate() === today.getDate();
            })
            .map((p, index) => {
                const patient = generatedData.samplePatients.find(pat => pat.personId === p.personId);
                if (!patient) return null;
                 const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('');
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

                return {
                    time: new Date(p.procedureDateTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
                    patient: {
                        ...(patient as Patient),
                        name: patient.fullName,
                        initials: getInitials(patient.fullName),
                        age: calculateAge(patient.dateOfBirth),
                        reason: p.procedureName,
                    },
                    status: 'Scheduled' as Appointment['status'],
                }
            })
            .filter(Boolean) as Appointment[];
        
        sampleAppointments.sort((a, b) => a.time.localeCompare(b.time));
        if (sampleAppointments.length > 0) {
            const inProgressIndex = sampleAppointments.findIndex(a => a.time > new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }));
            if (inProgressIndex > -1) {
              sampleAppointments[inProgressIndex].status = 'In Progress';
            } else {
                sampleAppointments[0].status = 'In Progress';
            }
        }

        setAppointments(sampleAppointments);
        setIsLoading(false);
        return;
      }


      for (const procedureDoc of procedureSnapshots.docs) {
          const procedure = procedureDoc.data();
          
          const procedureTime = new Date(procedure.procedureDateTime);
          if (procedureTime < today || procedureTime >= tomorrow) {
            continue; // Skip if not for today
          }

          const patientRef = doc(firestore, 'patients', procedure.personId);
          const patientDoc = await getDoc(patientRef);

          if (patientDoc.exists()) {
              const patientData = patientDoc.data() as Patient;
              
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
                time: procedureTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
                patient: {
                  ...patientData,
                  id: patientDoc.id,
                  name: patientData.fullName,
                  initials: getInitials(patientData.fullName),
                  age: calculateAge(patientData.dateOfBirth),
                  reason: procedure.procedureName,
                },
                // This is a placeholder, visitStatus would come from an encounter
                status: 'Scheduled', 
              });
          }
      }

      // Sort appointments by time
      appointmentsData.sort((a, b) => a.time.localeCompare(b.time));

      if (appointmentsData.length > 0) {
        const firstInProgress = appointmentsData.findIndex(a => a.status === 'Completed' || a.status === 'In Progress');
        if (firstInProgress === -1) {
            appointmentsData[0].status = 'In Progress';
        }
      }

      setAppointments(appointmentsData);
      setIsLoading(false);
    };

    fetchAppointments();
  }, [firestore, user]);


  return (
    <>
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-4">
            <CardTitle className="font-grotesk text-lg">Today's Schedule</CardTitle>
            <p className="text-sm text-muted-foreground">{currentDate}</p>
        </div>
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
                <Button variant="ghost" size="sm" onClick={() => handleOpenChart(appt)}>Open Chart</Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
     {selectedAppointment && (
        <PatientChartSheet 
            patient={selectedAppointment.patient}
            appointmentStatus={selectedAppointment.status}
            open={isChartOpen}
            onOpenChange={setIsChartOpen}
            onAppointmentComplete={handleAppointmentComplete}
        />
     )}
    </>
  );
}
