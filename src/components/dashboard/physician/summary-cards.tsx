import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Calendar, AlertCircle, Users, Clock } from 'lucide-react';

const summaryData = [
  {
    title: "Today's Appointments",
    value: '...',
    icon: Calendar,
    color: 'text-blue-500',
    borderColor: 'border-blue-500',
  },
  {
    title: 'Pending Tasks',
    value: '...',
    icon: AlertCircle,
    color: 'text-orange-500',
    borderColor: 'border-orange-500',
  },
  {
    title: 'Active Patients',
    value: '...',
    icon: Users,
    color: 'text-green-500',
    borderColor: 'border-green-500',
  },
  {
    title: 'Avg. Wait Time',
    value: '...',
    icon: Clock,
    color: 'text-purple-500',
    borderColor: 'border-purple-500',
  },
];

export function SummaryCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {summaryData.map((summary, index) => (
        <Card key={index} className={`border-l-4 ${summary.borderColor} shadow-sm`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-grotesk text-sm font-medium text-muted-foreground">
              {summary.title}
            </CardTitle>
            <summary.icon className={`h-5 w-5 ${summary.color}`} />
          </CardHeader>
          <CardContent>
            <div className="font-grotesk text-2xl font-bold text-gray-800">{summary.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
