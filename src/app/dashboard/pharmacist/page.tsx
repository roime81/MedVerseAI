
'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  AlertTriangle,
  Pill,
  Clock,
  Archive,
  BarChart,
  User,
  MoreHorizontal,
  CheckCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { WeeklyPrescriptionVolumeChart } from '@/components/dashboard/pharmacist/weekly-prescription-volume-chart';

const StatCard = ({ icon: Icon, title, value, description, footer, iconColor }) => (
  <Card className="bg-white">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      <Icon className={cn("h-4 w-4 text-muted-foreground", iconColor)} />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold text-foreground">{value}</div>
      <p className="text-xs text-muted-foreground">{description}</p>
      {footer}
    </CardContent>
  </Card>
);

const interactionAlerts = [
  { name: 'Dorothy Clark', drugs: 'Warfarin + Aspirin', note: 'Monitor INR closely, consider dose adjustment.', level: 'major' },
  { name: 'Richard Lewis', drugs: 'Simvastatin + Amiodarone', note: 'Reduce simvastatin dose to 20mg max.', level: 'moderate' },
  { name: 'Barbara Walker', drugs: 'Lisinopril + Potassium', note: 'Monitor potassium levels regularly.', level: 'moderate' },
];

const prescriptionQueue = [
    { name: 'Margaret Thompson', drug: 'Lisinopril 10mg', details: 'Qty 30 tablets • Dr. Dk. Carter', status: 'In Verification', priority: 'routine' },
    { name: 'William Garcia', drug: 'Metformin 500mg', details: 'Qty 60 tablets • Dr. Dk. Stone', status: 'Pending', priority: 'urgent' },
    { name: 'Elizabeth Harris', drug: 'Atorvastatin 20mg', details: 'Qty 30 tablets • Dr. Dk. Carter', status: 'Pending', priority: 'routine' },
    { name: 'Charles Martin', drug: 'Albuterol Inhaler', details: 'Qty 1 inhaler • Dr. Dk. Stone', status: 'In Verification', priority: 'stat' },
];

const inventoryAlerts = [
    { name: 'Insulin Glargine 100U/mL', stock: 12, reorder: 20, level: 'critical' },
    { name: 'Amoxicillin 500mg', stock: 88, reorder: 100, level: 'low' },
    { name: 'Amlodipine 5mg', stock: 142, reorder: 150, level: 'low' },
    { name: 'Levothyroxine 50mcg', stock: 8, reorder: 25, level: 'critical' },
];

const recentlyFilled = [
    { name: 'Nancy Young', drug: 'Omeprazole 20mg', quantity: '30 tabs', time: '5 min ago' },
    { name: 'Kenneth King', drug: 'Metoprolol 50mg', quantity: '60 tabs', time: '12 min ago' },
    { name: 'Karen Wright', drug: 'Gabapentin 300mg', quantity: '90 caps', time: '18 min ago' },
    { name: 'Steven Lopez', drug: 'Prednisone 10mg', quantity: '21 tabs', time: '25 min ago' },
];


