
'use client';

import * as React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  User as UserIcon,
  Users,
  CalendarCheck,
  FlaskConical,
  AlertTriangle,
  Clock,
  MoreVertical,
  ArrowRight,
  Plus
} from 'lucide-react';
import { useUser, useFirestore, useMemoFirebase } from '@/firebase';
import type { Patient, Appointment } from '@/lib/types';
import { generatedData } from '@/lib/sample-data';
import { useCollection } from '@/firebase/firestore/use-collection';
import { collection, query, where, limit } from 'firebase/firestore';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { PatientChartSheet } from '@/components/dashboard/patient-chart/patient-chart-sheet';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import Link from 'next/link';

const SummaryCard = ({ icon: Icon, title, value, change, changeType, color, children }) => (
    <Card className="bg-card border-border">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
            <Icon className={`h-5 w-5 ${color}`} />
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold text-white">{value}</div>
            {children}
        </CardContent>
    </Card>
);

export default function PhysicianDashboard() {
  const { user } = useUser();
  const firestore = useFirestore();
  const [selectedPatient, setSelectedPatient] = React.useState<Patient | null>(null);
  const [isChartOpen, setIsChartOpen] = React.useState(false);

  // Use sample data directly for appointments and tasks
  const today = new Date();
  const appointments: Appointment[] = generatedData.sampleProcedures
      .filter(p => p.performingClinicianId === 'dr_emily_carter' && new Date(p.procedureDateTime).toDateString() === today.toDateString())
      .map((proc, index) => ({
          time: format(new Date(proc.procedureDateTime), 'h:mm a'),
          patient: generatedData.samplePatients.find(patient => patient.personId === proc.personId)!,
          status: index < 2 ? 'Completed' : (index === 2 ? 'In Progress' : 'Scheduled'),
      }));

  const tasks = generatedData.samplePendingTasks.filter(t => t.assignedTo === 'dr_emily_carter' && t.status === 'Pending');

  const handleRowClick = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsChartOpen(true);
  };
  
  const handleAppointmentComplete = () => {
    // This function can be used to update appointment status in a real implementation
    console.log('Appointment marked as complete');
  };

  const getStatusBadge = (status: Appointment['status']) => {
    switch (status) {
        case 'Completed': return <Badge variant="default" className="bg-green-600/20 text-green-400 border-none">Completed</Badge>;
        case 'In Progress': return <Badge variant="default" className="bg-blue-600/20 text-blue-400 border-none">In Progress</Badge>;
        case 'Scheduled': return <Badge variant="default" className="bg-gray-600/20 text-gray-400 border-none">Scheduled</Badge>;
        default: return <Badge variant="secondary">Waiting</Badge>;
    }
  };

  return (
    <div className="space-y-8 text-white">
        <div>
            <h1 className="text-3xl font-bold font-grotesk">Welcome back, {user?.displayName || 'Clinician'}!</h1>
            <p className="text-muted-foreground">Here's a snapshot of your day.</p>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <SummaryCard title="Total Patients" value="124" color="text-blue-500" icon={Users} />
            <SummaryCard title="Today's Appointments" value={appointments.length} color="text-indigo-500" icon={CalendarCheck}/>
            <SummaryCard title="Pending Lab Results" value="8" color="text-amber-500" icon={FlaskConical}/>
            <SummaryCard title="High-Risk Patients" value="5" color="text-red-500" icon={AlertTriangle}/>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Today's Appointments */}
            <Card className="bg-card border-border">
                <CardHeader>
                    <CardTitle className="text-white">Today's Appointments</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow className="border-border">
                                <TableHead className="text-muted-foreground">Patient</TableHead>
                                <TableHead className="text-muted-foreground">Time</TableHead>
                                <TableHead className="text-muted-foreground">Status</TableHead>
                                <TableHead className="text-right text-muted-foreground">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {appointments.map((appt, index) => (
                                <TableRow key={index} className="border-border" onClick={() => handleRowClick(appt.patient)}>
                                    <TableCell className="font-medium text-white">{appt.patient.fullName}</TableCell>
                                    <TableCell>{appt.time}</TableCell>
                                    <TableCell>{getStatusBadge(appt.status)}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="sm">View</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Pending Tasks */}
            <Card className="bg-card border-border">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-white">Pending Tasks</CardTitle>
                    <Link href="#" className="text-sm text-primary flex items-center gap-1">
                        View All <ArrowRight className="h-4 w-4" />
                    </Link>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {tasks.slice(0, 4).map(task => (
                            <div key={task.taskId} className="flex items-center">
                                <div className="flex-1">
                                    <p className="font-medium text-white">{task.description}</p>
                                    <p className="text-sm text-muted-foreground">
                                        For: {generatedData.samplePatients.find(p => p.personId === task.patientId)?.fullName}
                                    </p>
                                </div>
                                <Badge variant={task.priority === 'High' ? 'destructive' : 'secondary'}>{task.priority}</Badge>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
        {selectedPatient && (
            <PatientChartSheet
                patient={selectedPatient}
                open={isChartOpen}
                onOpenChange={setIsChartOpen}
                onAppointmentComplete={handleAppointmentComplete}
                appointmentStatus={appointments.find(a => a.patient.personId === selectedPatient.personId)?.status}
            />
        )}
    </div>
  );
}
