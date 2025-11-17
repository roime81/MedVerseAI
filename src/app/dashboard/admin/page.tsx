
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield } from 'lucide-react';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';

export default function AdminDashboardPage() {
  return (
    <div className="flex flex-col h-full bg-slate-50 text-foreground">
        <DashboardHeader title="Admin Dashboard" description="System administration and oversight." />
        <div className="flex-1 overflow-y-auto p-8">
            <Card className="bg-white">
                <CardHeader>
                <CardTitle className="flex items-center">
                    <Shield className="mr-2 h-5 w-5" />
                    Admin Panel
                </CardTitle>
                </CardHeader>
                <CardContent>
                <p className="text-muted-foreground">
                    Welcome to the admin dashboard. Here you can manage users, settings, and monitor system activity.
                </p>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
