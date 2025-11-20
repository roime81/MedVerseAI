
'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Users,
  UserCheck,
  UserX,
  FileCheck,
  BarChart,
  ClipboardList
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { CredentialsExpiringCard } from '@/components/dashboard/hr/credentials-expiring-card';
import { OnboardingPipelineCard } from '@/components/dashboard/hr/onboarding-pipeline-card';
import { WorkforceMovementChart } from '@/components/dashboard/hr/workforce-movement-chart';

const StatCard = ({ icon: Icon, title, value, footer, cardClassName, iconClassName }) => (
  <Card className={cn("bg-white", cardClassName)}>
    <CardContent className="p-4 flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <p className="text-2xl font-bold text-foreground">{value}</p>
        {footer && <p className="text-xs text-muted-foreground">{footer}</p>}
      </div>
      <div className={cn("p-3 rounded-full", iconClassName)}>
        <Icon className="h-6 w-6 text-primary-foreground" />
      </div>
    </CardContent>
  </Card>
);

const credentialsByType = [
    { type: 'Medical Licenses', count: 1845, expiring: 12, status: 'expiring' },
    { type: 'Board Certifications', count: 1602, expiring: 8, status: 'expiring' },
    { type: 'DEA Registrations', count: 978, expiring: 4, status: 'expiring' },
    { type: 'Nursing Licenses', count: 2130, expiring: 22, status: 'expiring' },
];

export default function HRDashboardPage() {
    return (
        <div className="flex flex-col h-full bg-[#F8F9FA] text-foreground">
            <DashboardHeader 
                title="HR & Medical Credentialing Portal"
                description="Staff lifecycle management, credentialing, and compliance tracking"
            />
            <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-6">
                {/* Stat Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <StatCard 
                        icon={Users} 
                        title="Pending Onboards" 
                        value="28"
                        cardClassName="border-blue-200"
                        iconClassName="bg-blue-600"
                    />
                    <StatCard 
                        icon={UserCheck} 
                        title="Completed This Month" 
                        value="45"
                        cardClassName="border-green-200"
                        iconClassName="bg-green-600"
                    />
                     <StatCard 
                        icon={UserX} 
                        title="Credential Verifications" 
                        value="8"
                        cardClassName="border-yellow-300"
                        iconClassName="bg-yellow-500"
                    />
                </div>

                {/* Credentials Expiring Soon */}
                <CredentialsExpiringCard />
                
                {/* Onboarding Pipeline */}
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
                        <CardHeader>
                            <CardTitle>Credentials by Type</CardTitle>
                            <p className="text-sm text-muted-foreground">Active credentials and expiration tracking</p>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {credentialsByType.map((item, index) => (
                                <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                                    <div className='flex items-center'>
                                        <ClipboardList className="h-4 w-4 mr-3 text-muted-foreground" />
                                        <div>
                                            <p className="font-semibold text-foreground">{item.type}</p>
                                            <p className="text-xs text-muted-foreground">{item.count} active</p>
                                        </div>
                                    </div>
                                    <Button variant="destructive" size="sm">{item.expiring} {item.status}</Button>
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
                        <Button variant="outline" className="flex-col h-24 text-foreground"><UserCheck className="mb-2 h-6 w-6"/>New Hire</Button>
                        <Button variant="outline" className="flex-col h-24 text-foreground"><FileCheck className="mb-2 h-6 w-6"/>Expiring Credentials</Button>
                        <Button variant="outline" className="flex-col h-24 text-foreground"><Users className="mb-2 h-6 w-6"/>Staff Directory</Button>
                        <Button variant="outline" className="flex-col h-24 text-foreground"><BarChart className="mb-2 h-6 w-6"/>HR Reports</Button>
                    </CardContent>
                </Card>

            </div>
        </div>
    );
}
