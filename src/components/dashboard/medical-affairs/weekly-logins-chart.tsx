
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
            top: 5, right: 30, left: 20, bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="logins" stroke="hsl(var(--primary))" strokeWidth={2} activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
