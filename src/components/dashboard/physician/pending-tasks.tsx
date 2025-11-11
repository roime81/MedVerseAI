'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCollection, useFirestore, useUser, useMemoFirebase } from '@/firebase';
import { collection, query, where, doc, getDoc } from 'firebase/firestore';
import type { PendingTask as Task, Patient } from '@/lib/types';
import { AlertTriangle, CheckCircle, Clock, Loader2 } from 'lucide-react';
import { generatedData } from '@/lib/sample-data';
import { PatientChartSheet } from '../patient-chart/patient-chart-sheet';


const priorityIcons = {
  High: <AlertTriangle className="h-4 w-4 text-red-500" />,
  Medium: <Clock className="h-4 w-4 text-yellow-500" />,
  Low: <CheckCircle className="h-4 w-4 text-green-500" />,
};

const getPriorityClass = (priority: Task['priority']) => {
    switch (priority) {
        case 'High': return 'border-red-500/50 bg-red-500/10';
        case 'Medium': return 'border-yellow-500/50 bg-yellow-500/10';
        case 'Low': return 'border-green-500/50 bg-green-500/10';
        default: return '';
    }
}

export function PendingTasks() {
  const { user } = useUser();
  const firestore = useFirestore();
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [journeyUntilDate, setJourneyUntilDate] = useState<string | undefined>(undefined);
  const [isChartOpen, setIsChartOpen] = useState(false);

  const tasksQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return query(
      collection(firestore, `users/${user.uid}/tasks`),
      where('status', '==', 'Pending')
    );
  }, [firestore, user]);

  const { data: tasksFromDb, isLoading } = useCollection<Task>(tasksQuery);

  const tasks = (tasksFromDb?.length)
    ? tasksFromDb
    : user
        ? generatedData.samplePendingTasks.filter(t => t.assignedTo === 'dr_emily_carter') as Task[]
        : [];

  const handleOpenChart = async (task: Task) => {
    if (!task.patientId) return;

    let patientData: Patient | null = null;

    if (firestore) {
      const patientRef = doc(firestore, 'patients', task.patientId);
      const patientSnap = await getDoc(patientRef);
      if (patientSnap.exists()) {
        patientData = { ...patientSnap.data(), id: patientSnap.id } as Patient;
      }
    } 
    
    if (!patientData) {
      // Fallback to sample data if firestore fails or isn't available
      const samplePatient = generatedData.samplePatients.find(p => p.personId === task.patientId);
      if (samplePatient) {
        patientData = { ...samplePatient, id: samplePatient.personId } as Patient;
      }
    }
    
    if (patientData) {
      setSelectedPatient(patientData);
      setJourneyUntilDate(task.dueDate);
      setIsChartOpen(true);
    } else {
      console.error("Could not find patient data for ID:", task.patientId);
    }
  };


  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="font-grotesk text-lg">Pending Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex h-40 items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : !tasks || tasks.length === 0 ? (
            <div className="flex h-40 items-center justify-center">
              <p className="text-muted-foreground">No pending tasks.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {tasks.map((task, index) => (
                <div 
                  key={index} 
                  className={`flex items-center space-x-3 rounded-lg border p-3 cursor-pointer hover:bg-gray-50/80 transition-colors ${getPriorityClass(task.priority)}`}
                  onClick={() => handleOpenChart(task)}
                >
                  <div className="flex-shrink-0">
                      {priorityIcons[task.priority]}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{task.description}</p>
                    <p className="text-xs text-muted-foreground">Due: {task.dueDate}</p>
                  </div>
                  <Badge variant="outline" className="text-xs">{task.priority}</Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      {selectedPatient && (
        <PatientChartSheet
          patient={selectedPatient}
          open={isChartOpen}
          onOpenChange={setIsChartOpen}
          onAppointmentComplete={() => { /* Not applicable here */ }}
          journeyUntilDate={journeyUntilDate}
        />
      )}
    </>
  );
}
