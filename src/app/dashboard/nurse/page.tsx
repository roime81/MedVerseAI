
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HeartPulse } from 'lucide-react';

export default function NurseDashboardPage() {
  return (
    <div className="p-8 space-y-8 bg-background text-foreground">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Nursing Dashboard</h1>
        <p className="text-muted-foreground">Your central hub for patient care and coordination.</p>
      </div>

      <Card className="bg-white">
        <CardHeader>
          <CardTitle className="flex items-center">
            <HeartPulse className="mr-2 h-5 w-5" />
            Patient Vitals & Tasks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Welcome to the nursing dashboard. From here, you can view your assigned patients, update vital signs, administer medications, and complete nursing tasks.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
