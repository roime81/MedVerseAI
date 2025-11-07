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
import { Progress } from '@/components/ui/progress';
import { allWards, allPatients, Patient } from '@/lib/sample-data';
import { User, Users } from 'lucide-react';

// Helper function to find patients who visited multiple hospitals
const getMultiHospitalPatients = () => {
  const patientVisits: { [key: string]: { hospitals: Set<string>, patient: Patient, count: number } } = {};

  allPatients.forEach(patient => {
    if (!patientVisits[patient.name]) {
      patientVisits[patient.name] = {
        hospitals: new Set(),
        patient,
        count: 0,
      };
    }
    patientVisits[patient.name].hospitals.add(patient.hospital);
    patientVisits[patient.name].count = patientVisits[patient.name].hospitals.size;
  });
  
  return Object.values(patientVisits).filter(p => p.count > 3);
};


export default function BedManagementPage() {
  const wards = allWards;
  const recentActivity = allPatients.slice(0, 5);
  const multiHospitalPatients = getMultiHospitalPatients();
  
  const totalBeds = wards.reduce((sum, ward) => sum + ward.totalBeds, 0);
  const occupiedBeds = wards.reduce((sum, ward) => sum + ward.occupiedBeds, 0);
  const overallOccupancy = (occupiedBeds / totalBeds) * 100;

  const getBadgeVariant = (status: Patient['status']) => {
    switch (status) {
      case 'Occupied': return 'default';
      case 'Discharging': return 'secondary';
      case 'Admitted': return 'outline';
      default: return 'default';
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <header>
        <h1 className="font-headline text-3xl font-bold tracking-tight">
          Bed Management Dashboard
        </h1>
        <p className="text-muted-foreground">
          Real-time overview of bed availability and patient allocation across all hospitals.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Overall Occupancy</CardTitle>
            <CardDescription>All facilities combined</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{occupiedBeds} / {totalBeds}</div>
            <Progress value={overallOccupancy} className="mt-2" />
            <p className="mt-2 text-sm text-muted-foreground">
              {overallOccupancy.toFixed(1)}% of beds are currently occupied.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Available Beds</CardTitle>
             <CardDescription>Ready for patient admission</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">
              {totalBeds - occupiedBeds}
            </div>
             <p className="mt-2 text-sm text-muted-foreground">
              Across {wards.length} wards in multiple hospitals.
            </p>
          </CardContent>
        </Card>
         <Card>
          <CardHeader>
            <CardTitle>Needs Cleaning</CardTitle>
             <CardDescription>Beds pending housekeeping</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">
              {Math.floor(Math.random() * 20) + 5}
            </div>
             <p className="mt-2 text-sm text-muted-foreground">
              Highest priority: Cardiology C-105
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-1">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Users /> Frequent Visitors</CardTitle>
            <CardDescription>Patients who have visited more than 3 different hospital facilities.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient Name</TableHead>
                  <TableHead>Attending Consultant</TableHead>
                  <TableHead className="text-center">No. of Hospitals Visited</TableHead>
                  <TableHead>Last Seen Ward</TableHead>
                  <TableHead>Last Seen At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {multiHospitalPatients.length > 0 ? multiHospitalPatients.map(({ patient, count }) => (
                  <TableRow key={patient.id}>
                    <TableCell className="font-medium flex items-center gap-2"><User size={16} /> {patient.name}</TableCell>
                    <TableCell>{patient.consultant}</TableCell>
                    <TableCell className="text-center">{count}</TableCell>
                    <TableCell>{patient.ward}</TableCell>
                    <TableCell>{patient.hospital}</TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground">No patients have visited more than 3 hospitals.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Ward Occupancy</CardTitle>
            <CardDescription>Breakdown by clinical department</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
              {wards.slice(0, 15).map((ward) => ( // Displaying first 15 for brevity
                <div key={`${ward.hospital}-${ward.name}`}>
                  <div className="mb-1 flex justify-between">
                    <div>
                        <span className="font-medium">{ward.name}</span>
                        <span className="text-xs text-muted-foreground ml-2">{ward.hospital}</span>
                    </div>
                    <span className="text-muted-foreground">
                      {ward.occupiedBeds} / {ward.totalBeds}
                    </span>
                  </div>
                  <Progress value={(ward.occupiedBeds / ward.totalBeds) * 100} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Patient Movements</CardTitle>
            <CardDescription>Latest admissions and discharges</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead>Hospital</TableHead>
                  <TableHead>Ward</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentActivity.map((patient) => (
                  <TableRow key={patient.id}>
                    <TableCell className="font-medium">{patient.name}</TableCell>
                    <TableCell>{patient.hospital}</TableCell>
                    <TableCell>{patient.ward}</TableCell>
                    <TableCell>
                      <Badge variant={getBadgeVariant(patient.status)}>
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
