
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Users, UserPlus, UserMinus, AlertTriangle, Clock, CalendarOff, FileText, CheckCircle, Shield, ExternalLink } from 'lucide-react';
import { WeeklyLoginsChart } from '@/components/dashboard/medical-affairs/weekly-logins-chart';

const StatCard = ({ icon: Icon, title, value, description, footer, iconBgColor = 'bg-gray-100', iconColor = 'text-gray-600', isAlert = false }) => (
  <Card className={cn("bg-white shadow-sm hover:shadow-md transition-shadow", isAlert && "border-red-200")}>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      <div className={cn('p-1.5 rounded-md', iconBgColor)}>
        <Icon className={cn('h-4 w-4', iconColor)} />
      </div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold text-foreground">{value}</div>
      <p className={cn("text-xs", isAlert ? "text-red-500" : "text-muted-foreground")}>{description}</p>
      {footer && <div className="text-xs text-primary mt-1">{footer}</div>}
    </CardContent>
  </Card>
);

const RoleSnapshot = ({ role, active, pending, suspended, progress }) => (
    <div className="flex items-center gap-4 py-2">
        <div className="w-28 text-sm font-medium text-foreground">{role}</div>
        <div className="flex-1">
            <Progress value={progress} className="h-2"/>
        </div>
        <div className="flex gap-2 w-48 justify-end">
            <Badge variant="outline" className="w-16 justify-center">{active} active</Badge>
            <Badge variant="secondary" className="w-16 justify-center">{pending} pending</Badge>
            <Badge variant="destructive" className="w-16 justify-center">{suspended} suspended</Badge>
        </div>
    </div>
);

const QuickAction = ({ icon: Icon, title }) => (
    <Button variant="outline" className="flex-1 flex-col h-20 bg-white">
        <Icon className="h-5 w-5 mb-1 text-muted-foreground" />
        <span className="text-sm font-normal text-muted-foreground">{title}</span>
    </Button>
);

export default function MedicalAffairsDashboardPage() {
  return (
    <div className="flex flex-col h-full bg-slate-100 text-foreground">
        <div className="p-6">
            <h1 className="text-xl font-bold text-foreground">Access Management Overview</h1>
            <p className="text-muted-foreground text-sm">Medical Affairs / Clinical Gov - Identity & access monitoring and control</p>
        </div>

        <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-6">
            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
                <StatCard icon={Users} title="Total Active Users" value="1,247" description="" footer={<span className="flex items-center cursor-pointer hover:underline">Click to view directory <ExternalLink className="ml-1 h-3 w-3" /></span>} iconBgColor="bg-blue-100" iconColor="text-blue-600" />
                <StatCard icon={UserPlus} title="New Joiners" value="12" description="Last 7 days" iconBgColor="bg-green-100" iconColor="text-green-600" />
                <StatCard icon={UserMinus} title="Offboarded" value="8" description="Last 7 days" iconBgColor="bg-gray-200" iconColor="text-gray-600"/>
                <StatCard icon={Clock} title="Pending Requests" value="15" description="2 SLA breached" iconBgColor="bg-yellow-100" iconColor="text-yellow-800" isAlert={true}/>
                <StatCard icon={CalendarOff} title="Expiring Soon" value="23" description="Credentials (30 days)" iconBgColor="bg-orange-100" iconColor="text-orange-800"/>
                <StatCard icon={AlertTriangle} title="High-Risk Alerts" value="3" description="Requires immediate action" iconBgColor="bg-red-100" iconColor="text-red-600" isAlert={true}/>
            </div>

            <Card className="bg-red-50/50 border-red-200 shadow-none">
                <CardHeader>
                    <CardTitle className="flex items-center text-sm font-semibold text-red-800">
                        <AlertTriangle className="mr-2 h-4 w-4" />
                        Active Security Alerts (1)
                        <Button variant="link" className="ml-auto text-red-800">View all alerts</Button>
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
                        <Button>Investigate</Button>
                    </div>
                </CardContent>
            </Card>
            
            <Card className="bg-yellow-50/50 border-yellow-200 shadow-none">
                 <CardHeader>
                    <CardTitle className="flex items-center text-sm font-semibold text-yellow-800">
                         <AlertTriangle className="mr-2 h-4 w-4" />
                        Open Escalations (2)
                         <Button variant="link" className="ml-auto text-yellow-800">View all escalations</Button>
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="p-4 bg-white rounded-lg border border-yellow-200">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="font-semibold text-foreground">ESC-2023-001 - Dr. John Doe</p>
                                <p className="text-sm text-muted-foreground">License verification failed with state medical board API. Manual verification required.</p>
                                <p className="text-xs text-muted-foreground mt-2">Opened 12 days ago • Assigned to hr.credentialing@medverse.com • <span className="text-primary cursor-pointer hover:underline">Related Ticket #12345</span></p>
                            </div>
                             <div className="flex items-center gap-2">
                                <Badge variant="destructive">High</Badge>
                                <Button size="sm">Investigating</Button>
                            </div>
                        </div>
                        <Button variant="outline" size="sm" className="mt-3">View Details</Button>
                    </div>
                     <div className="p-4 bg-white rounded-lg border border-yellow-200">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="font-semibold text-foreground">PRV-2024-0076 - Dr. Emily Carter</p>
                                <p className="text-sm text-muted-foreground">Medical license expires in 7 days. Plan to use Locum Tenens, but clinical access in HIS/EMR not granted.</p>
                                <p className="text-xs text-muted-foreground mt-2">Opened 2 days ago • Assigned to it.iam@medverse.com • <span className="text-primary cursor-pointer hover:underline">Due Date 11/30/2025</span></p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Badge variant="secondary" className="bg-yellow-200 text-yellow-800">Low</Badge>
                                <Button size="sm" variant="secondary">Open</Button>
                            </div>
                        </div>
                        <Button variant="outline" size="sm" className="mt-3">View Details</Button>
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
                        <RoleSnapshot role="Physicians" active={200} pending={12} suspended={4} progress={(200/216)*100} />
                        <RoleSnapshot role="Nurses" active={800} pending={25} suspended={8} progress={(800/833)*100} />
                        <RoleSnapshot role="Radiology" active={30} pending={2} suspended={0} progress={(30/32)*100} />
                        <RoleSnapshot role="Lab" active={50} pending={5} suspended={1} progress={(50/56)*100} />
                        <RoleSnapshot role="Pharmacists" active={25} pending={1} suspended={0} progress={(25/26)*100} />
                        <RoleSnapshot role="Admin Staff" active={42} pending={3} suspended={1} progress={(42/46)*100} />
                        <RoleSnapshot role="Billing" active={15} pending={0} suspended={0} progress={100} />
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
