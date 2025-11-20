
'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Users,
  UserPlus,
  UserX,
  FileClock,
  CalendarClock,
  ShieldAlert,
  AlertOctagon,
  FileWarning,
  Server,
  FileCheck,
  UserCheck,
  BarChart,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { AccessChangesChart } from '@/components/dashboard/admin/access-changes-chart';


const StatCard = ({ icon: Icon, title, value, footer, cardClassName, iconClassName, valueClassName, footerClassName }) => (
  <Card className={cn("bg-white", cardClassName)}>
    <CardContent className="p-4 flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <p className={cn("text-2xl font-bold text-foreground", valueClassName)}>{value}</p>
        {footer && <p className={cn("text-xs text-muted-foreground", footerClassName)}>{footer}</p>}
      </div>
      <div className={cn("p-3 rounded-full", iconClassName)}>
        <Icon className="h-6 w-6 text-primary-foreground" />
      </div>
    </CardContent>
  </Card>
);

const securityAlerts = [
  {
    title: 'Multiple Failed Login Attempts',
    description: 'A-super-admin@medverse.com has had 5 failed login attempts in the last 15 minutes. Potential brute-force attack.',
    time: 'Occurred: 11/17/2025, 8:30 AM',
    level: 'critical',
  },
];

const openEscalations = [
    {
        id: 'ESC-2025-845',
        user: 'Dr. John Departed',
        status: 'investigating',
        priority: 'high',
        summary: 'User will lose all EMR access due to re-credentialing date of Oct 15, 2025. 90-day combined last day worked rule is Oct 10.',
        submitted: '12 days ago',
        assigned: 'hr-credentialing@medverse.com',
        deadline: 'Deadline: 11/17/2025',
    },
     {
        id: 'ESC-2025-646',
        user: 'Dr. Emily Carter',
        status: 'open',
        priority: 'urgent',
        summary: 'Medical license expires in 7 days (Nov 24). User will lose full clinical access in HIS/EMR.',
        submitted: '1 day ago',
        assigned: 'hr-credentialing@medverse.com',
        deadline: 'Deadline: 11/20/2025',
    }
];

const roleSnapshot = [
    { role: 'Physicians', active: 180, pending: 12, suspended: 4, progress: 85 },
    { role: 'Nurses', active: 420, pending: 25, suspended: 8, progress: 90 },
    { role: 'Radiology', active: 45, pending: 2, suspended: 1, progress: 95 },
    { role: 'Lab', active: 60, pending: 5, suspended: 2, progress: 92 },
    { role: 'Pharmacists', active: 30, pending: 1, suspended: 0, progress: 98 },
    { role: 'Admin Staff', active: 85, pending: 8, suspended: 3, progress: 90 },
    { role: 'Billing', active: 25, pending: 0, suspended: 1, progress: 96 },
];

