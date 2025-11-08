'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCollection, useFirestore, useUser, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import type { PendingTask as Task } from '@/lib/types';
import { AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { generatedData } from '@/lib/sample-data';


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

  const tasksQuery = useMemoFirebase(() => {
    if (!user) return null;
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-grotesk text-lg">Pending Tasks</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex h-40 items-center justify-center">
            <p className="text-muted-foreground">Loading tasks...</p>
          </div>
        ) : !tasks || tasks.length === 0 ? (
          <div className="flex h-40 items-center justify-center">
            <p className="text-muted-foreground">No pending tasks.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {tasks.map((task, index) => (
              <div key={index} className={`flex items-center space-x-3 rounded-lg border p-3 ${getPriorityClass(task.priority)}`}>
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
  );
}
