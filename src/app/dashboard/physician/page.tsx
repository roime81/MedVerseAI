
'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  User as UserIcon,
  Filter,
  Clock,
  AlertTriangle,
  Search,
  Bell,
  LogOut,
  ChevronDown
} from 'lucide-react';
import { useUser, useFirestore, useMemoFirebase, useAuth } from '@/firebase';
import type { Patient, DrugExposure, Condition } from '@/lib/types';
import { useCollection } from '@/firebase/firestore/use-collection';
import { collection, query } from 'firebase/firestore';
import { format, formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { NewOrderDialog } from '@/components/dashboard/physician/new-order-dialog';


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
    const birthDate = new date(dob);
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
  const auth = useAuth();
  const router = useRouter();
  const [selectedPatientId, setSelectedPatientId] = React.useState<string | null>(null);
  const [isNewOrderDialogOpen, setIsNewOrderDialogOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');


  const patientsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'patients'));
  }, [firestore]);

  const { data: patients, isLoading: isLoadingPatients } = useCollection<Patient>(patientsQuery);
  
  const filteredPatients = React.useMemo(() => {
    if (!patients) return [];
    return patients.filter(patient => 
      patient.fullName.toLowerCase().includes(searchTerm.toLowerCase())
    );
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

  const handleSignOut = () => {
    signOut(auth).then(() => {
      router.push('/login');
    });
  };


  return (
    <>
    <div className="flex h-full flex-col bg-slate-50 text-foreground">
       <div className="flex-shrink-0 border-b bg-white p-4">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <UserIcon className="h-6 w-6 text-primary" />
                </div>
                <div>
                    <h2 className="font-semibold text-foreground">{user?.displayName || 'Clinician'}</h2>
                    <p className="text-sm text-muted-foreground">Emergency Department</p>
                </div>
                <div className="h-8 border-l border-border"></div>
                 <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>Shift: 08:00 - 16:00</span>
                </div>
            </div>
             <div className="flex items-center gap-4">
              <div className="relative w-full max-w-xs">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search patients..."
                  className="w-full rounded-md bg-background pl-10 border-border placeholder:text-muted-foreground text-foreground"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground hover:text-foreground">
                <Bell className="h-5 w-5" />
              </Button>
               <Button variant="outline" size="sm" onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </Button>
            </div>
        </div>
      </div>
      <div className="flex flex-1 overflow-hidden">
        {/* Left column: Patient List */}
        <div className="w-1/4 max-w-sm flex-shrink-0 border-r overflow-y-auto flex flex-col bg-white">
            <div className="p-4 border-b">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-foreground">My Patients</h2>
                    <Button variant="ghost" size="icon"><Filter className="h-4 w-4 text-muted-foreground" /></Button>
                </div>
                <div className="flex gap-2">
                    <Button size="sm" variant="secondary" className="flex-grow">All Patients</Button>
                    <Button size="sm" variant="outline" className="flex-grow">New Assigned <Badge className="ml-2 bg-destructive text-destructive-foreground">2</Badge></Button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto">
                {isLoadingPatients ? (
                     <div className="flex justify-center items-center h-full">
                        <Loader2 className="mr-2 h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                ) : !filteredPatients || filteredPatients.length === 0 ? (
                    <div className="text-center text-muted-foreground py-10 px-4">
                        <p>No patients found{searchTerm && ` for "${searchTerm}"`}.</p>
                        {!searchTerm && <p className="text-xs mt-2">Run the seed script to populate sample data.</p>}
                    </div>
                ) : (
                    <div>
                    {filteredPatients.slice(0, 10).map((patient) => (
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
             <Card className="m-4 text-center text-sm rounded-lg bg-white shadow-none border">
                <CardContent className="p-3">
                    <div className="grid grid-cols-3 divide-x divide-border">
                        <div><span className="font-bold text-lg text-foreground">{filteredPatients?.length || 0}</span><p className="text-muted-foreground text-xs">Active</p></div>
                        <div><span className="font-bold text-lg text-destructive">{filteredPatients?.filter(p => p.allergyFlag !== 'None').length || 0}</span><p className="text-muted-foreground text-xs">Alerts</p></div>
                        <div><span className="font-bold text-lg text-foreground">12</span><p className="text-muted-foreground text-xs">Total</p></div>
                    </div>
                </CardContent>
             </Card>
        </div>

        {/* Right column: Patient Details */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50 text-foreground">
            {!selectedPatient ? (
                 <div className="flex h-full items-center justify-center">
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

                    {/* Alerts */}
                     {selectedPatient.allergyFlag !== 'None' && (
                        <div className="flex gap-2">
                            <Badge variant="destructive" className="p-2 text-sm"><AlertTriangle className="h-4 w-4 mr-2" />{selectedPatient.allergyFlag}</Badge>
                        </div>
                     )}

                    {/* Vitals */}
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

                    {/* Main Content Tabs */}
                    <Tabs defaultValue="problems" className="w-full">
                      <TabsList className="bg-white">
                          <TabsTrigger value="overview">Overview</TabsTrigger>
                          <TabsTrigger value="problems">Problems</TabsTrigger>
                          <TabsTrigger value="medications">Medications</TabsTrigger>
                          <TabsTrigger value="labs">Labs</TabsTrigger>
                          <TabsTrigger value="orders">Orders</TabsTrigger>
                          <TabsTrigger value="notes">Notes</TabsTrigger>
                      </TabsList>
                      <TabsContent value="problems" className="mt-4">
                         <div className="space-y-4">
                            {isLoadingConditions ? (
                                <div className="flex items-center justify-center h-24">
                                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                                </div>
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
                                <div className="flex items-center justify-center h-24 text-muted-foreground">
                                    <span>No active problems found.</span>
                                </div>
                            )}
                         </div>
                      </TabsContent>
                      <TabsContent value="medications" className="mt-4">
                        <div className="space-y-4">
                          {isLoadingMedications ? (
                              <div className="flex items-center justify-center h-24">
                                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                              </div>
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
                              <div className="flex items-center justify-center h-24 text-muted-foreground">
                                  <span>No current medications found.</span>
                              </div>
                          )}
                        </div>
                      </TabsContent>
                      <TabsContent value="labs" className="mt-4">
                        <div className="flex items-center justify-center h-40 rounded-lg border-2 border-dashed border-border text-muted-foreground">
                              <span>No lab results found.</span>
                        </div>
                      </TabsContent>
                       <TabsContent value="orders" className="mt-4">
                        <div className="flex items-center justify-center h-40 rounded-lg border-2 border-dashed border-border text-muted-foreground">
                              <span>No active orders.</span>
                        </div>
                      </TabsContent>
                       <TabsContent value="notes" className="mt-4">
                        <div className="flex items-center justify-center h-40 rounded-lg border-2 border-dashed border-border text-muted-foreground">
                              <span>No notes found.</span>
                        </div>
                      </TabsContent>
                    </Tabs>
                </div>
            )}
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
    </>
  );
}

    