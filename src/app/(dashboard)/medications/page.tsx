'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { PlusCircle, CheckCircle2, AlertTriangle, MoreHorizontal, ShieldCheck, ShieldAlert } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type MedicationStatus = 'Active' | 'On Hold' | 'Discontinued' | 'Unverified';

type Medication = {
  id: number;
  name: string;
  dosage: string;
  frequency: string;
  status: MedicationStatus;
};

const initialMedications: Medication[] = [
  { id: 1, name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily', status: 'Active' },
  { id: 2, name: 'Metformin', dosage: '500mg', frequency: 'Twice daily', status: 'Active' },
  { id: 3, name: 'Aspirin', dosage: '81mg', frequency: 'Once daily', status: 'Unverified' },
  { id: 4, name: 'Atorvastatin', dosage: '20mg', frequency: 'Once daily', status: 'Discontinued' },
];

export default function MedicationPage() {
  const [medications, setMedications] = useState<Medication[]>(initialMedications);

  const getStatusBadge = (status: MedicationStatus) => {
    switch (status) {
      case 'Active':
        return <Badge variant="default"><CheckCircle2 className="mr-1 h-3 w-3" />Active</Badge>;
      case 'On Hold':
        return <Badge variant="secondary">On Hold</Badge>;
      case 'Unverified':
        return <Badge variant="destructive"><AlertTriangle className="mr-1 h-3 w-3" />Unverified</Badge>;
      case 'Discontinued':
        return <Badge variant="outline">Discontinued</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-headline text-3xl font-bold tracking-tight">
            Medication Reconciliation
          </h1>
          <p className="text-muted-foreground">
            Patient: Jane Doe | MRN: 12345678
          </p>
        </div>
        <div className="mt-4 flex shrink-0 gap-2 md:mt-0">
            <Button><CheckCircle2 className="mr-2 h-4 w-4"/>Reconcile All</Button>
            <Button variant="outline"><PlusCircle className="mr-2 h-4 w-4"/>Add Medication</Button>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Current Medications</CardTitle>
            <CardDescription>List of medications recorded for the patient.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Medication</TableHead>
                  <TableHead>Dosage</TableHead>
                  <TableHead>Frequency</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead><span className="sr-only">Actions</span></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {medications.map((med) => (
                  <TableRow key={med.id} className="transition-colors hover:bg-secondary/50">
                    <TableCell className="font-medium">{med.name}</TableCell>
                    <TableCell>{med.dosage}</TableCell>
                    <TableCell>{med.frequency}</TableCell>
                    <TableCell>{getStatusBadge(med.status)}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Verify</DropdownMenuItem>
                          <DropdownMenuItem>Put on Hold</DropdownMenuItem>
                          <DropdownMenuItem>Discontinue</DropdownMenuItem>
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>Drug Interaction Check</CardTitle>
                <CardDescription>Powered by a real-time drug database.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <Alert>
                  <ShieldCheck className="h-4 w-4" />
                  <AlertTitle>No Significant Interactions</AlertTitle>
                  <AlertDescription>
                    The current active medication list shows no significant drug-drug interactions.
                  </AlertDescription>
                </Alert>
                <Alert variant="destructive">
                  <ShieldAlert className="h-4 w-4" />
                  <AlertTitle>Minor Interaction Warning</AlertTitle>
                  <AlertDescription>
                    Lisinopril & Aspirin: Monitor for potential renal function changes.
                  </AlertDescription>
                </Alert>
                 <Button variant="secondary" className="w-full">Run Full Analysis</Button>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
