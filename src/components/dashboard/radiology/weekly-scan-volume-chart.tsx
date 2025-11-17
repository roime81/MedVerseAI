
'use client';

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const data = [
  { name: 'Mon', scans: 42 },
  { name: 'Tue', scans: 51 },
  { name: 'Wed', scans: 45 },
  { name: 'Thu', scans: 55 },
  { name: 'Fri', scans: 52 },
  { name: 'Sat', scans: 25 },
  { name: 'Sun', 'scans': 21 },
];

export function WeeklyScanVolumeChart() {
  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
            <Tooltip
                contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    borderColor: 'hsl(var(--border))',
                    borderRadius: 'var(--radius)',
                }}
                cursor={{ fill: 'hsl(var(--accent))' }}
            />
            <Bar dataKey="scans" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

    