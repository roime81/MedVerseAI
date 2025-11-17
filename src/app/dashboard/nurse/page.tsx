
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HeartPulse } from 'lucide-react';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';

export default function NurseDashboardPage() {
  return (
    <div className="flex flex-col h-full bg-background text-foreground">
        <DashboardHeader title="Nursing Dashboard" description="Your central hub for patient care and coordination." showShiftTime={true}/>
        <div className="flex-1 overflow-y-auto p-8">
            <Card className="bg-white">
                <CardHeader>
                <CardTitle className="flex items-center">
                    <HeartPulse className="mr-2 h-5 w-5" />
                    Patient Vitals & Tasks
                </CardTitle>
                </CardHeader>
                <CardContent>
                <p className="text-muted-foreground">
                    Welcome to the nursing dashboard. From here, you can view your assigned patients, update vital signs, administer medications, and complete nursing tasks.
                </p>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
