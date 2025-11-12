
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Calendar, CreditCard } from 'lucide-react';

const activities = [
    { icon: Activity, text: 'Lab results ready', time: '2 hours ago', color: 'text-green-500' },
    { icon: Calendar, text: 'Appointment confirmed', time: 'Yesterday', color: 'text-blue-500' },
    { icon: CreditCard, text: 'Payment processed', time: '2 days ago', color: 'text-purple-500' }
]

export function RecentActivity() {
  return (
    <Card className="bg-white">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {activities.map((item, index) => {
            const Icon = item.icon;
            return (
                <div key={index} className="flex items-center gap-4">
                    <div className={`p-2 rounded-full bg-primary-foreground ${item.color.replace('text-', 'bg-').replace('-500', '/10')}`}>
                        <Icon className={`h-5 w-5 ${item.color}`} />
                    </div>
                    <div>
                        <p className="font-medium text-sm text-foreground">{item.text}</p>
                        <p className="text-xs text-muted-foreground">{item.time}</p>
                    </div>
                </div>
            )
        })}
      </CardContent>
    </Card>
  );
}
