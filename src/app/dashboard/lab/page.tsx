
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FlaskConical } from 'lucide-react';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';

export default function LabDashboardPage() {
  return (
    <div className="flex flex-col h-full bg-background text-foreground">
        <DashboardHeader title="Laboratory Dashboard" description="Manage and view laboratory test results." />
        <div className="flex-1 overflow-y-auto p-8">
            <Card className="bg-white">
                <CardHeader>
                <CardTitle className="flex items-center">
                    <FlaskConical className="mr-2 h-5 w-5" />
                    Lab Results
                </CardTitle>
                </CardHeader>
                <CardContent>
                <p className="text-muted-foreground">
                    Welcome to the laboratory dashboard. Here you can view incoming test orders, enter results, and manage lab specimens.
                </p>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
