
'use client';

import * as React from 'react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';

const complianceCategories = [
    { name: 'Access Reviews', percentage: 98.2 },
    { name: 'Credential Validity', percentage: 97.5 },
    { name: 'SoD Compliance', percentage: 99.1 },
    { name: 'Policy Adherence', percentage: 92.4 },
];

export function ComplianceByCategory() {
  return (
    <div className="space-y-4">
      {complianceCategories.map((category) => (
        <div key={category.name}>
          <div className="flex justify-between items-center mb-1 text-sm">
            <p className="font-medium text-foreground">{category.name}</p>
            <div className='flex items-center gap-2'>
                <p className="font-semibold text-foreground">{category.percentage}%</p>
                <Button size="sm" variant="secondary" className="h-7 text-xs">Examine</Button>
            </div>
          </div>
          <Progress value={category.percentage} className="h-2" />
        </div>
      ))}
    </div>
  );
}
