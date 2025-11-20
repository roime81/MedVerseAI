
'use client';

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';

const data = [
  { name: 'Week 1', Low: 4, Medium: 8, High: 12 },
  { name: 'Week 2', Low: 3, Medium: 9, High: 14 },
  { name: 'Week 3', Low: 5, Medium: 10, High: 16 },
  { name: 'Week 4', Low: 4, Medium: 12, High: 14 },
];

export function SecurityAlertTrendsChart() {
  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} domain={[0, 35]}/>
            <Tooltip
                contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    borderColor: 'hsl(var(--border))',
                }}
            />
            <Legend formatter={(value) => <span className="text-foreground">{value}</span>}/>
            <Bar dataKey="Low" stackId="a" fill="#22c55e" radius={[0, 0, 4, 4]} />
            <Bar dataKey="Medium" stackId="a" fill="#f97316" />
            <Bar dataKey="High" stackId="a" fill="#ef4444" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

    