
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard } from 'lucide-react';

export default function BillingDashboardPage() {
  return (
    <div className="p-8 space-y-8 bg-background text-foreground">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Billing Dashboard</h1>
        <p className="text-muted-foreground">Manage patient accounts and financial claims.</p>
      </div>

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
  );
}
