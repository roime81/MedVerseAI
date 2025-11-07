'use client';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { allWards, allPatients } from "@/lib/sample-data";

export default function AdminDashboard() {
  const wards = allWards.slice(0, 5); // Show top 5 wards for brevity
  const recentMovements = allPatients.filter(p => p.status !== 'Occupied').slice(0, 5);

  return (
    <div className="space-y-6 animate-fade-in">
      <header>
        <h1 className="font-headline text-3xl font-bold tracking-tight">
          Admin Dashboard
        </h1>
        <p className="text-muted-foreground">
          Real-time operational overview of City General Hospital.
        </p>
      </header>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total Bed Occupancy</CardTitle>
            <CardDescription>All Wards</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold">88%</span>
              <span className="text-sm text-muted-foreground">198/225 Beds</span>
            </div>
            <Progress value={88} className="mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Admissions (24h)</CardTitle>
            <CardDescription>New patients admitted</CardDescription>
          </CardHeader>
          <CardContent>
             <span className="text-3xl font-bold">24</span>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Discharges (24h)</CardTitle>
            <CardDescription>Patients discharged</CardDescription>
          </CardHeader>
          <CardContent>
            <span className="text-3xl font-bold">18</span>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Ward Occupancy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {wards.map((ward) => (
                <div key={ward.name}>
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{ward.name}</span>
                    <span className="text-muted-foreground">{ward.occupiedBeds}/{ward.totalBeds}</span>
                  </div>
                  <Progress value={(ward.occupiedBeds / ward.totalBeds) * 100} className="mt-1" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent Patient Movements</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead>Ward</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentMovements.map((patient) => (
                  <TableRow key={patient.id}>
                    <TableCell className="font-medium">{patient.name}</TableCell>
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
      </div>
    </div>
  );
}
