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
} from 'lucide-react';
import type { RecentPatient } from './physician-dashboard';

type PatientDetailSheetProps = {
  patient: RecentPatient | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
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
}: PatientDetailSheetProps) {
  if (!patient) return null;

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
                <p className="text-xs text-muted-foreground font-normal">
                  MRN: {patient.mrn} &bull; {getAge(patient.dob)} years old
                  &bull; {patient.gender}
                </p>
              </div>
              <div className="ml-auto flex gap-2">
                <Button variant="outline" size="sm">
                  <FileEdit className="mr-2 h-4 w-4" /> Edit
                </Button>
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
                <TabsTrigger value="vitals">Vitals</TabsTrigger>
                <TabsTrigger value="medications">Medications</TabsTrigger>
                <TabsTrigger value="lab-results">Lab Results</TabsTrigger>
                <TabsTrigger value="visit-history">Visit History</TabsTrigger>
                <TabsTrigger value="other">Other</TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                      <DetailRow label="SSN" value={`***-**-${patient.ssnLast4}`} />
                      <DetailRow
                        label="Marital Status"
                        value={patient.maritalStatus}
                      />
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center text-base">
                        <Phone className="mr-2" /> Contact Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <DetailRow label="Phone" value={patient.contact.phone} />
                      <DetailRow label="Email" value={patient.contact.email} />
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
                       <Separator className="my-2"/>
                      <DetailRow
                        label="Emergency Contact"
                        value={patient.emergencyContact.name}
                      />
                      <DetailRow
                        label="Emergency Phone"
                        value={patient.emergencyContact.phone}
                      />
                    </CardContent>
                  </Card>
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
                </div>
              </TabsContent>
              <TabsContent value="vitals" className="mt-4">
                <div className="space-y-6">
                    <h3 className="text-lg font-semibold">Vital Signs History</h3>
                    {patient.vitals.map((vital, index) => (
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
                    {patient.medications.map((med, index) => (
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
            </Tabs>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
