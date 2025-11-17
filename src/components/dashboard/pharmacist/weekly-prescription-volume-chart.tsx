
'use client';

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const data = [
  { name: 'Mon', prescriptions: 160 },
  { name: 'Tue', prescriptions: 170 },
  { name: 'Wed', prescriptions: 150 },
  { name: 'Thu', prescriptions: 175 },
  { name: 'Fri', prescriptions: 165 },
  { name: 'Sat', prescriptions: 90 },
  { name: 'Sun', prescriptions: 75 },
];

export function WeeklyPrescriptionVolumeChart() {
  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} domain={[0, 180]} ticks={[0, 45, 90, 135, 180]} />
            <Tooltip
                contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    borderColor: 'hsl(var(--border))',
                }}
            />
            <Bar dataKey="prescriptions" fill="#ec4899" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
