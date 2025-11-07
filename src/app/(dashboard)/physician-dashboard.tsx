
'use client';
import { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, AlertCircle, Users, Clock, FilePlus2, Search, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { PatientRegistrationForm, PatientRegistrationData } from './patient-registration-form';
import { useToast } from '@/hooks/use-toast';
import { PatientDetailSheet } from './patient-detail-sheet';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { useCollection, useFirebase, useMemoFirebase, useUser, addDocumentNonBlocking } from '@/firebase';
import { collection, query, where, orderBy, limit } from 'firebase/firestore';
import type { Patient as PatientData, Task } from '@/lib/sample-data';


const kpiData = [
    { title: "Today's Appointments", icon: Calendar, color: "text-blue-500", borderColor: "border-blue-500", id: "appointments" },
    { title: "Pending Tasks", icon: AlertCircle, color: "text-orange-500", borderColor: "border-orange-500", id: "tasks" },
    { title: "Active Patients", icon: Users, color: "text-green-500", borderColor: "border-green-500", id: "patients" },
    { title: "Avg. Wait Time", value: "15 min", icon: Clock, color: "text-purple-500", borderColor: "border-purple-500", id: "wait-time" },
];

export type RecentPatient = PatientData;

const PATIENTS_PER_PAGE = 5;

export default function PhysicianDashboard() {
  const { firestore } = useFirebase();
  const { user } = useUser();

  const [isFormOpen, setFormOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showAllPatientsDialog, setShowAllPatientsDialog] = useState(false);
  const [showAllTasks, setShowAllTasks] = useState(false);
  const { toast } = useToast();
  const [selectedPatient, setSelectedPatient] = useState<RecentPatient | null>(null);
  const [selectedAppointmentStatus, setSelectedAppointmentStatus] = useState<string | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const physicianPatientsQuery = useMemoFirebase(() => {
    if (!firestore || !user?.displayName) return null;
    return query(collection(firestore, 'patients'), where('consultant', '==', user.displayName));
  }, [firestore, user?.displayName]);

  const { data: allPatients, isLoading: allPatientsLoading } = useCollection<PatientData>(physicianPatientsQuery);

  const recentPatientsQuery = useMemoFirebase(() => {
    if (!firestore || !user?.displayName) return null;
    return query(collection(firestore, 'patients'), where('consultant', '==', user.displayName), orderBy('lastSeen', 'desc'), limit(3));
  }, [firestore, user?.displayName]);
  
  const { data: recentPatients, isLoading: patientsLoading } = useCollection<PatientData>(recentPatientsQuery);
  
  const tasksQuery = useMemoFirebase(() => {
    if (!firestore || !user?.displayName) return null;
    return query(collection(firestore, 'tasks'), limit(5));
  }, [firestore, user?.displayName]);
  const { data: allTasks, isLoading: tasksLoading } = useCollection<Task>(tasksQuery);
  
  const schedule = useMemo(() => {
    if (!allPatients) return [];
    const scheduleTimes = ['09:00', '09:30', '10:15', '11:00', '14:00'];
    const reasons = ['Follow-up', 'Diabetes Check', 'Annual Physical', 'Hypertension', 'Lab Review'];
    const statuses = ['Completed', 'In Progress', 'Waiting', 'Scheduled', 'Scheduled'];
    
    return allPatients.slice(0, 5).map((patient, index) => ({
      time: scheduleTimes[index % scheduleTimes.length],
      name: patient.name,
      age: patient.dob ? new Date().getFullYear() - new Date(patient.dob).getFullYear() : 0,
      reason: reasons[index % reasons.length],
      status: statuses[index % statuses.length],
      mrn: patient.mrn,
      id: patient.id
    }));
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
        consultant: user?.displayName || 'Dr. Sarah Anderson',
        hospital: 'City General',
        lastSeen: new Date().toLocaleDateString(),
        alerts: 0,
        mrn: `MRN-${Math.floor(1000 + Math.random() * 9000)}`
    };

    try {
        await addDocumentNonBlocking(collection(firestore, 'patients'), newPatient);
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
  
  const handleOpenChart = (mrn?: string, status?: string) => {
    if (!mrn) {
        toast({
            title: 'No MRN available',
            description: 'Cannot open chart for this patient.',
            variant: 'destructive',
        })
        return;
    };
    
    const patient = allPatients?.find(p => p.mrn === mrn);
    if (patient) {
        setSelectedPatient(patient as RecentPatient);
        setSelectedAppointmentStatus(status);
    } else {
        toast({
            title: 'Patient Not Found',
            description: `Could not find patient with MRN: ${mrn}. The data may still be loading.`,
            variant: 'destructive',
        })
    }
  };

  const handleKpiClick = (id: string) => {
    if (id === 'patients') {
      setShowAllPatientsDialog(true);
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
  
  const isLoading = patientsLoading || tasksLoading || allPatientsLoading || !user?.displayName;
  if (isLoading) {
    return <div className="flex items-center justify-center p-16"><Loader2 className="h-12 w-12 animate-spin text-muted-foreground" /></div>;
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
                className={`flex items-center p-4 border-l-4 ${kpi.borderColor} ${kpi.id === 'patients' || kpi.id === 'tasks' ? 'cursor-pointer hover:bg-secondary/50' : ''}`}
                onClick={() => handleKpiClick(kpi.id)}
              >
                  <div className="flex-1">
                      <p className="text-sm text-muted-foreground">{kpi.title}</p>
                      <p className="text-2xl font-bold">{
                        kpi.id === 'patients' ? (allPatients?.length || 0) :
                        kpi.id === 'tasks' ? allTasks?.length || 0 : 
                        kpi.id === 'appointments' ? schedule.length : kpi.value
                      }</p>
                  </div>
                  <kpi.icon className={`h-8 w-8 ${kpi.color}`} />
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
              <Table>
                <TableBody>
                  {schedule.filter(appt => appt.status !== 'Completed').map((appt, i) => (
                      <TableRow key={i}>
                          <TableCell className="font-semibold text-muted-foreground w-24">{appt.time}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-10 w-10">
                                  <AvatarFallback>{appt.name.split(' ').map(n=>n[0]).join('')}</AvatarFallback>
                              </Avatar>
                              <div>
                                  <p className="font-semibold text-base">{appt.name}</p>
                                  <p className="text-sm text-muted-foreground">{appt.age} yrs • {appt.reason}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{getStatusBadge(appt.status)}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" onClick={() => handleOpenChart(appt.mrn, appt.status)}>Open Chart</Button>
                          </TableCell>
                      </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Pending Tasks */}
          <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Pending Tasks</CardTitle>
                  <Button variant="link" size="sm" onClick={() => setShowAllTasks(true)}>View All</Button>
              </CardHeader>
              <CardContent>
                  <div className="space-y-3">
                      {(allTasks || []).slice(0,4).map((task, i) => (
                          <div key={i} className="flex items-start justify-between p-4 rounded-lg border bg-background hover:bg-secondary/50 transition-colors cursor-pointer" onClick={() => handleOpenChart(task.mrn)}>
                              <div className="flex-grow">
                                  <p className="font-semibold text-sm">{task.description}</p>
                                  <p className="text-xs text-muted-foreground mt-1">
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
                                    &bull; {task.time}
                                  </p>
                              </div>
                              <div className="ml-4">
                                {getPriorityBadge(task.priority)}
                              </div>
                          </div>
                      ))}
                  </div>
              </CardContent>
          </Card>
        </div>

        {/* Recent Patients */}
        <div className="space-y-4">
            <h2 className="text-xl font-semibold tracking-tight">Recent Patients</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(recentPatients || []).map((patient, i) => (
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
            </div>
        </div>
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
                <DialogDescription>A complete list of all patients assigned to you.</DialogDescription>
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
                        <TableRow key={index} className="cursor-pointer" onClick={() => handleOpenChart(task.mrn)}>
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

    