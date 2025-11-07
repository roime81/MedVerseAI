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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { allPatients } from '@/lib/sample-data';
import { Clock, FileText, Stethoscope } from 'lucide-react';
import { placeholderImages } from '@/lib/placeholder-images';

const upcomingAppointments = [
  { time: '09:00 AM', name: 'Robert Brown', reason: 'Follow-up', avatarId: 'tele-patient-1' },
  { time: '09:30 AM', name: 'Emily Davis', reason: 'New Patient Visit', avatarId: 'tele-patient-2' },
  { time: '10:00 AM', name: 'Michael Wilson', reason: 'Annual Check-up', avatarId: 'tele-patient-3' },
];

const recentResults = [
    { patient: 'Jane Doe', test: 'CBC', status: 'Normal' },
    { patient: 'John Smith', test: 'Chest X-Ray', status: 'Pending Review' },
    { patient: 'Mary Johnson', test: 'Lipid Panel', status: 'Action Required' },
]

export default function PhysicianDashboard() {
  const getAvatarUrl = (id: string) => placeholderImages.find(p => p.id === id)?.imageUrl || '';

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Normal':
        return <Badge variant="default">Normal</Badge>;
      case 'Pending Review':
        return <Badge variant="secondary">Pending Review</Badge>;
      case 'Action Required':
        return <Badge variant="destructive">Action Required</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };


  return (
    <div className="space-y-6 animate-fade-in">
      <header>
        <h1 className="font-headline text-3xl font-bold tracking-tight">
          Physician Dashboard
        </h1>
        <p className="text-muted-foreground">
          Welcome back, Dr. Carter. Here's your overview for today.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Stethoscope /> My Patients</CardTitle>
            <CardDescription>Active patients under your care</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{allPatients.filter(p => p.consultant === "Dr. Evans").length}</div>
            <p className="mt-2 text-sm text-muted-foreground">
              3 new admissions in the last 24 hours.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Clock/> Open Encounters</CardTitle>
            <CardDescription>In-progress patient notes</CardDescription>
          </CardHeader>
          <CardContent>
             <div className="text-4xl font-bold">5</div>
             <p className="mt-2 text-sm text-muted-foreground">
              2 encounters are over 48 hours old.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><FileText /> Unread Results</CardTitle>
             <CardDescription>Labs and reports needing review</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">8</div>
            <p className="mt-2 text-sm text-muted-foreground">
                3 are marked as critical.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Today's Appointments</CardTitle>
            <CardDescription>Your schedule for today.</CardDescription>
          </CardHeader>
          <CardContent>
             <div className="space-y-4">
              {upcomingAppointments.map((appt) => (
                <div key={appt.name} className="flex items-center gap-4">
                  <Avatar className="h-10 w-10 border">
                    <AvatarImage src={getAvatarUrl(appt.avatarId)} />
                    <AvatarFallback>{appt.name.split(' ').map(n=>n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium">{appt.name}</p>
                    <p className="text-sm text-muted-foreground">{appt.reason}</p>
                  </div>
                  <Badge variant="outline">{appt.time}</Badge>
                </div>
              ))}
             </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Results Inbox</CardTitle>
            <CardDescription>Latest lab and imaging results</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead>Test</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentResults.map((result) => (
                  <TableRow key={result.patient + result.test}>
                    <TableCell className="font-medium">{result.patient}</TableCell>
                    <TableCell>{result.test}</TableCell>
                    <TableCell>
                      {getStatusBadge(result.status)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
