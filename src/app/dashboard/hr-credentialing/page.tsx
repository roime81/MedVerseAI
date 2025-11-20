
'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, Clock, CheckCircle, FileText, ExternalLink, LineChart, PieChart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { WorkforceMovementChart } from '@/components/dashboard/hr-credentialing/workforce-movement-chart';
import { CredentialsByTypeChart } from '@/components/dashboard/hr-credentialing/credentials-by-type-chart';

const StatCard = ({ title, value, icon: Icon, iconBgColor = 'bg-gray-100', iconColor = 'text-gray-600', isAlert=false, alertCount }) => (
  <Card className={cn("bg-white flex-1", isAlert && "bg-yellow-50 border-yellow-200")}>
    <CardContent className="p-4">
      <div className="flex items-center justify-between">
          <p className={cn("text-sm font-medium", isAlert ? "text-yellow-800" : "text-muted-foreground")}>{title}</p>
          {isAlert && <Badge variant="destructive" className="h-5 w-5 p-0 justify-center text-xs">{alertCount}</Badge>}
      </div>
      <div className="flex items-center gap-4 mt-2">
        <div className={cn('p-2 rounded-md', iconBgColor)}>
            <Icon className={cn('h-5 w-5', iconColor)} />
        </div>
        <p className="text-2xl font-bold text-foreground">{value}</p>
      </div>
    </CardContent>
  </Card>
);


const expiringCredentials = [
  { name: 'Dr. Emily Carter', role: 'MD', license: 'Medical License - MD-12345', expires: '2025-08-24', daysLeft: 2 },
  { name: 'Dr. Michael Ross', role: 'DO', license: 'DEA Registration - R-DEA-987654321', expires: '2025-09-08', daysLeft: 16 },
  { name: 'Nurse Patricia Lee', role: 'RN', license: 'RN License - RN-012345', expires: '2025-09-29', daysLeft: 28 },
];

const onboardingPipeline = [
    { name: 'Dr. Jennifer Martinez', role: 'Physician - Cardiology', started: '2025-11-10', status: 'Credential Verification', progress: 40, priority: 'high' },
    { name: 'Nurse Robert Chen', role: 'Nurse - ICU', started: '2025-11-02', status: 'Background Check', progress: 80, priority: 'medium' },
    { name: 'Lab Tech Maria Garcia', role: 'Laboratory Technician', started: '2025-10-28', status: 'System Onboarding', progress: 95, priority: 'low' },
];

const QuickAction = ({ value, title }) => (
    <div className="flex-1 p-4 rounded-lg border bg-white text-center">
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-sm text-muted-foreground">{title}</p>
    </div>
)

export default function HRCredentialingPage() {
  return (
    <div className="flex flex-col h-full bg-slate-50 text-foreground">
        <DashboardHeader
            title="HR & Medical Credentialing Portal"
            description="Staff lifecycle management, credentialing, and compliance tracking"
        />

        <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-6">
            <div className="flex gap-6">
                <StatCard title="Ongoing Onboarding" value="12" icon={Clock} iconBgColor="bg-orange-100" iconColor="text-orange-600" />
                <StatCard title="Expiring Credentials" value="28" icon={AlertTriangle} iconBgColor="bg-yellow-100" iconColor="text-yellow-600" isAlert={true} alertCount={3}/>
                <StatCard title="Completed This Month" value="45" icon={CheckCircle} iconBgColor="bg-green-100" iconColor="text-green-600" />
                <StatCard title="Credential Verifications" value="8" icon={FileText} iconBgColor="bg-blue-100" iconColor="text-blue-600"/>
            </div>

            <Card className="bg-yellow-50/50 border-yellow-200 shadow-none">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="flex items-center text-sm font-semibold text-yellow-800">
                        <AlertTriangle className="mr-2 h-4 w-4" />
                        Credentials Expiring Soon (3)
                    </CardTitle>
                     <Button variant="link" className="text-yellow-800">View All Credentials</Button>
                </CardHeader>
                <CardContent className="space-y-3">
                    {expiringCredentials.map(item => (
                         <div key={item.name} className="flex items-center justify-between p-4 bg-white rounded-lg border border-yellow-200">
                            <div>
                                <p className="font-semibold text-foreground flex items-center">{item.name} 
                                <Badge variant="destructive" className="ml-2">{item.daysLeft} days left</Badge>
                                </p>
                                <p className="text-sm text-muted-foreground">{item.license}</p>
                                <p className="text-xs text-muted-foreground mt-1">Expires: {item.expires}</p>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline">Contact Provider</Button>
                                <Button className="bg-black text-white hover:bg-gray-800">Request Renewal</Button>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>
            
            <Card className="bg-white">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="flex items-center text-base">
                        <FileText className="mr-2 h-4 w-4 text-muted-foreground"/>
                        Onboarding Pipeline (3)
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">New hires in credentialing and processing process</p>
                    <Button variant="link">View All Candidates</Button>
                </CardHeader>
                <CardContent className="space-y-4">
                     {onboardingPipeline.map(item => (
                         <div key={item.name} className="flex items-center gap-4 p-4 rounded-lg border">
                            <div className="flex-1">
                                <div className="flex items-center justify-between">
                                    <p className="font-semibold text-foreground flex items-center">
                                        {item.name}
                                        {item.priority === 'high' && <Badge variant="destructive" className="ml-2">High</Badge>}
                                        {item.priority === 'medium' && <Badge variant="secondary" className="ml-2 bg-yellow-200 text-yellow-800">Medium</Badge>}
                                        {item.priority === 'low' && <Badge variant="secondary" className="ml-2 bg-slate-200 text-slate-800">Low</Badge>}
                                    </p>
                                    <span className="text-sm font-semibold">{item.progress}%</span>
                                </div>
                                <Progress value={item.progress} className="h-2 my-1"/>
                                <div className="flex items-center justify-between text-xs text-muted-foreground">
                                    <span>{item.role} • Started: {item.started}</span>
                                    <span>Status: <span className="font-medium text-foreground">{item.status}</span></span>
                                </div>
                            </div>
                            <Button variant="outline">View Profile</Button>
                        </div>
                    ))}
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-white">
                    <CardHeader>
                        <CardTitle className="text-base flex items-center"><LineChart className="h-4 w-4 mr-2 text-muted-foreground"/>Workforce Movement Trend</CardTitle>
                        <p className="text-sm text-muted-foreground">Monthly onboarding vs. offboarding</p>
                    </CardHeader>
                    <CardContent>
                        <WorkforceMovementChart />
                    </CardContent>
                </Card>
                 <Card className="bg-white">
                    <CardHeader>
                        <CardTitle className="text-base flex items-center"><PieChart className="h-4 w-4 mr-2 text-muted-foreground"/>Credentials by Type</CardTitle>
                         <p className="text-sm text-muted-foreground">Active credentials and expiration tracking</p>
                    </CardHeader>
                    <CardContent>
                        <CredentialsByTypeChart />
                    </CardContent>
                </Card>
            </div>
            
            <Card className="bg-transparent shadow-none border-none">
                <CardHeader className="px-0">
                    <CardTitle className="text-base">Quick Actions</CardTitle>
                    <p className="text-sm text-muted-foreground">Common HR and credentialing tasks</p>
                </CardHeader>
                <CardContent className="flex gap-4 p-0">
                   <QuickAction value="14" title="New Hires" />
                   <QuickAction value="28" title="Expiring Credentials" />
                   <QuickAction value="11" title="Staff Directory" />
                   <QuickAction value="4" title="HR Reports" />
                </CardContent>
             </Card>

        </div>
    </div>
  );
}
