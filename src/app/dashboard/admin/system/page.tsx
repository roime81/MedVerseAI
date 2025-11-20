
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
  Briefcase,
  Bell,
  AlertTriangle,
  FileWarning,
  CircleDot,
  ShieldAlert,
  Archive,
  Hourglass,
  FileCheck,
  FileText,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { AccessChangesChart } from '@/components/dashboard/admin/access-changes-chart';
import { useFirestore, useMemoFirebase } from '@/firebase';
import { useCollection } from '@/firebase/firestore/use-collection';
import { collection } from 'firebase/firestore';
import type { User as AppUser } from '@/lib/schemas';
import { Loader2 } from 'lucide-react';

const StatCard = ({ icon: Icon, title, value, footer, cardClassName, iconClassName, valueClassName }: { icon: React.ElementType, title: string, value: React.ReactNode, footer: string, cardClassName?: string, iconClassName?: string, valueClassName?: string }) => (
  <Card className={cn("bg-white", cardClassName)}>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      <Icon className={cn("h-4 w-4 text-muted-foreground", iconClassName)} />
    </CardHeader>
    <CardContent>
      <div className={cn("text-2xl font-bold text-foreground", valueClassName)}>{value}</div>
      <p className="text-xs text-muted-foreground">{footer}</p>
    </CardContent>
  </Card>
);

const securityAlerts = [
  {
    title: 'Multiple failed login attempts',
    description: '15 failed login attempts on 2 accounts. Source IP: 172.58.223.64.',
    time: 'Happened 1h ago, at 8:52 AM',
  },
];

const openEscalations = [
  {
    id: 'ESC-2024-1294',
    user: 'Dr. John Departed',
    action: 'will be set as active.',
    reason: 'HOD/HR resume employment date of Oct 16, 2025. HR confirmed last day was Sept 30.',
    status: 'High',
    assignee: 'Assigned to: hr-credentialing@medverse.com',
    deadline: 'Deadline: Oct 18, 2025',
    ago: 'Raised 1d ago',
    statusColor: 'bg-red-500',
  },
  {
    id: 'ESC-2024-1295',
    user: 'Dr. Emily Carter',
    action: 'role has been active for more than 1 year.',
    reason: 'Medical license expires in 1 week (Oct 25). User has not taken action on HRMS or MED.',
    status: 'Urgent',
    assignee: 'Assigned to: medical.affairs@medverse.com',
    deadline: 'Deadline: Oct 20, 2025',
    ago: 'Raised 2d ago',
    statusColor: 'bg-orange-500',
  },
];

const roleSnapshot = [
    { role: 'Physicians', active: 82, pending: 2, suspended: 1, color: 'hsl(var(--primary))' },
    { role: 'Nurses', active: 200, pending: 10, suspended: 2, color: 'hsl(var(--primary))' },
    { role: 'Radiology', active: 15, pending: 1, suspended: 0, color: 'hsl(var(--primary))' },
    { role: 'Lab', active: 30, pending: 2, suspended: 1, color: 'hsl(var(--primary))' },
    { role: 'Pharmacists', active: 10, pending: 1, suspended: 0, color: 'hsl(var(--primary))' },
    { role: 'Admin Staff', active: 22, pending: 1, suspended: 0, color: 'hsl(var(--primary))' },
    { role: 'Billing', active: 8, pending: 0, suspended: 0, color: 'hsl(var(--primary))' },
];


