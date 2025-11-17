
'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  AlertTriangle,
  FlaskConical,
  Clock,
  CheckCircle,
  FileText,
  LineChart,
  PieChart,
  User,
  Stethoscope
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { WeeklyTestVolumeChart } from '@/components/dashboard/lab/weekly-test-volume-chart';
import { TestDistributionChart } from '@/components/dashboard/lab/test-distribution-chart';

const StatCard = ({ icon: Icon, title, value, footer }) => (
  <Card className="bg-white">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold text-foreground">{value}</div>
      {footer}
    </CardContent>
  </Card>
);

const criticalResults = [
  { name: 'James Wilson', test: 'Troponin', value: '2.1 ng/mL', normal: '0-0.4', id: 1 },
  { name: 'Lisa Anderson', test: 'Potassium', value: '6.2 mEq/L', normal: '3.5-5.1', id: 2 },
  { name: 'Robert Taylor', test: 'Glucose', value: '45 mg/dL', normal: '70-100', id: 3 },
];

const testQueue = [
    { id: 1, name: 'Michael Johnson', test: 'Complete Blood Count (CBC)', clinician: 'Dr. Emily Carter', time: '5m', priority: 'stat'},
    { id: 2, name: 'Emma Williams', test: 'Lipid Panel', clinician: 'Dr. Ben Stone', time: '23m', priority: 'routine'},
    { id: 3, name: 'Daniel Brown', test: 'Comprehensive Metabolic Panel (CMP)', clinician: 'Dr. Sarah Davis', time: '35m', priority: 'urgent'},
    { id: 4, name: 'Sophia Davis', test: 'Thyroid-Stimulating Hormone (TSH)', clinician: 'Dr. Emily Carter', time: '51m', priority: 'routine'},
];

const recentlyCompleted = [
    { id: 1, name: 'Alan Martinez', test: 'Thyroid Panel', result: 'Normal', time: '2m ago' },
    { id: 2, name: 'Jessica Lee', test: 'Urinalysis', result: 'Normal', time: '25m ago' },
    { id: 3, name: 'Kevin White', test: 'Blood Culture', result: 'Negative', time: '45m ago' },
    { id: 4, name: 'Rachel Green', test: 'Vitamin D', result: 'Low', time: '1h ago' },
];


export default function LabDashboardPage() {
  return (
    <div className="flex flex-col h-full bg-slate-50 text-foreground">
        <div className="p-6">
            <h1 className="text-2xl font-bold text-foreground">Laboratory Dashboard</h1>
            <p className="text-muted-foreground">Test queue, critical results, and lab analytics.</p>
        </div>
        <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard 
                    icon={FlaskConical} 
                    title="Today's Tests" 
                    value="1,345/2,100" 
                    footer={<Progress value={(1345/2100)*100} className="h-2 mt-2" />}
                />
                <StatCard 
                    icon={AlertTriangle} 
                    title="Critical Results" 
                    value="3"
                    footer={<p className="text-xs text-muted-foreground">Require immediate attention</p>}
                />
                <StatCard 
                    icon={Clock} 
                    title="Avg. TAT" 
                    value="42 min"
                    footer={<p className="text-xs text-muted-foreground">for routine samples</p>}
                />
                 <StatCard 
                    icon={CheckCircle} 
                    title="STAT Orders" 
                    value="8"
                    footer={<p className="text-xs text-muted-foreground">0 overdue</p>}
                />
            </div>
            
            <Card className="bg-red-50/50 border-red-200">
                <CardHeader>
                    <CardTitle className="flex items-center text-sm font-semibold text-red-800">
                        <AlertTriangle className="mr-2 h-4 w-4" />
                        Critical Results - Action Required
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    {criticalResults.map(item => (
                         <div key={item.id} className="flex items-center justify-between p-3 rounded-lg border bg-white">
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-red-100 rounded-full">
                                    <User className="h-5 w-5 text-red-600"/>
                                </div>
                                <div>
                                    <p className="font-semibold text-foreground">{item.name}</p>
                                    <p className="text-sm text-muted-foreground">{item.test} <span className="font-bold text-red-600">{item.value}</span> (Normal: {item.normal})</p>
                                </div>
                                <Badge variant="destructive">CRITICAL</Badge>
                            </div>
                            <Button size="sm" variant="destructive">Notify Physician</Button>
                        </div>
                    ))}
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-white">
                    <CardHeader>
                        <CardTitle className="text-base">Test Queue</CardTitle>
                        <p className="text-sm text-muted-foreground">Current lab orders in process</p>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {testQueue.map(item => (
                            <div key={item.id} className="flex items-center gap-4 p-3 rounded-lg border">
                                <div className="flex-1">
                                    <p className="font-semibold text-foreground">{item.name}</p>
                                    <p className="text-sm text-muted-foreground">{item.test}</p>
                                    <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                                        <span className="flex items-center gap-1"><Stethoscope className="h-3 w-3"/> {item.clinician}</span>
                                        <span className="flex items-center gap-1"><Clock className="h-3 w-3"/> {item.time}</span>
                                        {item.priority === 'stat' && <Badge variant="destructive" className="py-0">STAT</Badge>}
                                        {item.priority === 'urgent' && <Badge variant="secondary" className="py-0 bg-yellow-200 text-yellow-800">Urgent</Badge>}
                                    </div>
                                </div>
                                <Button variant="outline" size="sm">View</Button>
                                <Button size="sm">Process</Button>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <Card className="bg-white">
                    <CardHeader>
                        <CardTitle className="text-base">Recently Completed</CardTitle>
                        <p className="text-sm text-muted-foreground">Latest finalized tests</p>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {recentlyCompleted.map(item => (
                            <div key={item.id} className="flex items-center justify-between p-3 rounded-lg bg-green-50 border border-green-200">
                                <div className="flex items-center gap-3">
                                    <div className="p-1 bg-white rounded-full border border-green-200"><CheckCircle className="h-4 w-4 text-green-600"/></div>
                                    <div>
                                        <p className="font-semibold text-foreground">{item.name}</p>
                                        <p className="text-sm text-muted-foreground">{item.test}: <span className="font-medium text-green-700">{item.result}</span></p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <Button variant="link" size="sm" className="h-auto p-0 text-primary">View Report</Button>
                                    <p className="text-xs text-muted-foreground mt-1">{item.time}</p>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-white">
                    <CardHeader>
                        <CardTitle className="text-base flex items-center"><LineChart className="h-4 w-4 mr-2 text-muted-foreground"/>Weekly Test Volume</CardTitle>
                        <p className="text-sm text-muted-foreground">Number of tests processed per day</p>
                    </CardHeader>
                    <CardContent>
                        <WeeklyTestVolumeChart />
                    </CardContent>
                </Card>
                 <Card className="bg-white">
                    <CardHeader>
                        <CardTitle className="text-base flex items-center"><PieChart className="h-4 w-4 mr-2 text-muted-foreground"/>Test Distribution</CardTitle>
                         <p className="text-sm text-muted-foreground">By department this week</p>
                    </CardHeader>
                    <CardContent>
                        <TestDistributionChart />
                    </CardContent>
                </Card>
            </div>
        </div>
    </div>
  );
}
