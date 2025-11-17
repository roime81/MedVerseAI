
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FlaskConical } from 'lucide-react';

export default function LabDashboardPage() {
  return (
    <div className="p-8 space-y-8 bg-background text-foreground">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Laboratory Dashboard</h1>
        <p className="text-muted-foreground">Manage and view laboratory test results.</p>
      </div>

      <Card className="bg-white">
        <CardHeader>
          <CardTitle className="flex items-center">
            <FlaskConical className="mr-2 h-5 w-5" />
            Lab Results
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Welcome to the laboratory dashboard. Here you can view incoming test orders, enter results, and manage lab specimens.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
