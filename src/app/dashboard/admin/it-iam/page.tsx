
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Fingerprint } from 'lucide-react';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';

export default function ItIamDashboardPage() {
  return (
    <div className="flex flex-col h-full bg-slate-50 text-foreground">
        <DashboardHeader title="IT Identity & Access Management" description="Manage user accounts and system access privileges." />
        <div className="flex-1 overflow-y-auto p-8">
            <Card className="bg-white">
                <CardHeader>
                <CardTitle className="flex items-center">
                    <Users className="mr-2 h-5 w-5" />
                    User Account Management
                </CardTitle>
                </CardHeader>
                <CardContent>
                <p className="text-muted-foreground">
                    Create, modify, and deactivate user accounts. Assign roles and ensure access policies are correctly applied across all clinical systems.
                </p>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
