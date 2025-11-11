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
  AlertTriangle,
  Clock,
  FlaskConical,
  HeartPulse,
  Pill,
  Scan,
  Stethoscope,
  FileText,
  Syringe,
  Hospital,
  Beaker,
  Link as LinkIcon,
  Filter,
  Plus,
  Info,
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUser, useFirestore, useMemoFirebase } from '@/firebase';
import type { Patient, Condition, DrugExposure } from '@/lib/types';
import { generatedData } from '@/lib/sample-data';
import { useCollection } from '@/firebase/firestore/use-collection';
import { collection, query, where } from 'firebase/firestore';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { ClinicalNoteDialog } from '@/components/dashboard/patient-chart/clinical-note-dialog';
import { EncounterNoteDialog } from '@/components/dashboard/patient-chart/encounter-note-dialog';

const sampleJourneyNotes = [
  {
      author: 'Dr. Emily Carter',
      date: '2025-07-15T10:00:00Z',
      type: 'Initial Consultation Note',
      text: 'Patient presents with complaints of persistent fatigue and unexplained weight gain over the past 4-6 months. Denies any significant changes in diet or physical activity. Reports feeling sluggish throughout the day and experiencing increased sensitivity to cold. No history of thyroid issues in the family. Physical exam is largely unremarkable. Plan to order a full thyroid panel (TSH, T3, T4) and a complete blood count to investigate potential underlying causes.'
  },
  {
      author: 'Dr. Emily Carter',
      date: '2025-07-22T11:30:00Z',
      type: 'Treatment Plan Note',
      text: 'Lab results reviewed. TSH came back elevated at 8.2 mIU/L, confirming a diagnosis of primary hypothyroidism. Started patient on Levothyroxine 50mcg once daily. Discussed the nature of the condition, the importance of medication adherence, and potential side effects. Provided patient with educational materials. Advised on diet and lifestyle modifications to support thyroid health. Scheduled follow-up in 6 weeks to re-check TSH levels and adjust dosage as needed.'
  },
  {
      author: 'Dr. Emily Carter',
      date: '2025-09-05T14:00:00Z',
      type: 'Follow-up Note',
      text: 'Patient reports significant improvement in symptoms. Fatigue has decreased, and energy levels are better. Follow-up TSH level is 3.5 mIU/L, which is within the target range but could be optimized. To further alleviate remaining mild symptoms, dosage will be increased to Levothyroxine 75mcg daily. Patient understands the change and has no questions. Will continue to monitor. Next follow-up in 3 months.'
  }
];