export default function SuperAdminDashboard() {
    const firestore = useFirestore();

    const usersQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return collection(firestore, 'users');
    }, [firestore]);

    const { data: users, isLoading: isLoadingUsers } = useCollection<AppUser>(usersQuery);

    const totalUsers = users?.length ?? 0;
    const newJoiners = users?.filter(u => true).length ?? 0; // Placeholder logic
    const offboarded = 9; // Static for demo
    const pendingRequests = 15; // Static
    const expiringSoon = 33; // Static
    const highRiskAlerts = 3; // Static


    return (
        <div className="flex flex-col h-full bg-[#F8F9FA] text-foreground">
            <div className="p-6">
                <h1 className="text-2xl font-bold text-foreground">Access Management Overview</h1>
                <p className="text-muted-foreground">Super Admin - Identity & access monitoring and control</p>
            </div>
            <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-6">
                {/* Stat Cards */}
                <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
                    <StatCard 
                        icon={Users} 
                        title="Total Active Users" 
                        value={isLoadingUsers ? <Loader2 className="h-6 w-6 animate-spin"/> : totalUsers}
                        footer="View User Directory"
                        cardClassName="border-primary/20"
                    />
                    <StatCard 
                        icon={UserPlus} 
                        title="New Joiners" 
                        value={isLoadingUsers ? <Loader2 className="h-6 w-6 animate-spin"/> : newJoiners}
                        footer="in last 7 days"
                        cardClassName="border-primary/20"
                    />
                    <StatCard 
                        icon={UserX} 
                        title="Offboarded" 
                        value={offboarded}
                        footer="in last 7 days"
                        cardClassName="border-primary/20"
                    />
                    <StatCard 
                        icon={FileClock} 
                        title="Pending Request" 
                        value={pendingRequests}
                        footer="for activation"
                        cardClassName="border-yellow-400/50 bg-yellow-50"
                        iconClassName="text-yellow-600"
                    />
                     <StatCard 
                        icon={Briefcase} 
                        title="Expiring Soon" 
                        value={expiringSoon}
                        footer="contracts (in 30 days)"
                        cardClassName="border-yellow-400/50 bg-yellow-50"
                        iconClassName="text-yellow-600"
                    />
                     <StatCard 
                        icon={ShieldAlert} 
                        title="High-Risk Alerts" 
                        value={highRiskAlerts}
                        footer="requires immediate action"
                        cardClassName="border-red-400/50 bg-red-50"
                        iconClassName="text-red-600"
                    />
                </div>

                {/* Security Alerts */}
                <Card className="bg-red-50/50 border-red-200">
                    <CardHeader className="flex-row justify-between items-center">
                        <CardTitle className="flex items-center text-sm font-semibold text-red-800">
                            <AlertTriangle className="mr-2 h-4 w-4" />
                            Active Security Alerts
                            <Badge variant="destructive" className="ml-2">{securityAlerts.length}</Badge>
                        </CardTitle>
                        <Button variant="link" size="sm" className="text-red-800">View all alerts</Button>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {securityAlerts.map((item, index) => (
                             <div key={index} className="flex items-center justify-between p-3 rounded-lg border bg-white">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-red-100 rounded-full">
                                        <Bell className="h-5 w-5 text-red-600"/>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-foreground">{item.title}</p>
                                        <p className="text-sm text-muted-foreground">{item.description}</p>
                                        <p className="text-xs text-muted-foreground mt-1">{item.time}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button variant="secondary">Acknowledge</Button>
                                    <Button>Investigate</Button>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Open Escalations */}
                <Card className="bg-orange-50/50 border-orange-200">
                    <CardHeader className="flex-row justify-between items-center">
                        <CardTitle className="flex items-center text-sm font-semibold text-orange-800">
                            <FileWarning className="mr-2 h-4 w-4" />
                            Open Escalations
                             <Badge variant="secondary" className="ml-2 bg-orange-200 text-orange-800">{openEscalations.length}</Badge>
                        </CardTitle>
                         <Button variant="link" size="sm" className="text-orange-800">Escalation Center</Button>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {openEscalations.map((item) => (
                             <div key={item.id} className="flex items-start justify-between p-4 rounded-lg border bg-white">
                                <div className="flex items-center gap-4">
                                     <div className="p-2 bg-orange-100 rounded-full">
                                        <CircleDot className="h-5 w-5 text-orange-600"/>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <p className="font-semibold text-foreground">{item.id} - {item.user}</p>
                                            <Badge variant="destructive" className={cn("capitalize", item.statusColor)}>{item.status}</Badge>
                                        </div>
                                        <p className="text-sm text-muted-foreground">{item.action}</p>
                                        <p className="text-xs mt-1 text-muted-foreground">{item.reason}</p>
                                         <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                                            <span>{item.assignee}</span>
                                            <span>{item.deadline}</span>
                                            <span>{item.ago}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button variant="outline" size="sm">View Details</Button>
                                    <Button variant="destructive" size="sm">Take Action</Button>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                    {/* Role Snapshot */}
                    <Card className="lg:col-span-3 bg-white">
                        <CardHeader className="flex-row justify-between items-center">
                            <CardTitle>Role & Department Snapshot</CardTitle>
                             <Button variant="link" size="sm">View Directory</Button>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {roleSnapshot.map(role => (
                                <div key={role.role}>
                                    <div className="flex justify-between items-center mb-1">
                                        <p className="text-sm font-medium text-foreground">{role.role}</p>
                                        <div className="flex items-center gap-3 text-xs">
                                            <span><span className="font-semibold">{role.active}</span> active</span>
                                            {role.pending > 0 && <span><span className="font-semibold">{role.pending}</span> pending</span>}
                                            {role.suspended > 0 && <span className="text-red-500"><span className="font-semibold">{role.suspended}</span> suspended</span>}
                                        </div>
                                    </div>
                                    <Progress value={(role.active / (role.active + role.pending + role.suspended)) * 100} className="h-2" />
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
                        <Button variant="outline" className="flex-col h-24 text-foreground"><Archive className="mb-2 h-6 w-6"/>User Directory</Button>
                        <Button variant="outline" className="flex-col h-24 text-foreground"><Hourglass className="mb-2 h-6 w-6"/>My Approvals</Button>
                        <Button variant="outline" className="flex-col h-24 text-foreground"><FileCheck className="mb-2 h-6 w-6"/>Expiring Credentials</Button>
                        <Button variant="outline" className="flex-col h-24 text-foreground"><FileText className="mb-2 h-6 w-6"/>Reports</Button>
                    </CardContent>
                </Card>

            </div>
        </div>
    );
}
