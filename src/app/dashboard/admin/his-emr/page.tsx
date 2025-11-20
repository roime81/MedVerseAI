
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Database } from 'lucide-react';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';

export default function HisEmrDashboardPage() {
  return (
    <div className="flex flex-col h-full bg-slate-50 text-foreground">
        <DashboardHeader title="HIS/EMR Application Dashboard" description="Manage and maintain the Health Information System." />
        <div className="flex-1 overflow-y-auto p-8">
            <Card className="bg-white">
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <Database className="mr-2 h-5 w-5" />
                        HIS/EMR Dashboard
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-lg">Hello, HIS/EMR Application Team</p>
                </CardContent>
            </Card>
        </div>
    </div>
  );_emr/page.tsx
}
