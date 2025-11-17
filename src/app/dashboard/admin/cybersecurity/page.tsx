
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldAlert } from 'lucide-react';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';

export default function CybersecurityDashboardPage() {
  return (
    <div className="flex flex-col h-full bg-slate-50 text-foreground">
        <DashboardHeader title="Cybersecurity Operations" description="Monitor and enforce system security policies." />
        <div className="flex-1 overflow-y-auto p-8">
            <Card className="bg-white">
                <CardHeader>
                <CardTitle className="flex items-center">
                    <ShieldAlert className="mr-2 h-5 w-5" />
                    Security & Access Monitoring
                </CardTitle>
                </CardHeader>
                <CardContent>
                <p className="text-muted-foreground">
                    Enforce MFA, monitor for suspicious activity, and manage access policies. Review audit logs and session recordings to ensure compliance.
                </p>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
