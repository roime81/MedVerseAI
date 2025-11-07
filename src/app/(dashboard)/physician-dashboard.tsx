'use client';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Stethoscope, Video, FileText } from "lucide-react";
import { allPatients } from "@/lib/sample-data";

export default function PhysicianDashboard() {
  const myPatients = allPatients.filter(p => p.consultant === 'Dr. Evans').slice(0, 5);
  const appointments = [
    { time: '10:00 AM', name: 'Robert Brown', type: 'Follow-up' },
    { time: '10:30 AM', name: 'Emily Davis', type: 'New Patient' },
    { time: '11:00 AM', name: 'Michael Wilson', type: 'Telehealth' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <header>
        <h1 className="font-headline text-3xl font-bold tracking-tight">
          Physician Dashboard
        </h1>
        <p className="text-muted-foreground">
          Welcome back, Dr. Evans. Here's your overview for today.
        </p>
      </header>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Stethoscope /> My Patients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{myPatients.length}</div>
            <p className="text-xs text-muted-foreground">Active in your care</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Calendar /> Today's Appointments</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="text-3xl font-bold">{appointments.length}</div>
             <p className="text-xs text-muted-foreground">Scheduled for today</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><FileText /> Unsigned Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Notes and orders pending signature</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>My Patient List</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Ward</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {myPatients.map((patient) => (
                  <TableRow key={patient.id}>
                    <TableCell className="font-medium flex items-center gap-3">
                       <Avatar className="h-8 w-8">
                         <AvatarImage src={`https://i.pravatar.cc/150?u=${patient.id}`} />
                         <AvatarFallback>{patient.name.split(' ').map(n=>n[0]).join('')}</AvatarFallback>
                       </Avatar>
                       {patient.name}
                    </TableCell>
                    <TableCell>{patient.ward}</TableCell>
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
                <CardTitle>Upcoming Appointments</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {appointments.map((appt, i) => (
                        <div key={i} className="flex items-center justify-between p-2 rounded-lg hover:bg-secondary/50">
                            <div className="flex items-center gap-3">
                                {appt.type === 'Telehealth' ? <Video className="h-5 w-5 text-primary"/> : <Stethoscope className="h-5 w-5 text-primary"/>}
                                <div>
                                    <p className="font-semibold text-sm">{appt.name}</p>
                                    <p className="text-xs text-muted-foreground">{appt.time}</p>
                                </div>
                            </div>
                            <Badge variant="outline">{appt.type}</Badge>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
