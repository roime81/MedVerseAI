
'use client';

import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const data = [
  { name: 'Nov 11', changes: 12 },
  { name: 'Nov 12', changes: 8 },
  { name: 'Nov 13', changes: 9 },
  { name: 'Nov 14', changes: 14 },
  { name: 'Nov 15', changes: 8 },
  { name: 'Nov 16', changes: 10 },
  { name: 'Nov 17', changes: 9 },
];

export function AccessChangesChart() {
  return (
    <div style={{ width: '100%', height: 250 }}>
      <ResponsiveContainer>
        <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} domain={[0, 16]} ticks={[0, 4, 8, 12, 16]}/>
            <Tooltip
                contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    borderColor: 'hsl(var(--border))',
                }}
            />
            <Line type="monotone" dataKey="changes" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4, fill: 'hsl(var(--primary))' }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

    