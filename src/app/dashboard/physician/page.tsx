import { PhysicianHeader } from '@/components/dashboard/physician/header';
import { SummaryCards } from '@/components/dashboard/physician/summary-cards';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function PhysicianDashboard() {
  return (
    <div className="grid flex-1 items-start gap-4 md:gap-8">
      <PhysicianHeader />
      <SummaryCards />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Today's Schedule</CardTitle>
            <CardDescription>
              You have 12 appointments scheduled for today.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Placeholder for schedule */}
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Pending Tasks</CardTitle>
            <CardDescription>
              You have 8 tasks to complete.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Placeholder for tasks */}
          </CardContent>
        </Card>
          <Card className="col-span-7">
          <CardHeader>
            <CardTitle>Recent Patients</CardTitle>
            <CardDescription>
              Patients you've recently seen.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Placeholder for recent patients */}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
