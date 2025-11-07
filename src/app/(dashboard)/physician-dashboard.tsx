
'use client';
import { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, AlertCircle, Users, Clock, FilePlus2, FileClock, ClipboardCheck, Pill, Search } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { PatientRegistrationForm, PatientRegistrationData } from './patient-registration-form';
import { useToast } from '@/hooks/use-toast';
import { PatientDetailSheet } from './patient-detail-sheet';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TreatmentJourney } from './treatment-journey';
import { Input } from '@/components/ui/input';
import { useCollection, useFirebase, useMemoFirebase, useUser } from '@/firebase';
import { collection, query, where, addDoc } from 'firebase/firestore';
import type { Patient as PatientData, Task } from '@/lib/sample-data';


const kpiData = [
    { title: "Today's Appointments", value: 12, icon: Calendar, color: "text-blue-500", id: "appointments" },
    { title: "Pending Tasks", value: 6, icon: AlertCircle, color: "text-orange-500", id: "tasks" },
    { title: "Active Patients", value: 156, icon: Users, color: "text-green-500", id: "patients" },
    { title: "Avg. Wait Time", value: "15 min", icon: Clock, color: "text-purple-500", id: "wait-time" },
];

const schedule = [
    { time: '09:00', name: 'Sarah Johnson', age: 45, reason: 'Follow-up', status: 'Completed', mrn: 'MRN-0921' },
    { time: '09:30', name: 'James Martinez', age: 62, reason: 'Diabetes Check', status: 'In Progress', mrn: 'MRN-0847' },
    { time: '10:15', name: 'Emma Davis', age: 34, reason: 'Annual Physical', status: 'Waiting', mrn: 'MRN-1055' },
    { time: '11:00', name: 'Robert Wilson', age: 58, reason: 'Hypertension', status: 'Scheduled', mrn: 'MRN-0921' },
    { time: '14:00', name: 'Lisa Anderson', age: 41, reason: 'Lab Review', status: 'Scheduled', mrn: 'MRN-0847' },
];

export type RecentPatient = PatientData;

export type JourneyTask = {
  title: string;
  description: string;
  status: 'Completed' | 'In Progress' | 'Upcoming';
  icon: React.ElementType;
  completedBy?: string;
};

const PATIENTS_PER_PAGE = 5;

