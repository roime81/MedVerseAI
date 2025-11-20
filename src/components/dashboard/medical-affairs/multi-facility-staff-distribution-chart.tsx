
'use client';

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';

const data = [
  { name: 'Hospital A', 'Staff with access': 150, 'Daily Active': 120, 'Admin': 45 },
  { name: 'Hospital B', 'Staff with access': 210, 'Daily Active': 180, 'Admin': 60 },
  { name: 'Hospital C', 'Staff with access': 120, 'Daily Active': 90, 'Admin': 30 },
];

export function MultiFacilityStaffDistributionChart() {
  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <BarChart data={data} barGap={-20}>
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
            <Bar dataKey="Staff with access" fill="#a78bfa" radius={[4, 4, 0, 0]} barSize={20} />
            <Bar dataKey="Daily Active" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={20} />
            <Bar dataKey="Admin" fill="#6b7280" radius={[4, 4, 0, 0]} barSize={20} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

    