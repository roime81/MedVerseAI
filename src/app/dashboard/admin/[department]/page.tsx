
'use client';

import * as React from 'react';
import { SuperAdminDashboard } from '@/components/dashboard/admin/super-admin-dashboard';
import { HrCredentialingDashboard } from '@/components/dashboard/admin/hr-credentialing-dashboard';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';

// A mapping from the department slug in the URL to the corresponding dashboard component.
const dashboardMap: Record<string, React.ComponentType> = {
  'system': SuperAdminDashboard,
  'hr-credentialing': HrCredentialingDashboard,
  // Add other admin dashboards here as they are created
  // 'it-iam': ITDashboard,
  // 'cybersecurity': CybersecurityDashboard,
};

const departmentNameMap: Record<string, string> = {
    'system': 'System Administration',
    'hr-credentialing': 'HR & Medical Credentialing',
}


export default function AdminDepartmentPage({ params }: { params: { department: string } }) {
  const { department } = params;
  const DashboardComponent = dashboardMap[department];

  const departmentName = departmentNameMap[department] || 'Admin Dashboard';

  if (!DashboardComponent) {
    return (
        <div className="flex flex-col h-full bg-slate-50 text-foreground">
            <DashboardHeader title={departmentName} description={`No specific dashboard found for department: ${department}.`} />
            <div className="flex-1 overflow-y-auto p-8">
                <p>This is a placeholder for the {department} dashboard. A specific UI has not been created for this department yet.</p>
            </div>
        </div>
    );
  }

  return <DashboardComponent />;
}