export default function PhysicianDashboard() {
  const { firestore } = useFirebase();
  const { user } = useUser();

  const [isFormOpen, setFormOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showAllPatientsDialog, setShowAllPatientsDialog] = useState(false);
  const [showAllTasks, setShowAllTasks] = useState(false);
  const [showJourney, setShowJourney] = useState(false);
  const [selectedPatientForJourney, setSelectedPatientForJourney] = useState<RecentPatient | null>(null);
  const [showActivePatientsDialog, setShowActivePatientsDialog] = useState(false);
  const { toast } = useToast();
  const [selectedPatient, setSelectedPatient] = useState<RecentPatient | null>(null);
  const [selectedAppointmentStatus, setSelectedAppointmentStatus] = useState<string | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const patientsQuery = useMemoFirebase(() => firestore ? collection(firestore, 'patients') : null, [firestore]);
  const { data: allPatients, isLoading: patientsLoading } = useCollection<PatientData>(patientsQuery);
  
  const tasksQuery = useMemoFirebase(() => firestore ? collection(firestore, 'tasks') : null, [firestore]);
  const { data: allTasks, isLoading: tasksLoading } = useCollection<Task>(tasksQuery);
  
  const recentPatients = useMemo(() => {
    if (!allPatients) return [];
    // simple sort for recency for now
    return allPatients.sort((a, b) => (a.lastSeen && b.lastSeen && a.lastSeen > b.lastSeen ? -1 : 1)).slice(0, 3);
  }, [allPatients]);
  
  const handleSavePatient = async (data: PatientRegistrationData) => {
    if(!firestore) return;
    setIsSaving(true);

    const newPatient: Partial<PatientData> = {
        name: `${data.firstName} ${data.lastName}`,
        dob: data.dob.toISOString().split('T')[0],
        gender: data.gender as PatientData['gender'],
        ssnLast4: data.ssn ? data.ssn.slice(-4) : '',
        maritalStatus: data.maritalStatus as PatientData['maritalStatus'],
        contact: {
            phone: data.primaryPhone,
            email: data.email,
            address: {
                line1: data.streetAddress,
                city: data.city,
                state: data.state,
                zip: data.zipCode,
            },
        },
        emergencyContact: {
            name: data.emergencyContactName,
            phone: data.emergencyContactPhone,
        },
        insurance: {
            provider: data.insuranceProvider,
            policyNumber: data.policyNumber,
            groupNumber: data.groupNumber || '',
            status: 'Active',
        },
        status: 'Admitted',
        ward: 'General Medicine',
        consultant: 'Dr. Anderson',
        hospital: 'City General',
        lastSeen: new Date().toLocaleDateString(),
        alerts: 0,
        mrn: `MRN-${Math.floor(1000 + Math.random() * 9000)}`
    };

    try {
        await addDoc(collection(firestore, 'patients'), newPatient);
        toast({
            title: 'Patient Registered',
            description: `${data.firstName} ${data.lastName} has been successfully added to the system.`,
        });
        setFormOpen(false);
    } catch (error) {
        console.error("Error adding patient: ", error);
        toast({
            title: 'Registration Failed',
            description: 'Could not save patient data. Please try again.',
            variant: 'destructive',
        });
    } finally {
        setIsSaving(false);
    }
  };
  
  const handleOpenChart = (mrn: string, status?: string) => {
    const patient = allPatients?.find(p => p.mrn === mrn);
    if (patient) {
        setSelectedPatient(patient as RecentPatient);
        setSelectedAppointmentStatus(status);
    } else {
        // Fallback for when patient is not in the initially loaded list
        const fullPatientRecord = allPatients?.find(p => p.mrn === mrn);
        if (fullPatientRecord) {
            setSelectedPatient(fullPatientRecord as RecentPatient);
            setSelectedAppointmentStatus(status);
        } else {
            toast({
                title: 'Patient Not Found',
                description: 'The selected patient\'s detailed chart is not available.',
                variant: 'destructive',
            })
        }
    }
  };

  const handleKpiClick = (id: string) => {
    if (id === 'patients') {
      setShowActivePatientsDialog(true);
    }
     if (id === 'tasks') {
      setShowAllTasks(true);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
        case 'Completed': return <Badge className="bg-gray-800 text-white hover:bg-gray-700">Completed</Badge>;
        case 'In Progress': return <Badge variant="secondary">In Progress</Badge>;
        case 'Waiting': return <Badge variant="outline" className="text-orange-500 border-orange-500">Waiting</Badge>;
        case 'Scheduled': return <Badge variant="outline">Scheduled</Badge>;
        default: return <Badge>{status}</Badge>;
    }
  }
  
  const getPatientStatusBadge = (status: string) => {
    switch (status) {
        case 'Occupied': return <Badge variant="default">Occupied</Badge>;
        case 'Discharging': return <Badge variant="secondary">Discharging</Badge>;
        case 'Admitted': return <Badge variant="outline">Admitted</Badge>;
        default: return <Badge>{status}</Badge>;
    }
}

  const getPriorityBadge = (priority: string) => {
    switch(priority) {
        case 'High': return <Badge variant="destructive">High</Badge>;
        case 'Medium': return <Badge className="bg-yellow-500 text-white hover:bg-yellow-400">Medium</Badge>;
        case 'Low': return <Badge variant="secondary">Low</Badge>;
        default: return <Badge>{priority}</Badge>;
    }
  }

  const handleTaskClick = (mrn: string) => {
    const patient = allPatients?.find(p => p.mrn === mrn);
    if (patient) {
        setSelectedPatientForJourney(patient as RecentPatient);
        setShowJourney(true);
    } else {
        toast({
            title: 'Patient Not Found',
            description: 'Cannot display journey for the selected task\'s patient.',
            variant: 'destructive',
        })
    }
  };
  
const treatmentJourneyMartinez: JourneyTask[] = [
    { 
        title: 'Initial Consultation',
        description: 'Patient admitted for chest pain.',
        status: 'Completed',
        icon: ClipboardCheck,
        completedBy: 'Dr. Anderson'
    },
    { 
        title: 'Lab Work & Vitals',
        description: 'Troponin, EKG, and vital signs checked.',
        status: 'Completed',
        icon: ClipboardCheck,
        completedBy: 'Nurse Smith'
    },
    { 
        title: 'Medication Adjustment',
        description: 'Lisinopril increased to 20mg.',
        status: 'In Progress',
        icon: Pill
    },
    { 
        title: 'Follow-up Appointment',
        description: 'Scheduled for 4 weeks post-discharge.',
        status: 'Upcoming',
        icon: FileClock
    },
    { 
        title: 'Discharge Summary',
        description: 'Awaiting final sign-off.',
        status: 'Upcoming',
        icon: FileClock
    },
];

const treatmentJourneyLee: JourneyTask[] = [
    { 
        title: 'Initial Diagnosis',
        description: 'Patient diagnosed with COPD and High Cholesterol.',
        status: 'Completed',
        icon: ClipboardCheck,
        completedBy: 'Dr. Anderson'
    },
    { 
        title: 'Prescription Initiated',
        description: 'Symbicort and Lipitor prescribed.',
        status: 'Completed',
        icon: Pill,
        completedBy: 'Dr. Anderson'
    },
    { 
        title: 'Lab Results Review',
        description: 'Cholesterol levels remain elevated.',
        status: 'In Progress',
        icon: ClipboardCheck,
    },
    { 
        title: 'Smoking Cessation Counseling',
        description: 'Scheduled with a specialist.',
        status: 'Upcoming',
        icon: FileClock
    },
    { 
        title: 'Pulmonary Function Test',
        description: 'Scheduled for next month.',
        status: 'Upcoming',
        icon: FileClock
    },
];

  const currentJourney = selectedPatientForJourney?.mrn === 'MRN-1055' 
    ? treatmentJourneyLee 
    : treatmentJourneyMartinez;

  const filteredPatients = useMemo(() => {
    if (!allPatients) return [];
    return allPatients.filter(patient =>
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (patient.mrn && patient.mrn.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [allPatients, searchQuery]);

  const totalPages = Math.ceil(filteredPatients.length / PATIENTS_PER_PAGE);
  const paginatedPatients = filteredPatients.slice(
    (currentPage - 1) * PATIENTS_PER_PAGE,
    currentPage * PATIENTS_PER_PAGE
  );
  
  if (patientsLoading || tasksLoading) {
    return <div>Loading physician dashboard...</div>;
  }

  return (
    <>
      <div className="space-y-6 animate-fade-in">
        <header className="flex items-center justify-between">
          <div>
              <h1 className="font-headline text-3xl font-bold tracking-tight">
              Welcome back, {user?.displayName || 'Dr. Anderson'}
              </h1>
              <p className="text-muted-foreground">
              Here's what's happening today
              </p>
          </div>
          <Button onClick={() => setFormOpen(true)}>
              <FilePlus2 className="mr-2 h-4 w-4" />
              New Patient Record
          </Button>
        </header>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {kpiData.map((kpi) => (
              <Card 
                key={kpi.title} 
                className={`flex items-center p-4 ${kpi.id === 'patients' || kpi.id === 'tasks' ? 'cursor-pointer hover:bg-secondary/50' : ''}`}
                onClick={() => handleKpiClick(kpi.id)}
              >
                  <div className={`mr-4 p-3 rounded-lg bg-secondary ${kpi.color}`}>
                      <kpi.icon className="h-6 w-6" />
                  </div>
                  <div>
                      <p className="text-sm text-muted-foreground">{kpi.title}</p>
                      <p className="text-2xl font-bold">{kpi.id === 'tasks' ? allTasks?.length || 0 : kpi.value}</p>
                  </div>
              </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Today's Schedule */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Today's Schedule</CardTitle>
              <Button variant="outline" size="sm">
                  <Calendar className="mr-2 h-4 w-4"/>
                  View Full Calendar
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                  {schedule.filter(appt => appt.status !== 'Completed').map((appt, i) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-lg hover:bg-secondary/50 transition-colors">
                          <div className="flex items-center gap-4">
                              <span className="font-semibold text-sm w-12 text-muted-foreground">{appt.time}</span>
                              <Avatar className="h-10 w-10">
                                  <AvatarFallback>{appt.name.split(' ').map(n=>n[0]).join('')}</AvatarFallback>
                              </Avatar>
                              <div>
                                  <p className="font-semibold text-base">{appt.name}</p>
                                  <p className="text-sm text-muted-foreground">{appt.age} yrs • {appt.reason}</p>
                              </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {getStatusBadge(appt.status)}
                            <Button variant="ghost" onClick={() => handleOpenChart(appt.mrn, appt.status)}>Open Chart</Button>
                          </div>
                      </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          {/* Pending Tasks */}
          <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Pending Tasks</CardTitle>
                  <Button variant="link" size="sm" onClick={() => setShowAllTasks(true)}>View All</Button>
              </CardHeader>
              <CardContent>
                  <div className="space-y-2">
                      {(allTasks || []).slice(0,5).map((task, i) => (
                          <div key={i} className="flex items-center justify-between p-3 rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer" onClick={() => handleTaskClick(task.mrn)}>
                              <div className="flex-grow">
                                  <p className="font-semibold text-sm">{task.description}</p>
                                  <p className="text-xs text-muted-foreground">
                                    Patient:{" "}
                                    <Button
                                        variant="link"
                                        className="p-0 h-auto text-xs"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleOpenChart(task.mrn);
                                        }}
                                    >
                                        {task.patient}
                                    </Button>{" "}
                                    &bull; Due: {task.time}
                                  </p>
                              </div>
                              {getPriorityBadge(task.priority)}
                          </div>
                      ))}
                  </div>
              </CardContent>
          </Card>
        </div>

        {/* Recent Patients */}
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Recent Patients</CardTitle>
                <Button variant="link" size="sm" onClick={() => { setSearchQuery(''); setCurrentPage(1); setShowAllPatientsDialog(true); }}>View All</Button>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recentPatients.map((patient, i) => (
                    <Card key={i} className="flex flex-col cursor-pointer hover:bg-secondary/50 transition-colors" onClick={() => setSelectedPatient(patient)}>
                        <CardContent className="p-4 flex-grow">
                          <div className="flex items-start justify-between">
                              <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10">
                                    <AvatarFallback>{patient.name.split(' ').map(n=>n[0]).join('')}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-semibold">{patient.name}</p>
                                    <p className="text-sm text-muted-foreground">{patient.lastSeen}</p>
                                </div>
                              </div>
                              {patient.alerts && patient.alerts > 0 && <Badge variant="destructive" className="flex items-center justify-center rounded-full h-6 w-6 p-0">{patient.alerts}</Badge>}
                          </div>
                          <div className="mt-3 flex flex-wrap gap-1">
                              {patient.conditions?.slice(0, 2).map((cond, j) => (
                                  <Badge key={j} variant="outline" className="text-xs">{cond.name}</Badge>
                              ))}
                          </div>
                        </CardContent>
                    </Card>
                ))}
            </CardContent>
        </Card>
      </div>
      
      <Dialog open={isFormOpen} onOpenChange={setFormOpen}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>New Patient Registration</DialogTitle>
              <DialogDescription>
                Complete the form below to register a new patient in the system.
              </DialogDescription>
            </DialogHeader>
            <PatientRegistrationForm 
              onSubmit={handleSavePatient}
              onCancel={() => setFormOpen(false)}
              isSaving={isSaving}
            />
          </DialogContent>
      </Dialog>
      
      <Dialog open={showAllPatientsDialog} onOpenChange={setShowAllPatientsDialog}>
        <DialogContent className="max-w-4xl">
            <DialogHeader>
                <DialogTitle>All Patients</DialogTitle>
                <DialogDescription>A complete list of all patients in the system.</DialogDescription>
                 <div className="relative pt-2">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                        placeholder="Search by name or MRN..." 
                        className="pl-9" 
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setCurrentPage(1);
                        }}
                    />
                </div>
            </DialogHeader>
             <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>MRN</TableHead>
                        <TableHead>Ward</TableHead>
                        <TableHead>Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {paginatedPatients.map((patient) => (
                        <TableRow key={patient.id}>
                            <TableCell className="font-medium">
                                <Button
                                    variant="link"
                                    className="p-0 h-auto"
                                    onClick={() => {
                                        handleOpenChart(patient.mrn || '');
                                        setShowAllPatientsDialog(false);
                                    }}
                                >
                                    {patient.name}
                                </Button>
                            </TableCell>
                            <TableCell>{patient.mrn}</TableCell>
                            <TableCell>{patient.ward}</TableCell>
                            <TableCell>{getPatientStatusBadge(patient.status)}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <DialogFooter className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                    Showing page {currentPage} of {totalPages}
                </p>
                <div className="flex gap-2">
                    <Button 
                        variant="outline"
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </Button>
                    <Button 
                        variant="outline"
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </Button>
                </div>
            </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={showActivePatientsDialog} onOpenChange={setShowActivePatientsDialog}>
        <DialogContent className="max-w-4xl">
            <DialogHeader className="flex-row items-center justify-between">
                <div>
                    <DialogTitle>Active Patients</DialogTitle>
                    <DialogDescription>A list of recently active patients.</DialogDescription>
                </div>
                 <Button variant="link" onClick={() => { setShowActivePatientsDialog(false); setShowAllPatientsDialog(true); }}>View All Patients</Button>
            </DialogHeader>
             <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>MRN</TableHead>
                        <TableHead>Gender</TableHead>
                        <TableHead>Last Seen</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {recentPatients.map((patient) => (
                        <TableRow key={patient.mrn} className="cursor-pointer" onClick={() => {
                            setSelectedPatient(patient);
                            setShowActivePatientsDialog(false);
                        }}>
                            <TableCell className="font-medium">
                                <Button variant="link" className="p-0 h-auto">{patient.name}</Button>
                            </TableCell>
                            <TableCell>{patient.mrn}</TableCell>
                            <TableCell>{patient.gender}</TableCell>
                            <TableCell>{patient.lastSeen}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </DialogContent>
      </Dialog>

      <Dialog open={showAllTasks} onOpenChange={setShowAllTasks}>
        <DialogContent className="max-w-4xl">
            <DialogHeader>
                <DialogTitle>All Pending Tasks</DialogTitle>
                <DialogDescription>Overview of all pending physician tasks.</DialogDescription>
            </DialogHeader>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Task</TableHead>
                        <TableHead>Patient</TableHead>
                        <TableHead>MRN</TableHead>
                        <TableHead>Due</TableHead>
                        <TableHead>Priority</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {(allTasks || []).map((task, index) => (
                        <TableRow key={index} className="cursor-pointer" onClick={() => handleTaskClick(task.mrn)}>
                            <TableCell className="font-medium">{task.description}</TableCell>
                            <TableCell>{task.patient}</TableCell>
                            <TableCell>{task.mrn}</TableCell>
                            <TableCell>{task.time}</TableCell>
                            <TableCell>{getPriorityBadge(task.priority)}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </DialogContent>
      </Dialog>

      <Dialog open={showJourney} onOpenChange={setShowJourney}>
          <DialogContent>
            <DialogHeader>
                <DialogTitle>Treatment Journey</DialogTitle>
                <DialogDescription>Patient: {selectedPatientForJourney?.name}</DialogDescription>
            </DialogHeader>
            <TreatmentJourney journey={currentJourney} />
          </DialogContent>
      </Dialog>

      <PatientDetailSheet 
        patient={selectedPatient}
        isOpen={!!selectedPatient}
        onOpenChange={(isOpen) => {
            if (!isOpen) {
                setSelectedPatient(null);
                setSelectedAppointmentStatus(undefined);
            }
        }}
        appointmentStatus={selectedAppointmentStatus}
      />
    </>
  );
}
