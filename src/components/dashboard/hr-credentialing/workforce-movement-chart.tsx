
'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const data = [
  { name: 'Jul', onboarded: 28, offboarded: 10 },
  { name: 'Aug', onboarded: 35, offboarded: 12 },
  { name: 'Sep', onboarded: 42, offboarded: 8 },
  { name: 'Oct', onboarded: 38, offboarded: 15 },
  { name: 'Nov', onboarded: 45, offboarded: 11 },
];

export function WorkforceMovementChart() {
  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'hsl(var(--background))',
              borderColor: 'hsl(var(--border))',
            }}
          />
          <Legend />
          <Line type="monotone" dataKey="onboarded" stroke="#22c55e" strokeWidth={2} name="Onboarding" />
          <Line type="monotone" dataKey="offboarded" stroke="#ef4444" strokeWidth={2} name="Offboarding" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
