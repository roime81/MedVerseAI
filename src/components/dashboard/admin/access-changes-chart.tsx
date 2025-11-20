'use client';

import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const data = [
  { name: 'Nov 11', changes: 12 },
  { name: 'Nov 12', changes: 19 },
  { name: 'Nov 13', changes: 11 },
  { name: 'Nov 14', changes: 17 },
  { name: 'Nov 15', changes: 9 },
  { name: 'Nov 16', changes: 22 },
  { name: 'Nov 17', changes: 18 },
];

export function AccessChangesChart() {
  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} domain={[0, 24]} ticks={[0, 6, 12, 18, 24]} />
            <Tooltip
                contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    borderColor: 'hsl(var(--border))',
                }}
            />
            <Line type="monotone" dataKey="changes" stroke="hsl(var(--primary))" strokeWidth={2} activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
