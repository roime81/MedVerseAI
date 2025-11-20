
'use client';

import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const data = [
  { name: 'Jul', compliance: 92.1 },
  { name: 'Aug', compliance: 94.7 },
  { name: 'Sep', compliance: 94.8 },
  { name: 'Oct', compliance: 95.2 },
  { name: 'Nov', compliance: 94.7 },
];

export function PolicyComplianceTrendChart() {
  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} domain={[70, 100]} ticks={[75, 80, 85, 90, 95, 100]} unit="%"/>
            <Tooltip
                contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    borderColor: 'hsl(var(--border))',
                }}
                formatter={(value) => `${value}%`}
            />
            <Line type="monotone" dataKey="compliance" stroke="#22c55e" strokeWidth={2} dot={{ r: 4, fill: '#22c55e' }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
