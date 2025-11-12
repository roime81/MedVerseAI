
'use client';

import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ActionCardProps {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  className?: string;
}

export function ActionCard({ icon: Icon, title, subtitle, className }: ActionCardProps) {
  return (
    <Card className={cn("hover:shadow-md transition-shadow cursor-pointer bg-white", className)}>
      <CardContent className="p-6 flex flex-col items-start gap-2">
        <div className="p-2 bg-primary/10 rounded-lg">
            <Icon className="h-6 w-6 text-primary" />
        </div>
        <div>
            <p className="font-semibold">{title}</p>
            <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>
      </CardContent>
    </Card>
  );
}
