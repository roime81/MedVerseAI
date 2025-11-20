
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Users, FileText, CheckCircle, Shield, AlertTriangle, ExternalLink } from 'lucide-react';
import { WeeklyLoginsChart } from '@/components/dashboard/medical-affairs/weekly-logins-chart';
import { cn } from '@/lib/utils';

const RoleSnapshot = ({ role, active, pending, suspended, progress }) => (
    <div className="flex items-center gap-4 py-3 border-b last:border-b-0">
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
    <Button variant="outline" className="flex-1 flex-col h-24 bg-white shadow-sm hover:bg-slate-50">
        <Icon className="h-6 w-6 mb-2 text-muted-foreground" />
        <span className="text-sm font-medium text-muted-foreground">{title}</span>
    </Button>
);

export default function SuperAdminDashboardPage() {
  return (
    <div className="flex flex-col h-full bg-slate-100 text-foreground">
        <div className="p-6">
            <h1 className="text-xl font-bold text-foreground">Home / Overview</h1>
        </div>

        <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-6">
            <Card className="bg-red-100 border-red-300 shadow-none">
                <CardContent className="flex items-center justify-between p-4">
                    <div className='flex items-center'>
                        <AlertTriangle className="mr-3 h-5 w-5 text-red-600" />
                        <div>
                            <p className="font-semibold text-red-800">Multiple Failed Login Attempts</p>
                            <p className="text-sm text-red-700">12 failed login attempts from IP <span className="font-mono">49.207.181.22</span> targeting multiple physician accounts.</p>
                            <p className="text-xs text-red-600 mt-1">Triggered: 11/21/2025, 8:41:00 AM</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" className='bg-white'>Acknowledge</Button>
                        <Button className='bg-gray-800 text-white hover:bg-gray-900'>Investigate</Button>
                    </div>
                </CardContent>
            </Card>
            
            <Card className="bg-orange-100/70 border-orange-300 shadow-none">
                 <CardHeader className='pb-4'>
                    <CardTitle className="flex items-center text-base font-semibold text-orange-800">
                         <AlertTriangle className="mr-2 h-4 w-4" />
                        Open Escalations (2)
                         <Button variant="link" className="ml-auto text-orange-900 font-semibold">Escalation Center</Button>
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="p-4 bg-white rounded-lg border border-gray-200">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="font-semibold text-foreground">ESC-2025-045 - Dr. John Departed</p>
                                <p className="text-sm text-muted-foreground">User still has active HIS/HIE access despite resignation date of Oct 31, 2025. HR confirmed last day worked was Oct 30.</p>
                                <p className="text-xs text-muted-foreground mt-2">Raised: 12 days ago • Assigned to: it.iam@medverse.com • <span className="font-semibold text-red-600">Deadline: 11/17/2025</span></p>
                            </div>
                             <div className="flex items-center gap-2">
                                <Badge variant="destructive">High</Badge>
                                <Button size="sm" className='bg-gray-600 text-white'>Investigating</Button>
                            </div>
                        </div>
                        <div className='mt-3 space-x-2'>
                            <Button variant="outline" size="sm">View Details</Button>
                            <Button size='sm' variant='destructive'>Take Action</Button>
                        </div>
                    </div>
                     <div className="p-4 bg-white rounded-lg border border-gray-200">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="font-semibold text-foreground">ESC-2025-046 - Dr. Emily Carter</p>
                                <p className="text-sm text-muted-foreground">Medical license expires in 7 days (Nov 24). User still has full clinical access in HIS/EMR.</p>
                                <p className="text-xs text-muted-foreground mt-2">Raised: 5 days ago • Assigned to: hr.credentialing@medverse.com • <span className="font-semibold text-red-600">Deadline: 11/20/2025</span></p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Badge variant="destructive">Critical</Badge>
                                <Button size="sm" variant="outline">Open</Button>
                            </div>
                        </div>
                        <div className='mt-3 space-x-2'>
                            <Button variant="outline" size="sm">View Details</Button>
                             <Button size='sm' variant='destructive'>Take Action</Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-white">
                    <CardHeader>
                        <div className='flex justify-between items-center'>
                            <div>
                                <CardTitle className="text-base">Role & Department Snapshot</CardTitle>
                                <p className="text-sm text-muted-foreground">User distribution by role</p>
                            </div>
                            <Button variant={'link'}>View Directory</Button>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <RoleSnapshot role="Physicians" active={82} pending={2} suspended={1} progress={(82/85)*100} />
                        <RoleSnapshot role="Nurses" active={120} pending={10} suspended={1} progress={(120/131)*100} />
                        <RoleSnapshot role="Radiology" active={15} pending={0} suspended={0} progress={100} />
                        <RoleSnapshot role="Lab" active={22} pending={1} suspended={0} progress={(22/23)*100} />
                        <RoleSnapshot role="Pharmacists" active={12} pending={0} suspended={0} progress={100} />
                        <RoleSnapshot role="Admin Staff" active={30} pending={2} suspended={0} progress={(30/32)*100} />
                        <RoleSnapshot role="Billing" active={20} pending={1} suspended={0} progress={(20/21)*100} />
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
                   <QuickAction icon={Users} title="User Directory" />
                   <QuickAction icon={CheckCircle} title="My Approvals" />
                   <QuickAction icon={FileText} title="Expiring Credentials" />
                   <QuickAction icon={Shield} title="Reports" />
                </CardContent>
             </Card>

        </div>
    </div>
  );
}
