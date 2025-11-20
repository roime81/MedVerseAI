
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ClipboardCheck } from 'lucide-react';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';

export default function ComplianceAuditDashboardPage() {
  return (
    <div className="flex flex-col h-full bg-slate-50 text-foreground">
        <DashboardHeader title="Compliance & Internal Audit" description="Conduct periodic reviews and ensure regulatory adherence." />
        <div className="flex-1 overflow-y-auto p-8">
            <Card className="bg-white">
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <ClipboardCheck className="mr-2 h-5 w-5" />
                        Compliance/Audit Dashboard
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-lg">Hello Compliance/Audit Admin</p>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
