'use client';
import { JourneyTask } from './physician-dashboard';
import { staffProfiles } from '@/lib/sample-data';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { placeholderImages } from '@/lib/placeholder-images';

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

export function TreatmentJourney({ journey }: { journey: JourneyTask[] }) {

  const getAvatarUrl = (avatarId?: string) => {
    if (!avatarId) return '';
    return placeholderImages.find(p => p.id === avatarId)?.imageUrl || '';
  };

  return (
    <div className="relative">
      <div
        aria-hidden="true"
        className="absolute left-5 top-2 h-full w-0.5 bg-border -translate-x-1/2"
      ></div>
      <div className="space-y-4">
        {journey.map((task, index) => {
          const classes = getStatusClasses(task.status);
          const Icon = task.icon;
          const staffMember = task.completedBy ? staffProfiles[task.completedBy] : undefined;

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
                {task.status === 'Completed' && staffMember && (
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Completed by:{' '}
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="link" className="p-0 h-auto text-xs">{task.completedBy}</Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-64">
                            <div className="flex items-center gap-4">
                                <Avatar>
                                    <AvatarImage src={getAvatarUrl(staffMember.avatarId)} />
                                    <AvatarFallback>{staffMember.name.split(' ').map(n=>n[0]).join('')}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-semibold text-sm">{staffMember.name}</p>
                                    <p className="text-xs text-muted-foreground">{staffMember.role}</p>
                                    <p className="text-xs text-muted-foreground">{staffMember.email}</p>
                                </div>
                            </div>
                        </PopoverContent>
                    </Popover>
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
