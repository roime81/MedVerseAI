'use client';
import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, AlertCircle, Users, Clock, FilePlus2, Check } from "lucide-react";
import { allPatients, Patient } from "@/lib/sample-data";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { PatientRegistrationForm, PatientRegistrationData } from './patient-registration-form';
import { useToast } from '@/hooks/use-toast';
import { PatientDetailSheet } from './patient-detail-sheet';


const kpiData = [
    { title: "Today's Appointments", value: 12, icon: Calendar, color: "text-blue-500" },
    { title: "Pending Tasks", value: 8, icon: AlertCircle, color: "text-orange-500" },
    { title: "Active Patients", value: 156, icon: Users, color: "text-green-500" },
    { title: "Avg. Wait Time", value: "15 min", icon: Clock, color: "text-purple-500" },
];

const schedule = [
    { time: '09:00', name: 'Sarah Johnson', age: 45, reason: 'Follow-up', status: 'Completed' },
    { time: '09:30', name: 'Michael Chen', age: 62, reason: 'Diabetes Check', status: 'In Progress' },
    { time: '10:15', name: 'Emma Davis', age: 34, reason: 'Annual Physical', status: 'Waiting' },
    { time: '11:00', name: 'Robert Wilson', age: 58, reason: 'Hypertension', status: 'Scheduled' },
    { time: '14:00', name: 'Lisa Anderson', age: 41, reason: 'Lab Review', status: 'Scheduled' },
];

const tasks = [
    { description: 'Review lab results for Michael Chen', time: '30 min ago', priority: 'High' },
    { description: 'Sign prescription refill for Sarah Johnson', time: '1 hour ago', priority: 'Medium' },
    { description: 'Complete discharge summary for Robert Wilson', time: '2 hours ago', priority: 'High' },
    { description: 'Review imaging results', time: '3 hours ago', priority: 'Low' },
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
        { date: '2025-11-03', bloodPressure: '145/92', heartRate: '82 bpm', temperature: '98.4°F', weight: '185 lbs', height: "5'10\"", bmi: '26.5' },
        { date: '2025-10-20', bloodPressure: '148/94', heartRate: '78 bpm', temperature: '98.6°F', weight: '187 lbs', height: "5'10\"", bmi: '26.8' },
        { date: '2025-09-15', bloodPressure: '152/96', heartRate: '85 bpm', temperature: '98.5°F', weight: '189 lbs', height: "5'10\"", bmi: '27.1' },
    ],
    medications: [
        { name: 'Lisinopril', dosage: '20mg', frequency: 'Once daily', prescriber: 'Dr. Anderson', remaining: 3, startDate: 'Jan 2018' },
        { name: 'Metformin', dosage: '1000mg', frequency: 'Twice daily', prescriber: 'Dr. Anderson', remaining: 2, startDate: 'Jun 2019' },
        { name: 'Atorvastatin', dosage: '40mg', frequency: 'Once daily at bedtime', prescriber: 'Dr. Anderson', remaining: 5, startDate: 'Jan 2018' },
        { name: 'Aspirin', dosage: '81mg', frequency: 'Once daily', prescriber: 'Dr. Anderson', remaining: 6, startDate: 'Jan 2018' },
    ],
    labResults: [
        { name: 'HbA1c', date: '2025-11-03', result: '7.2%', reference: '<7.0%', status: 'Elevated' },
        { name: 'Total Cholesterol', date: '2025-11-03', result: '195 mg/dL', reference: '<200 mg/dL', status: 'Normal' },
        { name: 'LDL Cholesterol', date: '2025-11-03', result: '115 mg/dL', reference: '<100 mg/dL', status: 'Elevated' },
        { name: 'HDL Cholesterol', date: '2025-11-03', result: '45 mg/dL', reference: '>40 mg/dL', status: 'Normal' },
        { name: 'Triglycerides', date: '2025-11-03', result: '175 mg/dL', reference: '<150 mg/dL', status: 'Elevated' },
        { name: 'Creatinine', date: '2025-11-03', result: '1.1 mg/dL', reference: '0.7-1.3 mg/dL', status: 'Normal' },
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
    ]
  },
];


export default function PhysicianDashboard() {
  const [isFormOpen, setFormOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const [recentPatients, setRecentPatients] = useState(initialRecentPatients);
  const [selectedPatient, setSelectedPatient] = useState<RecentPatient | null>(null);
  
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
      allPatients.push(newPatient);

      toast({
        title: 'Patient Registered',
        description: `${data.firstName} ${data.lastName} has been successfully added to the system.`,
      });
      setIsSaving(false);
      setFormOpen(false);
    }, 1000);
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

  const getPriorityBadge = (priority: string) => {
    switch(priority) {
        case 'High': return <Badge variant="destructive">High</Badge>;
        case 'Medium': return <Badge className="bg-yellow-500 text-white hover:bg-yellow-400">Medium</Badge>;
        case 'Low': return <Badge variant="secondary">Low</Badge>;
        default: return <Badge>{priority}</Badge>;
    }
  }

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
              <Card key={kpi.title} className="flex items-center p-4">
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
                  {schedule.map((appt, i) => (
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
                            <Button variant="ghost">Open Chart</Button>
                          </div>
                      </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          {/* Pending Tasks */}
          <Card>
              <CardHeader>
                  <CardTitle>Pending Tasks</CardTitle>
              </CardHeader>
              <CardContent>
                  <div className="space-y-4">
                      {tasks.map((task, i) => (
                          <div key={i} className="flex items-center justify-between p-3 rounded-lg border">
                            <div>
                                  <p className="font-semibold text-sm">{task.description}</p>
                                  <p className="text-xs text-muted-foreground">{task.time}</p>
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
            <CardHeader>
                <CardTitle>Recent Patients</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recentPatients.map((patient, i) => (
                    <Card 
                      key={i} 
                      className="p-4 hover:bg-secondary/50 transition-colors cursor-pointer"
                      onClick={() => setSelectedPatient(patient)}
                    >
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

      <PatientDetailSheet 
        patient={selectedPatient}
        isOpen={!!selectedPatient}
        onOpenChange={(isOpen) => {
            if (!isOpen) {
                setSelectedPatient(null);
            }
        }}
      />
    </>
  );
}
