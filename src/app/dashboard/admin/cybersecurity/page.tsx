
'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  AlertTriangle,
  UserCheck,
  ShieldAlert,
  Ban,
  Clock,
  ThumbsUp,
  Fingerprint,
  Users,
  BarChart,
  Eye
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { AccessRiskDistributionChart } from '@/components/dashboard/admin/cybersecurity/access-risk-distribution-chart';
import { SecurityAlertTrendsChart } from '@/components/dashboard/admin/cybersecurity/security-alert-trends-chart';

const StatCard = ({ icon: Icon, title, value, cardClassName, iconClassName }) => (
  <Card className={cn("bg-white border", cardClassName)}>
    <CardContent className="p-4 flex items-center justify-between">
      <div className='flex items-center gap-4'>
        <div className={cn("p-2 rounded-md", iconClassName)}>
            <Icon className="h-5 w-5 text-current" />
        </div>
        <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold text-foreground">{value}</p>
        </div>
      </div>
    </CardContent>
  </Card>
);

const securityAlerts = [
  {
    id: 'SEC-2025-0841',
    user: 'Dr. Aaron Adams',
    action: 'Toxic-Access Combination',
    details: 'User has both Physician role and billing modification rights',
    priority: 'critical',
  },
  {
    id: 'SEC-2025-0842',
    user: 'Admin User - Delaware',
    action: 'Suspicious Findings',
    details: 'Non-EMR user exporting multiple patient records',
    priority: 'high',
  },
  {
    id: 'SEC-2025-0847',
    user: 'Dr. Sarah Chie',
    action: 'Dormant-Account-Active',
    details: 'User inactive for 90+ days showed login activity',
    priority: 'medium',
  },
];

const anomalyDetections = [
    { name: 'Off-hours Access', count: 4, icon: Clock },
    { name: 'Multiple Failed Logins', count: 1, icon: Ban },
    { name: 'Unusual Data Exports', count: 2, icon: Fingerprint },
    { name: 'Privilege Escalation', count: 0, icon: ThumbsUp },
]

export default function CybersecurityDashboard() {
    return (
        <div className="flex flex-col h-full bg-[#F8F9FA] text-foreground">
            <div className="p-6">
                <h1 className="text-2xl font-bold text-foreground">Cybersecurity Monitoring Portal</h1>
                <p className="text-muted-foreground">Security oversight, risk monitoring, and threat detection</p>
            </div>
            <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-6">
                {/* Stat Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <StatCard 
                        icon={UserCheck} 
                        title="High-Risk Users" 
                        value="2"
                        cardClassName='border-red-200 bg-red-50/20'
                        iconClassName="text-red-600 bg-red-100"
                    />
                    <StatCard 
                        icon={ShieldAlert} 
                        title="Active Alerts" 
                        value="24"
                        cardClassName='border-yellow-300 bg-yellow-50/20'
                        iconClassName="text-yellow-600 bg-yellow-100"
                    />
                    <StatCard 
                        icon={Ban} 
                        title="Toxic Combinations" 
                        value="4"
                        cardClassName='border-yellow-300 bg-yellow-50/20'
                        iconClassName="text-yellow-600 bg-yellow-100"
                    />
                     <StatCard 
                        icon={Clock} 
                        title="Account Access Duration" 
                        value="7d"
                        cardClassName='border-yellow-300 bg-yellow-50/20'
                        iconClassName="text-yellow-600 bg-yellow-100"
                    />
                </div>

                 {/* Active Security Alerts */}
                <Card className="bg-red-50/50 border-red-200">
                    <CardHeader className="flex-row justify-between items-center pb-2">
                        <CardTitle className="flex items-center text-sm font-semibold text-red-800">
                            <AlertTriangle className="mr-2 h-4 w-4" />
                            Active Security Alerts
                            <Badge variant="destructive" className="ml-2">{securityAlerts.length}</Badge>
                        </CardTitle>
                        <Button variant="link" size="sm" className="text-red-800">View All Alerts</Button>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {securityAlerts.map((item) => (
                            <div key={item.id} className="p-4 rounded-lg border bg-white">
                                <div className="flex items-start justify-between">
                                     <div className="flex items-center gap-3">
                                        <p className="font-semibold text-foreground">{item.id} - {item.action}</p>
                                        <Badge variant={item.priority === 'critical' ? 'destructive' : item.priority === 'high' ? 'destructive' : 'secondary'} className={cn('capitalize', item.priority === 'medium' && 'bg-yellow-200 text-yellow-800')}>{item.priority}</Badge>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button variant="outline" size="sm">Investigate</Button>
                                        <Button size="sm">Remediate</Button>
                                    </div>
                                </div>
                                <p className="text-sm text-muted-foreground my-1">User: {item.user}</p>
                                <p className="text-xs text-muted-foreground">{item.details}</p>
                            </div>
                        ))}
                    </CardContent>
                </Card>


                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Access Risk Distribution */}
                    <Card className="bg-white">
                        <CardHeader>
                            <CardTitle>Access Risk Distribution</CardTitle>
                            <p className="text-sm text-muted-foreground">User risk profile across the organization</p>
                        </CardHeader>
                        <CardContent>
                            <AccessRiskDistributionChart />
                        </CardContent>
                    </Card>

                    {/* Security Alert Trends */}
                    <Card className="bg-white">
                        <CardHeader>
                            <CardTitle>Security Alert Trends</CardTitle>
                             <p className="text-sm text-muted-foreground">Weekly alert volume by severity</p>
                        </CardHeader>
                        <CardContent>
                            <SecurityAlertTrendsChart />
                        </CardContent>
                    </Card>
                </div>

                 <Card className="bg-white">
                    <CardHeader className='flex-row items-center justify-between'>
                        <CardTitle>Anomaly Detection</CardTitle>
                        <Button variant="link" size="sm">View All Patterns</Button>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {anomalyDetections.map(item => (
                            <div key={item.name} className="flex items-center justify-between p-3 rounded-lg border">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-slate-100 rounded-md">
                                        <item.icon className="h-5 w-5 text-muted-foreground" />
                                    </div>
                                    <p className="font-semibold text-foreground">{item.name}</p>
                                </div>
                                <p className="font-bold text-lg">{item.count}</p>
                            </div>
                        ))}
                    </CardContent>
                </Card>
                
                {/* Quick Actions */}
                <Card className="bg-white">
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                         <p className="text-sm text-muted-foreground">Security monitoring and response tools</p>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Button variant="outline" className="flex-col h-24 text-foreground"><Eye className="mb-2 h-6 w-6"/>Security Alerts</Button>
                        <Button variant="outline" className="flex-col h-24 text-foreground"><Users className="mb-2 h-6 w-6"/>High-Risk Users</Button>
                        <Button variant="outline" className="flex-col h-24 text-foreground"><ShieldAlert className="mb-2 h-6 w-6"/>Task Teams</Button>
                        <Button variant="outline" className="flex-col h-24 text-foreground"><BarChart className="mb-2 h-6 w-6"/>Threat Reports</Button>
                    </CardContent>
                </Card>

            </div>
        </div>
    );
}

    