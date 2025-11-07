'use client';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useCollection } from '@/firebase';
import { useMemo, useState } from 'react';
import { collection, getFirestore, limit, query } from 'firebase/firestore';
import type { Ward, Patient } from '@/lib/sample-data';
import { Button } from "@/components/ui/button";
import { seedDatabase } from "@/lib/seed";
import { useToast } from "@/hooks/use-toast";
import { Database, Loader2 } from "lucide-react";

export default function AdminDashboard() {
  const firestore = getFirestore();
  const { toast } = useToast();
  const [isSeeding, setIsSeeding] = useState(false);
  
  const wardsQuery = useMemo(() => query(collection(firestore, 'wards'), limit(5)), [firestore]);
  const patientsQuery = useMemo(() => query(collection(firestore, 'patients'), limit(5)), [firestore]);
  const allWardsQuery = useMemo(() => collection(firestore, 'wards'), [firestore]);

  const { data: topWards, isLoading: wardsLoading } = useCollection<Ward>(wardsQuery);
  const { data: recentMovements, isLoading: patientsLoading } = useCollection<Patient>(patientsQuery);
  const { data: allWards, isLoading: allWardsLoading } = useCollection<Ward>(allWardsQuery);

  const totalOccupancy = useMemo(() => {
    if (!allWards) return { percentage: 0, occupied: 0, total: 0 };
    const totalBeds = allWards.reduce((acc, ward) => acc + ward.totalBeds, 0);
    const occupiedBeds = allWards.reduce((acc, ward) => acc + ward.occupiedBeds, 0);
    return {
      percentage: totalBeds > 0 ? (occupiedBeds / totalBeds) * 100 : 0,
      occupied: occupiedBeds,
      total: totalBeds,
    };
  }, [allWards]);
  
  const handleSeedDatabase = async () => {
    setIsSeeding(true);
    const result = await seedDatabase();
    if (result.success) {
      toast({
        title: "Database Seeded",
        description: "The Firestore database has been populated with sample data.",
      });
    } else {
      toast({
        title: "Seeding Failed",
        description: result.message,
        variant: "destructive",
      });
    }
    setIsSeeding(false);
  };

  const isLoading = wardsLoading || patientsLoading || allWardsLoading;

  if (isLoading) {
    return <div className="flex items-center justify-center p-16"><Loader2 className="h-12 w-12 animate-spin text-muted-foreground" /></div>
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <header className="flex items-center justify-between">
        <div>
            <h1 className="font-headline text-3xl font-bold tracking-tight">
            Admin Dashboard
            </h1>
            <p className="text-muted-foreground">
            Real-time operational overview of City General Hospital.
            </p>
        </div>
        <Button onClick={handleSeedDatabase} disabled={isSeeding}>
            <Database className="mr-2 h-4 w-4" />
            {isSeeding ? 'Seeding...' : 'Seed Database'}
        </Button>
      </header>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total Bed Occupancy</CardTitle>
            <CardDescription>All Wards</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold">{totalOccupancy.percentage.toFixed(0)}%</span>
              <span className="text-sm text-muted-foreground">{totalOccupancy.occupied}/{totalOccupancy.total} Beds</span>
            </div>
            <Progress value={totalOccupancy.percentage} className="mt-2" />
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
              {(topWards || []).map((ward) => (
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
                {(recentMovements || []).map((patient) => (
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
