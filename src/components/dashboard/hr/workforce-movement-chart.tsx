
'use client';

import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';

const data = [
  { name: 'Jul', onboarded: 35, offboarded: 8 },
  { name: 'Aug', onboarded: 42, offboarded: 10 },
  { name: 'Sep', onboarded: 38, offboarded: 7 },
  { name: 'Oct', onboarded: 45, offboarded: 6 },
  { name: 'Nov', onboarded: 40, offboarded: 9 },
];

export function WorkforceMovementChart() {
  return (
    <div style={{ width: '100%', height: 250 }}>
      <ResponsiveContainer>
        <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} domain={[0, 50]}/>
            <Tooltip
                contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    borderColor: 'hsl(var(--border))',
                }}
            />
            <Legend />
            <Line type="monotone" dataKey="onboarded" name="Onboarded" stroke="#22c55e" strokeWidth={2} dot={{ r: 4, fill: '#22c55e' }} />
            <Line type="monotone" dataKey="offboarded" name="Offboarded" stroke="#ef4444" strokeWidth={2} dot={{ r: 4, fill: '#ef4444' }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
