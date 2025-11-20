
'use client';

import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';

const data = [
  { name: 'Mon', successful: 45, failed: 2 },
  { name: 'Tue', successful: 52, failed: 1 },
  { name: 'Wed', successful: 48, failed: 3 },
  { name: 'Thu', successful: 55, failed: 0 },
  { name: 'Fri', successful: 60, failed: 2 },
  { name: 'Sat', successful: 20, failed: 0 },
  { name: 'Sun', successful: 15, failed: 1 },
];

export function ExecutionPerformanceChart() {
  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} domain={[0, 65]}/>
            <Tooltip
                contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    borderColor: 'hsl(var(--border))',
                }}
            />
            <Legend formatter={(value) => <span className="text-foreground">{value}</span>}/>
            <Line type="monotone" dataKey="successful" name="Successful" stroke="#22c55e" strokeWidth={2} dot={{ r: 4, fill: '#22c55e' }} />
            <Line type="monotone" dataKey="failed" name="Failed" stroke="#ef4444" strokeWidth={2} dot={{ r: 4, fill: '#ef4444' }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

    