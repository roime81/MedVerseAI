
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Scan } from 'lucide-react';

export default function RadiologyDashboardPage() {
  return (
    <div className="p-8 space-y-8 bg-background text-foreground">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Radiology Dashboard</h1>
        <p className="text-muted-foreground">Manage and interpret imaging studies.</p>
      </div>

      <Card className="bg-white">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Scan className="mr-2 h-5 w-5" />
            Imaging Worklist
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
           This is the radiology worklist. View incoming imaging orders, access studies from PACS, and write your reports.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
