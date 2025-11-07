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
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
          <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-3">
            <PhysicianHeader />
            <SummaryCards />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Today's Schedule</CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Placeholder for schedule */}
                </CardContent>
              </Card>
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Pending Tasks</CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Placeholder for tasks */}
                </CardContent>
              </Card>
               <Card className="col-span-7">
                <CardHeader>
                  <CardTitle>Recent Patients</CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Placeholder for recent patients */}
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
