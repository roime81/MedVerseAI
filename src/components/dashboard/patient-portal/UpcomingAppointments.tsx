
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';

const appointments = [
    {
        type: 'Follow-up - Cardiology',
        doctor: 'Dr. Michael Roberts',
        time: '10:30 AM',
        location: 'Main Hospital - 3rd Floor',
        status: 'Tomorrow'
    },
    {
        type: 'Annual Physical',
        doctor: 'Dr. Lisa Wang',
        time: '2:00 PM',
        location: 'Family Medicine Clinic',
        status: 'Dec 15'
    }
]

export function UpcomingAppointments() {
  return (
    <Card className="bg-white">
      <CardHeader>
        <CardTitle>Upcoming Appointments</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {appointments.map((appt, index) => (
            <div key={index} className="flex items-center justify-between p-4 rounded-lg border bg-background">
                <div>
                    <p className="font-semibold text-foreground">{appt.type}</p>
                    <p className="text-sm text-muted-foreground">{appt.doctor}</p>
                    <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{appt.time}</span>
                        <span className="text-gray-300">•</span>
                        <span>{appt.location}</span>
                    </div>
                </div>
                <Badge 
                    variant={appt.status === 'Tomorrow' ? 'default' : 'outline'}
                    className={appt.status === 'Tomorrow' ? 'bg-primary text-primary-foreground' : ''}
                >
                    {appt.status}
                </Badge>
            </div>
        ))}
      </CardContent>
    </Card>
  );
}
