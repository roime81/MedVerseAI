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

type Ward = {
  name: string;
  totalBeds: number;
  occupiedBeds: number;
};

type Patient = {
  id: string;
  name: string;
  ward: string;
  bed: string;
  status: 'Occupied' | 'Discharging';
};

const wards: Ward[] = [
  { name: 'Cardiology', totalBeds: 20, occupiedBeds: 18 },
  { name: 'Orthopedics', totalBeds: 25, occupiedBeds: 22 },
  { name: 'Neurology', totalBeds: 15, occupiedBeds: 10 },
  { name: 'Oncology', totalBeds: 30, occupiedBeds: 29 },
  { name: 'Pediatrics', totalBeds: 20, occupiedBeds: 15 },
  { name: 'Maternity', totalBeds: 18, occupiedBeds: 12 },
];

const recentActivity: Patient[] = [
  { id: 'P001', name: 'John Doe', ward: 'Cardiology', bed: 'C-101', status: 'Occupied' },
  { id: 'P002', name: 'Jane Smith', ward: 'Orthopedics', bed: 'O-205', status: 'Occupied' },
  { id: 'P003', name: 'Peter Jones', ward: 'Neurology', bed: 'N-302', status: 'Discharging' },
  { id: 'P004', name: 'Mary Johnson', ward: 'Oncology', bed: 'ON-410', status: 'Occupied' },
  { id: 'P005', name: 'David Williams', ward: 'Pediatrics', bed: 'P-501', status: 'Occupied' },
];

export default function BedManagementPage() {
  const totalBeds = wards.reduce((sum, ward) => sum + ward.totalBeds, 0);
  const occupiedBeds = wards.reduce((sum, ward) => sum + ward.occupiedBeds, 0);
  const overallOccupancy = (occupiedBeds / totalBeds) * 100;

  return (
    <div className="space-y-6 animate-fade-in">
      <header>
        <h1 className="font-headline text-3xl font-bold tracking-tight">
          Bed Management Dashboard
        </h1>
        <p className="text-muted-foreground">
          Real-time overview of bed availability and patient allocation.
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
              Across {wards.length} wards.
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
              5
            </div>
             <p className="mt-2 text-sm text-muted-foreground">
              Highest priority: Cardiology C-105
            </p>
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
            <div className="space-y-4">
              {wards.map((ward) => (
                <div key={ward.name}>
                  <div className="mb-1 flex justify-between">
                    <span className="font-medium">{ward.name}</span>
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
                  <TableHead>Ward</TableHead>
                  <TableHead>Bed</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentActivity.map((patient) => (
                  <TableRow key={patient.id}>
                    <TableCell className="font-medium">{patient.name}</TableCell>
                    <TableCell>{patient.ward}</TableCell>
                    <TableCell>{patient.bed}</TableCell>
                    <TableCell>
                      <Badge variant={patient.status === 'Occupied' ? 'default' : 'secondary'}>
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
