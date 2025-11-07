import { PhysicianHeader } from '@/components/dashboard/physician/header';
import { RecentPatients } from '@/components/dashboard/physician/recent-patients';
import { SummaryCards } from '@/components/dashboard/physician/summary-cards';
import { TodaysSchedule } from '@/components/dashboard/physician/todays-schedule';
import { PendingTasks } from '@/components/dashboard/physician/pending-tasks';

export default function PhysicianDashboard() {
  return (
    <div className="flex flex-col gap-6">
      <PhysicianHeader />
      <SummaryCards />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <TodaysSchedule />
        </div>
        <div className="lg:col-span-1">
          <PendingTasks />
        </div>
      </div>
      <RecentPatients />
    </div>
  );
}
