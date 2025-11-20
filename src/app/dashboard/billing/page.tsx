
'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, TrendingUp, DollarSign, Ban, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';

const StatCard = ({ icon: Icon, title, value, footer, cardClassName, iconClassName, valueClassName }) => (
  <Card className={cn("bg-white text-foreground", cardClassName)}>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      <Icon className={cn("h-4 w-4 text-muted-foreground", iconClassName)} />
    </CardHeader>
    <CardContent>
      <div className={cn("text-2xl font-bold", valueClassName)}>{value}</div>
      <p className="text-xs text-muted-foreground">{footer}</p>
    </CardContent>
  </Card>
);

const deniedClaims = [
  { id: 'CLM-7850', name: 'Robert Davis', reason: 'Missing documentation', amount: '$3,200.00', date: 'Nov 14, 2025' },
  { id: 'CLM-7851', name: 'Linda Garcia', reason: 'Code mismatch', amount: '$1,100.00', date: 'Nov 13, 2025' },
  { id: 'CLM-7852', name: 'James Rodriguez', reason: 'Prior authorization required', amount: '$690.00', date: 'Nov 12, 2025' },
];

const pendingClaims = [
  { id: 'CLM-78901', name: 'John Anderson', service: 'Surgery - Appendectomy', payer: 'Blue Cross', date: 'Nov 15, 2025', amount: '$2,450.00', status: 'pending' },
  { id: 'CLM-78902', name: 'Mary Thompson', service: 'ER Visit', payer: 'Medicare', date: 'Nov 16, 2025', amount: '$850.00', status: 'in-review' },
  { id: 'CLM-78903', name: 'David Wilson', service: 'MRI - Brain', payer: 'Aetna', date: 'Nov 16, 2025', amount: '$1,250.00', status: 'pending' },
  { id: 'CLM-78904', name: 'Sarah Martinez', service: 'Lab Work', payer: 'Cigna', date: 'Nov 17, 2025', amount: '$650.00', status: 'pending' },
];

const outstandingBalances = [
  { name: 'Patricia White', amount: '$1,850.00', days: 45, lastContact: 'Nov 10, 2025' },
  { name: 'Christopher Lee', amount: '$2,300.00', days: 62, lastContact: 'Nov 5, 2025' },
  { name: 'Nancy Harris', amount: '$950.00', days: 30, lastContact: 'Nov 12, 2025' },
];

export default function BillingDashboardPage() {
  return (
    <div className="flex flex-col h-full bg-slate-50 text-foreground">
        <DashboardHeader title="Billing & Revenue Dashboard" description="Claims management, revenue tracking, and payment processing." />
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard 
                    icon={Clock}
                    title="Pending Claims"
                    value="4"
                    footer="$5,240"
                />
                <StatCard 
                    icon={Ban}
                    title="Denied Claims"
                    value="3"
                    footer="$5,190 at risk"
                    valueClassName="text-destructive"
                />
                 <StatCard 
                    icon={DollarSign}
                    title="MTD Revenue"
                    value="$312,000"
                    footer="+5.8% from last month"
                />
                 <StatCard 
                    icon={TrendingUp}
                    title="Collection Rate"
                    value="94.2%"
                    footer="+2.1% this month"
                />
            </div>
            
            <Card className="bg-red-50/50 border-red-200">
                <CardHeader>
                    <CardTitle className="flex items-center text-sm font-semibold text-red-800">
                        <AlertTriangle className="mr-2 h-4 w-4" />
                        Denied Claims - Action Required
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    {deniedClaims.map(item => (
                         <div key={item.id} className="flex items-center justify-between p-3 rounded-lg border bg-white">
                            <div className="grid grid-cols-5 items-center gap-4 w-full">
                                <p className="font-semibold col-span-1">{item.name}</p>
                                <p className="text-sm text-muted-foreground col-span-2">Claim ID: {item.id} • Reason: {item.reason}</p>
                                <p className="text-sm text-muted-foreground col-span-1">{item.amount} • Denied: {item.date}</p>
                                <div className="flex items-center gap-2 justify-end col-span-1">
                                    <Badge variant="destructive">Denied</Badge>
                                    <Button variant="outline" size="sm">Review</Button>
                                    <Button size="sm">Resubmit</Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-white">
                    <CardHeader>
                        <CardTitle className="text-base">Pending Claims</CardTitle>
                        <p className="text-sm text-muted-foreground">Claims awaiting processing or payment</p>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {pendingClaims.map(item => (
                            <div key={item.id} className="flex items-center justify-between gap-4 p-3 rounded-lg border">
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                      <p className="font-semibold text-foreground">{item.name}</p>
                                      <p className="font-semibold text-foreground">{item.amount}</p>
                                    </div>
                                    <p className="text-sm text-muted-foreground">{item.service}</p>
                                    <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
                                        <span>{item.id} • {item.payer} • {item.date}</span>
                                        <Badge variant={item.status === 'pending' ? 'secondary' : 'outline'} className={cn('capitalize', item.status === 'pending' && 'bg-yellow-100 text-yellow-800 border-yellow-200')}>{item.status.replace('-', ' ')}</Badge>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Button variant="outline" size="sm">Details</Button>
                                  <Button size="sm">Follow Up</Button>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <Card className="bg-white">
                    <CardHeader>
                        <CardTitle className="text-base">Outstanding Patient Balances</CardTitle>
                        <p className="text-sm text-muted-foreground">Accounts requiring collection follow-up</p>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {outstandingBalances.map(item => (
                            <div key={item.name} className={cn("p-4 rounded-lg border", item.days > 60 ? "bg-red-50 border-red-200" : item.days > 30 ? "bg-orange-50 border-orange-200" : "bg-card")}>
                                <div className="flex justify-between items-center mb-2">
                                    <p className="font-semibold text-foreground">{item.name}</p>
                                    <p className="font-bold text-foreground">{item.amount}</p>
                                </div>
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="text-xs text-muted-foreground">{item.days} days outstanding</p>
                                        <p className="text-xs text-muted-foreground">Last contact: {item.lastContact}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm">Send Statement</Button>
                                        <Button size="sm">Contact Patient</Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    </div>
  );
}
