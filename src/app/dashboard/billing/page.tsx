
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard } from 'lucide-react';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';

export default function BillingDashboardPage() {
  return (
    <div className="flex flex-col h-full bg-background text-foreground">
        <DashboardHeader title="Billing Dashboard" description="Manage patient accounts and financial claims." />
        <div className="flex-1 overflow-y-auto p-8">
            <Card className="bg-white">
                <CardHeader>
                <CardTitle className="flex items-center">
                    <CreditCard className="mr-2 h-5 w-5" />
                    Billing & Claims
                </CardTitle>
                </CardHeader>
                <CardContent>
                <p className="text-muted-foreground">
                    This is the central hub for managing all billing activities, including claim submission, payment posting, and patient account management.
                </p>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
