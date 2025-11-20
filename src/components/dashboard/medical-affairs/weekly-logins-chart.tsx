
'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Mon', logins: 1250 },
  { name: 'Tue', logins: 1300 },
  { name: 'Wed', logins: 1200 },
  { name: 'Thu', logins: 1400 },
  { name: 'Fri', logins: 1350 },
  { name: 'Sat', logins: 900 },
  { name: 'Sun', logins: 750 },
];

export function WeeklyLoginsChart() {
  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <LineChart
          data={data}
          margin={{
            top: 5, right: 30, left: 0, bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'hsl(var(--background))',
              borderColor: 'hsl(var(--border))',
              color: 'hsl(var(--foreground))'
            }}
            labelStyle={{ color: 'hsl(var(--muted-foreground))' }}
          />
          <Line type="monotone" dataKey="logins" name="Access Changes" stroke="#38bdf8" strokeWidth={2} activeDot={{ r: 8, fill: '#38bdf8' }} dot={{ fill: '#38bdf8', r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
