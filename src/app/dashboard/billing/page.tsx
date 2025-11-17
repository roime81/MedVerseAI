
'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard, DollarSign, UserCheck, UserX, AlertTriangle, Loader2 } from 'lucide-react';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { BillableProvidersTable } from '@/components/dashboard/billing/billable-providers-table';
import { useFirestore, useMemoFirebase } from '@/firebase';
import { useCollection } from '@/firebase/firestore/use-collection';
import { collection, query, where } from 'firebase/firestore';
import type { User } from '@/lib/schemas';

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

export default function BillingDashboardPage() {
  const firestore = useFirestore();

  const providersQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    // For this demo, we'll query for a few roles that can be billable providers
    return query(collection(firestore, 'users'), where('role', 'in', ['physician', 'nurse']));
  }, [firestore]);

  const { data: providers, isLoading: isLoadingProviders } = useCollection<User>(providersQuery);

  const activeProviders = providers?.length || 0;
  const pendingProviders = 2; // static for demo
  const revenueImpact = 12500; // static for demo


  return (
    <div className="flex flex-col h-full bg-background text-foreground">
        <DashboardHeader title="Billing Dashboard" description="Manage patient accounts and financial claims." />
        <div className="flex-1 overflow-y-auto p-8 space-y-8">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard 
                    icon={UserCheck}
                    title="Active Providers"
                    value={isLoadingProviders ? <Loader2 className="h-6 w-6 animate-spin" /> : activeProviders}
                    description="Providers cleared for billing."
                />
                <StatCard 
                    icon={UserX}
                    title="Pending Activation"
                    value={pendingProviders}
                    description="Providers awaiting payor linking."
                />
                 <StatCard 
                    icon={AlertTriangle}
                    title="Revenue At Risk"
                    value={`$${revenueImpact.toLocaleString()}`}
                    description="Potential loss from inactive providers."
                />
                 <StatCard 
                    icon={DollarSign}
                    title="Claims Submitted (Today)"
                    value="1,204"
                    description="Total value of claims processed."
                />
            </div>
            
            <BillableProvidersTable providers={providers} isLoading={isLoadingProviders} />

        </div>
    </div>
  );
}
