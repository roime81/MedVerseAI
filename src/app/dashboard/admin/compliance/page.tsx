
'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  AlertTriangle,
  FileCheck,
  ShieldCheck,
  FileClock,
  History,
  Scale,
  ListChecks,
  BarChart,
  Target
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { PolicyComplianceTrendChart } from '@/components/dashboard/admin/compliance/policy-compliance-trend-chart';
import { ComplianceByCategory } from '@/components/dashboard/admin/compliance/compliance-by-category';

const StatCard = ({ title, value, footer, icon: Icon, cardClassName, iconClassName, progress }) => (
  <Card className={cn("bg-white text-foreground", cardClassName)}>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      {Icon && <Icon className={cn("h-4 w-4 text-muted-foreground", iconClassName)} />}
    </CardHeader>
    <CardContent>
      {progress !== undefined ? (
        <>
            <div className="text-2xl font-bold">{progress}%</div>
            <Progress value={progress} className="h-2 mt-2" />
        </>
      ) : (
        <div className="text-2xl font-bold">{value}</div>
      )}
      <p className="text-xs text-muted-foreground">{footer}</p>
    </CardContent>
  </Card>
);

const complianceFindings = [
  {
    id: 'COMP-2025-0012',
    description: 'Access review not completed for 20 users in Q3',
    department: 'Department: Multiple Departments',
    due: 'Due: Oct 17, 2025',
    priority: 'high',
  },
  {
    id: 'COMP-2025-0014',
    description: 'Separation of Duties violation identified for 1 user across billing and clinical access',
    department: 'Department: Finance & Clinical',
    due: 'Due: Oct 22, 2025',
    priority: 'medium',
  },
  {
    id: 'COMP-2025-0015',
    description: 'Expired credentials detected for 3 clinical users with active system access',
    department: 'Department: HR / Medical Credentialing',
    due: 'Due: Oct 28, 2025',
    priority: 'medium',
  },
];

const auditTrail = [
    {id: 'access-granted-1', user: 'Dr. Lana Mitchell', action: 'Access Granted', details: 'Approved by HOD-Mitch... on 2025-11-15'},
    {id: 'system-mod-1', user: 'System-M Update', action: 'Census Employee Data Sync', details: 'System Sync Event: 2025-11-15-2AM'},
    {id: 'role-modified-1', user: 'Nurse Arin Davis', action: 'Role Modified', details: 'System-M Role - Approved by HOD-CL on 2025-11-15'},
    {id: 'credential-verified-1', user: 'Dr. Michael Renn', action: 'Credential Verified', details: 'System-NPS - Approved by Credentialing on 2025-11-15'}
]


export default function ComplianceDashboardPage() {
    return (
        <div className="flex flex-col h-full bg-[#F8F9FA] text-foreground">
            <div className="p-6">
                <h1 className="text-2xl font-bold text-foreground">Compliance & Internal Audit Portal</h1>
                <p className="text-muted-foreground">Regulatory compliance monitoring, audit trail, and policy enforcement</p>
            </div>
            <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-6">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <StatCard 
                        title="Compliance Score"
                        progress={94.7}
                        footer="of all policies are met"
                        cardClassName="border-green-200 bg-green-50/20"
                    />
                    <StatCard 
                        icon={AlertTriangle}
                        title="Active Violations"
                        value="8"
                        footer="2 high-risk, 6 medium-risk"
                         cardClassName="border-yellow-300 bg-yellow-50/20"
                        iconClassName="text-yellow-600"
                    />
                     <StatCard 
                        icon={FileCheck}
                        title="Remediated Reviews"
                        value="15"
                        footer="in the last 30 days"
                        cardClassName="border-orange-300 bg-orange-50/20"
                        iconClassName="text-orange-600"
                    />
                    <StatCard 
                        icon={FileClock}
                        title="Audit Findings Due"
                        value="12"
                        footer="in the next 30 days"
                        cardClassName="border-orange-300 bg-orange-50/20"
                        iconClassName="text-orange-600"
                    />
                </div>

                <Card className="bg-orange-50/50 border-orange-200">
                    <CardHeader className="flex-row justify-between items-center pb-2">
                        <CardTitle className="flex items-center text-sm font-semibold text-orange-800">
                            <AlertTriangle className="mr-2 h-4 w-4" />
                            Active Compliance Findings
                            <Badge variant="destructive" className="ml-2 bg-orange-200 text-orange-800">{complianceFindings.length}</Badge>
                        </CardTitle>
                        <Button variant="link" size="sm" className="text-orange-800">View All Findings</Button>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {complianceFindings.map((item) => (
                            <div key={item.id} className="flex items-center justify-between p-3 rounded-lg border bg-white">
                                <div>
                                    <div className="flex items-center gap-3">
                                        <p className="font-semibold text-foreground">{item.id}</p>
                                        <Badge variant={item.priority === 'high' ? 'destructive' : 'secondary'} className={cn('capitalize', item.priority === 'medium' && 'bg-yellow-200 text-yellow-800')}>{item.priority}</Badge>
                                    </div>
                                    <p className="text-sm font-medium text-foreground mt-1">{item.description}</p>
                                    <p className="text-xs text-muted-foreground">{item.department} • {item.due}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button variant="outline" size="sm">Review</Button>
                                    <Button size="sm">Track Progress</Button>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="bg-white">
                        <CardHeader>
                            <CardTitle>Policy Compliance Trend</CardTitle>
                            <p className="text-sm text-muted-foreground">Monthly compliance percentage</p>
                        </CardHeader>
                        <CardContent>
                            <PolicyComplianceTrendChart />
                        </CardContent>
                    </Card>
                    <Card className="bg-white">
                        <CardHeader>
                            <CardTitle>Compliance by Category</CardTitle>
                            <p className="text-sm text-muted-foreground">Status across key compliance areas</p>
                        </CardHeader>
                        <CardContent>
                            <ComplianceByCategory />
                        </CardContent>
                    </Card>
                </div>

                <Card className="bg-white">
                    <CardHeader className="flex-row justify-between items-center">
                        <CardTitle>Recent Audit Trail</CardTitle>
                        <Button variant="link" size="sm">Full Audit Log</Button>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {auditTrail.map(item => (
                            <div key={item.id} className="flex items-center justify-between p-3 rounded-lg border">
                                <div className="flex items-center gap-3">
                                     <History className="h-5 w-5 text-muted-foreground" />
                                     <div>
                                        <p className="font-semibold text-foreground">{item.action} - <span className="font-normal">{item.user}</span></p>
                                        <p className="text-xs text-muted-foreground">{item.details}</p>
                                     </div>
                                </div>
                                <Badge variant="outline">{item.action.replace(/\s+/g, '-')}</Badge>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <Card className="bg-white">
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                        <p className="text-sm text-muted-foreground">Compliance monitoring and audit tools</p>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Button variant="outline" className="flex-col h-24 text-foreground"><Target className="mb-2 h-6 w-6"/>Violation Findings</Button>
                        <Button variant="outline" className="flex-col h-24 text-foreground"><History className="mb-2 h-6 w-6"/>Audit Trail</Button>
                        <Button variant="outline" className="flex-col h-24 text-foreground"><ListChecks className="mb-2 h-6 w-6"/>Circular Reviews</Button>
                        <Button variant="outline" className="flex-col h-24 text-foreground"><BarChart className="mb-2 h-6 w-6"/>Compliance Reports</Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
