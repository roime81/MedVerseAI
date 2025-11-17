
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, BarChart2, AlertTriangle, Wifi, CheckCircle, Clock, Database, Archive, User, Cog, FileText, Server, UserCheck, UserX, Activity } from 'lucide-react';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { WeeklyLoginsChart } from '@/components/dashboard/medical-affairs/weekly-logins-chart';
import { UsersByRoleChart } from '@/components/dashboard/medical-affairs/users-by-role-chart';

const StatCard = ({ icon: Icon, title, value, change, changeType, description }) => (
  <Card className="bg-white">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
);

const recentActivities = [
    { user: 'Dr. Emily Carter', action: 'Accessed patient records', time: '2 min ago', icon: UserCheck, color: 'text-blue-500' },
    { user: 'System Admin', action: 'Updated user permissions', time: '15 min ago', icon: Cog, color: 'text-blue-500' },
    { user: 'IT Admin', action: 'Failed login attempt detected', time: '23 min ago', icon: UserX, color: 'text-orange-500' },
    { user: 'HR Admin', action: 'Added new staff member', time: '1 hour ago', icon: User, color: 'text-blue-500' },
    { user: 'Compliance Officer', action: 'Generated audit report', time: '2 hours ago', icon: FileText, color: 'text-blue-500' },
]

export default function MedicalAffairsDashboardPage() {
  return (
    <div className="flex flex-col h-full bg-background text-foreground">
        <DashboardHeader title="Medical Affairs" description="Clinical governance and quality management" />
        <div className="flex-1 overflow-y-auto p-8 space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <StatCard 
                    icon={Users}
                    title="Total Users"
                    value="1,247"
                    description="+12 this week"
                />
                <StatCard 
                    icon={BarChart2}
                    title="System Health"
                    value="99.98%"
                    description="Uptime"
                />
                 <StatCard 
                    icon={AlertTriangle}
                    title="Security Alerts"
                    value="2"
                    description="Requires attention"
                />
                 <StatCard 
                    icon={Wifi}
                    title="Active Sessions"
                    value="847"
                    description="Currently online"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-1 bg-white">
                    <CardHeader>
                        <CardTitle>System Metrics</CardTitle>
                        <p className="text-sm text-muted-foreground">Current system performance indicators</p>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <CheckCircle className="h-5 w-5 text-green-500" />
                                <div>
                                    <p className="font-medium">System Uptime</p>
                                    <p className="text-sm text-muted-foreground">99.98%</p>
                                </div>
                            </div>
                            <CheckCircle className="h-5 w-5 text-green-500" />
                        </div>
                         <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Clock className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="font-medium">Active Users</p>
                                    <p className="text-sm text-muted-foreground">1,247</p>
                                </div>
                            </div>
                             <CheckCircle className="h-5 w-5 text-green-500" />
                        </div>
                         <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Database className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="font-medium">Database Performance</p>
                                    <p className="text-sm text-muted-foreground">95%</p>
                                </div>
                            </div>
                             <CheckCircle className="h-5 w-5 text-green-500" />
                        </div>
                         <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Archive className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="font-medium">Backup Status</p>
                                    <p className="text-sm text-muted-foreground">Complete</p>
                                </div>
                            </div>
                             <CheckCircle className="h-5 w-5 text-green-500" />
                        </div>
                    </CardContent>
                </Card>

                 <Card className="lg:col-span-2 bg-white">
                    <CardHeader>
                        <CardTitle>Recent Activities</CardTitle>
                        <p className="text-sm text-muted-foreground">Latest system events and user actions</p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {recentActivities.map((activity, index) => {
                            const Icon = activity.icon;
                            return (
                                <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border">
                                    <div className={`mt-1 h-2 w-2 rounded-full ${activity.color.replace('text-','bg-')}`}></div>
                                    <div className="flex-grow">
                                        <p className="font-medium text-sm">{activity.user}</p>
                                        <p className="text-sm text-muted-foreground">{activity.action}</p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                                        {activity.color.includes('orange') && <AlertTriangle className="h-4 w-4 text-orange-500" />}
                                    </div>
                                </div>
                            )
                        })}
                    </CardContent>
                </Card>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <Card className="lg:col-span-3 bg-white">
                    <CardHeader>
                        <CardTitle>Weekly Login Activity</CardTitle>
                        <p className="text-sm text-muted-foreground">User logins per day</p>
                    </CardHeader>
                    <CardContent>
                        <WeeklyLoginsChart />
                    </CardContent>
                </Card>
                <Card className="lg:col-span-2 bg-white">
                    <CardHeader>
                        <CardTitle>Users by Role</CardTitle>
                        <p className="text-sm text-muted-foreground">Distribution of active users</p>
                    </CardHeader>
                    <CardContent>
                        <UsersByRoleChart />
                    </CardContent>
                </Card>
            </div>
            
             <Card className="bg-white">
                <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Button variant="outline" className="flex-col h-20"><User className="mb-2"/>Manage Users</Button>
                    <Button variant="outline" className="flex-col h-20"><Cog className="mb-2"/>Security Settings</Button>
                    <Button variant="outline" className="flex-col h-20"><FileText className="mb-2"/>Generate Report</Button>
                    <Button variant="outline" className="flex-col h-20"><Server className="mb-2"/>System Backup</Button>
                </CardContent>
             </Card>

        </div>
    </div>
  );
}
