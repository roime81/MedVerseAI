
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { Shield } from 'lucide-react';
import { generatedData } from '@/lib/sample-data';

// Helper to convert URL slug back to department name
const slugToDepartmentName = (slug: string): string => {
    for (const user of generatedData.sampleUsers) {
        if (user.department && user.department.toLowerCase().replace(/[\s/&]+/g, '-') === slug) {
            return user.department;
        }
    }
    return slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};


export default function AdminDepartmentPage({ params }: { params: { department: string } }) {
    const departmentName = slugToDepartmentName(params.department);
    const title = `${departmentName} Dashboard`;
    const description = `Manage and monitor activities for the ${departmentName} department.`;

  return (
    <div className="flex flex-col h-full bg-slate-50 text-foreground">
        <DashboardHeader title={title} description={description} />
        <div className="flex-1 overflow-y-auto p-8">
            <Card className="bg-white">
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <Shield className="mr-2 h-5 w-5" />
                        {departmentName}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-lg">Hello, {departmentName} Admin</p>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
