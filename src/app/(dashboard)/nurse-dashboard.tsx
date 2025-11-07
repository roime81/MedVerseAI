'use client';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, ClipboardList, Syringe, UserCheck } from "lucide-react";
import { useCollection, useFirebase, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import type { Patient, Task } from '@/lib/sample-data';

export default function NurseDashboard() {
  const { firestore } = useFirebase();

  const patientsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'patients'), where('ward', '==', 'Cardiology'));
  }, [firestore]);

  const tasksQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    // In a real app, you'd likely filter tasks by the current nurse
    return collection(firestore, 'tasks');
  }, [firestore]);

  const { data: myPatientsData, isLoading: patientsLoading } = useCollection<Patient>(patientsQuery);
  const { data: tasksData, isLoading: tasksLoading } = useCollection<Task>(tasksQuery);
  
  const myPatients = myPatientsData ? myPatientsData.slice(0, 4) : [];
  const tasks = tasksData || [];


  if (patientsLoading || tasksLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <header>
        <h1 className="font-headline text-3xl font-bold tracking-tight">
          Nurse Dashboard
        </h1>
        <p className="text-muted-foreground">
          Cardiology Ward | Today's Tasks and Patient Overview
        </p>
      </header>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><UserCheck /> Assigned Patients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{myPatients.length}</div>
            <p className="text-xs text-muted-foreground">In your direct care</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Syringe /> Meds to Administer</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="text-3xl font-bold">8</div>
             <p className="text-xs text-muted-foreground">In the next 4 hours</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><ClipboardList /> Open Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{tasks.length}</div>
            <p className="text-xs text-muted-foreground">Requires your attention</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>My Patients</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Bed</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {myPatients.map((patient, index) => (
                  <TableRow key={patient.id}>
                    <TableCell className="font-medium flex items-center gap-3">
                       <Avatar className="h-8 w-8">
                         <AvatarImage src={`https://i.pravatar.cc/150?u=${patient.id}`} />
                         <AvatarFallback>{patient.name.split(' ').map(n=>n[0]).join('')}</AvatarFallback>
                       </Avatar>
                       {patient.name}
                    </TableCell>
                    <TableCell>CW-B{index + 1}</TableCell>
                    <TableCell>
                       <Badge variant={patient.status === 'Discharging' ? 'secondary' : 'default'}>
                        {patient.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
         <Card className="lg:col-span-2">
            <CardHeader>
                <CardTitle>Task List</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    {tasks.map((task, i) => (
                        <div key={i} className="flex items-center justify-between p-3 rounded-lg hover:bg-secondary/50 transition-colors">
                            <div>
                                <p className="font-semibold text-sm">{task.description}</p>
                                <p className="text-xs text-muted-foreground">Patient: {task.patient} | Due: {task.time}</p>
                            </div>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                               <Check className="h-4 w-4 text-green-500" />
                            </Button>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