export default function PharmacistDashboardPage() {
  return (
    <div className="flex flex-col h-full bg-slate-50 text-foreground">
        <DashboardHeader title="Pharmacy Dashboard" description="Prescription queue, drug interactions, and inventory management." />
        <div className="flex-1 overflow-y-auto p-8 space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard 
                    icon={Pill} 
                    title="Today's Prescriptions" 
                    value="72/98" 
                    description="15 pending"
                    footer={<Progress value={(72/98)*100} className="h-2 mt-2" />}
                />
                <StatCard 
                    icon={AlertTriangle} 
                    title="Drug Interactions" 
                    value="3"
                    description="1 major, 2 moderate"
                    iconColor="text-destructive"
                />
                <StatCard 
                    icon={Archive} 
                    title="Low Stock Items" 
                    value="4"
                    description="2 critical levels"
                    iconColor="text-yellow-500"
                />
                 <StatCard 
                    icon={Clock} 
                    title="Avg. Fill Time" 
                    value="8 min"
                    description="-1 min from target"
                    iconColor="text-green-500"
                />
            </div>
            
            <Card className="bg-red-50/50 border-red-200">
                <CardHeader>
                    <CardTitle className="flex items-center text-sm font-semibold text-red-800">
                        <AlertTriangle className="mr-2 h-4 w-4" />
                        Drug Interaction Alerts
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    {interactionAlerts.map(item => (
                         <div key={item.name} className="flex items-center justify-between p-3 rounded-lg border bg-white">
                            <div className="flex items-center gap-4">
                                <div>
                                    <p className="font-semibold text-foreground">{item.name}</p>
                                    <p className="text-sm text-muted-foreground">{item.drugs}</p>
                                    <p className="text-xs mt-1">{item.note}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Badge variant={item.level === 'major' ? 'destructive' : 'secondary'} className={cn(item.level === 'moderate' && 'bg-yellow-200 text-yellow-800')}>{item.level}</Badge>
                                <Button size="sm">Contact Prescriber</Button>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-white">
                    <CardHeader>
                        <CardTitle className="text-base">Prescription Queue</CardTitle>
                        <p className="text-sm text-muted-foreground">Orders awaiting verification and filling</p>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {prescriptionQueue.map(item => (
                            <div key={item.name} className="flex items-center gap-4 p-3 rounded-lg border">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <p className="font-semibold text-foreground">{item.name}</p>
                                        <Badge variant={item.priority === 'stat' ? 'destructive' : item.priority === 'urgent' ? 'secondary' : 'outline'} className={cn('py-0 capitalize', item.priority === 'urgent' && 'bg-yellow-200 text-yellow-800')}>{item.priority}</Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground">{item.drug}</p>
                                    <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                                        <span>{item.details}</span>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2 items-end">
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm">Review</Button>
                                        <Button size="sm">Fill</Button>
                                    </div>
                                    <p className="text-xs text-muted-foreground">{item.status}</p>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <Card className="bg-white">
                    <CardHeader>
                        <CardTitle className="text-base">Inventory Alerts</CardTitle>
                        <p className="text-sm text-muted-foreground">Items requiring reorder</p>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {inventoryAlerts.map(item => (
                            <div key={item.name} className={cn("p-3 rounded-lg border", item.level === 'critical' ? 'border-destructive bg-destructive/10' : 'border-yellow-300 bg-yellow-50')}>
                                <div className="flex justify-between items-center mb-2">
                                    <p className="font-semibold text-foreground">{item.name}</p>
                                    <p className="text-sm font-bold text-foreground">{item.stock}</p>
                                </div>
                                <Progress value={(item.stock / item.reorder) * 100} className="h-2 mb-3" />
                                <div className="flex justify-between items-center">
                                    <p className="text-xs text-muted-foreground">Reorder at {item.reorder}</p>
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm">View Details</Button>
                                        <Button size="sm" variant={item.level === 'critical' ? 'destructive' : 'default'}>Order Now</Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 <Card className="bg-white">
                    <CardHeader>
                        <CardTitle className="text-base">Weekly Prescription Volume</CardTitle>
                        <p className="text-sm text-muted-foreground">Prescriptions filled per day</p>
                    </CardHeader>
                    <CardContent>
                        <WeeklyPrescriptionVolumeChart />
                    </CardContent>
                </Card>
                 <Card className="bg-white">
                    <CardHeader>
                        <CardTitle className="text-base">Recently Filled</CardTitle>
                        <p className="text-sm text-muted-foreground">Latest completed prescriptions</p>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {recentlyFilled.map(item => (
                             <div key={item.name} className="flex items-center justify-between p-3 rounded-lg bg-green-50 border border-green-200">
                                <div className="flex items-center gap-3">
                                    <div className="p-1 bg-white rounded-full border border-green-200"><CheckCircle className="h-4 w-4 text-green-600"/></div>
                                    <div>
                                        <p className="font-semibold text-foreground">{item.name}</p>
                                        <p className="text-sm text-muted-foreground">{item.drug} • {item.quantity}</p>
                                        <p className="text-xs text-muted-foreground mt-1">{item.time}</p>
                                    </div>
                                </div>
                                <Button variant="outline" size="sm">Print Label</Button>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    </div>
  );
}
