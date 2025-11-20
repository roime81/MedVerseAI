
'use client';

import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';

const data = [
  { name: 'Mon', logins: 210, errors: 5 },
  { name: 'Tue', logins: 220, errors: 3 },
  { name: 'Wed', logins: 205, errors: 8 },
  { name: 'Thu', logins: 230, errors: 4 },
  { name: 'Fri', logins: 240, errors: 6 },
  { name: 'Sat', logins: 90, errors: 1 },
  { name: 'Sun', logins: 85, errors: 2 },
];

export function SystemUsageTrendChart() {
  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} domain={[0, 250]}/>
            <Tooltip
                contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    borderColor: 'hsl(var(--border))',
                }}
            />
            <Legend formatter={(value) => <span className="text-foreground">{value}</span>}/>
            <Line type="monotone" dataKey="logins" name="Daily Logins" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4, fill: '#3b82f6' }} />
            <Line type="monotone" dataKey="errors" name="Errors" stroke="#ef4444" strokeWidth={2} dot={{ r: 4, fill: '#ef4444' }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
