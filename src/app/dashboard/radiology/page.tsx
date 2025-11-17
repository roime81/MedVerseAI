
'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Scan,
  Clock,
  AlertTriangle,
  BarChart2,
  CheckCircle,
  FileText,
  User,
  MoreHorizontal
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { WeeklyScanVolumeChart } from '@/components/dashboard/radiology/weekly-scan-volume-chart';


const StatCard = ({ icon: Icon, title, value, footer }) => (
  <Card className="bg-white">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
       <MoreHorizontal className="h-4 w-4 text-muted-foreground cursor-pointer" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold text-foreground">{value}</div>
      {footer}
    </CardContent>
  </Card>
);

const scanQueue = [
    { id: 1, name: 'Sarah Miller', modality: 'CT Brain', status: 'In Progress', time: '12 min ago - Est. 2:45 PM', priority: 'stat'},
    { id: 2, name: 'Sam Henderson', modality: 'X-Ray - Ankle', status: 'Waiting', time: 'Est. 2:55 PM', priority: 'routine'},
    { id: 3, name: 'Arthur Cooper', modality: 'X-Ray - Chest', status: 'Waiting', time: 'Est. 3:05 PM', priority: 'urgent'},
    { id: 4, name: 'Mark Stevens', modality: 'Ultrasound - Abdomen', status: 'Waiting', time: 'Est. 3:20 PM', priority: 'routine'},
];

const pendingReports = [
    { id: 1, name: 'Jennifer Larson', modality: 'CT Abdomen', time: 'Rec. 1:15 PM', status: 'Review' },
    { id: 2, name: 'Paul Martinez', modality: 'X-Ray - Hand', time: 'Rec. 12:45 PM', status: 'Draft' },
    { id: 3, name: 'Laura White', modality: 'X-Ray - Chest', time: 'Rec. 11:30 AM', status: 'Review' },
    { id: 4, name: 'Chris Taylor', modality: 'CT Head', time: 'Rec. 10:55 AM', status: 'Draft' },
];

const recentlyCompleted = [
    { id: 1, name: 'Robert Green - X-Ray - Knee', details: 'No acute fracture', time: '2 min ago' },
    { id: 2, name: 'Susan Black - CT - Chest', details: 'Follow-up recommended', time: '25 min ago' },
    { id: 3, name: 'Michael Blue - MRI - Shoulder', details: 'Rotator cuff tear identified', time: '1 hour ago' },
];

export default function RadiologyDashboardPage() {
  return (
    <div className="flex flex-col h-full bg-slate-50 text-foreground">
        <div className="p-6">
            <h1 className="text-2xl font-bold text-foreground">Radiology Dashboard</h1>
            <p className="text-muted-foreground">Imaging queue, pending reports, and exam analytics.</p>
        </div>
        <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard 
                    icon={Scan} 
                    title="Today's Scans" 
                    value="15/24" 
                    footer={<Progress value={(15/24)*100} className="h-2 mt-2" />}
                />
                <StatCard 
                    icon={FileText} 
                    title="Pending Reports" 
                    value="4"
                    footer={<p className="text-xs text-red-500">2 awaiting final sign-off</p>}
                />
                <StatCard 
                    icon={Clock} 
                    title="Avg. Scan Time" 
                    value="28 min"
                    footer={<p className="text-xs text-muted-foreground">-2 min from average</p>}
                />
                 <StatCard 
                    icon={AlertTriangle} 
                    title="STAT Orders" 
                    value="2"
                    footer={<p className="text-xs text-muted-foreground">1 Urgent</p>}
                />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-white">
                    <CardHeader>
                        <CardTitle className="text-base">Scan Queue</CardTitle>
                        <p className="text-sm text-muted-foreground">Current imaging orders</p>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {scanQueue.map(item => (
                            <div key={item.id} className={cn(
                                "flex items-center gap-4 p-3 rounded-lg border",
                                item.status === 'In Progress' ? 'border-primary ring-2 ring-primary/20' : 'bg-card'
                            )}>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <p className="font-semibold text-foreground">{item.name}</p>
                                         {item.priority === 'stat' && <Badge variant="destructive" className="py-0">STAT</Badge>}
                                         {item.priority === 'urgent' && <Badge variant="secondary" className="py-0 bg-yellow-200 text-yellow-800">Urgent</Badge>}
                                    </div>
                                    <p className="text-sm text-muted-foreground">{item.modality}</p>
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                                        <Clock className="h-3 w-3"/> 
                                        <span>{item.time}</span>
                                    </div>
                                    {item.status === 'In Progress' && (
                                        <div className="flex items-center text-xs text-primary font-semibold mt-2">
                                            <div className="animate-pulse bg-primary h-2 w-2 rounded-full mr-2"></div>
                                            In Progress...
                                        </div>
                                    )}
                                </div>
                                {item.status !== 'In Progress' ? (
                                    <>
                                        <Button variant="outline" size="sm">Details</Button>
                                        <Button size="sm">Start Scan</Button>
                                    </>
                                ) : (
                                    <Button variant="secondary" size="sm">Complete</Button>
                                )}
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <Card className="bg-white">
                    <CardHeader>
                        <CardTitle className="text-base">Pending Reports</CardTitle>
                        <p className="text-sm text-muted-foreground">Reports awaiting finalization</p>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {pendingReports.map(item => (
                            <div key={item.id} className="flex items-center justify-between p-3 rounded-lg border">
                                <div>
                                    <p className="font-semibold text-foreground">{item.name}</p>
                                    <p className="text-sm text-muted-foreground">{item.modality} • {item.time}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Badge variant={item.status === 'Review' ? 'default' : 'secondary'}>{item.status}</Badge>
                                    <Button variant="outline" size="sm">View Images</Button>
                                    <Button size="sm">Review & Sign</Button>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-white">
                    <CardHeader>
                        <CardTitle className="text-base flex items-center"><BarChart2 className="h-4 w-4 mr-2 text-muted-foreground"/>Weekly Scan Volume</CardTitle>
                        <p className="text-sm text-muted-foreground">Number of imaging procedures per day</p>
                    </CardHeader>
                    <CardContent>
                        <WeeklyScanVolumeChart />
                    </CardContent>
                </Card>
                 <Card className="bg-white">
                    <CardHeader>
                        <CardTitle className="text-base flex items-center"><CheckCircle className="h-4 w-4 mr-2 text-muted-foreground"/>Recently Completed</CardTitle>
                         <p className="text-sm text-muted-foreground">Latest finalized scans</p>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {recentlyCompleted.map(item => (
                            <div key={item.id} className="flex items-center justify-between p-3 rounded-lg bg-green-50 border border-green-200">
                                <div>
                                    <p className="font-semibold text-foreground">{item.name}</p>
                                    <p className="text-sm text-muted-foreground">{item.details}</p>
                                    <p className="text-xs text-muted-foreground mt-1">{item.time}</p>
                                </div>
                                <Button variant="link" size="sm" className="h-auto p-0 text-primary">View Report</Button>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    </div>
  );
}

    