'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  CalendarClock,
  ClipboardCheck,
  Ban,
  FileCheck,
  Briefcase,
  UserCheck,
  FileWarning,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { CredentialsExpiringCard } from '@/components/dashboard/hr/credentials-expiring-card';
import { OnboardingPipelineCard } from '@/components/dashboard/hr/onboarding-pipeline-card';
import { WorkforceMovementChart } from '@/components/dashboard/hr/workforce-movement-chart';

const StatCard = ({ icon: Icon, title, value, cardClassName, iconClassName, valueClassName }: { icon: React.ElementType, title: string, value: React.ReactNode, cardClassName?: string, iconClassName?: string, valueClassName?: string }) => (
  <Card className={cn("bg-white", cardClassName)}>
    <CardContent className="p-4 flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <p className={cn("text-2xl font-bold text-foreground", valueClassName)}>{value}</p>
      </div>
      <div className={cn("p-3 rounded-full", iconClassName)}>
        <Icon className="h-6 w-6 text-yellow-800" />
      </div>
    </CardContent>
  </Card>
);

const credentialsByType = [
  { name: 'Medical Licenses', active: 98, expiring: 4 },
  { name: 'Board Certifications', active: 85, expiring: 2 },
  { name: 'DEA Registrations', active: 78, expiring: 1 },
  { name: 'Nursing Licenses', active: 210, expiring: 8 },
];


export default function HrCredentialingDashboard() {
    return (
        <div className="flex flex-col h-full bg-[#F8F9FA] text-foreground">
            <div className="p-6">
                <h1 className="text-2xl font-bold text-foreground">HR &amp; Medical Credentialing Portal</h1>
                <p className="text-muted-foreground">Staff lifecycle management, credentialing, and compliance tracking</p>
            </div>
            <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-6">
                {/* Stat Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <StatCard 
                        icon={CalendarClock} 
                        title="Pending Onboarding" 
                        value="12"
                        cardClassName="bg-yellow-50 border-yellow-200"
                        iconClassName="bg-yellow-100"
                    />
                    <StatCard 
                        icon={FileWarning} 
                        title="Expiring Credentials" 
                        value="25"
                         cardClassName="bg-yellow-50 border-yellow-200"
                        iconClassName="bg-yellow-100"
                    />
                     <StatCard 
                        icon={ClipboardCheck} 
                        title="Completed this month" 
                        value="45"
                         cardClassName="bg-green-50 border-green-200"
                        iconClassName="bg-green-100"
                        valueClassName='text-green-800'
                    />
                     <StatCard 
                        icon={Ban} 
                        title="Contracted with error" 
                        value="8"
                         cardClassName="bg-red-50 border-red-200"
                        iconClassName="bg-red-100"
                        valueClassName="text-red-800"
                    />
                </div>

                <CredentialsExpiringCard />

                <OnboardingPipelineCard />

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                    {/* Workforce Movement Trend */}
                    <Card className="lg:col-span-3 bg-white">
                        <CardHeader>
                            <CardTitle>Workforce Movement Trend</CardTitle>
                             <p className="text-sm text-muted-foreground">Monthly onboarding vs offboarding</p>
                        </CardHeader>
                        <CardContent>
                            <WorkforceMovementChart />
                        </CardContent>
                    </Card>

                    {/* Credentials by Type */}
                     <Card className="lg:col-span-2 bg-white">
                        <CardHeader className="flex-row justify-between items-center">
                            <CardTitle>Credentials by Type</CardTitle>
                             <Button variant="link" size="sm">View All</Button>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {credentialsByType.map(item => (
                                <div key={item.name} className="flex items-center justify-between p-3 rounded-lg border">
                                    <div>
                                        <p className="font-semibold text-foreground">{item.name}</p>
                                        <p className="text-sm text-muted-foreground">{item.active} active</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge variant="destructive" className="bg-red-100 text-red-800">{item.expiring} expiring</Badge>
                                        <Button variant="outline" size="sm">View</Button>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
                
                {/* Quick Actions */}
                <Card className="bg-white">
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                         <p className="text-sm text-muted-foreground">Common HR and credentialing tasks</p>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Button variant="outline" className="flex-col h-24 text-foreground"><FileCheck className="mb-2 h-6 w-6"/>Expiring Credentials</Button>
                        <Button variant="outline" className="flex-col h-24 text-foreground"><Briefcase className="mb-2 h-6 w-6"/>Agency Contracts</Button>
                        <Button variant="outline" className="flex-col h-24 text-foreground"><UserCheck className="mb-2 h-6 w-6"/>Staff Directory</Button>
                        <Button variant="outline" className="flex-col h-24 text-foreground"><Users className="mb-2 h-6 w-6"/>All Reports</Button>
                    </CardContent>
                </Card>

            </div>
        </div>
    );
}
