'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Users } from 'lucide-react';
import { cn } from '@/lib/utils';

const onboardingPipeline = [
  {
    name: 'Dr. Jennifer Martinez',
    role: 'Physician - Cardiology',
    status: 'Start Date: 2025-11-15 | Days: 30',
    stage: 'License & Credential Verification',
    progress: 33,
    priority: 'high',
  },
  {
    name: 'Nurse Robert Chen',
    role: 'Nurse - CU',
    status: 'Start Date: 2025-12-01 | Days: 45',
    stage: 'Background Check',
    progress: 60,
    priority: 'medium',
  },
  {
    name: 'Lab Tech Maria Garcia',
    role: 'Laboratory Technician',
    status: 'Start Date: 2025-11-20 | Days: 35',
    stage: 'System Training',
    progress: 85,
    priority: 'high',
  },
];


export function OnboardingPipelineCard() {
  return (
    <Card className="bg-white">
      <CardHeader className="flex-row justify-between items-center">
        <CardTitle className="flex items-center">
          <Users className="mr-2 h-5 w-5 text-muted-foreground" />
          Onboarding Pipeline
          <Badge variant="secondary" className="ml-2">{onboardingPipeline.length}</Badge>
        </CardTitle>
        <Button variant="link" size="sm">View all candidates</Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {onboardingPipeline.map((item, index) => (
          <div key={index} className="p-4 rounded-lg border">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-semibold text-foreground">{item.name}</p>
                <p className="text-sm text-muted-foreground">{item.role}</p>
                <p className="text-xs text-muted-foreground mt-1">{item.status}</p>
              </div>
              <Badge variant={item.priority === 'high' ? 'destructive' : 'secondary'} className={cn('capitalize', item.priority === 'medium' && 'bg-yellow-200 text-yellow-800')}>{item.priority}</Badge>
            </div>
            <div className="mt-3">
                <div className="flex justify-between items-center text-sm mb-1">
                    <p className="font-medium text-foreground">{item.stage}</p>
                    <p className="font-semibold">{item.progress}%</p>
                </div>
                <Progress value={item.progress} className="h-2" />
            </div>
            <div className="flex justify-end mt-3">
                <Button variant="outline" size="sm">View Profile</Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
