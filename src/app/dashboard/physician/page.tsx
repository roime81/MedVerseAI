
'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  User as UserIcon,
  Filter,
  Clock,
  AlertTriangle,
  Search,
  Bell,
  LogOut,
  ChevronDown,
  PlusCircle,
  FileText,
  ShieldCheck
} from 'lucide-react';
import { useUser, useFirestore, useMemoFirebase, useAuth } from '@/firebase';
import type { Patient, DrugExposure, Condition, PendingTask } from '@/lib/types';
import { useCollection } from '@/firebase/firestore/use-collection';
import { collection, query, where } from 'firebase/firestore';
import { format, formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { NewOrderDialog } from '@/components/dashboard/physician/new-order-dialog';
import { NewPatientForm } from '@/components/dashboard/physician/new-patient-form';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { ActionCard } from '@/components/dashboard/patient-portal/ActionCard';
import { UpcomingExpiryWidget } from '@/components/dashboard/physician/upcoming-expiry-widget';
import { PendingRequestsWidget } from '@/components/dashboard/physician/pending-requests-widget';

const PatientListItem = ({ patient, isActive, onClick }) => {
    const alerts = patient.allergyFlag && patient.allergyFlag !== 'None' ? 1 : 0;
    const age = calculateAge(patient.dateOfBirth);

    return (
        <div
            onClick={onClick}
            className={cn(
                "cursor-pointer border-b p-4 transition-all",
                isActive ? "bg-primary/10" : "hover:bg-muted"
            )}
        >
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-foreground">{patient.fullName}</h3>
                </div>
                {alerts > 0 && <Badge variant="destructive" className="flex-shrink-0">{alerts}</Badge>}
            </div>
            
            <p className="text-sm text-muted-foreground">{patient.gender?.charAt(0)}{age} • MRN-{patient.nationalId?.slice(-6)}</p>
            
            <p className="mt-2 text-sm text-foreground">{patient.activeProblemList?.split(',')[0] || 'No active problems'}</p>
            
            {patient.allergyFlag && patient.allergyFlag !== 'None' && (
                <div className="mt-2">
                    <Badge variant="destructive" className="w-full justify-start text-xs font-normal">
                        <AlertTriangle className="mr-2 h-3 w-3" />
                        {patient.allergyFlag}
                    </Badge>
                </div>
            )}

            <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>14:23 (2h 15m)</span>
                </div>
                <span>ED - Bay {patient.personId.slice(-1)}</span>
            </div>
        </div>
    );
};

const VitalSignMetric = ({ label, value }: { label: string, value: string }) => (
    <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="font-semibold text-lg text-foreground">{value}</p>
    </div>
);

const calculateAge = (dob: string) => {
    if (!dob) return '';
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
};


export default function PhysicianDashboard() {
  const { user } = useUser();
  const firestore = useFirestore();
  const [selectedPatientId, setSelectedPatientId] = React.useState<string | null>(null);
  const [isNewOrderDialogOpen, setIsNewOrderDialogOpen] = React.useState(false);
  const [isNewPatientFormOpen, setIsNewPatientFormOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filterMode, setFilterMode] = React.useState<'all' | 'my-patients'>('my-patients');


  const patientsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    if (filterMode === 'my-patients' && user) {
        return query(collection(firestore, 'patients'), where('primaryProviderId', '==', user.uid));
    }
    return query(collection(firestore, 'patients'));
  }, [firestore, user, filterMode]);

  const { data: patients, isLoading: isLoadingPatients } = useCollection<Patient>(patientsQuery);
  
  const pendingTasksQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(collection(firestore, 'users', user.uid, 'tasks'), where('status', '==', 'Pending'));
    }, [firestore, user]);

  const { data: pendingTasks, isLoading: isLoadingTasks } = useCollection<PendingTask>(pendingTasksQuery);
  
  const filteredPatients = React.useMemo(() => {
    if (!patients) return [];
    if (searchTerm) {
        return patients.filter(patient => 
          patient.fullName.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }
    return patients;
  }, [patients, searchTerm]);

  React.useEffect(() => {
    if (filteredPatients && filteredPatients.length > 0) {
      const isSelectedPatientInList = filteredPatients.some(p => p.personId === selectedPatientId);
      if (!isSelectedPatientInList) {
        setSelectedPatientId(filteredPatients[0].personId);
      }
    } else if (filteredPatients && filteredPatients.length === 0) {
        setSelectedPatientId(null);
    }
  }, [filteredPatients, selectedPatientId]);

  const selectedPatient = React.useMemo(() => {
    return patients?.find(p => p.personId === selectedPatientId) || null;
  }, [patients, selectedPatientId]);


  const drugExposuresQuery = useMemoFirebase(() => {
    if (!firestore || !selectedPatient) return null;
    return collection(firestore, 'patients', selectedPatient.personId, 'drugExposures');
  }, [firestore, selectedPatient]);

  const { data: medications, isLoading: isLoadingMedications } = useCollection<DrugExposure>(drugExposuresQuery);
  
  const conditionsQuery = useMemoFirebase(() => {
    if (!firestore || !selectedPatient) return null;
    return collection(firestore, 'patients', selectedPatient.personId, 'conditions');
    }, [firestore, selectedPatient]);

  const { data: conditions, isLoading: isLoadingConditions } = useCollection<Condition>(conditionsQuery);


  return (
    <>
    <div className="flex h-full flex-col bg-slate-50 text-foreground">
        <DashboardHeader
            title={user?.displayName || 'Clinician'}
            description="Emergency Department"
            showShiftTime={true}
        >
        </DashboardHeader>

        <div className="flex-1 overflow-y-auto p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <ActionCard icon={FileText} title="My Access" subtitle="View systems & privileges"/>
                <ActionCard icon={ShieldCheck} title="Training" subtitle="View compliance status" />
                <UpcomingExpiryWidget />
                <PendingRequestsWidget />
            </div>

            <div className="flex h-[calc(100vh-280px)] overflow-hidden">
                {/* Left column: Patient List */}
                <Card className="w-1/3 max-w-sm flex-shrink-0 overflow-y-auto flex flex-col bg-white h-full">
                    <CardHeader className="p-4 border-b sticky top-0 bg-white z-10">
                        <div className="flex items-center justify-between mb-2">
                            <CardTitle className="text-lg">Patient List</CardTitle>
                             <Button variant="ghost" size="sm" onClick={() => setIsNewPatientFormOpen(true)}>
                                <PlusCircle className="mr-2 h-4 w-4" /> New
                            </Button>
                        </div>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                            placeholder="Search patients..."
                            className="w-full rounded-md bg-background pl-10 border-border placeholder:text-muted-foreground text-foreground"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2 pt-2">
                            <Button 
                                size="sm" 
                                variant={filterMode === 'my-patients' ? 'secondary' : 'outline'} 
                                className="flex-grow"
                                onClick={() => setFilterMode('my-patients')}
                            >
                                My Patients ({isLoadingPatients ? <Loader2 className='h-3 w-3 animate-spin ml-1'/> : patients?.length})
                            </Button>
                            <Button 
                                size="sm" 
                                variant={filterMode === 'all' ? 'secondary' : 'outline'} 
                                className="flex-grow"
                                onClick={() => setFilterMode('all')}
                            >
                                All ED Patients
                            </Button>
                        </div>
                    </CardHeader>

                    <div className="flex-1 overflow-y-auto">
                        {isLoadingPatients ? (
                             <div className="flex justify-center items-center h-full">
                                <Loader2 className="mr-2 h-6 w-6 animate-spin text-muted-foreground" />
                            </div>
                        ) : !filteredPatients || filteredPatients.length === 0 ? (
                            <div className="text-center text-muted-foreground py-10 px-4">
                                <p>No patients found{searchTerm && ` for "${searchTerm}"`}.</p>
                            </div>
                        ) : (
                            <div>
                            {filteredPatients.map((patient) => (
                                <PatientListItem
                                    key={patient.personId}
                                    patient={patient}
                                    isActive={patient.personId === selectedPatientId}
                                    onClick={() => setSelectedPatientId(patient.personId)}
                                />
                            ))}
                            </div>
                        )}
                    </div>
                </Card>

                {/* Right column: Patient Details */}
                <div className="flex-1 overflow-y-auto pl-6">
                    {!selectedPatient ? (
                         <div className="flex h-full items-center justify-center bg-white rounded-lg border">
                            {isLoadingPatients ? (
                                <>
                                    <Loader2 className="mr-2 h-6 w-6 animate-spin text-muted-foreground" />
                                    <p className="text-muted-foreground">Loading patient details...</p>
                                </>
                            ) : (
                                <p className="text-muted-foreground">Select a patient to view details.</p>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* Patient Header */}
                            <div className="flex justify-between items-start">
                                <div>
                                    <h1 className="text-2xl font-bold text-foreground">{selectedPatient.fullName}</h1>
                                    <p className="text-muted-foreground">
                                        {selectedPatient.gender.charAt(0)}{calculateAge(selectedPatient.dateOfBirth)} • MRN-{selectedPatient.nationalId?.slice(-6)} • {selectedPatient.activeProblemList?.split(',')[0] || 'No active problems'} • ED - Bay 3
                                    </p>
                                </div>
                                <Button onClick={() => setIsNewOrderDialogOpen(true)}>+ New Order</Button>
                            </div>

                             {selectedPatient.allergyFlag !== 'None' && (
                                <div className="flex gap-2">
                                    <Badge variant="destructive" className="p-2 text-sm"><AlertTriangle className="h-4 w-4 mr-2" />{selectedPatient.allergyFlag}</Badge>
                                </div>
                             )}

                            <Card className="bg-white">
                                <CardContent className="p-4">
                                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-4 text-center">
                                        <VitalSignMetric label="BP" value="168/95" />
                                        <VitalSignMetric label="HR" value="102" />
                                        <VitalSignMetric label="RR" value="22" />
                                        <VitalSignMetric label="Temp" value="37.2°C" />
                                        <VitalSignMetric label="SpO2" value="94%" />
                                        <VitalSignMetric label="Time" value="14:45" />
                                    </div>
                                </CardContent>
                            </Card>

                            <Tabs defaultValue="problems" className="w-full">
                              <TabsList className="bg-white">
                                  <TabsTrigger value="problems">Problems</TabsTrigger>
                                  <TabsTrigger value="medications">Medications</TabsTrigger>
                                  <TabsTrigger value="labs">Labs</TabsTrigger>
                                  <TabsTrigger value="orders">Orders</TabsTrigger>
                                  <TabsTrigger value="notes">Notes</TabsTrigger>
                              </TabsList>
                              <TabsContent value="problems" className="mt-4">
                                 <div className="space-y-4">
                                    {isLoadingConditions ? (
                                        <div className="flex items-center justify-center h-24 bg-white rounded-lg border"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
                                    ) : conditions && conditions.length > 0 ? (
                                        conditions.map((condition) => (
                                            <Card key={condition.diagnosisId} className="bg-white">
                                                <CardContent className="p-4 flex justify-between items-center">
                                                    <div>
                                                        <p className="font-semibold text-foreground">{condition.icd10Code}</p>
                                                        <p className="text-sm text-muted-foreground">Onset: {condition.onsetDate ? format(new Date(condition.onsetDate), 'yyyy') : 'N/A'}</p>
                                                    </div>
                                                    <Badge variant="outline" className="text-green-400 border-green-400/50">{condition.status}</Badge>
                                                </CardContent>
                                            </Card>
                                        ))
                                    ) : (
                                        <div className="flex items-center justify-center h-24 text-muted-foreground bg-white rounded-lg border"><span>No active problems found.</span></div>
                                    )}
                                 </div>
                              </TabsContent>
                              <TabsContent value="medications" className="mt-4">
                                <div className="space-y-4">
                                  {isLoadingMedications ? (
                                      <div className="flex items-center justify-center h-24 bg-white rounded-lg border"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
                                  ) : medications && medications.length > 0 ? (
                                      medications.map((med) => (
                                          <Card key={med.medicationId} className="bg-white">
                                              <CardContent className="p-4">
                                                  <p className="font-semibold text-foreground">{med.drugName}</p>
                                                  <p className="text-sm text-muted-foreground">{med.dose}</p>
                                                  <div className="flex justify-between items-end mt-2">
                                                      <p className="text-xs text-muted-foreground">Prescribed by {med.prescribingPhysicianId || 'Unknown'}</p>
                                                      <p className="text-xs text-muted-foreground">Since {med.startDate ? format(new Date(med.startDate), 'MMM yyyy') : 'N/A'}</p>
                                                  </div>
                                              </CardContent>
                                          </Card>
                                      ))
                                  ) : (
                                      <div className="flex items-center justify-center h-24 text-muted-foreground bg-white rounded-lg border"><span>No current medications found.</span></div>
                                  )}
                                </div>
                              </TabsContent>
                              <TabsContent value="labs" className="mt-4"><div className="flex items-center justify-center h-40 rounded-lg border-2 border-dashed border-border text-muted-foreground bg-white"><span>No lab results found.</span></div></TabsContent>
                               <TabsContent value="orders" className="mt-4"><div className="flex items-center justify-center h-40 rounded-lg border-2 border-dashed border-border text-muted-foreground bg-white"><span>No active orders.</span></div></TabsContent>
                               <TabsContent value="notes" className="mt-4"><div className="flex items-center justify-center h-40 rounded-lg border-2 border-dashed border-border text-muted-foreground bg-white"><span>No notes found.</span></div></TabsContent>
                            </Tabs>
                        </div>
                    )}
                </div>
            </div>
        </div>
    </div>
    {selectedPatient && (
      <NewOrderDialog 
        open={isNewOrderDialogOpen} 
        onOpenChange={setIsNewOrderDialogOpen}
        patient={selectedPatient}
        />
    )}
    <NewPatientForm 
      open={isNewPatientFormOpen}
      onOpenChange={setIsNewPatientFormOpen}
    />
    </>
  );
}
