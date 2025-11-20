
'use client';

import { useParams } from 'next/navigation';
import SuperAdminDashboard from '@/app/dashboard/admin/system/page';
// Import other admin dashboards here as they are created
// e.g., import HrCredentialingDashboard from '@/components/dashboard/admin/hr-credentialing-dashboard';

const dashboardMap: { [key: string]: React.ComponentType } = {
  system: SuperAdminDashboard,
  // 'hr-credentialing': HrCredentialingDashboard,
};

export default function AdminDepartmentPage() {
  const params = useParams();
  const department = params.department as string;

  const DashboardComponent = dashboardMap[department];

  if (!DashboardComponent) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">
          Dashboard for the '{department}' department not found.
        </p>
      </div>
    );
  }

  return <DashboardComponent />;
}
