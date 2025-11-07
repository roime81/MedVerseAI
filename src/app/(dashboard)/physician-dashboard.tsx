'use client';
import { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, AlertCircle, Users, Clock, FilePlus2, FileClock, ClipboardCheck, Pill, Search } from "lucide-react";
import { allPatients, Patient, allTasks } from "@/lib/sample-data";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { PatientRegistrationForm, PatientRegistrationData } from './patient-registration-form';
import { useToast } from '@/hooks/use-toast';
import { PatientDetailSheet } from './patient-detail-sheet';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TreatmentJourney } from './treatment-journey';
import { Input } from '@/components/ui/input';


const kpiData = [
    { title: "Today's Appointments", value: 12, icon: Calendar, color: "text-blue-500", id: "appointments" },
    { title: "Pending Tasks", value: allTasks.length, icon: AlertCircle, color: "text-orange-500", id: "tasks" },
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

export type RecentPatient = {
  name: string;
  lastSeen: string;
  alerts: number;
  mrn: string;
  dob: string;
  gender: 'Male' | 'Female' | 'Other';
  ssnLast4: string;
  maritalStatus: 'Married' | 'Single' | 'Divorced' | 'Widowed';
  contact: {
    phone: string;
    email: string;
    address: {
      line1: string;
      city: string;
      state: string;
      zip: string;
    };
  };
  emergencyContact: {
    name: string;
    phone: string;
  };
  insurance: {
    provider: string;
    policyNumber: string;
    groupNumber: string;
    status: 'Active' | 'Inactive';
  };
  conditions: {
    name: string;
    stage: string;
    code: string;
    diagnosedDate: string;
  }[];
  vitals: {
    date: string;
    bloodPressure: string;
    heartRate: string;
    temperature: string;
    weight: string;
    height: string;
    bmi: string;
  }[];
  medications: {
    name: string;
    dosage: string;
    frequency: string;
    prescriber: string;
    remaining: number;
    startDate: string;
  }[];
  labResults: {
    name: string;
    date: string;
    result: string;
    reference: string;
    status: 'Normal' | 'Elevated' | 'Low';
  }[];
  visitHistory: {
    type: string;
    date: string;
    doctor: string;
    chiefComplaint: string;
    diagnosis: string;
    notes: string;
  }[];
  immunizationHistory: {
    vaccine: string;
    date: string;
    administeredBy: string;
  }[];
  socialHistory: {
    smokingStatus: string;
    alcoholUse: string;
    exercise: string;
    occupation: string;
  };
  familyHistory: {
    relation: string;
    condition: string;
    notes: string;
  }[];
};

export type JourneyTask = {
  title: string;
  description: string;
  status: 'Completed' | 'In Progress' | 'Upcoming';
  icon: React.ElementType;
  completedBy?: string;
};

const initialRecentPatients: RecentPatient[] = [
  {
    name: 'James Martinez',
    lastSeen: '2 days ago',
    alerts: 2,
    mrn: 'MRN-0847',
    dob: '1965-03-12',
    gender: 'Male',
    ssnLast4: '4521',
    maritalStatus: 'Married',
    contact: {
      phone: '(555) 234-8901',
      email: 'james.martinez@email.com',
      address: {
        line1: '456 Oak Avenue, Apt 3B',
        city: 'New York',
        state: 'NY',
        zip: '10002',
      },
    },
    emergencyContact: {
      name: 'Maria Martinez',
      phone: '(555) 234-8902',
    },
    insurance: {
      provider: 'Medicare',
      policyNumber: 'MED-847521963',
      groupNumber: 'GRP-NY-001',
      status: 'Active',
    },
    conditions: [
      { name: 'Hypertension', stage: '(Stage 2)', code: 'I10', diagnosedDate: '2018-01-15' },
      { name: 'Type 2 Diabetes Mellitus', stage: '', code: 'E11.9', diagnosedDate: '2019-06-20' },
    ],
    vitals: [
        { date: '2025-11-05', bloodPressure: '145/92', heartRate: '82 bpm', temperature: '98.4°F', weight: '185 lbs', height: "5'10\"", bmi: '26.5' },
        { date: '2025-10-20', bloodPressure: '148/94', heartRate: '78 bpm', temperature: '98.6°F', weight: '187 lbs', height: "5'10\"", bmi: '26.8' },
        { date: '2025-09-15', bloodPressure: '152/96', heartRate: '85 bpm', temperature: '98.5°F', weight: '189 lbs', height: "5'10\"", bmi: '27.1' },
    ],
    medications: [
        { name: 'Lisinopril', dosage: '20mg', frequency: 'Once daily', prescriber: 'Dr. Sarah Anderson', remaining: 3, startDate: 'Jan 2018' },
        { name: 'Metformin', dosage: '1000mg', frequency: 'Twice daily', prescriber: 'Dr. Sarah Anderson', remaining: 2, startDate: 'Jun 2019' },
        { name: 'Atorvastatin', dosage: '40mg', frequency: 'Once daily at bedtime', prescriber: 'Dr. Sarah Anderson', remaining: 5, startDate: 'Jan 2018' },
        { name: 'Aspirin', dosage: '81mg', frequency: 'Once daily', prescriber: 'Dr. Sarah Anderson', remaining: 6, startDate: 'Jan 2018' },
    ],
    labResults: [
        { name: 'HbA1c', date: '2025-11-05', result: '7.2%', reference: '<7.0%', status: 'Elevated' },
        { name: 'Total Cholesterol', date: '2025-11-05', result: '195 mg/dL', reference: '<200 mg/dL', status: 'Normal' },
        { name: 'LDL Cholesterol', date: '2025-11-05', result: '115 mg/dL', reference: '<100 mg/dL', status: 'Elevated' },
        { name: 'HDL Cholesterol', date: '2025-11-05', result: '45 mg/dL', reference: '>40 mg/dL', status: 'Normal' },
        { name: 'Triglycerides', date: '2025-11-05', result: '175 mg/dL', reference: '<150 mg/dL', status: 'Elevated' },
        { name: 'Creatinine', date: '2025-11-05', result: '1.1 mg/dL', reference: '0.7-1.3 mg/dL', status: 'Normal' },
    ],
    visitHistory: [
        {
            type: 'Follow-up Visit',
            date: '2025-11-05',
            doctor: 'Dr. Sarah Anderson',
            chiefComplaint: 'Blood pressure management',
            diagnosis: 'Hypertension - poorly controlled',
            notes: 'Patient reports occasional headaches. BP readings at home averaging 145/90. Discussed lifestyle modifications including reduced sodium intake and increased physical activity. Increased Lisinopril from 10mg to 20mg. Follow-up in 4 weeks.'
        },
        {
            type: 'Routine Check-up',
            date: '2025-10-20',
            doctor: 'Dr. Sarah Anderson',
            chiefComplaint: 'Annual physical examination',
            diagnosis: 'Type 2 Diabetes - adequate control, Hypertension',
            notes: 'Patient is compliant with medications. HbA1c improved from 7.8% to 7.2%. Continue current diabetes management. BP slightly elevated, monitoring.'
        }
    ],
    immunizationHistory: [
      { vaccine: 'Influenza', date: '2025-10-05', administeredBy: 'Dr. Kim' },
      { vaccine: 'Tdap', date: '2022-08-15', administeredBy: 'Dr. Kim' }
    ],
    socialHistory: {
      smokingStatus: 'Former Smoker',
      alcoholUse: 'Socially',
      exercise: 'Walking 3x/week',
      occupation: 'Accountant'
    },
    familyHistory: [
      { relation: 'Father', condition: 'Myocardial Infarction', notes: 'Age 55' },
      { relation: 'Mother', condition: 'Hypertension', notes: '' }
    ]
  },
  {
    name: 'Patricia Brown',
    lastSeen: '5 days ago',
    alerts: 0,
    mrn: 'MRN-0921',
    dob: '1980-08-25',
    gender: 'Female',
    ssnLast4: '7890',
    maritalStatus: 'Single',
    contact: {
      phone: '(555) 555-1234',
      email: 'patricia.brown@email.com',
      address: { line1: '789 Pine St', city: 'Someville', state: 'CA', zip: '90210' },
    },
    emergencyContact: { name: 'John Brown', phone: '(555) 555-5678' },
    insurance: { provider: 'Blue Shield PPO', policyNumber: 'BS-12345', groupNumber: 'BS-GRP-1', status: 'Active' },
    conditions: [{ name: 'Asthma', stage: '', code: 'J45', diagnosedDate: '2010-05-10' }],
    vitals: [
      { date: '2025-11-01', bloodPressure: '120/80', heartRate: '72 bpm', temperature: '98.7°F', weight: '140 lbs', height: "5'5\"", bmi: '23.4' },
    ],
    medications: [
        { name: 'Albuterol', dosage: '90mcg', frequency: '2 puffs every 4-6 hours as needed', prescriber: 'Dr. Anderson', remaining: 1, startDate: 'May 2010' },
    ],
    labResults: [
        { name: 'Spirometry', date: '2025-11-01', result: 'FEV1 85%', reference: '>80%', status: 'Normal' },
    ],
    visitHistory: [],
    immunizationHistory: [
      { vaccine: 'Influenza', date: '2025-10-05', administeredBy: 'Dr. Kim' }
    ],
    socialHistory: {
      smokingStatus: 'Never',
      alcoholUse: 'None',
      exercise: 'Yoga 4x/week',
      occupation: 'Marketing Director'
    },
    familyHistory: [
      { relation: 'Mother', condition: 'Asthma', notes: 'Childhood onset' }
    ]
  },
  {
    name: 'David Lee',
    lastSeen: '1 week ago',
    alerts: 1,
    mrn: 'MRN-1055',
    dob: '1955-11-02',
    gender: 'Male',
    ssnLast4: '3456',
    maritalStatus: 'Widowed',
    contact: {
      phone: '(555) 987-6543',
      email: 'david.lee@email.com',
      address: { line1: '123 Maple Dr', city: 'Anytown', state: 'TX', zip: '75001' },
    },
    emergencyContact: { name: 'Susan Lee', phone: '(555) 987-1111' },
    insurance: { provider: 'Aetna', policyNumber: 'AET-98765', groupNumber: 'AET-GRP-2', status: 'Active' },
    conditions: [
      { name: 'COPD', stage: '', code: 'J44.9', diagnosedDate: '2021-02-01' },
      { name: 'High Cholesterol', stage: '', code: 'E78.5', diagnosedDate: '2020-11-11' },
    ],
    vitals: [
         { date: '2025-10-28', bloodPressure: '135/88', heartRate: '75 bpm', temperature: '98.2°F', weight: '170 lbs', height: "5'11\"", bmi: '23.7' },
    ],
    medications: [
         { name: 'Symbicort', dosage: '160/4.5 mcg', frequency: '1 inhalation twice daily', prescriber: 'Dr. Anderson', remaining: 1, startDate: 'Feb 2021' },
         { name: 'Lipitor', dosage: '20mg', frequency: 'Once daily', prescriber: 'Dr. Anderson', remaining: 4, startDate: 'Nov 2020' },
    ],
    labResults: [
        { name: 'Total Cholesterol', date: '2025-10-28', result: '210 mg/dL', reference: '<200 mg/dL', status: 'Elevated' },
        { name: 'LDL Cholesterol', date: '2025-10-28', result: '140 mg/dL', reference: '<100 mg/dL', status: 'Elevated' },
    ],
    visitHistory: [],
    immunizationHistory: [],
    socialHistory: {
      smokingStatus: 'Current Smoker',
      alcoholUse: 'Rarely',
      exercise: 'None',
      occupation: 'Retired'
    },
    familyHistory: []
  },
];

const PATIENTS_PER_PAGE = 5;

export default function PhysicianDashboard() {
  const [isFormOpen, setFormOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showAllPatientsDialog, setShowAllPatientsDialog] = useState(false);
  const [showAllTasks, setShowAllTasks] = useState(false);
  const [showJourney, setShowJourney] = useState(false);
  const [selectedPatientForJourney, setSelectedPatientForJourney] = useState<RecentPatient | null>(null);
  const [showActivePatientsDialog, setShowActivePatientsDialog] = useState(false);
  const { toast } = useToast();
  const [recentPatients, setRecentPatients] = useState(initialRecentPatients);
  const [selectedPatient, setSelectedPatient] = useState<RecentPatient | null>(null);
  const [selectedAppointmentStatus, setSelectedAppointmentStatus] = useState<string | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  
  const handleSavePatient = (data: PatientRegistrationData) => {
    setIsSaving(true);
    setTimeout(() => {
      const newPatient: Patient = {
        id: allPatients.length + 1,
        name: `${data.firstName} ${data.lastName}`,
        ward: 'General Medicine',
        hospital: 'City General',
        consultant: 'Dr. Anderson',
        status: 'Admitted',
      };
      // This is a mock update. In a real app, this would be a state update.
      // allPatients.push(newPatient);

      toast({
        title: 'Patient Registered',
        description: `${data.firstName} ${data.lastName} has been successfully added to the system.`,
      });
      setIsSaving(false);
      setFormOpen(false);
    }, 1000);
  };
  
  const handleOpenChart = (mrn: string, status?: string) => {
    const patient = recentPatients.find(p => p.mrn === mrn) || allPatients.find(p => p.mrn === mrn);
    if (patient) {
        setSelectedPatient(patient as RecentPatient);
        setSelectedAppointmentStatus(status);
    } else {
        toast({
            title: 'Patient Not Found',
            description: 'The selected patient\'s detailed chart is not available.',
            variant: 'destructive',
        })
    }
  };

  const handleKpiClick = (id: string) => {
    if (id === 'patients') {
      setShowActivePatientsDialog(true);
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
    const patient = recentPatients.find(p => p.mrn === mrn);
    if (patient) {
        setSelectedPatientForJourney(patient);
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
    return allPatients.filter(patient =>
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (patient.mrn && patient.mrn.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [searchQuery]);

  const totalPages = Math.ceil(filteredPatients.length / PATIENTS_PER_PAGE);
  const paginatedPatients = filteredPatients.slice(
    (currentPage - 1) * PATIENTS_PER_PAGE,
    currentPage * PATIENTS_PER_PAGE
  );

  return (
    <>
      <div className="space-y-6 animate-fade-in">
        <header className="flex items-center justify-between">
          <div>
              <h1 className="font-headline text-3xl font-bold tracking-tight">
              Welcome back, Dr. Anderson
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
                className={`flex items-center p-4 ${kpi.id === 'patients' ? 'cursor-pointer hover:bg-secondary/50' : ''}`}
                onClick={() => handleKpiClick(kpi.id)}
              >
                  <div className={`mr-4 p-3 rounded-lg bg-secondary ${kpi.color}`}>
                      <kpi.icon className="h-6 w-6" />
                  </div>
                  <div>
                      <p className="text-sm text-muted-foreground">{kpi.title}</p>
                      <p className="text-2xl font-bold">{kpi.value}</p>
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
                      {allTasks.slice(0,5).map((task, i) => (
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
                              {patient.alerts > 0 && <Badge variant="destructive" className="flex items-center justify-center rounded-full h-6 w-6 p-0">{patient.alerts}</Badge>}
                          </div>
                          <div className="mt-3 flex flex-wrap gap-1">
                              {patient.conditions.slice(0, 2).map((cond, j) => (
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
                        <TableRow 
                            key={patient.id} 
                            className="cursor-pointer"
                            onClick={() => {
                                handleOpenChart(patient.mrn || '');
                                setShowAllPatientsDialog(false);
                            }}
                        >
                            <TableCell className="font-medium">{patient.name}</TableCell>
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
                    {allTasks.map((task, index) => (
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
