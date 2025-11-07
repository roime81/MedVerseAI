'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, AlertCircle, Users, Clock } from 'lucide-react';
import { Header } from './header';
import { useUser, useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where, limit, collectionGroup } from 'firebase/firestore';
import type { Patient, Encounter } from '@/lib/types';
import { getInitials } from '@/lib/utils';

const StatCard = ({ title, value, icon: Icon, colorClass }) => (
  <Card className="shadow-md">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <div className={`h-8 w-8 rounded-full flex items-center justify-center ${colorClass}`}>
        <Icon className="h-4 w-4 text-white" />
      </div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
    </CardContent>
  </Card>
);

const AppointmentItem = ({ appointment }: { appointment: Encounter }) => {
    const statusMap = {
        'In Progress': 'bg-blue-100 text-blue-800',
        'Completed': 'bg-gray-200 text-gray-800',
        'Waiting': 'bg-yellow-100 text-yellow-800',
        'Scheduled': 'bg-green-100 text-green-800',
    };
    
    // Fallback patient data if details are not available
    const patientName = 'Unknown Patient';
    const patientAge = 'N/A';
    const patientInitials = '??';


    const admissionTime = new Date(appointment.admissionDatetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return (
        <div className="flex items-center justify-between p-3 border-b">
            <div className="flex items-center">
            <span className="text-sm font-semibold text-gray-600 w-16">{admissionTime}</span>
            <div className="flex items-center ml-4">
                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600 mr-4">{patientInitials}</div>
                <div>
                <p className="font-semibold text-gray-800">{patientName}</p>
                <p className="text-sm text-gray-500">{patientAge} yrs • {appointment.visitReason}</p>
                </div>
            </div>
            </div>
            <div className="flex items-center gap-2">
            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusMap[appointment.visitStatus] || 'bg-gray-100 text-gray-800'}`}>{appointment.visitStatus}</span>
            <Button variant="outline" size="sm">Open Chart</Button>
            </div>
        </div>
    );
};

const TaskItem = ({ title, patient, time, priority, priorityColor }) => (
    <div className="p-4 bg-white rounded-lg shadow-sm border mb-3">
        <div className="flex justify-between items-start">
            <div>
                <p className="font-semibold text-gray-800">{title}</p>
                <p className="text-sm text-gray-500">{patient}</p>
            </div>
            <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${priorityColor}`}>{priority}</span>
        </div>
        <p className="text-xs text-gray-400 mt-2">{time} ago</p>
    </div>
);


const RecentPatientCard = ({ patient }: { patient: Patient }) => {
    const lastSeen = patient.lastSeen ? `Last seen ${patient.lastSeen}` : 'No recent visits';
    const conditions = patient.activeProblemList?.split(',').map(c => c.trim()) || ['No active problems'];
    
    return (
        <Card className="shadow-sm">
            <CardContent className="p-4">
                <div className="flex justify-between items-start">
                    <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600 mr-3">{getInitials(patient.fullName)}</div>
                        <div>
                            <p className="font-semibold text-gray-800">{patient.fullName}</p>
                            <p className="text-sm text-gray-500">{lastSeen}</p>
                        </div>
                    </div>
                    {patient.allergyFlag !== 'None' && <div className="h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">!</div>}
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                    {conditions.slice(0, 2).map(cond => (
                        <span key={cond} className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-md">{cond}</span>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
};

export default function PhysicianDashboard() {
  const { user } = useUser();
  const firestore = useFirestore();

  const patientsCollection = useMemoFirebase(
      () => collection(firestore, 'patients'), 
      [firestore]
  );
  const { data: patients, isLoading: isLoadingPatients } = useCollection<Patient>(patientsCollection);

  const today = new Date();
  const startOfToday = new Date(today.setHours(0, 0, 0, 0)).toISOString();
  const endOfToday = new Date(today.setHours(23, 59, 59, 999)).toISOString();

  const appointmentsQuery = useMemoFirebase(
    () => query(
        collectionGroup(firestore, 'encounters'), 
        where('admissionDatetime', '>=', startOfToday),
        where('admissionDatetime', '<=', endOfToday),
        limit(5)
    ),
    [firestore, startOfToday, endOfToday]
  );
  const { data: appointments, isLoading: isLoadingAppointments } = useCollection<Encounter>(appointmentsQuery);

  const recentPatients = patients?.slice(0, 3) || [];

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />
      <main className="p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold font-grotesk text-gray-800">Welcome back, {user?.displayName?.split(' ')[0] || 'Doctor'}</h1>
            <p className="text-gray-600">Here's what's happening today</p>
          </div>
          <Button className="bg-primary hover:bg-primary/90">
            <Calendar className="mr-2 h-4 w-4" /> New Patient Record
          </Button>
        </div>

        {/* Stat Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <StatCard title="Today's Appointments" value={isLoadingAppointments ? '...' : appointments?.length || 0} icon={Calendar} colorClass="bg-blue-500" />
          <StatCard title="Pending Tasks" value="8" icon={AlertCircle} colorClass="bg-orange-500" />
          <StatCard title="Active Patients" value={isLoadingPatients ? '...' : patients?.length || 0} icon={Users} colorClass="bg-green-500" />
          <StatCard title="Avg. Wait Time" value="15 min" icon={Clock} colorClass="bg-purple-500" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Today's Schedule */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="font-grotesk text-xl">Today's Schedule</CardTitle>
                 <Button variant="outline">
                    <Calendar className="mr-2 h-4 w-4" /> View Full Calendar
                </Button>
              </CardHeader>
              <CardContent className="p-0">
                {isLoadingAppointments && <div className="p-4 text-center">Loading appointments...</div>}
                {appointments && appointments.length > 0 ? (
                    appointments.map(app => <AppointmentItem key={app.id} appointment={app} />)
                ) : (
                    !isLoadingAppointments && <div className="p-4 text-center text-gray-500">No appointments scheduled for today.</div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Pending Tasks */}
          <div>
            <h2 className="text-xl font-bold font-grotesk mb-4 text-gray-800">Pending Tasks</h2>
            <div className="space-y-4">
                <TaskItem title="Review lab results for Michael Chen" patient="" time="30 min" priority="High" priorityColor="bg-red-100 text-red-800" />
                <TaskItem title="Sign prescription refill for Sarah Johnson" patient="" time="1 hour" priority="Medium" priorityColor="bg-yellow-100 text-yellow-800" />
                <TaskItem title="Complete discharge summary for Robert Wilson" patient="" time="2 hours" priority="High" priorityColor="bg-red-100 text-red-800" />
                <TaskItem title="Review imaging results" patient="" time="3 hours" priority="Low" priorityColor="bg-gray-100 text-gray-800" />
            </div>
          </div>
        </div>
        
        {/* Recent Patients */}
        <div className="mt-8">
            <h2 className="text-xl font-bold font-grotesk mb-4 text-gray-800">Recent Patients</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoadingPatients && <p>Loading patients...</p>}
                {recentPatients.map(patient => (
                    <RecentPatientCard key={patient.id} patient={patient} />
                ))}
            </div>
        </div>

      </main>
    </div>
  );
}
