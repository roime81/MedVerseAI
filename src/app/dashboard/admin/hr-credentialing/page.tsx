
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BadgeCheck } from 'lucide-react';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';

export default function HrCredentialingDashboardPage() {
  return (
    <div className="flex flex-col h-full bg-slate-50 text-foreground">
        <DashboardHeader title="HR & Credentialing Dashboard" description="Manage employee credentials and HR processes." />
        <div className="flex-1 overflow-y-auto p-8">
            <Card className="bg-white">
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <BadgeCheck className="mr-2 h-5 w-5" />
                        HR/Credentialing Dashboard
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-lg">Hello, HR / Medical Credentialing Admin</p>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