export default function SuperAdminDashboard() {
    return (
        <div className="flex flex-col h-full bg-[#F8F9FA] text-foreground">
            <div className="p-6">
                <h1 className="text-2xl font-bold text-foreground">Access Management Overview</h1>
                <p className="text-muted-foreground">Super Admin - Identity & access monitoring and control</p>
            </div>
            <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-6">
                {/* Stat Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
                    <StatCard 
                        icon={Users} 
                        title="Total Active Users" 
                        value="7,247"
                        footer={<a href="#" className="text-primary text-xs font-semibold hover:underline">Click to view directory</a>}
                        cardClassName="border-blue-200"
                        iconClassName="bg-blue-600"
                    />
                    <StatCard 
                        icon={UserPlus} 
                        title="New Joiners" 
                        value="72"
                        footer="Last 7 days"
                        cardClassName="border-green-200"
                        iconClassName="bg-green-600"
                        valueClassName="text-green-700"
                    />
                     <StatCard 
                        icon={UserX} 
                        title="Offboarded" 
                        value="8"
                        footer="Last 7 days"
                        cardClassName="border-gray-300"
                        iconClassName="bg-gray-600"
                    />
                     <StatCard 
                        icon={FileClock} 
                        title="Pending Requests" 
                        value="14"
                        footer="2 Escalated"
                        cardClassName="border-yellow-300"
                        iconClassName="bg-yellow-500"
                        valueClassName="text-yellow-600"
                    />
                    <StatCard 
                        icon={CalendarClock} 
                        title="Expiring Soon" 
                        value="23"
                        footer="Credentials (60 days)"
                        cardClassName="border-yellow-300"
                        iconClassName="bg-yellow-500"
                        valueClassName="text-yellow-600"
                    />
                    <StatCard 
                        icon={ShieldAlert} 
                        title="High Risk Alerts" 
                        value="2"
                        footer="Requires immediate action"
                        cardClassName="border-red-300"
                        iconClassName="bg-red-600"
                        valueClassName="text-red-700"
                        footerClassName="text-red-600"
                    />
                </div>

                {/* Security Alerts */}
                <Card className="bg-red-50/50 border-red-200">
                    <CardHeader className="flex-row justify-between items-center pb-2">
                        <CardTitle className="flex items-center text-sm font-semibold text-red-800">
                            <AlertOctagon className="mr-2 h-4 w-4" />
                            Active Security Alerts
                            <Badge variant="destructive" className="ml-2">{securityAlerts.length}</Badge>
                        </CardTitle>
                        <Button variant="link" size="sm" className="text-red-800">View All Alerts</Button>
                    </CardHeader>
                    <CardContent>
                        {securityAlerts.map((alert, index) => (
                            <div key={index} className="flex items-center justify-between p-3 rounded-lg border bg-white">
                                <div>
                                    <p className="font-semibold text-foreground">{alert.title}</p>
                                    <p className="text-sm text-muted-foreground">{alert.description}</p>
                                    <p className="text-xs text-muted-foreground mt-1">{alert.time}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button variant="secondary" size="sm">Acknowledge</Button>
                                    <Button size="sm">Investigate</Button>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Open Escalations */}
                <Card className="bg-orange-50/50 border-orange-200">
                    <CardHeader className="flex-row justify-between items-center pb-2">
                        <CardTitle className="flex items-center text-sm font-semibold text-orange-800">
                            <FileWarning className="mr-2 h-4 w-4" />
                            Open Escalations
                             <Badge variant="destructive" className="ml-2 bg-orange-200 text-orange-800">{openEscalations.length}</Badge>
                        </CardTitle>
                        <Button variant="link" size="sm" className="text-orange-800">Escalation Center</Button>
                    </CardHeader>
                    <CardContent className="space-y-3">
                         {openEscalations.map((item) => (
                            <div key={item.id} className="p-4 rounded-lg border bg-white">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <p className="font-semibold text-foreground">{item.id} - {item.user}</p>
                                        <Badge variant={item.priority === 'high' ? 'destructive' : 'secondary'} className={cn('capitalize', item.priority === 'urgent' && 'bg-yellow-200 text-yellow-800')}>{item.priority}</Badge>
                                        <Badge variant="secondary" className="bg-blue-100 text-blue-800 capitalize">{item.status}</Badge>
                                    </div>
                                    <p className="text-xs text-muted-foreground">{item.deadline}</p>
                                </div>
                                <p className="text-sm text-muted-foreground my-2">{item.summary}</p>
                                <div className="flex items-center justify-between text-xs text-muted-foreground">
                                    <p>Submitted {item.submitted} by <a href="#" className="text-primary hover:underline">{item.assigned}</a></p>
                                     <div className="flex items-center gap-2">
                                        <Button variant="outline" size="sm">View Details</Button>
                                        <Button variant="destructive" size="sm">Take Action</Button>
                                    </div>
                                </div>
                            </div>
                         ))}
                    </CardContent>
                </Card>


                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                    {/* Role & Department Snapshot */}
                    <Card className="lg:col-span-3 bg-white">
                        <CardHeader className="flex-row justify-between items-center">
                            <CardTitle>Role & Department Snapshot</CardTitle>
                            <Button variant="link" size="sm">View Directory</Button>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {roleSnapshot.map(role => (
                                <div key={role.role}>
                                    <div className="flex justify-between items-center mb-1">
                                        <p className="font-semibold text-foreground">{role.role}</p>
                                        <div className="flex items-center gap-2 text-sm">
                                            <Badge variant="secondary">{role.active} active</Badge>
                                            <Badge variant="outline">{role.pending} pending</Badge>
                                            <Badge variant="destructive" className="bg-red-100 text-red-800">{role.suspended} suspended</Badge>
                                        </div>
                                    </div>
                                    <Progress value={role.progress} className="h-2"/>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Access Changes Trend */}
                    <Card className="lg:col-span-2 bg-white">
                        <CardHeader>
                            <CardTitle>Access Changes Trend</CardTitle>
                             <p className="text-sm text-muted-foreground">Daily access modifications (last 7 days)</p>
                        </CardHeader>
                        <CardContent>
                            <AccessChangesChart />
                        </CardContent>
                    </Card>
                </div>
                
                {/* Quick Actions */}
                <Card className="bg-white">
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                         <p className="text-sm text-muted-foreground">Common tasks and shortcuts</p>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Button variant="outline" className="flex-col h-24 text-foreground"><Server className="mb-2 h-6 w-6"/>User Directory</Button>
                        <Button variant="outline" className="flex-col h-24 text-foreground"><FileCheck className="mb-2 h-6 w-6"/>My Approvals</Button>
                        <Button variant="outline" className="flex-col h-24 text-foreground"><UserCheck className="mb-2 h-6 w-6"/>Expiring Credentials</Button>
                        <Button variant="outline" className="flex-col h-24 text-foreground"><BarChart className="mb-2 h-6 w-6"/>Reports</Button>
                    </CardContent>
                </Card>

            </div>
        </div>
    );
}
