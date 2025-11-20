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
  Hourglass,
  CalendarClock,
  ShieldAlert,
  FileText,
  Copy,
  Users2,
  GitPullRequest,
} from 'lucide-react';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { AccessChangesChart } from '@/components/dashboard/admin/access-changes-chart';
import { cn } from '@/lib/utils';

const StatCard = ({
  icon: Icon,
  title,
  value,
  change,
  isRisk = false,
}: {
  icon: React.ElementType;
  title: string;
  value: string;
  change?: string;
  isRisk?: boolean;
}) => (
  <Card className={cn("bg-white", isRisk && 'bg-red-50 border-red-200')}>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      <Icon className={cn("h-4 w-4 text-muted-foreground", isRisk && "text-destructive")} />
    </CardHeader>
    <CardContent>
      <div className={cn("text-2xl font-bold", isRisk && "text-destructive")}>{value}</div>
      {change && <p className="text-xs text-muted-foreground">{change}</p>}
    </CardContent>
  </Card>
);

const RoleSnapshot = ({ role, active, pending, suspended, total }: { role: string; active: number; pending: number; suspended: number; total: number }) => (
    <div className="flex items-center gap-4 py-2">
        <p className="w-24 text-sm font-medium text-foreground">{role}</p>
        <div className="flex-1">
            <Progress value={(active / total) * 100} className="h-3" />
        </div>
        <div className="flex items-center gap-2">
            <Badge variant="secondary" className="w-16 justify-center bg-black text-white hover:bg-black">{active} active</Badge>
            <Badge variant="secondary" className="w-16 justify-center">{pending} pending</Badge>
            <Badge variant="destructive" className="w-16 justify-center">{suspended} suspended</Badge>
        </div>
    </div>
);


export default function SuperAdminDashboard() {
  return (
    <div className="flex flex-col h-full bg-slate-100 text-foreground">
      <DashboardHeader
        title="Access Management Overview"
        description="Super Admin - Identity & access monitoring and control"
        className="bg-white"
      />
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <StatCard icon={Users} title="Total Active Users" value="1,247" change="24/7 high" />
          <StatCard icon={UserPlus} title="New Joiners" value="12" change="Last 7 days" />
          <StatCard icon={UserX} title="Offboards" value="8" change="Last 7 days" />
          <StatCard icon={Hourglass} title="Pending Requests" value="15" change="2 SLA Breaches" />
          <StatCard icon={CalendarClock} title="Expiring Soon" value="22" change="Next 30 days" />
          <StatCard icon={ShieldAlert} title="High Risk Alerts" value="2" change="Immediate attention" isRisk />
        </div>

        <Card className="border-red-200 bg-red-50">
            <CardHeader>
                <CardTitle className="text-base text-red-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <ShieldAlert className="h-5 w-5" />
                        Active Security Alerts (1)
                    </div>
                     <Button variant="link" size="sm" className="text-red-800">View All Alerts</Button>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                 <div className="bg-white p-4 rounded-lg border border-red-200/50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-100 rounded-full"><ShieldAlert className="h-5 w-5 text-red-600" /></div>
                        <div>
                            <p className="font-semibold">Brute-force login attempts</p>
                            <p className="text-sm text-muted-foreground">Multiple failed attempts on Dr. Ben Stone's account detected at 11/17/2024, 9:15 AM</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="secondary">Acknowledge</Button>
                        <Button variant="default" className="bg-black text-white hover:bg-gray-800">Investigate</Button>
                    </div>
                </div>
            </CardContent>
        </Card>
        
        <Card className="border-orange-200 bg-orange-50">
            <CardHeader>
                <CardTitle className="text-base text-orange-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Hourglass className="h-5 w-5" />
                        Open Escalations (2)
                    </div>
                    <Button variant="link" size="sm" className="text-orange-800">Escalation Center</Button>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                 <div className="bg-white p-4 rounded-lg border border-orange-200/50 flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <p className="font-semibold">ESC-2025-045 - John Departed</p>
                            <Badge variant="destructive">Offboarding</Badge>
                            <Badge variant="secondary">Incomplete</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">User has been off-boarded but still has active sessions. Failed to clear access on EPIC, awaiting response from application team.</p>
                        <p className="text-xs text-muted-foreground mt-1">Raised 12 days ago. Assigned to <span className="font-medium text-primary">john.doe@email.com</span></p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">View Details</Button>
                        <Button variant="destructive" size="sm">Take Action</Button>
                    </div>
                </div>
                 <div className="bg-white p-4 rounded-lg border border-orange-200/50 flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <p className="font-semibold">ESC-2025-046 - Dr. Emily Carter</p>
                            <Badge variant="destructive">Urgent</Badge>
                            <Badge>opm</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">Medical license expires in 7 days (Nov 24, 2024). User has full clinical access on systems.</p>
                        <p className="text-xs text-muted-foreground mt-1">Raised 1 day ago. Assigned to <span className="font-medium text-primary">hr.credentialing@medverse.com</span> • Deadline 11/20/2024</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">View Details</Button>
                        <Button variant="destructive" size="sm">Take Action</Button>
                    </div>
                </div>
            </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-white">
                <CardHeader>
                    <CardTitle className="text-base flex items-center justify-between">
                        Role & Department Snapshot
                        <Button variant="link" size="sm">View Directory</Button>
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">User distribution by role</p>
                </CardHeader>
                <CardContent>
                    <RoleSnapshot role="Physicians" active={600} pending={2} suspended={0} total={602} />
                    <RoleSnapshot role="Nurses" active={450} pending={10} suspended={1} total={461} />
                    <RoleSnapshot role="Radiology" active={80} pending={0} suspended={0} total={80} />
                    <RoleSnapshot role="Lab" active={120} pending={1} suspended={0} total={121} />
                    <RoleSnapshot role="Pharmacists" active={60} pending={0} suspended={0} total={60} />
                    <RoleSnapshot role="Admin Staff" active={85} pending={1} suspended={0} total={86} />
                    <RoleSnapshot role="Billing" active={30} pending={0} suspended={0} total={30} />
                </CardContent>
            </Card>
             <Card className="bg-white">
                <CardHeader>
                    <CardTitle className="text-base">Access Changes Trend</CardTitle>
                     <p className="text-sm text-muted-foreground">Daily access modifications (last 7 days)</p>
                </CardHeader>
                <CardContent>
                    <AccessChangesChart />
                </CardContent>
            </Card>
        </div>

        <Card className="bg-white">
            <CardHeader><CardTitle className="text-base">Quick Actions</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-4 gap-4">
                <Button variant="outline" className="flex-col h-24"><UserPlus className="h-6 w-6 mb-2" /> Start Onboarding</Button>
                <Button variant="outline" className="flex-col h-24"><GitPullRequest className="h-6 w-6 mb-2" /> My Approvals</Button>
                <Button variant="outline" className="flex-col h-24"><Copy className="h-6 w-6 mb-2" /> Signing Credentials</Button>
                <Button variant="outline" className="flex-col h-24"><FileText className="h-6 w-6 mb-2" /> Reports</Button>
            </CardContent>
        </Card>

      </div>
    </div>
  );
}
