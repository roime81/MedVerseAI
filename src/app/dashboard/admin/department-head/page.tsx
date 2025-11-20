
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserCog } from 'lucide-react';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';

export default function DepartmentHeadDashboardPage() {
  return (
    <div className="flex flex-col h-full bg-slate-50 text-foreground">
        <DashboardHeader title="Department Head Dashboard" description="Oversee departmental operations and personnel." />
        <div className="flex-1 overflow-y-auto p-8">
            <Card className="bg-white">
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <UserCog className="mr-2 h-5 w-5" />
                        Department Head Dashboard
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-lg">Hello, Department Head (HOD)</p>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
