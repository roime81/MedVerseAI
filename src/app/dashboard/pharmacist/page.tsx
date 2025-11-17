
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Pill } from 'lucide-react';

export default function PharmacistDashboardPage() {
  return (
    <div className="p-8 space-y-8 bg-background text-foreground">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Pharmacy Dashboard</h1>
        <p className="text-muted-foreground">Verify and dispense medications.</p>
      </div>

      <Card className="bg-white">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Pill className="mr-2 h-5 w-5" />
            Medication Orders
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This dashboard is for managing medication orders. Review new prescriptions, verify dosages, and manage the dispensation queue.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
