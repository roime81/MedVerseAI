import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import type { RecentPatient } from '@/lib/types';

const patients: RecentPatient[] = [
  { initials: 'JM', name: 'James Martinez', lastSeen: '2 days ago', conditions: ['Hypertension', 'Type 2 Diabetes'], alerts: 2 },
  { initials: 'PB', name: 'Patricia Brown', lastSeen: '5 days ago', conditions: ['Asthma'], alerts: 0 },
  { initials: 'DL', name: 'David Lee', lastSeen: '1 week ago', conditions: ['COPD', 'High Cholesterol'], alerts: 1 },
];

export function RecentPatients() {
  return (
    <Card>
        <CardHeader>
            <CardTitle className="text-lg">Recent Patients</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {patients.map((patient, index) => (
                <Card key={index} className="p-4">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-4">
                            <Avatar className="h-10 w-10">
                                <AvatarFallback className="bg-gray-200 text-gray-800 font-semibold">{patient.initials}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-semibold text-gray-800">{patient.name}</p>
                                <p className="text-sm text-muted-foreground">{patient.lastSeen}</p>
                            </div>
                        </div>
                        {patient.alerts > 0 && (
                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                                {patient.alerts}
                            </div>
                        )}
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                        {patient.conditions.map((condition, i) => (
                            <Badge key={i} variant="outline" className="font-normal">{condition}</Badge>
                        ))}
                    </div>
                </Card>
            ))}
            </div>
        </CardContent>
    </Card>
  );
}
