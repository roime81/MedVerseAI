'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Users,
  Clock,
  Settings2,
  HeartPulse,
  PlayCircle,
  FileCog,
  Shield,
  Dna,
  FlaskConical,
  Scan,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { SystemUsageTrendChart } from '@/components/dashboard/admin/his-emr/system-usage-trend-chart';

const StatCard = ({ title, value, icon: Icon, cardClassName, iconClassName, valueClassName }) => (
  <Card className={cn("bg-white text-foreground", cardClassName)}>
    <CardContent className="p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={cn("p-2 rounded-md", iconClassName)}>
            <Icon className="h-5 w-5 text-current" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className={cn("text-2xl font-bold", valueClassName)}>{value}</p>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

const provisioningQueue = [
  {
    id: 'DMN-2025-8121',
    user: 'Dr. Sarah Mitchell',
    action: 'New Template Physician-Cardiology',
    details: 'Facility: HOSP-A',
    needed: 'Reason: Global Credentialing, CPOE, Radiology Viewer',
    priority: 'high',
    status: 'ready',
  },
  {
    id: 'DMN-2025-8122',
    user: 'Nurse Robert Chen',
    action: 'New Template: Nurse-ICU (Extended)',
    details: 'Facility: HOSP-B, HOSP-A',
    needed: 'Reason: Sterling Documentation, Medication Admin, CPOE, Telehealth',
    priority: 'medium',
    status: 'ready',
  },
  {
    id: 'DMN-2025-8123',
    user: 'Dr. Lincoln White',
    action: 'Active-Access Deprovision',
    details: 'Facility: All',
    needed: 'Reason: User offboarding scheduled for tomorrow',
    priority: 'in-progress',
    status: 'high'
  },
];

const roleDistribution = [
    { role: 'Physician', count: 180, progress: 85, color: 'bg-blue-500' },
    { role: 'Nurse', count: 420, progress: 92, color: 'bg-purple-500' },
    { role: 'Clinical Support', count: 85, progress: 40, color: 'bg-pink-500' },
    { role: 'Administrative', count: 60, progress: 30, color: 'bg-orange-500' },
];

const moduleMatrix = [
    { icon: FileCog, name: 'Clinical Documentation', updated: '2025-11-10'},
    { icon: Shield, name: 'CPOE', updated: '2025-11-10'},
    { icon: Dna, name: 'Medication Administration', updated: '2025-11-10'},
    { icon: FlaskConical, name: 'Lab Result Viewer', updated: '2025-11-10'},
    { icon: Scan, name: 'Radiology Viewer (PACS)', updated: '2025-11-10'},
];


export default function HisEmrAdminDashboard() {
    return (
        <div className="flex flex-col h-full bg-[#F8F9FA] text-foreground">
            <div className="p-6">
                <h1 className="text-2xl font-bold text-foreground">HIS/EMR Application Team Portal</h1>
                <p className="text-muted-foreground">EMR access management, role configuration, and system provisioning</p>
            </div>
            <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-6">
                {/* Stat Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <StatCard 
                        icon={Users} 
                        title="HIS/EMR Active Users" 
                        value="270"
                        iconClassName="text-blue-600 bg-blue-100"
                    />
                    <StatCard 
                        icon={Clock} 
                        title="Pending Provisions" 
                        value="11"
                        iconClassName="text-orange-600 bg-orange-100"
                        cardClassName="border-orange-200"
                    />
                    <StatCard 
                        icon={Settings2} 
                        title="Role Config Changes" 
                        value="3"
                        iconClassName="text-orange-600 bg-orange-100"
                        cardClassName="border-orange-200"
                    />
                     <StatCard 
                        icon={HeartPulse} 
                        title="System Health" 
                        value="99.5%"
                        iconClassName="text-green-600 bg-green-100"
                        cardClassName="border-green-200"
                        valueClassName="text-green-600"
                    />
                </div>

                {/* Provisioning Queue */}
                <Card className="bg-white">
                    <CardHeader className="flex-row justify-between items-center pb-2">
                        <CardTitle className="flex items-center text-base font-semibold">
                            <PlayCircle className="mr-2 h-5 w-5 text-muted-foreground" />
                            HIS/EMR Provisioning Queue
                            <Badge variant="secondary" className="ml-2">{provisioningQueue.length}</Badge>
                        </CardTitle>
                        <Button variant="link" size="sm">View All Tasks</Button>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {provisioningQueue.map((item) => (
                            <div key={item.id} className="flex items-center justify-between p-3 rounded-lg border">
                                <div>
                                    <div className="flex items-center gap-3">
                                        <p className="font-semibold text-foreground">{item.id}</p>
                                         <Badge variant={item.priority === 'high' ? 'destructive' : 'secondary'} className={cn('capitalize', item.priority === 'medium' && 'bg-yellow-200 text-yellow-800')}>{item.priority}</Badge>
                                        <Badge variant="outline" className={cn('capitalize', item.status === 'ready' ? 'text-green-600 border-green-600' : 'text-blue-600 border-blue-600')}>{item.status}</Badge>
                                    </div>
                                    <p className="text-sm font-medium text-foreground mt-1">{item.user} - {item.action}</p>
                                    <p className="text-xs text-muted-foreground">{item.details}</p>
                                    <p className="text-xs text-muted-foreground">{item.needed}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    {item.id === 'DMN-2025-8123' ? (
                                        <Button variant="outline" size="sm">Monitor</Button>
                                    ) : (
                                        <>
                                            <Button variant="outline" size="sm">View Details</Button>
                                            <Button size="sm">Execute</Button>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>


                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                    <Card className="lg:col-span-2 bg-white">
                        <CardHeader>
                            <CardTitle>EMR Role Distribution</CardTitle>
                            <p className="text-sm text-muted-foreground">Active users by role type</p>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {roleDistribution.map(role => (
                                <div key={role.role}>
                                    <div className="flex justify-between items-center mb-1 text-sm">
                                        <div className="flex items-center">
                                            <div className={cn("w-2.5 h-2.5 rounded-full mr-2", role.color)}></div>
                                            <p className="font-semibold text-foreground">{role.role}</p>
                                        </div>
                                        <Badge variant="secondary">{role.count} users</Badge>
                                    </div>
                                    <Progress value={role.progress} className="h-2" />
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card className="lg:col-span-3 bg-white">
                        <CardHeader>
                            <CardTitle>EMR System Usage Trend</CardTitle>
                             <p className="text-sm text-muted-foreground">Daily login activity and errors</p>
                        </CardHeader>
                        <CardContent>
                            <SystemUsageTrendChart />
                        </CardContent>
                    </Card>
                </div>
                
                <Card className="bg-white">
                    <CardHeader className="flex-row justify-between items-center">
                        <CardTitle>EMR Module Access Matrix</CardTitle>
                        <Button variant="link" size="sm">Manage Modules</Button>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {moduleMatrix.map(item => {
                            const Icon = item.icon;
                            return(
                            <div key={item.name} className="flex items-center justify-between p-3 rounded-lg border">
                                <div className="flex items-center gap-3">
                                    <Icon className="h-5 w-5 text-muted-foreground" />
                                    <div>
                                        <p className="font-semibold text-foreground">{item.name}</p>
                                        <p className="text-xs text-muted-foreground">Last updated: {item.updated}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Badge variant="secondary">285 users</Badge>
                                    <Button variant="outline" size="sm">Configure</Button>
                                </div>
                            </div>
                        )})}
                    </CardContent>
                </Card>

            </div>
        </div>
    );
}