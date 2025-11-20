
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Users, UserPlus, UserMinus, AlertTriangle, Clock, CalendarOff, FileText, CheckCircle, Shield, ExternalLink, Activity } from 'lucide-react';
import { WeeklyLoginsChart } from '@/components/dashboard/medical-affairs/weekly-logins-chart';
import { cn } from '@/lib/utils';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';

const StatCard = ({ icon: Icon, title, value, description, footer, iconBgColor = 'bg-gray-100', iconColor = 'text-gray-600', isAlert = false, isHighlighted = false }) => (
  <Card className={cn("bg-white shadow-sm hover:shadow-md transition-shadow", isAlert && "border-red-200", isHighlighted && "border-yellow-300")}>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      <div className={cn('p-1.5 rounded-md', iconBgColor)}>
        <Activity className={cn('h-4 w-4', iconColor)} />
      </div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold text-foreground">{value}</div>
      <p className={cn("text-xs", isAlert ? "text-red-500" : "text-muted-foreground")}>{description}</p>
      {footer && <div className="text-xs text-primary mt-1">{footer}</div>}
    </CardContent>
  </Card>
);

const RoleSnapshot = ({ role, active, pending, suspended }) => {
    const total = active + pending + suspended;
    const activePercent = total > 0 ? (active / total) * 100 : 0;
    
    return (
        <div className="flex items-center gap-4 py-2">
            <div className="w-28 text-sm font-medium text-foreground">{role}</div>
            <div className="flex-1">
                <Progress value={activePercent} className="h-2"/>
            </div>
            <div className="flex gap-2 w-48 justify-end">
                <Badge variant="outline" className="w-16 justify-center bg-black text-white">{active} active</Badge>
                <Badge variant="secondary" className="w-16 justify-center bg-slate-500 text-white">{pending} pending</Badge>
                <Badge variant="destructive" className="w-16 justify-center">{suspended} suspended</Badge>
            </div>
        </div>
    );
};

const QuickAction = ({ icon: Icon, title }) => (
    <Button variant="outline" className="flex-1 flex-col h-24 bg-white hover:bg-slate-50 border-slate-200">
        <Icon className="h-5 w-5 mb-1 text-muted-foreground" />
        <span className="text-sm font-normal text-muted-foreground">{title}</span>
    </Button>
);

