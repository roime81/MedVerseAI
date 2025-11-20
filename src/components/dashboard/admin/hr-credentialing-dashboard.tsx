'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { UserCheck, CalendarClock, Users } from 'lucide-react';

export function HrCredentialingDashboard() {
  return (
    <div className="flex flex-col h-full bg-slate-50 text-foreground">
        <DashboardHeader title="HR & Credentialing Dashboard" description="Manage staff lifecycle, credentials, and compliance." />
        <div className="flex-1 overflow-y-auto p-8 space-y-8">
             <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Ongoing Onboarding</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">14</div>
                        <p className="text-xs text-muted-foreground">New staff in the onboarding pipeline.</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Expiring Credentials</CardTitle>
                        <CalendarClock className="h-4 w-4 text-destructive" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-destructive">8</div>
                        <p className="text-xs text-muted-foreground">Credentials expiring in the next 30 days.</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Completed This Week</CardTitle>
                        <UserCheck className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">5</div>
                        <p className="text-xs text-muted-foreground">Onboardings & offboardings.</p>
                    </CardContent>
                </Card>
            </div>
             <Card>
                <CardHeader>
                    <CardTitle>HR & Credentialing Overview</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>Placeholder for HR-specific charts and tables.</p>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
