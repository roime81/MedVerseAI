
'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Users,
  AlertTriangle,
  Pill,
  ClipboardCheck,
  Bell,
  Heart,
  Thermometer,
  FilePen,
  CheckCircle,
  Clock,
  User,
  Activity,
  BarChart,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUser } from '@/firebase';

const StatCard = ({ icon: Icon, title, value, description, footer }) => (
  <Card className="bg-white">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold text-foreground">{value}</div>
      <p className="text-xs text-muted-foreground">{description}</p>
      {footer && <div className="mt-4">{footer}</div>}
    </CardContent>
  </Card>
);

const vitalAlerts = [
  { name: 'Linda Martinez', alert: 'Elevated heart rate: 120 bpm', time: '5 min ago', level: 'high' },
  { name: 'Patricia Garcia', alert: 'Low blood pressure: 85/55', time: '20 min ago', level: 'medium' },
  { name: 'James Anderson', alert: 'Temperature check due', time: '30 min ago', level: 'low' },
];

const patients = [
  { name: 'Robert Wilson', room: '302-A', vitals: '10 min ago', status: 'Stable' },
  { name: 'Linda Martinez', room: '204-B', vitals: '1 min ago', status: 'Critical', alerts: 2 },
  { name: 'David Thompson', room: '105-A', vitals: '15 min ago', status: 'Recovering' },
  { name: 'Patricia Garcia', room: '106-C', vitals: '20 min ago', status: 'Stable', alerts: 1 },
  { name: 'James Anderson', room: '107-A', vitals: '8 min ago', status: 'Observation' },
];

const medicationSchedule = [
  { name: 'Amoxicillin 500mg', patient: 'Robert Wilson', time: '09:00 AM', status: 'Done' },
  { name: 'Insulin 10 units', patient: 'Linda Martinez', time: '09:30 AM', status: 'Pending' },
  { name: 'Ibuprofen 400mg', patient: 'David Thompson', time: '10:00 AM', status: 'Pending' },
  { name: 'Metformin 850mg', patient: 'Patricia Garcia', time: '10:30 AM', status: 'Pending' },
]

export default function NurseDashboardPage() {
    const { user } = useUser();

    const getStatusBadge = (status) => {
        switch (status) {
            case 'Stable': return <Badge variant="secondary" className="bg-green-100 text-green-800">Stable</Badge>;
            case 'Critical': return <Badge variant="destructive">Critical</Badge>;
            case 'Recovering': return <Badge variant="outline" className="text-blue-600 border-blue-600">Recovering</Badge>;
            case 'Observation': return <Badge variant="outline" className="text-yellow-600 border-yellow-600">Observation</Badge>;
            default: return <Badge variant="secondary">{status}</Badge>;
        }
    };

  return (
    <div className="flex flex-col h-full bg-slate-50 text-foreground">
        <div className="p-6">
            <h1 className="text-2xl font-bold text-foreground">Good Morning, {user?.displayName || 'Olivia Rodriguez'}</h1>
            <p className="text-muted-foreground">You have 5 patients assigned to you today.</p>
        </div>
        <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <StatCard icon={Users} title="Assigned Patients" value="5" description="2 critical, 3 stable" />
                <StatCard icon={AlertTriangle} title="Active Alerts" value="3" description="1 high priority" />
                <StatCard icon={Pill} title="Medications Due" value="3" description="1 completed today" />
                <StatCard 
                    icon={ClipboardCheck} 
                    title="Vitals Checks" 
                    value="12/15" 
                    description="3 remaining"
                    footer={<Progress value={(12/15)*100} className="h-2" />}
                />
            </div>
            
            <Card className="bg-white border-2 border-orange-200">
                <CardHeader>
                    <CardTitle className="flex items-center text-orange-600">
                        <Bell className="mr-2 h-5 w-5" />
                        Active Vital Alerts
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    {vitalAlerts.map(item => (
                         <div key={item.name} className="flex items-center justify-between p-3 rounded-lg border bg-card">
                            <div className="flex items-center gap-3">
                                <Badge variant={item.level === 'high' ? 'destructive' : item.level === 'medium' ? 'secondary': 'outline' } className={cn(item.level === 'medium' && "bg-yellow-100 text-yellow-800")}>{item.level}</Badge>
                                <div>
                                    <p className="font-semibold text-foreground">{item.name}</p>
                                    <p className="text-sm text-muted-foreground">{item.alert}</p>
                                </div>
                            </div>
                             <div className="flex items-center gap-4">
                                <p className="text-xs text-muted-foreground">{item.time}</p>
                                <Button size="sm">Respond</Button>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2 bg-white">
                    <CardHeader>
                        <CardTitle>My Patients</CardTitle>
                        <p className="text-sm text-muted-foreground">Currently assigned patient list</p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {patients.map(p => (
                            <div key={p.name} className="flex items-center justify-between p-3 rounded-lg border bg-slate-50/50">
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <p className="font-semibold text-foreground">{p.name}</p>
                                        {getStatusBadge(p.status)}
                                    </div>
                                    <p className="text-sm text-muted-foreground">Room {p.room}</p>
                                    <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                                        <Activity className="h-3 w-3" />
                                        <span>Vitals: {p.vitals}</span>
                                        {p.alerts && (
                                            <>
                                                <span className="text-gray-300">•</span>
                                                <span className="flex items-center text-red-500 font-medium">
                                                    <AlertTriangle className="h-3 w-3 mr-1" />
                                                    {p.alerts} {p.alerts > 1 ? 'alerts' : 'alert'}
                                                </span>
                                            </>
                                        )}
                                    </div>
                                </div>
                                <Button variant="outline" size="sm" className="ml-4">View Chart</Button>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <Card className="bg-white">
                    <CardHeader>
                        <CardTitle>Medication Schedule</CardTitle>
                        <p className="text-sm text-muted-foreground">Today's medication rounds</p>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between mb-4 text-sm">
                            <p className="font-medium">1/4 completed</p>
                            <Progress value={25} className="w-1/2 h-2" />
                        </div>
                        <div className="space-y-3">
                            {medicationSchedule.map(med => (
                                <div key={med.name} className={cn(
                                    "p-3 rounded-lg border",
                                    med.status === 'Done' ? 'bg-green-50 border-green-200' : 'bg-card'
                                )}>
                                    <p className={cn("font-semibold", med.status === 'Done' && 'text-gray-500 line-through')}>{med.name}</p>
                                    <p className="text-sm text-muted-foreground">{med.patient}</p>
                                    <div className="flex items-center justify-between mt-2">
                                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                            <Clock className="h-3 w-3" />
                                            <span>Scheduled: {med.time}</span>
                                        </div>
                                        {med.status === 'Done' ? (
                                             <div className="flex items-center gap-1 text-xs text-green-600 font-semibold">
                                                <CheckCircle className="h-3 w-3" />
                                                <span>Done</span>
                                            </div>
                                        ) : (
                                            <Button size="sm" variant="default" className="h-7 text-xs">Administer</Button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
            
             <Card className="bg-white">
                <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Button variant="outline" className="flex-col h-24"><BarChart className="mb-2 h-6 w-6"/>Record Vitals</Button>
                    <Button variant="outline" className="flex-col h-24"><Pill className="mb-2 h-6 w-6"/>Log Medication</Button>
                    <Button variant="outline" className="flex-col h-24"><Thermometer className="mb-2 h-6 w-6"/>Temperature Check</Button>
                    <Button variant="outline" className="flex-col h-24"><FilePen className="mb-2 h-6 w-6"/>Patient Notes</Button>
                </CardContent>
             </Card>

        </div>
    </div>
  );
}
