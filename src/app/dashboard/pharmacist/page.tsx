
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Pill } from 'lucide-react';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';

export default function PharmacistDashboardPage() {
  return (
    <div className="flex flex-col h-full bg-slate-50 text-foreground">
        <DashboardHeader title="Pharmacy Dashboard" description="Verify and dispense medications." />
        <div className="flex-1 overflow-y-auto p-8">
            <Card className="bg-white">
                <CardHeader>
                <CardTitle className="flex items-center">
                    <Pill className="mr-2 h-5 w-5" />
                    Medication Orders
                </CardTitle>
                </CardHeader>
                <CardContent>
                <p className="text-muted-foreground">
                    This is the dashboard for managing medication orders. Review new prescriptions, verify dosages, and manage the dispensation queue.
                </p>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
