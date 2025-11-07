
'use client';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from '@/components/ui/sheet';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  User,
  Phone,
  Shield,
  HeartPulse,
  FileEdit,
  Download,
  X,
  Pill,
  Activity,
  BriefcaseMedical,
  Users2,
  Route,
  FileClock,
  ClipboardCheck,
} from 'lucide-react';
import type { RecentPatient, JourneyTask } from './physician-dashboard';
import { TreatmentJourney } from './treatment-journey';

type PatientDetailSheetProps = {
  patient: RecentPatient | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  appointmentStatus?: string;
};

const DetailRow = ({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) => (
  <div className="flex justify-between text-sm">
    <span className="text-muted-foreground">{label}</span>
    <span className="font-medium text-right">{value}</span>
  </div>
);

const HistoryDetailRow = ({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) => (
  <div className="grid grid-cols-2 gap-4">
    <p className="text-sm text-muted-foreground">{label}</p>
    <p className="font-medium">{value}</p>
  </div>
);

const VitalStat = ({ label, value }: { label: string; value: string }) => (
    <div className="text-center">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="font-semibold text-lg">{value}</p>
    </div>
)

export function PatientDetailSheet({
  patient,
  isOpen,
  onOpenChange,
  appointmentStatus,
}: PatientDetailSheetProps) {
  if (!patient) return null;

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

  const currentJourney = patient.mrn === 'MRN-1055' 
    ? treatmentJourneyLee 
    : treatmentJourneyMartinez;

  const getAge = (dob: string) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Normal':
        return <Badge variant="default">Normal</Badge>;
      case 'Elevated':
        return <Badge variant="destructive">Elevated</Badge>;
      case 'Low':
        return <Badge variant="secondary" className="bg-blue-500 text-white">Low</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const canEdit = appointmentStatus === 'In Progress';

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="p-0 sm:max-w-2xl">
        <div className="relative h-full">
          <SheetHeader className="p-4 border-b">
            <SheetTitle className="flex items-center gap-4">
              <Avatar className="h-12 w-12">
                <AvatarFallback>
                  {patient.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-xl font-bold">{patient.name}</p>
                {patient.mrn && patient.dob && patient.gender && (
                  <p className="text-xs text-muted-foreground font-normal">
                    MRN: {patient.mrn} &bull; {getAge(patient.dob)} years old
                    &bull; {patient.gender}
                  </p>
                )}
              </div>
              <div className="ml-auto flex gap-2">
                {canEdit && (
                  <Button variant="outline" size="sm">
                    <FileEdit className="mr-2 h-4 w-4" /> Edit
                  </Button>
                )}
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" /> Export
                </Button>
              </div>
            </SheetTitle>
            <SheetClose className="absolute right-4 top-4 !m-0">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </SheetClose>
          </SheetHeader>

          <div className="p-4 h-[calc(100vh-80px)] overflow-y-auto">
            <Tabs defaultValue="overview">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="journey">Journey</TabsTrigger>
                <TabsTrigger value="vitals">Vitals</TabsTrigger>
                <TabsTrigger value="medications">Medications</TabsTrigger>
                <TabsTrigger value="lab-results">Lab Results</TabsTrigger>
                <TabsTrigger value="visit-history">Visit History</TabsTrigger>
                <TabsTrigger value="other">Other</TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {patient.dob && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center text-base">
                          <User className="mr-2" /> Demographics
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <DetailRow
                          label="Date of Birth"
                          value={new Date(patient.dob).toLocaleDateString(
                            'en-US',
                            { year: 'numeric', month: 'long', day: 'numeric' }
                          )}
                        />
                        <DetailRow label="Gender" value={patient.gender} />
                        {patient.ssnLast4 && (
                          <DetailRow label="SSN" value={`***-**-${patient.ssnLast4}`} />
                        )}
                        {patient.maritalStatus && (
                          <DetailRow
                            label="Marital Status"
                            value={patient.maritalStatus}
                          />
                        )}
                      </CardContent>
                    </Card>
                  )}
                  {patient.contact && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center text-base">
                          <Phone className="mr-2" /> Contact Information
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <DetailRow label="Phone" value={patient.contact.phone} />
                        <DetailRow label="Email" value={patient.contact.email} />
                        {patient.contact.address && (
                            <DetailRow
                            label="Address"
                            value={
                                <>
                                {patient.contact.address.line1}
                                <br />
                                {patient.contact.address.city},{' '}
                                {patient.contact.address.state}{' '}
                                {patient.contact.address.zip}
                                </>
                            }
                            />
                        )}
                        {patient.emergencyContact && (
                          <>
                            <Separator className="my-2"/>
                            <DetailRow
                              label="Emergency Contact"
                              value={patient.emergencyContact.name}
                            />
                            <DetailRow
                              label="Emergency Phone"
                              value={patient.emergencyContact.phone}
                            />
                          </>
                        )}
                      </CardContent>
                    </Card>
                  )}
                  {patient.insurance && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center text-base">
                          <Shield className="mr-2" /> Insurance
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <DetailRow
                          label="Provider"
                          value={patient.insurance.provider}
                        />
                        <DetailRow
                          label="Policy Number"
                          value={patient.insurance.policyNumber}
                        />
                        <DetailRow
                          label="Group Number"
                          value={patient.insurance.groupNumber}
                        />
                        <DetailRow
                          label="Status"
                          value={<Badge>{patient.insurance.status}</Badge>}
                        />
                      </CardContent>
                    </Card>
                  )}
                  {patient.conditions && patient.conditions.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center text-base">
                          <HeartPulse className="mr-2" /> Active Conditions
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {patient.conditions.map((condition) => (
                          <div key={condition.name} className="p-3 rounded-md border text-sm">
                            <div className="flex justify-between items-start">
                                  <div>
                                      <p className="font-semibold">{condition.name}</p>
                                      <p className="text-xs text-muted-foreground">{condition.stage}</p>
                                  </div>
                                  <Badge variant="outline">{condition.code}</Badge>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">Diagnosed: {new Date(condition.diagnosedDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</p>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>
              <TabsContent value="journey" className="mt-4">
                <Card>
                  <CardHeader>
                      <CardTitle className="flex items-center text-base">
                          <Route className="mr-2" /> Treatment Journey
                      </CardTitle>
                      <CardDescription>
                          A timeline of the patient's treatment plan and progress.
                      </CardDescription>
                  </CardHeader>
                  <CardContent>
                      <TreatmentJourney journey={currentJourney} />
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="vitals" className="mt-4">
                <div className="space-y-6">
                    <h3 className="text-lg font-semibold">Vital Signs History</h3>
                    {patient.vitals && patient.vitals.map((vital, index) => (
                        <Card key={index}>
                            <CardHeader>
                                <CardTitle className="text-base">
                                    {new Date(vital.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="grid grid-cols-3 sm:grid-cols-6 gap-4">
                                <VitalStat label="Blood Pressure" value={vital.bloodPressure} />
                                <VitalStat label="Heart Rate" value={vital.heartRate} />
                                <VitalStat label="Temperature" value={vital.temperature} />
                                <VitalStat label="Weight" value={vital.weight} />
                                <VitalStat label="Height" value={vital.height} />
                                <VitalStat label="BMI" value={vital.bmi} />
                            </CardContent>
                        </Card>
                    ))}
                </div>
              </TabsContent>
               <TabsContent value="medications" className="mt-4">
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Current Medications</h3>
                    {patient.medications && patient.medications.map((med, index) => (
                        <Card key={index}>
                            <CardContent className="p-4 grid grid-cols-2 gap-4 items-start">
                                <div>
                                    <p className="font-semibold">{med.name}</p>
                                    <p className="text-sm text-muted-foreground">{med.dosage} &bull; {med.frequency}</p>
                                    <div className="text-xs text-muted-foreground mt-2">Prescribed by{' '}
                                        <Button variant="link" className="p-0 h-auto text-xs">
                                            {med.prescriber}
                                        </Button>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <Badge variant="outline" className="mb-2">{med.remaining} remaining</Badge>
                                    <p className="text-sm text-muted-foreground">Since {med.startDate}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
              </TabsContent>
              <TabsContent value="lab-results" className="mt-4">
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Recent Laboratory Results</h3>
                    {patient.labResults && patient.labResults.map((lab, index) => (
                        <Card key={index} className="p-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-semibold">{lab.name}</p>
                                    <p className="text-sm text-muted-foreground">
                                        {new Date(lab.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                                    </p>
                                </div>
                                {getStatusBadge(lab.status)}
                            </div>
                            <div className="flex justify-between items-end mt-2 text-sm">
                                <p>Result: <span className="font-medium">{lab.result}</span></p>
                                <p className="text-muted-foreground">Reference: {lab.reference}</p>
                            </div>
                        </Card>
                    ))}
                </div>
              </TabsContent>
              <TabsContent value="visit-history" className="mt-4">
                <div className="space-y-6">
                    <h3 className="text-lg font-semibold">Visit History</h3>
                    {patient.visitHistory && patient.visitHistory.map((visit, index) => (
                        <Card key={index}>
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle className="text-lg">{visit.type} at {visit.hospital}</CardTitle>
                                        <p className="text-sm text-muted-foreground">
                                             {new Date(visit.date).toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })} &bull; {visit.doctor}
                                        </p>
                                    </div>
                                    <Button variant="outline" size="sm">View Full Note</Button>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4 pt-0">
                                <div className="p-4 rounded-md border bg-secondary/50 space-y-3 text-sm">
                                    <div>
                                        <p className="text-xs font-semibold text-muted-foreground">Chief Complaint</p>
                                        <p>{visit.chiefComplaint}</p>
                                    </div>
                                     <div>
                                        <p className="text-xs font-semibold text-muted-foreground">Diagnosis</p>
                                        <p>{visit.diagnosis}</p>
                                    </div>
                                     <div>
                                        <p className="text-xs font-semibold text-muted-foreground">Notes</p>
                                        <p className="text-muted-foreground">{visit.notes}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
              </TabsContent>
              <TabsContent value="other" className="mt-4">
                <div className="space-y-6">
                  {patient.immunizationHistory && patient.immunizationHistory.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center text-base">
                          <Activity className="mr-2" /> Immunization History
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                          {patient.immunizationHistory.map((shot, index) => (
                              <div key={index} className="flex justify-between items-center p-3 rounded-md border text-sm bg-secondary/30">
                                  <div>
                                      <p className="font-semibold">{shot.vaccine}</p>
                                      <p className="text-xs text-muted-foreground">Administered by {shot.administeredBy}</p>
                                  </div>
                                  <span className="text-sm text-muted-foreground">{new Date(shot.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                              </div>
                          ))}
                      </CardContent>
                    </Card>
                  )}
                  {patient.socialHistory && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center text-base">
                          <BriefcaseMedical className="mr-2" /> Social History
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                          <HistoryDetailRow label="Smoking Status" value={patient.socialHistory.smokingStatus} />
                          <HistoryDetailRow label="Alcohol Use" value={patient.socialHistory.alcoholUse} />
                          <HistoryDetailRow label="Exercise" value={patient.socialHistory.exercise} />
                          <HistoryDetailRow label="Occupation" value={patient.socialHistory.occupation} />
                      </CardContent>
                    </Card>
                  )}
                  {patient.familyHistory && patient.familyHistory.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center text-base">
                          <Users2 className="mr-2" /> Family History
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {patient.familyHistory.map((item, index) => (
                            <div key={index} className="flex justify-between items-center p-3 rounded-md border text-sm bg-secondary/30">
                                <div>
                                    <p className="font-semibold">{item.condition}</p>
                                    <p className="text-xs text-muted-foreground">{item.relation}</p>

                                </div>
                                <Badge variant="outline">{item.notes}</Badge>
                            </div>
                        ))}
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