export default function PhysicianDashboard() {
  const { user } = useUser();
  const firestore = useFirestore();

  const [selectedPatientId, setSelectedPatientId] = React.useState<string | null>(null);

  const patientsQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return query(
      collection(firestore, 'patients'),
      where('primaryProviderId', '==', user.uid)
    );
  }, [firestore, user]);

  const { data: patientsFromDb, isLoading: isLoadingPatients } = useCollection<Patient>(patientsQuery);
  
  const patientsList = (patientsFromDb?.length)
    ? patientsFromDb
    : user
        ? generatedData.samplePatients.filter(p => p.primaryProviderId === 'dr_emily_carter') as Patient[]
        : [];
  
  React.useEffect(() => {
    if (!selectedPatientId && patientsList.length > 0) {
      setSelectedPatientId(patientsList[0].personId);
    }
  }, [patientsList, selectedPatientId]);

  const selectedPatient = React.useMemo(() => {
    if (!selectedPatientId) return null;
    return patientsList.find(p => p.personId === selectedPatientId) ?? null;
  }, [selectedPatientId, patientsList]);

  const calculateAge = (dob: string) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };
  
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b bg-white p-4">
        <div className="flex items-center gap-4">
          <UserIcon className="h-8 w-8 text-primary" />
          <div>
            <h1 className="font-bold text-lg">{user?.displayName || 'Clinician'}</h1>
            <p className="text-sm text-muted-foreground">Emergency Department</p>
          </div>
        </div>
        <div className="text-sm text-muted-foreground">
          <span className="font-semibold text-gray-700">Shift:</span> 08:00 - 16:00
        </div>
      </div>
      <div className="flex flex-1 overflow-hidden">
        {/* Left Column: Patient List */}
        <div className="w-1/3 max-w-sm border-r bg-white overflow-y-auto">
          <div className="p-4">
             <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-lg">My Patients</h2>
                <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" className="bg-primary/10 text-primary">My Patients</Button>
                    <Button variant="ghost" size="sm" className="text-muted-foreground">All ED</Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                        <Filter className="h-4 w-4" />
                    </Button>
                </div>
            </div>
            <div className="space-y-2">
              {isLoadingPatients ? <Loader2 className="animate-spin" /> :
                patientsList.map(patient => (
                  <PatientListItem 
                    key={patient.personId}
                    patient={patient}
                    isSelected={selectedPatientId === patient.personId}
                    onSelect={() => setSelectedPatientId(patient.personId)}
                  />
                ))
              }
            </div>
          </div>
        </div>

        {/* Right Column: Patient Chart */}
        <div className="flex-1 overflow-y-auto p-6 bg-background">
          {isLoadingPatients || !selectedPatient ? (
            <div className="flex h-full items-center justify-center">
              <Loader2 className="animate-spin text-muted-foreground" />
            </div>
          ) : (
            <PatientChart patient={selectedPatient} age={calculateAge(selectedPatient.dateOfBirth)} />
          )}
        </div>
      </div>
    </div>
  );
}

const PatientListItem = ({ patient, isSelected, onSelect }: { patient: Patient, isSelected: boolean, onSelect: () => void}) => {
    return (
        <div 
            onClick={onSelect}
            className={cn(
                "rounded-lg p-3 cursor-pointer border-l-4", 
                isSelected ? 'bg-primary/10 border-primary' : 'bg-white border-transparent hover:bg-gray-50'
            )}
        >
            <div className="flex justify-between items-start">
                <p className="font-semibold">{patient.fullName}</p>
                <Info className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">
                {patient.age}
                {patient.gender?.[0]} • MRN-{patient.personId.slice(0,6)}
            </p>
            <p className="text-sm font-medium mt-1">Chest pain, shortness of breath</p>
            <div className="mt-2 space-y-1">
                {patient.allergyFlag && patient.allergyFlag !== 'None' && (
                    <Badge variant="destructive" className="w-full justify-start text-xs">
                        <AlertTriangle className="mr-1 h-3 w-3" />
                        {patient.allergyFlag} - Anaphylaxis
                    </Badge>
                )}
                 <Badge className="w-full justify-start text-xs bg-yellow-100 text-yellow-800 border-yellow-200">
                    <AlertTriangle className="mr-1 h-3 w-3" />
                    High fall risk
                </Badge>
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground mt-2">
                <span>14:23 (2h 15m)</span>
                <span>ED - Bay 3</span>
            </div>
        </div>
    )
}


