
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Condition, DrugExposure } from '@/lib/types';
import { Loader2 } from 'lucide-react';


interface HealthSummaryProps {
    conditions?: Condition[] | null;
    medications?: DrugExposure[] | null;
    allergies?: string | null;
}

export function HealthSummary({ conditions, medications, allergies }: HealthSummaryProps) {
  return (
    <Card className="bg-white">
        <CardHeader>
            <CardTitle>My Health Summary</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                    <h3 className="font-semibold text-muted-foreground mb-3">Active Conditions</h3>
                    <div className="space-y-2">
                        {conditions ? (
                            conditions.length > 0 ? (
                                conditions.map(condition => (
                                    <div key={condition.diagnosisId} className="p-3 rounded-md bg-slate-50 text-sm font-medium">
                                        {condition.icd10Code}
                                    </div>
                                ))
                            ) : (<p className="text-sm text-muted-foreground">No active conditions.</p>)
                        ) : <Loader2 className="h-4 w-4 animate-spin" />}
                    </div>
                </div>
                 <div>
                    <h3 className="font-semibold text-muted-foreground mb-3">Current Medications</h3>
                    <div className="space-y-2">
                        {medications ? (
                            medications.length > 0 ? (
                                medications.map(med => (
                                    <div key={med.medicationId} className="p-3 rounded-md bg-slate-50 text-sm font-medium">
                                        {med.drugName}
                                    </div>
                                ))
                            ) : (<p className="text-sm text-muted-foreground">No current medications.</p>)
                        ) : <Loader2 className="h-4 w-4 animate-spin" />}
                    </div>
                </div>
                 <div>
                    <h3 className="font-semibold text-muted-foreground mb-3">Allergies</h3>
                     <div className="space-y-2">
                        {allergies && allergies !== 'None' ? (
                             <Badge variant="destructive" className="p-2 text-base">{allergies}</Badge>
                        ) : (
                            <p className="text-sm text-muted-foreground">No known allergies.</p>
                        )}
                    </div>
                </div>
            </div>
        </CardContent>
    </Card>
  );
}
