'use client';
import { treatmentJourney, JourneyTask } from '@/lib/sample-data';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

const getStatusClasses = (status: JourneyTask['status']) => {
  switch (status) {
    case 'Completed':
      return {
        iconContainer: 'bg-green-100 dark:bg-green-900',
        icon: 'text-green-600 dark:text-green-400',
        title: 'text-muted-foreground line-through',
        description: 'text-muted-foreground line-through',
      };
    case 'In Progress':
      return {
        iconContainer: 'bg-primary/10 dark:bg-primary/20',
        icon: 'text-primary',
        title: 'font-semibold',
        description: '',
      };
    case 'Upcoming':
      return {
        iconContainer: 'bg-secondary',
        icon: 'text-muted-foreground',
        title: 'text-muted-foreground',
        description: 'text-muted-foreground',
      };
  }
};

export function TreatmentJourney() {
  return (
    <div className="relative">
      <div
        aria-hidden="true"
        className="absolute left-5 top-2 h-full w-0.5 bg-border -translate-x-1/2"
      ></div>
      <div className="space-y-4">
        {treatmentJourney.map((task, index) => {
          const classes = getStatusClasses(task.status);
          const Icon = task.icon;

          return (
            <div key={index} className="flex items-start gap-4 relative">
              <div
                className={cn(
                  'relative z-10 flex h-10 w-10 items-center justify-center rounded-full',
                  classes.iconContainer
                )}
              >
                {task.status === 'Completed' ? (
                  <Check className={cn('h-5 w-5', classes.icon)} />
                ) : (
                  <Icon className={cn('h-5 w-5', classes.icon)} />
                )}
              </div>
              <div className="pt-1.5">
                <p className={cn('text-sm', classes.title)}>{task.title}</p>
                <p className={cn('text-xs', classes.description)}>
                  {task.description}
                </p>
                {task.status === 'Completed' && task.completedBy && (
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Completed by: <Button variant="link" className="p-0 h-auto text-xs">{task.completedBy}</Button>
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
