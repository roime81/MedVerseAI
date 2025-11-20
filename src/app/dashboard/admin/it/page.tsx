
'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Clock,
  CheckCircle,
  AlertCircle,
  Zap,
  Cog,
  ShieldQuestion,
  Book,
  Server,
  PlayCircle,
  XCircle,
  History
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ExecutionPerformanceChart } from '@/components/dashboard/admin/it/execution-performance-chart';

const StatCard = ({ icon: Icon, title, value, footer, cardClassName, iconClassName, valueClassName }) => (
  <Card className={cn("bg-white", cardClassName)}>
    <CardContent className="p-4">
      <div className="flex items-center justify-between">
         <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className={cn("text-2xl font-bold text-foreground", valueClassName)}>{value}</p>
         </div>
         <div className={cn("p-2 rounded-md", iconClassName)}>
            <Icon className="h-5 w-5 text-current" />
        </div>
      </div>
       {footer && <p className="text-xs text-muted-foreground mt-1">{footer}</p>}
    </CardContent>
  </Card>
);

const executionQueue = [
  {
    id: 'EXEC-2025-8009',
    user: 'Dr. Sarah Mitchell',
    action: 'Active: Practice HIS Access - Physician Role',
    details: 'Facility: HOSP-A - Approved by HOD-Mitch...',
    priority: 'high',
    status: 'ready',
  },
  {
    id: 'EXEC-2025-8010',
    user: 'Nurse Arin Davis',
    action: 'Active: Role Modification - ACC To ICU',
    details: 'Facility: HOSP-A - Approved by HOD-CL',
    priority: 'medium',
    status: 'ready',
  },
  {
    id: 'EXEC-2025-8008',
    user: 'Dr. Mark Lolem',
    action: 'Active: Deprovision Access - Termination',
    details: 'Facility: All Sites - Approved by HR',
    priority: 'high',
    status: 'in-progress',
  },
];

const systemHealth = [
    { name: 'Active Directory', status: 'healthy', lastSync: '1 min ago' },
    { name: 'HIS/EMR', status: 'healthy', lastSync: '1 min ago' },
    { name: 'PACS', status: 'healthy', lastSync: '25 min ago' },
    { name: 'Pharmacy System', status: 'healthy', lastSync: '1 min ago' },
];

export default function ITAdminDashboard() {
    return (
        <div className="flex flex-col h-full bg-[#F8F9FA] text-foreground">
            <div className="p-6">
                <h1 className="text-2xl font-bold text-foreground">IT Identity & Access Management Portal</h1>
                <p className="text-muted-foreground">Technical execution, provisioning, and system integration management</p>
            </div>
            <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-6">
                {/* Stat Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <StatCard 
                        icon={Clock} 
                        title="Pending Executions" 
                        value="14"
                        iconClassName="text-orange-600 bg-orange-100"
                    />
                    <StatCard 
                        icon={CheckCircle} 
                        title="Completed Today" 
                        value="52"
                        iconClassName="text-green-600 bg-green-100"
                    />
                    <StatCard 
                        icon={XCircle} 
                        title="Failed Today" 
                        value="2"
                        iconClassName="text-red-600 bg-red-100"
                    />
                     <StatCard 
                        icon={History} 
                        title="Avg Execution Time" 
                        value="4.2m"
                        iconClassName="text-blue-600 bg-blue-100"
                    />
                </div>

                {/* Execution Queue */}
                <Card className="bg-white">
                    <CardHeader className="flex-row justify-between items-center pb-2">
                        <CardTitle className="flex items-center text-base font-semibold">
                            <PlayCircle className="mr-2 h-5 w-5 text-muted-foreground" />
                            Execution Queue
                            <Badge variant="secondary" className="ml-2">{executionQueue.length}</Badge>
                        </CardTitle>
                        <Button variant="link" size="sm">View All Jobs</Button>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {executionQueue.map((item) => (
                            <div key={item.id} className="flex items-center justify-between p-3 rounded-lg border">
                                <div>
                                    <div className="flex items-center gap-3">
                                        <p className="font-semibold text-foreground">{item.id}</p>
                                        <Badge variant={item.priority === 'high' ? 'destructive' : 'secondary'} className={cn('capitalize', item.priority === 'medium' && 'bg-yellow-200 text-yellow-800')}>{item.priority}</Badge>
                                        <Badge variant="outline" className={cn('capitalize', item.status === 'ready' ? 'text-green-600 border-green-600' : 'text-blue-600 border-blue-600')}>{item.status}</Badge>
                                    </div>
                                    <p className="text-sm font-medium text-foreground mt-1">{item.user} - {item.action}</p>
                                    <p className="text-xs text-muted-foreground">{item.details}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button variant="outline" size="sm">View Details</Button>
                                    <Button size="sm">Execute</Button>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>


                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                    {/* System Integration Health */}
                    <Card className="lg:col-span-2 bg-white">
                        <CardHeader className="flex-row justify-between items-center">
                            <CardTitle>System Integration Health</CardTitle>
                            <Button variant="link" size="sm">Monitor</Button>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {systemHealth.map(item => (
                                <div key={item.name} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={cn("h-2.5 w-2.5 rounded-full", item.status === 'healthy' ? 'bg-green-500' : 'bg-red-500')}></div>
                                        <p className="font-medium text-foreground">{item.name}</p>
                                    </div>
                                    <p className="text-sm text-muted-foreground">{item.lastSync}</p>
                                </div>
                            ))}
                             <div className="p-3 rounded-lg bg-yellow-50 border border-yellow-200 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <AlertCircle className="h-5 w-5 text-yellow-600" />
                                    <p className="text-sm text-yellow-800 font-medium">PACS integration sync delay</p>
                                </div>
                                <Button variant="secondary" size="sm" className="bg-yellow-200 text-yellow-800 hover:bg-yellow-300">Check Connection</Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Execution Performance */}
                    <Card className="lg:col-span-3 bg-white">
                        <CardHeader>
                            <CardTitle>Execution Performance</CardTitle>
                             <p className="text-sm text-muted-foreground">Weekly access provisioning activity</p>
                        </CardHeader>
                        <CardContent>
                            <ExecutionPerformanceChart />
                        </CardContent>
                    </Card>
                </div>
                
                {/* Quick Actions */}
                <Card className="bg-white">
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                         <p className="text-sm text-muted-foreground">Common IAM operational tasks</p>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Button variant="outline" className="flex-col h-24 text-foreground"><Zap className="mb-2 h-6 w-6"/>Run Scheduled Queue</Button>
                        <Button variant="outline" className="flex-col h-24 text-foreground"><Cog className="mb-2 h-6 w-6"/>Edit Operations</Button>
                        <Button variant="outline" className="flex-col h-24 text-foreground"><ShieldQuestion className="mb-2 h-6 w-6"/>Access Audit</Button>
                        <Button variant="outline" className="flex-col h-24 text-foreground"><Server className="mb-2 h-6 w-6"/>System Health</Button>
                    </CardContent>
                </Card>

            </div>
        </div>
    );
}

    