
'use client';

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const data = [
  { name: 'Low Risk', value: 234 },
  { name: 'Medium Risk', value: 45 },
  { name: 'High Risk', value: 12 },
];

const COLORS = ['#22c55e', '#f97316', '#ef4444'];

export function AccessRiskDistributionChart() {
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
            formatter={(value, entry) => <span className="text-foreground">{value}: {entry.payload.value}</span>}
            iconType="circle"
            align="center"
            verticalAlign="bottom"
            wrapperStyle={{paddingTop: '20px'}}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

    