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
import { Patient } from '@/lib/types';
import { FileText, Pencil, Download, User, Phone, Briefcase, AlertTriangle, HeartPulse, Stethoscope, Pill, FlaskConical } from 'lucide-react';
import { format } from 'date-fns';


interface PatientChartSheetProps {
  patient: Patient | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PatientChartSheet({ patient, open, onOpenChange }: PatientChartSheetProps) {
  if (!patient) return null;
  
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
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full max-w-4xl sm:max-w-4xl p-0">
        <div className="flex h-full flex-col">
            <SheetHeader className="p-6 border-b">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                        <Avatar className="h-16 w-16">
                            <AvatarFallback className="text-xl bg-primary/20 text-primary font-bold">{patient.initials}</AvatarFallback>
                        </Avatar>
                        <div>
                            <h2 className="text-2xl font-bold font-grotesk">{patient.fullName}</h2>
                            <p className="text-muted-foreground">
                                MRN: {patient.personId.substring(0, 8)} • {calculateAge(patient.dateOfBirth)} years old • {patient.gender}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline"><Pencil className="mr-2 h-4 w-4" /> Edit</Button>
                        <Button variant="outline"><Download className="mr-2 h-4 w-4" /> Export</Button>
                    </div>
                </div>
            </SheetHeader>
            <div className="flex-1 overflow-y-auto p-6">
                <Tabs defaultValue="overview">
                    <TabsList className="mb-4">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="vitals">Vitals</TabsTrigger>
                        <TabsTrigger value="medications">Medications</TabsTrigger>
                        <TabsTrigger value="lab-results">Lab Results</TabsTrigger>
                        <TabsTrigger value="visit-history">Visit History</TabsTrigger>
                        <TabsTrigger value="other">Other</TabsTrigger>
                    </TabsList>
                    <TabsContent value="overview">
                        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                            <InfoCard icon={User} title="Demographics" className="xl:col-span-1">
                                <InfoItem label="Date of Birth" value={format(new Date(patient.dateOfBirth), 'MMMM dd, yyyy')} />
                                <InfoItem label="Gender" value={patient.gender} />
                                <InfoItem label="SSN" value={`***-**-${patient.nationalId?.slice(-4)}`} />
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
                                {patient.allergyFlag !== 'None' ? (
                                    <Badge variant="destructive">{patient.allergyFlag}</Badge>
                                ): (
                                    <p className="text-sm text-muted-foreground">No known allergies.</p>
                                )}
                            </InfoCard>

                             <InfoCard icon={HeartPulse} title="Active Conditions" className="xl:col-span-2">
                                <div className="flex flex-wrap gap-2">
                                    {patient.activeProblemList?.split(', ').map((problem, index) => (
                                        problem && <Badge key={index} variant="secondary">{problem}</Badge>
                                    ))}
                                    {!patient.activeProblemList && <p className="text-sm text-muted-foreground">No active conditions.</p>}
                                </div>
                            </InfoCard>
                        </div>
                    </TabsContent>
                    <TabsContent value="vitals">
                      <div className="grid grid-cols-1 gap-6">
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center text-base font-semibold">
                              <Stethoscope className="mr-3 h-5 w-5 text-muted-foreground" />
                              Vital Signs History
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                              <div className="rounded-lg border bg-card p-4">
                                  <p className="font-medium mb-4">Nov 7, 2025</p>
                                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-4 text-center">
                                      <VitalSignMetric label="Blood Pressure" value="116/74" />
                                      <VitalSignMetric label="Heart Rate" value="68 bpm" />
                                      <VitalSignMetric label="Temperature" value="98.2°F" />
                                      <VitalSignMetric label="Weight" value="128 lbs" />
                                      <VitalSignMetric label="Height" value="5'6&quot;" />
                                      <VitalSignMetric label="BMI" value="20.7" />
                                  </div>
                              </div>
                          </CardContent>
                        </Card>
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
                                        <MedicationItem 
                                            name="Levothyroxine"
                                            dose="75mcg • Once daily"
                                            prescribedBy="Dr. Anderson"
                                            since="Since Mar 2019"
                                            remaining={6}
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>
                     <TabsContent value="lab-results">
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
                </Tabs>
            </div>
        </div>
      </SheetContent>
    </Sheet>
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
        <p className="font-medium text-right">{value}</p>
    </div>
);

const VitalSignMetric = ({ label, value }: { label: string, value: string }) => (
    <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="font-semibold text-lg">{value}</p>
    </div>
);


const MedicationItem = ({ name, dose, prescribedBy, since, remaining }: { name: string, dose: string, prescribedBy: string, since: string, remaining: number }) => (
    <div className="rounded-lg border bg-card p-4">
        <div className="flex justify-between items-start">
            <div>
                <p className="font-semibold text-base">{name}</p>
                <p className="text-sm text-muted-foreground">{dose}</p>
            </div>
            <Badge variant="outline">{remaining} remaining</Badge>
        </div>
        <div className="flex justify-between items-end mt-4">
            <p className="text-xs text-muted-foreground">Prescribed by {prescribedBy}</p>
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