const PatientChart = ({ patient, age }: { patient: Patient, age: number }) => {
  const [isNoteDialogOpen, setIsNoteDialogOpen] = React.useState(false);
  const [isEncounterNoteDialogOpen, setIsEncounterNoteDialogOpen] = React.useState(false);
  const [selectedNoteDate, setSelectedNoteDate] = React.useState<string | null>(null);

  const firestore = useFirestore();

  const drugExposuresQuery = useMemoFirebase(() => {
    if (!firestore || !patient) return null;
    return collection(firestore, 'patients', patient.personId, 'drugExposures');
  }, [firestore, patient]);

  const { data: drugExposuresFromDb, isLoading: isLoadingMedications } = useCollection<DrugExposure>(drugExposuresQuery);
  
  const medications = (drugExposuresFromDb && drugExposuresFromDb.length > 0)
    ? drugExposuresFromDb
    : patient
        ? generatedData.sampleDrugExposures.filter(de => de.personId === patient.personId)
        : [];
  
  const handleViewNotes = (date: string) => {
    setSelectedNoteDate(date);
    setIsNoteDialogOpen(true);
  };
  
  const handleSaveEncounterNote = () => {
    console.log("Encounter note saved.");
    setIsEncounterNoteDialogOpen(false);
    // onAppointmentComplete(); 
  };

  const JourneyContent = (
    <Card>
        <CardHeader>
            <CardTitle className="flex items-center text-base font-semibold">
                <FileText className="mr-3 h-5 w-5 text-muted-foreground" />
                Patient Journey
            </CardTitle>
        </CardHeader>
        <CardContent className="pl-10">
            <div className="relative">
                {sampleJourneyNotes.map((item, index) => {
                  const timelineItems = [
                    { icon: Stethoscope, title: "Outpatient Visit", description: "Initial consultation for fatigue and weight gain.", date: "2025-07-15T10:00:00Z" },
                    { icon: FlaskConical, title: "Labs Ordered", description: "TSH, T3, T4, and CBC labs were ordered to assess thyroid function.", date: "2025-07-15T10:00:00Z" },
                    { icon: HeartPulse, title: "Diagnosis", description: "Diagnosed with Hypothyroidism based on lab results (TSH: 8.2 mIU/L).", date: "2025-07-22T11:30:00Z"},
                    { icon: Syringe, title: "Treatment Started", description: "Prescribed Levothyroxine 50mcg daily. Advised on lifestyle and diet changes.", date: "2025-07-22T11:30:00Z"},
                    { icon: Hospital, title: "Follow-up Visit", description: "Patient reported feeling better. TSH levels improved. Adjusted dosage to 75mcg.", date: "2025-09-05T14:00:00Z"}
                  ];
                  const timelineItem = timelineItems.find(i => i.date === item.date);

                  if(!timelineItem) return null;

                  return (
                    <TimelineItem 
                        key={index}
                        icon={timelineItem.icon}
                        title={timelineItem.title}
                        date={timelineItem.date}
                        clinician={item.author}
                        description={timelineItem.description}
                        onViewNote={() => handleViewNotes(timelineItem.date)}
                        isLast={index === sampleJourneyNotes.length -1}
                    />
                  )
                })}
            </div>
        </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-bold font-grotesk">{patient.fullName} <span className="font-normal text-base text-muted-foreground">{age}{patient.gender?.[0]} • MRN-{patient.personId.slice(0,6)}</span></h2>
          <p className="text-muted-foreground">Chest pain, shortness of breath • ED - Bay 3</p>
           <div className="mt-2 flex gap-2">
               {patient.allergyFlag && patient.allergyFlag !== 'None' && (
                    <Badge variant="destructive">
                        <AlertTriangle className="mr-1 h-3 w-3" />
                        {patient.allergyFlag} - Anaphylaxis
                    </Badge>
                )}
                <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                    <AlertTriangle className="mr-1 h-3 w-3" />
                    High fall risk
                </Badge>
           </div>
        </div>
        <Button><Plus className="mr-2 h-4 w-4"/> New Order</Button>
      </div>

       <div className="rounded-lg border bg-white p-4">
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-4 text-center">
              <VitalSignMetric label="BP" value="168/95" />
              <VitalSignMetric label="HR" value="102" />
              <VitalSignMetric label="RR" value="22" />
              <VitalSignMetric label="Temp" value="37.2°C" />
              <VitalSignMetric label="SpO2" value="94%" />
              <VitalSignMetric label="Time" value="14:45" />
          </div>
      </div>
      
      <Tabs defaultValue="problems">
        <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="problems">Problems</TabsTrigger>
            <TabsTrigger value="medications">Medications</TabsTrigger>
            <TabsTrigger value="labs">Labs</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
            <Card>
                <CardContent className="pt-6">
                    This is the overview tab.
                </CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="problems">
            <div className="space-y-2">
                <ProblemListItem name="Hypertension" onset="2018" />
                <ProblemListItem name="Type 2 Diabetes" onset="2019" />
                <ProblemListItem name="Coronary Artery Disease" onset="2020" />
            </div>
        </TabsContent>
        <TabsContent value="medications">
            <Card>
                <CardContent className="pt-6">
                    <div className="space-y-4">
                    {isLoadingMedications ? (
                        <div className="flex items-center justify-center h-24">
                            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                        </div>
                    ) : medications.length > 0 ? (
                        medications.map((med) => (
                            <MedicationItem 
                                key={med.medicationId}
                                name={med.drugName}
                                dose={med.dose}
                                prescribedBy={med.prescribingPhysicianId} // This should be resolved to a name
                                since={`Since ${format(new Date(med.startDate), 'MMM yyyy')}`}
                            />
                        ))
                    ) : (
                        <div className="flex items-center justify-center h-24 text-muted-foreground">
                            <span>No current medications found.</span>
                        </div>
                    )}
                    </div>
                </CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="labs">
            <Card>
                <CardContent className="pt-6">
                    No lab results found.
                </CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="orders">
            <Card>
                <CardContent className="pt-6">
                    No orders found.
                </CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="notes">
            {JourneyContent}
        </TabsContent>
      </Tabs>
    </div>
  )
}


