
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Stethoscope } from 'lucide-react';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';

export default function MedicalAffairsDashboardPage() {
  return (
    <div className="flex flex-col h-full bg-slate-50 text-foreground">
        <DashboardHeader title="Medical Affairs / Clinical Governance" description="Oversee clinical standards and governance." />
        <div className="flex-1 overflow-y-auto p-8">
            <Card className="bg-white">
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <Stethoscope className="mr-2 h-5 w-5" />
                        Medical Affairs Dashboard
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-lg">Hello Medical Affairs/Clinical Gov Admin</p>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
