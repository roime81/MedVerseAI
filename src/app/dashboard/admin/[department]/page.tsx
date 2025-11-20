
'use client';

import * as React from 'react';
import { HrCredentialingDashboard } from '@/components/dashboard/admin/hr-credentialing-dashboard';
import SuperAdminDashboard from '@/app/dashboard/admin/system/page';
import { notFound } from 'next/navigation';

// A mapping from the department slug in the URL to the corresponding dashboard component.
const dashboardMap: Record<string, React.ComponentType> = {
  'system': SuperAdminDashboard,
  'hr-credentialing': HrCredentialingDashboard,
  // Add other admin dashboards here as they are created
  // 'it-iam': ITDashboard,
  // 'cybersecurity': CybersecurityDashboard,
};


export default function AdminDepartmentPage({ params }: { params: { department: string } }) {
  const { department } = params;
  const DashboardComponent = dashboardMap[department];

  // If the department slug doesn't exist in our map, show a 404 or a generic page.
  // A 404 is often better to avoid showing pages for invalid URLs.
  if (!DashboardComponent) {
    notFound();
  }
  
  // This component will now correctly render the specific dashboard
  // based on the URL slug, which is derived from the user's department.
  return <DashboardComponent />;
}
