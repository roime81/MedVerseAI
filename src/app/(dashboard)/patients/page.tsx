'use client'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { allPatients } from "@/lib/sample-data";

export default function PatientsPage() {
    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'Occupied': return <Badge variant="default">Occupied</Badge>;
            case 'Discharging': return <Badge variant="secondary">Discharging</Badge>;
            case 'Admitted': return <Badge variant="outline">Admitted</Badge>;
            default: return <Badge>{status}</Badge>;
        }
    }
  return (
    <div className="space-y-6 animate-fade-in">
      <header>
        <h1 className="font-headline text-3xl font-bold tracking-tight">
          All Patients
        </h1>
        <p className="text-muted-foreground">
          A complete list of all patients in the system.
        </p>
      </header>
      <Card>
        <CardHeader>
          <CardTitle>Patient List</CardTitle>
          <CardDescription>Click on a row to view patient details.</CardDescription>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Ward</TableHead>
                        <TableHead>Hospital</TableHead>
                        <TableHead>Consultant</TableHead>
                        <TableHead>Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {allPatients.map((patient) => (
                        <TableRow key={patient.id} className="cursor-pointer">
                            <TableCell className="font-medium">{patient.name}</TableCell>
                            <TableCell>{patient.ward}</TableCell>
                            <TableCell>{patient.hospital}</TableCell>
                            <TableCell>{patient.consultant}</TableCell>
                            <TableCell>{getStatusBadge(patient.status)}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </CardContent>
      </Card>
    </div>
  );
}
