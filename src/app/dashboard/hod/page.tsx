
'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  FileClock,
  ShieldCheck,
  UserCheck,
  ClipboardList,
  BarChart,
  Clipboard,
  ShieldAlert,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { DepartmentAccessTrendChart } from '@/components/dashboard/hod/department-access-trend-chart';

const StatCard = ({ icon: Icon, title, value, footer, cardClassName, iconClassName, valueClassName }) => (
  <Card className={cn("bg-white", cardClassName)}>
    <CardContent className="p-4">
      <div className="flex items-center justify-between">
         <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className={cn("text-2xl font-bold text-foreground", valueClassName)}>{value}</p>
         </div>
         <div className={cn("p-2 rounded-md", iconClassName)}>
            <Icon className="h-5 w-5 text-green-600" />
        </div>
      </div>
       {footer && <p className="text-xs text-muted-foreground mt-1">{footer}</p>}
    </CardContent>
  </Card>
);


const pendingApprovals = [
  {
    id: 'REQ-2025-0214',
    user: 'Dr. Sarah Mitchell',
    request: 'Additional Access',
    submitted: '3 hours ago',
    priority: 'high',
  },
  {
    id: 'REQ-2025-0215',
    user: 'Nurse Arin Davis',
    request: 'Role Change',
    submitted: '7 hours ago',
    priority: 'medium',
  },
  {
    id: 'REQ-2025-0216',
    user: 'Dr. Lisa Pate',
    request: 'New Access Request',
    submitted: '1 day ago',
    priority: 'medium',
  }
];

const staffOverview = [
    { title: 'Active & Compliant', count: 85, icon: ShieldCheck, color: 'text-green-600' },
    { title: 'Credentials Expiring Soon', count: 4, icon: ClipboardList, color: 'text-yellow-600' },
    { title: 'Pending Onboarding', count: 2, icon: UserCheck, color: 'text-blue-600' },
];

export default function HodDashboardPage() {
    return (
        <div className="flex flex-col h-full bg-[#F8F9FA] text-foreground">
            <div className="p-6">
                <h1 className="text-2xl font-bold text-foreground">Head of Department Portal</h1>
                <p className="text-muted-foreground">Department access oversight and clinical approval management</p>
            </div>
            <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-6">
                {/* Stat Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <StatCard 
                        icon={Users} 
                        title="Total Staff" 
                        value="85"
                        footer="+2 from last month"
                        iconClassName="bg-green-100"
                    />
                    <StatCard 
                        icon={ClipboardList} 
                        title="Active Licenses" 
                        value="82"
                        footer="2 licenses due renewal"
                        iconClassName="bg-green-100"
                    />
                    <StatCard 
                        icon={FileClock} 
                        title="Pending Approvals" 
                        value="3"
                        footer="1 high priority"
                        iconClassName="bg-green-100"
                        valueClassName="text-orange-600"
                    />
                     <StatCard 
                        icon={ShieldCheck} 
                        title="Access Reviews Due" 
                        value="12"
                        footer="+2 from last month"
                        iconClassName="bg-green-100"
                    />
                </div>

                {/* Pending Clinical Approvals */}
                <Card className="bg-orange-50/50 border-orange-200">
                    <CardHeader className="flex-row justify-between items-center pb-2">
                        <CardTitle className="flex items-center text-sm font-semibold text-orange-800">
                            <ShieldAlert className="mr-2 h-4 w-4" />
                            Pending Clinical Approvals
                            <Badge variant="destructive" className="ml-2 bg-orange-200 text-orange-800">{pendingApprovals.length}</Badge>
                        </CardTitle>
                        <Button variant="link" size="sm" className="text-orange-800">View All Requests</Button>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {pendingApprovals.map((item) => (
                            <div key={item.id} className="flex items-center justify-between p-3 rounded-lg border bg-white">
                                <div>
                                    <div className="flex items-center gap-3">
                                        <p className="font-semibold text-foreground">{item.id} - {item.user}</p>
                                        <Badge variant={item.priority === 'high' ? 'destructive' : 'secondary'} className={cn('capitalize', item.priority === 'medium' && 'bg-yellow-200 text-yellow-800')}>{item.priority}</Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground mt-1">{item.request}</p>
                                    <p className="text-xs text-muted-foreground">Submitted {item.submitted}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button variant="outline" size="sm">Reject</Button>
                                    <Button size="sm">Approve</Button>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>


                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                    {/* Department Staff Overview */}
                    <Card className="lg:col-span-2 bg-white">
                        <CardHeader className="flex-row justify-between items-center">
                            <CardTitle>Department Staff Overview</CardTitle>
                            <Button variant="link" size="sm">View All</Button>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {staffOverview.map(item => (
                                <div key={item.title} className="flex items-center justify-between p-3 rounded-md border hover:bg-slate-50 cursor-pointer">
                                    <div className="flex items-center gap-3">
                                        <div className={cn("p-2 rounded-full", item.color.replace('text-', 'bg-').replace('-600', '/10'))}>
                                            <item.icon className={cn("h-5 w-5", item.color)} />
                                        </div>
                                        <p className="font-semibold text-foreground">{item.title}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <p className="font-bold text-lg">{item.count}</p>
                                        <ChevronRight className="h-4 w-4 text-muted-foreground"/>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Department Access Request Trend */}
                    <Card className="lg:col-span-3 bg-white">
                        <CardHeader>
                            <CardTitle>Department Access Request Trend</CardTitle>
                             <p className="text-sm text-muted-foreground">Monthly access requests from your team</p>
                        </CardHeader>
                        <CardContent>
                            <DepartmentAccessTrendChart />
                        </CardContent>
                    </Card>
                </div>
                
                {/* Quick Actions */}
                <Card className="bg-white">
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                         <p className="text-sm text-muted-foreground">Common department management tasks</p>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Button variant="outline" className="flex-col h-24 text-foreground"><FileClock className="mb-2 h-6 w-6"/>My Approvals</Button>
                        <Button variant="outline" className="flex-col h-24 text-foreground"><Users className="mb-2 h-6 w-6"/>My Team</Button>
                        <Button variant="outline" className="flex-col h-24 text-foreground"><ClipboardList className="mb-2 h-6 w-6"/>Expiring Credentials</Button>
                        <Button variant="outline" className="flex-col h-24 text-foreground"><BarChart className="mb-2 h-6 w-6"/>Department Reports</Button>
                    </CardContent>
                </Card>

            </div>
        </div>
    );
}
