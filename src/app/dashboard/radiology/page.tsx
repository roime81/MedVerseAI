
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Scan } from 'lucide-react';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';

export default function RadiologyDashboardPage() {
  return (
    <div className="flex flex-col h-full bg-slate-50 text-foreground">
        <DashboardHeader title="Radiology Dashboard" description="Manage and interpret imaging studies." />
        <div className="flex-1 overflow-y-auto p-8">
            <Card className="bg-white">
                <CardHeader>
                <CardTitle className="flex items-center">
                    <Scan className="mr-2 h-5 w-5" />
                    Imaging Worklist
                </CardTitle>
                </CardHeader>
                <CardContent>
                <p className="text-muted-foreground">
                This is the radiology worklist. View incoming imaging orders, access studies from PACS, and write your reports.
                </p>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
