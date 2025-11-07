import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Syringe, Pill, Activity, User, Check } from 'lucide-react';

const marTasks = [
  { patient: 'Jane Doe', room: 'C-101', time: '09:00', task: 'Lisinopril 10mg', type: 'med', status: 'Due' },
  { patient: 'John Smith', room: 'C-102', time: '09:00', task: 'Metformin 500mg', type: 'med', status: 'Completed' },
  { patient: 'Jane Doe', room: 'C-101', time: '10:00', task: 'Vitals Check', type: 'task', status: 'Due' },
  { patient: 'Peter Jones', room: 'C-103', time: '10:30', task: 'Insulin Injection', type: 'injection', status: 'Due' },
  { patient: 'Mary Johnson', room: 'C-104', time: '11:00', task: 'Ambulate in hallway', type: 'task', status: 'Upcoming' },
];

const patientAssignments = [
  { name: 'Jane Doe', room: 'C-101', consultant: 'Dr. Evans' },
  { name: 'John Smith', room: 'C-102', consultant: 'Dr. Evans' },
  { name: 'Peter Jones', room: 'C-103', consultant: 'Dr. Chen' },
  { name: 'Mary Johnson', room: 'C-104', consultant: 'Dr. Rodriguez' },
];

export default function NurseDashboard() {
  const getTaskIcon = (type: string) => {
    switch (type) {
      case 'med': return <Pill className="h-4 w-4 text-blue-500" />;
      case 'injection': return <Syringe className="h-4 w-4 text-red-500" />;
      case 'task': return <Activity className="h-4 w-4 text-green-500" />;
      default: return null;
    }
  }

   const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Due':
        return <Badge variant="destructive">Due</Badge>;
      case 'Completed':
        return <Badge variant="default">Completed</Badge>;
      case 'Upcoming':
        return <Badge variant="secondary">Upcoming</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <header className="flex items-center justify-between">
        <div>
            <h1 className="font-headline text-3xl font-bold tracking-tight">
                Nurse Dashboard
            </h1>
            <p className="text-muted-foreground">
                Cardiology Ward | Today's Tasks and Assignments
            </p>
        </div>
        <Button><Check className="mr-2 h-4 w-4"/> Acknowledge Handoff</Button>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Medication & Task List (MAR)</CardTitle>
            <CardDescription>Real-time view of patient care tasks for your shift.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]"></TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Room</TableHead>
                  <TableHead>Task</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {marTasks.map((item, index) => (
                  <TableRow key={index} className={item.status === 'Completed' ? 'text-muted-foreground' : ''}>
                    <TableCell>
                        <div className="flex items-center justify-center rounded-full bg-secondary h-8 w-8">
                         {getTaskIcon(item.type)}
                        </div>
                    </TableCell>
                    <TableCell className="font-medium">{item.time}</TableCell>
                    <TableCell>{item.patient}</TableCell>
                    <TableCell>{item.room}</TableCell>
                    <TableCell>{item.task}</TableCell>
                    <TableCell>{getStatusBadge(item.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>My Patient Assignments</CardTitle>
            <CardDescription>Patients assigned to you for this shift.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             {patientAssignments.map((patient) => (
                <div key={patient.name} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 border">
                    <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border">
                            <AvatarFallback>{patient.name.split(' ').map(n=>n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-semibold">{patient.name}</p>
                            <p className="text-sm text-muted-foreground">Consultant: {patient.consultant}</p>
                        </div>
                    </div>
                    <Badge variant="outline">Room {patient.room}</Badge>
                </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
