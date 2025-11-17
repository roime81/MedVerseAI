
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield } from 'lucide-react';

export default function AdminDashboardPage() {
  return (
    <div className="p-8 space-y-8 bg-background text-foreground">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-muted-foreground">System administration and oversight.</p>
      </div>

      <Card className="bg-white">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="mr-2 h-5 w-5" />
            Admin Panel
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Welcome to the admin dashboard. Here you can manage users, settings, and monitor system activity.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
