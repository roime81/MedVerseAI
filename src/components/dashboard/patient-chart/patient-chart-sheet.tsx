
'use client';

import * as React from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Appointment, Patient, DrugExposure } from '@/lib/types';
import { FileText, Pencil, Download, User, Phone, Briefcase, AlertTriangle, HeartPulse, Stethoscope, Pill, FlaskConical, Beaker, Scan, Hospital, Syringe, Link as LinkIcon, Activity, Users as UsersIcon, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';
import { ClinicalNoteDialog } from './clinical-note-dialog';
import { EncounterNoteDialog } from './encounter-note-dialog';
import { useFirestore, useUser, useMemoFirebase } from '@/firebase';
import { useCollection } from '@/firebase/firestore/use-collection';
import { collection } from 'firebase/firestore';


interface PatientChartSheetProps {
  patient: Patient | null;
  appointmentStatus?: Appointment['status'];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAppointmentComplete: () => void;
  journeyUntilDate?: string;
  view?: 'full' | 'journey';
}

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


export function PatientChartSheet({ patient, open, onOpenChange, appointmentStatus, onAppointmentComplete, journeyUntilDate, view = 'full' }: PatientChartSheetProps) {
  const [isNoteDialogOpen, setIsNoteDialogOpen] = React.useState(false);
  const [isEncounterNoteDialogOpen, setIsEncounterNoteDialogOpen] = React.useState(false);
  const [selectedNoteDate, setSelectedNoteDate] = React.useState<string | null>(null);

  const firestore = useFirestore();

  const drugExposuresQuery = useMemoFirebase(() => {
    if (!firestore || !patient) return null;
    return collection(firestore, 'patients', patient.personId, 'drugExposures');
  }, [firestore, patient]);

  const { data: medications, isLoading: isLoadingMedications } = useCollection<DrugExposure>(drugExposuresQuery);
  
  const handleViewNotes = (date: string) => {
    setSelectedNoteDate(date);
    setIsNoteDialogOpen(true);
  };
  
  const handleSaveEncounterNote = () => {
    // Here you would typically save the note to the backend
    console.log("Encounter note saved.");
    setIsEncounterNoteDialogOpen(false);
    onAppointmentComplete(); // Trigger the status update
    onOpenChange(false); // Close the patient chart sheet
  };


  if (!patient) return null;
  
  const calculateAge = (dob: string) => {
    if(!dob) return '';
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const filteredJourneyItems = journeyUntilDate
    ? sampleJourneyNotes.filter(note => new Date(note.date) <= new Date(journeyUntilDate))
    : sampleJourneyNotes;
  
  const journeyItemsToRender = filteredJourneyItems.length > 0 ? filteredJourneyItems : sampleJourneyNotes;

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
                {journeyItemsToRender.map((item, index) => {
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
                        isLast={index === journeyItemsToRender.length -1}
                    />
                  )
                })}
            </div>
        </CardContent>
    </Card>
  );
  
  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="w-full max-w-4xl sm:max-w-4xl p-0">
          <div className="flex h-full flex-col">
              <SheetHeader className="p-6 border-b">
                  <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                          <Avatar className="h-16 w-16">
                              <AvatarFallback className="text-xl bg-primary/20 text-primary font-bold">{patient.fullName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div>
                              <h2 className="text-2xl font-bold font-grotesk">{patient.fullName}</h2>
                              <p className="text-muted-foreground">
                                  MRN: {patient.personId.substring(0, 8)} • {calculateAge(patient.dateOfBirth)} years old • {patient.gender}
                              </p>
                          </div>
                      </div>
                      <div className="flex items-center gap-2">
                          {appointmentStatus === 'In Progress' && (
                              <Button variant="outline" onClick={() => setIsEncounterNoteDialogOpen(true)}><Pencil className="mr-2 h-4 w-4" /> New Notes</Button>
                          )}
                          <Button variant="outline"><Download className="mr-2 h-4 w-4" /> Export</Button>
                      </div>
                  </div>
              </SheetHeader>
              <div className="flex-1 overflow-y-auto p-6">
                {view === 'full' ? (
                  <Tabs defaultValue="overview">
                      <TabsList className="mb-4">
                          <TabsTrigger value="overview">Overview</TabsTrigger>
                          <TabsTrigger value="problems">Problems</TabsTrigger>
                          <TabsTrigger value="medications">Medications</TabsTrigger>
                          <TabsTrigger value="orders">Orders</TabsTrigger>
                          <TabsTrigger value="labs">Labs</TabsTrigger>
                          <TabsTrigger value="imaging">Imaging</TabsTrigger>
                          <TabsTrigger value="notes">Notes</TabsTrigger>
                      </TabsList>
                      <TabsContent value="overview">
                          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                              <InfoCard icon={User} title="Demographics" className="xl:col-span-1">
                                  <InfoItem label="Date of Birth" value={patient.dateOfBirth ? format(new Date(patient.dateOfBirth), 'MMMM dd, yyyy') : 'N/A'} />
                                  <InfoItem label="Gender" value={patient.gender} />
                                  <InfoItem label="SSN" value={patient.nationalId ? `***-**-${patient.nationalId.slice(-4)}` : 'N/A'} />
                                  <InfoItem label="Marital Status" value={patient.maritalStatus} />
                              </InfoCard>
                              
                              <InfoCard icon={Phone} title="Contact Information" className="xl:col-span-1">
                                  <InfoItem label="Phone" value={patient.contactInfo} />
                                  <InfoItem label="Email" value={patient.contactInfo} />
                                  <InfoItem label="Address" value={patient.address?.split(',')[0]} />
                                  <InfoItem label="City" value={patient.address?.split(',').slice(1).join(', ')} />
                                  <InfoItem label="Emergency Contact" value={patient.emergencyContact?.split(',')[0]} />
                                  <InfoItem label="Emergency Phone" value={patient.emergencyContact?.split(',')[1]} />
                              </InfoCard>

                              <InfoCard icon={Briefcase} title="Insurance" className="xl:col-span-1">
                                  <InfoItem label="Provider" value="Blue Cross Blue Shield" />
                                  <InfoItem label="Policy Number" value={patient.insuranceNumber} />
                                  <InfoItem label="Group Number" value="GRP-7890" />
                                  <InfoItem label="Subscriber" value={patient.fullName} />
                              </InfoCard>

                               <InfoCard icon={AlertTriangle} title="Allergies" className="xl:col-span-1">
                                  {patient.allergyFlag && patient.allergyFlag !== 'None' ? (
                                      <Badge variant="destructive">{patient.allergyFlag}</Badge>
                                  ): (
                                      <p className="text-sm text-muted-foreground">No known allergies.</p>
                                  )}
                              </InfoCard>
                               <InfoCard icon={Stethoscope} title="Vitals" className="xl:col-span-2">
                                <div className="rounded-lg border bg-card p-4">
                                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-4 text-center">
                                        <VitalSignMetric label="Blood Pressure" value="116/74" />
                                        <VitalSignMetric label="Heart Rate" value="68 bpm" />
                                        <VitalSignMetric label="Temperature" value="98.2°F" />
                                        <VitalSignMetric label="Weight" value="128 lbs" />
                                        <VitalSignMetric label="Height" value="5'6&quot;" />
                                        <VitalSignMetric label="BMI" value="20.7" />
                                    </div>
                                </div>
                              </InfoCard>
                          </div>
                      </TabsContent>
                       <TabsContent value="problems">
                          <div className="grid grid-cols-1 gap-6">
                              <InfoCard icon={HeartPulse} title="Active Conditions">
                                  <div className="flex flex-wrap gap-2">
                                      {patient.activeProblemList?.split(', ').map((problem, index) => (
                                          problem && <Badge key={index} variant="secondary">{problem}</Badge>
                                      ))}
                                      {!patient.activeProblemList && <p className="text-sm text-muted-foreground">No active conditions.</p>}
                                  </div>
                              </InfoCard>
                          </div>
                      </TabsContent>
                      <TabsContent value="medications">
                          <div className="grid grid-cols-1 gap-6">
                              <Card>
                                  <CardHeader>
                                      <CardTitle className="flex items-center text-base font-semibold">
                                          <Pill className="mr-3 h-5 w-5 text-muted-foreground" />
                                          Current Medications
                                      </CardTitle>
                                  </CardHeader>
                                  <CardContent>
                                      <div className="space-y-4">
                                        {isLoadingMedications ? (
                                            <div className="flex items-center justify-center h-24">
                                                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                                            </div>
                                        ) : medications && medications.length > 0 ? (
                                            medications.map((med) => (
                                                <MedicationItem 
                                                    key={med.medicationId}
                                                    name={med.drugName}
                                                    dose={med.dose}
                                                    prescribedBy={med.prescribingPhysicianId} // This should be resolved to a name
                                                    since={med.startDate ? `Since ${format(new Date(med.startDate), 'MMM yyyy')}` : ''}
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
                          </div>
                      </TabsContent>
                      <TabsContent value="orders">
                          <div className="flex items-center justify-center h-40 text-muted-foreground">
                            <Beaker className="mr-2 h-5 w-5" />
                            <span>No active orders.</span>
                          </div>
                      </TabsContent>
                       <TabsContent value="labs">
                          <div className="grid grid-cols-1 gap-6">
                              <Card>
                                  <CardHeader>
                                      <CardTitle className="flex items-center text-base font-semibold">
                                          <FlaskConical className="mr-3 h-5 w-5 text-muted-foreground" />
                                          Recent Laboratory Results
                                      </CardTitle>
                                  </CardHeader>
                                  <CardContent>
                                      <div className="space-y-4">
                                          <LabResultItem
                                              testName="TSH"
                                              date="Oct 30, 2025"
                                              result="2.4 mIU/L"
                                              status="Normal"
                                              reference="0.4-4.0 mIU/L"
                                          />
                                      </div>
                                  </CardContent>
                              </Card>
                          </div>
                      </TabsContent>
                      <TabsContent value="imaging">
                           <div className="flex items-center justify-center h-40 text-muted-foreground">
                            <Scan className="mr-2 h-5 w-5" />
                            <span>No imaging studies found.</span>
                          </div>
                      </TabsContent>
                      <TabsContent value="notes">
                        {JourneyContent}
                      </TabsContent>
                  </Tabs>
                ) : (
                  JourneyContent
                )}
              </div>
          </div>
        </SheetContent>
      </Sheet>
      <ClinicalNoteDialog
          isOpen={isNoteDialogOpen}
          onOpenChange={setIsNoteDialogOpen}
          notes={sampleJourneyNotes}
          defaultDate={selectedNoteDate}
      />
      {patient && (
        <EncounterNoteDialog
          isOpen={isEncounterNoteDialogOpen}
          onOpenChange={setIsEncounterNoteDialogOpen}
          patient={patient}
          onSave={handleSaveEncounterNote}
        />
      )}
    </>
  );
}

const InfoCard = ({ icon: Icon, title, children, className }: { icon: React.ElementType, title: string, children: React.ReactNode, className?: string }) => (
    <Card className={className}>
        <CardHeader className="pb-4">
            <CardTitle className="flex items-center text-base font-semibold">
                <Icon className="mr-3 h-5 w-5 text-muted-foreground" />
                {title}
            </CardTitle>
        </CardHeader>
        <CardContent>
            <div className="space-y-3">
                {children}
            </div>
        </CardContent>
    </Card>
);

const InfoItem = ({ label, value }: { label: string, value?: string | number }) => (
    <div className="flex justify-between text-sm">
        <p className="text-muted-foreground">{label}:</p>
        <p className="font-medium text-right">{value || 'N/A'}</p>
    </div>
);

const VitalSignMetric = ({ label, value }: { label: string, value: string }) => (
    <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="font-semibold text-lg">{value}</p>
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

const LabResultItem = ({ testName, date, result, status, reference }: { testName: string, date: string, result: string, status: "Normal" | "Abnormal", reference: string }) => (
    <div className="rounded-lg border bg-card p-4">
        <div className="flex justify-between items-start">
            <div>
                <p className="font-semibold text-base">{testName}</p>
                <p className="text-sm text-muted-foreground">{date}</p>
            </div>
            <Badge variant={status === "Normal" ? "default" : "destructive"} className={status === "Normal" ? "bg-gray-800" : ""}>{status}</Badge>
        </div>
        <div className="flex justify-between items-end mt-2">
            <p className="text-sm">Result: <span className="font-semibold">{result}</span></p>
            <p className="text-xs text-muted-foreground">Reference: {reference}</p>
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
                        <User className="h-3 w-3" />
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
