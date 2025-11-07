import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Calendar, Activity, Users, Clock } from 'lucide-react';

export function SummaryCards() {
  const summaries = [
    { title: "Today's Appointments", value: 12, icon: Calendar },
    { title: 'Pending Tasks', value: 8, icon: Activity },
    { title: 'Active Patients', value: 156, icon: Users },
    { title: 'Avg. Wait Time', value: '15 min', icon: Clock },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
      {summaries.map((summary, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {summary.title}
            </CardTitle>
            <summary.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