export default function SuperAdminDashboardPage() {
  return (
    <div className="flex flex-col h-full bg-slate-50 text-foreground">
        <DashboardHeader
            title="Access Management Overview"
            description="Super Admin - Identity & access monitoring and control"
        />

        <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-6">
            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
                <StatCard icon={Users} title="Total Active Users" value="1,247" description="" footer={<span className="flex items-center cursor-pointer hover:underline">View directory <ExternalLink className="ml-1 h-3 w-3" /></span>} iconBgColor="bg-blue-100" iconColor="text-blue-600" />
                <StatCard icon={UserPlus} title="New Joiners" value="12" description="Last 7 days" iconBgColor="bg-green-100" iconColor="text-green-600" />
                <StatCard icon={UserMinus} title="Offboarded" value="8" description="Last 7 days" iconBgColor="bg-gray-200" iconColor="text-gray-600"/>
                <StatCard icon={Clock} title="Pending Requests" value="15" description="2 SLA breached" iconBgColor="bg-yellow-100" iconColor="text-yellow-800" isHighlighted={true} />
                <StatCard icon={CalendarOff} title="Expiring Soon" value="23" description="Credentials (30 days)" iconBgColor="bg-orange-100" iconColor="text-orange-800"/>
                <StatCard icon={AlertTriangle} title="High-Risk Alerts" value="3" description="Requires immediate action" iconBgColor="bg-red-100" iconColor="text-red-600" isAlert={true}/>
            </div>

            <Card className="bg-red-50/50 border-red-200 shadow-none">
                <CardHeader>
                    <CardTitle className="flex items-center text-sm font-semibold text-red-800">
                        <AlertTriangle className="mr-2 h-4 w-4" />
                        Active Security Alerts (1)
                        <Button variant="link" className="ml-auto text-red-800">View all</Button>
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-between p-4 bg-white mx-6 mb-6 rounded-lg border border-red-200">
                    <div>
                        <p className="font-semibold text-foreground">Multiple Failed Login Attempts</p>
                        <p className="text-sm text-muted-foreground">Failed login attempts from IP <span className="font-mono">49.207.181.22</span> targeting multiple physician accounts.</p>
                        <p className="text-xs text-muted-foreground mt-1">Triggered 2 minutes ago</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline">Acknowledge</Button>
                        <Button className="bg-black text-white hover:bg-gray-800">Investigate</Button>
                    </div>
                </CardContent>
            </Card>
            
            <Card className="bg-yellow-50/50 border-yellow-200 shadow-none">
                 <CardHeader>
                    <CardTitle className="flex items-center text-sm font-semibold text-yellow-800">
                         <AlertTriangle className="mr-2 h-4 w-4" />
                        Open Escalations (2)
                         <Button variant="link" className="ml-auto text-yellow-800">Escalation Center</Button>
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="p-4 bg-white rounded-lg border border-yellow-200">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="font-semibold text-foreground">ESC-2023-045 - Dr. John Departed</p>
                                <p className="text-sm text-muted-foreground">User still has active HIS/EMR despite seperation date of Oct 31, 2025. HR confirmed last day worked was Oct 30.</p>
                                <p className="text-xs text-muted-foreground mt-2">Opened 12 days ago • Assigned to hrandcredentialing@medverse.com • DueLine: 11/15/2025</p>
                            </div>
                             <div className="flex items-center gap-2">
                                <Badge variant="secondary" className="bg-red-600 text-white">high</Badge>
                                <Badge variant="secondary" className="bg-gray-800 text-white">investigating</Badge>
                            </div>
                        </div>
                        <div className="flex gap-2 mt-3">
                            <Button variant="outline" size="sm">View Details</Button>
                            <Button variant="destructive" size="sm">Take Action</Button>
                        </div>
                    </div>
                     <div className="p-4 bg-white rounded-lg border border-yellow-200">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="font-semibold text-foreground">PRV-2025-446 - Dr. Emily Carter</p>
                                <p className="text-sm text-muted-foreground">Medical license expires in 7 days (Nov 25). User will lose full clinical access in HIS/EMR.</p>
                                <p className="text-xs text-muted-foreground mt-2">Opened 2 days ago • Assigned to hrandcredentialing@medverse.com • Deadline: 11/30/2025</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Badge variant="secondary" className="bg-yellow-200 text-yellow-800">low</Badge>
                                <Badge variant="secondary" className="bg-gray-400 text-white">open</Badge>
                            </div>
                        </div>
                        <div className="flex gap-2 mt-3">
                            <Button variant="outline" size="sm">View Details</Button>
                            <Button variant="destructive" size="sm">Take Action</Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-white">
                    <CardHeader>
                        <CardTitle className="text-base">Role & Department Snapshot</CardTitle>
                        <p className="text-sm text-muted-foreground">User distribution by role</p>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <RoleSnapshot role="Physicians" active={200} pending={12} suspended={4} />
                        <RoleSnapshot role="Nurses" active={800} pending={25} suspended={8} />
                        <RoleSnapshot role="Radiology" active={30} pending={2} suspended={0} />
                        <RoleSnapshot role="Lab" active={50} pending={5} suspended={1} />
                        <RoleSnapshot role="Pharmacists" active={25} pending={1} suspended={0} />
                        <RoleSnapshot role="Admin Staff" active={42} pending={3} suspended={1} />
                        <RoleSnapshot role="Billing" active={15} pending={0} suspended={0} />
                    </CardContent>
                </Card>
                 <Card className="bg-white">
                    <CardHeader>
                        <CardTitle className="text-base">Access Changes Trend</CardTitle>
                        <p className="text-sm text-muted-foreground">Daily access modifications (last 7 days)</p>
                    </CardHeader>
                    <CardContent>
                        <WeeklyLoginsChart />
                    </CardContent>
                </Card>
            </div>
            
             <Card className="bg-transparent shadow-none border-none">
                <CardHeader className="px-0">
                    <CardTitle className="text-base">Quick Actions</CardTitle>
                    <p className="text-sm text-muted-foreground">Common tasks and shortcuts</p>
                </CardHeader>
                <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4 p-0">
                   <QuickAction icon={Users} title="User Summary" />
                   <QuickAction icon={CheckCircle} title="My Approvals" />
                   <QuickAction icon={FileText} title="Expiring Credentials" />
                   <QuickAction icon={Shield} title="Reports" />
                </CardContent>
             </Card>

        </div>
    </div>
  );
}
