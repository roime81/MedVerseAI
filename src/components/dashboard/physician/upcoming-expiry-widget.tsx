
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarClock } from 'lucide-react';

export function UpcomingExpiryWidget() {
    // Static data for demonstration
    const licenseExpiryDays = 84;
    const contractExpiryDays = 256;

    return (
        <Card className="bg-white hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Upcoming Expiry</CardTitle>
                <CalendarClock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-xs text-muted-foreground">License</p>
                        <p className="font-semibold">{licenseExpiryDays} days</p>
                    </div>
                    <div>
                         <p className="text-xs text-muted-foreground">Contract</p>
                        <p className="font-semibold">{contractExpiryDays} days</p>
                    </div>
                </div>
                 <div className="mt-2 flex gap-2">
                    <Badge variant={licenseExpiryDays <= 90 ? 'destructive' : 'secondary'}>License Renewal</Badge>
                    <Badge variant="secondary">APC</Badge>
                </div>
            </CardContent>
        </Card>
    );
}