const VitalSignMetric = ({ label, value }: { label: string, value: string }) => (
    <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="font-semibold text-lg">{value}</p>
    </div>
);

const ProblemListItem = ({ name, onset }: { name: string, onset: string }) => (
    <div className="flex items-center justify-between rounded-lg border bg-white p-4">
        <div>
            <p className="font-semibold">{name}</p>
            <p className="text-sm text-muted-foreground">Onset: {onset}</p>
        </div>
        <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">Active</Badge>
    </div>
);

const MedicationItem = ({ name, dose, prescribedBy, since }: { name: string, dose?: string, prescribedBy?: string, since: string }) => (
    <div className="rounded-lg border bg-card p-4">
        <div className="flex justify-between items-start">
            <div>
                <p className="font-semibold text-base">{name}</p>
                <p className="text-sm text-muted-foreground">{dose}</p>
            </div>
            
        </div>
        <div className="flex justify-between items-end mt-4">
            <p className="text-xs text-muted-foreground">Prescribed by {prescribedBy || 'Unknown'}</p>
            <p className="text-xs text-muted-foreground">{since}</p>
        </div>
    </div>
);


const TimelineItem = ({ icon: Icon, title, date, description, clinician, onViewNote, isLast = false }: { icon: React.ElementType, title: string, date: string, description: string, clinician?: string, onViewNote?: () => void, isLast?: boolean }) => (
    <div className="relative pl-8">
        {!isLast && <div className="absolute left-3 top-5 -translate-x-1/2 h-full w-px bg-border"></div>}
        <div className="absolute left-3 top-1 h-6 w-6 bg-primary rounded-full flex items-center justify-center -translate-x-1/2">
            <Icon className="h-4 w-4 text-primary-foreground" />
        </div>
        <div className="mb-8 hover:bg-gray-50/50 p-2 rounded-md cursor-pointer" onClick={onViewNote}>
            <p className="font-semibold">{title}</p>
            <p className="text-sm text-muted-foreground mb-1">{format(new Date(date), "MMMM dd, yyyy")}</p>
            <p className="text-sm mb-2">{description}</p>
            <div className="flex items-center gap-4 text-xs">
                {clinician && (
                    <div className="flex items-center gap-1 text-muted-foreground">
                        <UserIcon className="h-3 w-3" />
                        <span>By:</span>
                        <Link href="#" className="font-medium text-primary hover:underline" onClick={(e) => e.stopPropagation()}>{clinician}</Link>
                    </div>
                )}
                {onViewNote && (
                     <div className="flex items-center gap-1 text-primary">
                        <LinkIcon className="h-3 w-3" />
                        <span>View Notes</span>
                    </div>
                )}
            </div>
        </div>
    </div>
);
