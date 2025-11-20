
'use client';

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const data = [
  { name: 'Internal Medicine', value: 52 },
  { name: 'Pediatrics', value: 25 },
  { name: 'Emergency Medicine', value: 29 },
  { name: 'Other Specialties', value: 114 },
];

const COLORS = ['#3b82f6', '#ec4899', '#f97316', '#6b7280'];

export function CliniciansBySpecialtyChart() {
  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
           <Tooltip
                contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    borderColor: 'hsl(var(--border))',
                }}
            />
          <Legend 
            formatter={(value) => <span className="text-foreground">{value}</span>}
            iconType="circle"
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

    