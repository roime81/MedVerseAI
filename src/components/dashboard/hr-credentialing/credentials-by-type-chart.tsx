
'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const credentialsData = [
  { type: 'Medical License', active: 580, expiring: 12 },
  { type: 'Board Certification', active: 450, expiring: 8 },
  { type: 'DEA Registration', active: 520, expiring: 5 },
  { type: 'Nursing License', active: 1200, expiring: 35 },
];

export function CredentialsByTypeChart() {
  return (
    <div className="space-y-4 h-[300px]">
      {credentialsData.map((item) => (
        <div key={item.type} className="flex items-center justify-between p-4 rounded-lg border bg-slate-50">
          <div>
            <p className="font-semibold text-foreground">{item.type}</p>
            <p className="text-sm text-muted-foreground">{item.active} active credentials</p>
          </div>
          <div className="flex items-center gap-4">
             <div className="text-right">
                <p className="font-semibold text-destructive">{item.expiring}</p>
                <p className="text-xs text-muted-foreground">Expiring soon</p>
             </div>
             <Button size="sm" variant="destructive">Track</Button>
          </div>
        </div>
      ))}
    </div>
  );
}
