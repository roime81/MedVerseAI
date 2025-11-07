import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import type { Appointment } from '@/lib/types';

const appointments: Appointment[] = [
  { time: '09:00', patient: { initials: 'SJ', name: 'Sarah Johnson', age: 45, reason: 'Follow-up' }, status: 'Completed' },
  { time: '09:30', patient: { initials: 'MC', name: 'Michael Chen', age: 62, reason: 'Diabetes Check' }, status: 'In Progress' },
  { time: '10:15', patient: { initials: 'ED', name: 'Emma Davis', age: 34, reason: 'Annual Physical' }, status: 'Waiting' },
  { time: '11:00', patient: { initials: 'RW', name: 'Robert Wilson', age: 58, reason: 'Hypertension' }, status: 'Scheduled' },
  { time: '14:00', patient: { initials: 'LA', name: 'Lisa Anderson', age: 41, reason: 'Lab Review' }, status: 'Scheduled' },
];

const getStatusClass = (status: Appointment['status']) => {
  switch (status) {
    case 'Completed': return 'bg-gray-800 text-white';
    case 'In Progress': return 'bg-blue-100 text-blue-800';
    case 'Waiting': return 'bg-yellow-100 text-yellow-800';
    case 'Scheduled': return 'bg-gray-100 text-gray-800';
    default: return '';
  }
}

export function TodaysSchedule() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Today's Schedule</CardTitle>
        <Button variant="outline" size="sm">
          <Calendar className="mr-2 h-4 w-4" />
          View Full Calendar
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {appointments.map((appt, index) => (
            <div key={index} className="flex items-center space-x-4 rounded-lg p-3 hover:bg-gray-50">
              <div className="w-14 text-sm text-muted-foreground">{appt.time}</div>
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-blue-100 text-blue-800 font-semibold">{appt.patient.initials}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-semibold text-gray-800">{appt.patient.name}</p>
                <p className="text-sm text-muted-foreground">{`${appt.patient.age} yrs • ${appt.patient.reason}`}</p>
              </div>
              <Badge className={`font-semibold ${getStatusClass(appt.status)}`}>{appt.status}</Badge>
              <Button variant="ghost" size="sm">Open Chart</Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
