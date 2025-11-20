
'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle } from 'lucide-react';

const expiringCredentials = [
  {
    name: 'Dr. Emily Carter',
    license: 'Medical License - GML-12334',
    expires: 'in 7 days',
    date: '2025-10-24',
    badgeColor: 'bg-red-500',
  },
  {
    name: 'Dr. Michael Renn',
    license: 'DEA Registration - DEA-RM12345',
    expires: 'in 15 days',
    date: '2025-11-01',
    badgeColor: 'bg-red-500',
  },
  {
    name: 'Nurse Patricia Lee',
    license: 'RN License - RN-123213',
    expires: 'in 25 days',
    date: '2025-11-11',
    badgeColor: 'bg-orange-500',
  },
];

export function CredentialsExpiringCard() {
  return (
    <Card className="bg-yellow-50/50 border-yellow-200">
      <CardHeader className="flex-row justify-between items-center">
        <CardTitle className="flex items-center text-sm font-semibold text-yellow-800">
          <AlertTriangle className="mr-2 h-4 w-4" />
          Credentials Expiring Soon
          <Badge variant="destructive" className="ml-2 bg-yellow-200 text-yellow-800">{expiringCredentials.length}</Badge>
        </CardTitle>
        <Button variant="link" size="sm" className="text-yellow-800">View all credentials</Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {expiringCredentials.map((item, index) => (
          <div key={index} className="flex items-center justify-between p-3 rounded-lg border bg-white">
            <div>
              <p className="font-semibold text-foreground">{item.name}</p>
              <p className="text-sm text-muted-foreground">{item.license}</p>
              <p className="text-xs text-muted-foreground mt-1">Expires: {item.date}</p>
            </div>
            <div className="flex items-center gap-3">
                <Badge className={item.badgeColor}>{item.expires}</Badge>
                <Button variant="secondary" size="sm">Contact Provider</Button>
                <Button size="sm">Request Renewal</Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
