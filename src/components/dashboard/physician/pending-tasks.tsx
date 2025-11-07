import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { PendingTask } from '@/lib/types';

const tasks: PendingTask[] = [
    { description: 'Review lab results for Michael Chen', time: '30 min ago', priority: 'High' },
    { description: 'Sign prescription refill for Sarah Johnson', time: '1 hour ago', priority: 'Medium' },
    { description: 'Complete discharge summary for Robert Wilson', time: '2 hours ago', priority: 'High' },
    { description: 'Review imaging results', time: '3 hours ago', priority: 'Low' },
];

const getPriorityClass = (priority: PendingTask['priority']) => {
    switch (priority) {
        case 'High': return 'bg-red-500 text-white';
        case 'Medium': return 'bg-yellow-400 text-gray-800';
        case 'Low': return 'bg-gray-200 text-gray-800';
        default: return '';
    }
}

export function PendingTasks() {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg">Pending Tasks</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {tasks.map((task, index) => (
                        <div key={index} className="flex items-start justify-between rounded-lg border p-3">
                            <div>
                                <p className="font-semibold text-gray-800">{task.description}</p>
                                <p className="text-sm text-muted-foreground">{task.time}</p>
                            </div>
                            <Badge className={`font-semibold ${getPriorityClass(task.priority)}`}>{task.priority}</Badge>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
