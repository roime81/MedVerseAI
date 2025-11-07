import { ScheduleForm } from './schedule-form';

export default function SchedulePage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <header>
        <h1 className="font-headline text-3xl font-bold tracking-tight">
          Intelligent Appointment Scheduling
        </h1>
        <p className="text-muted-foreground">
          Optimize schedules based on patient needs and resource availability.
        </p>
      </header>
      <ScheduleForm />
    </div>
  );
}
