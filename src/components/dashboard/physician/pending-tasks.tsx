import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export function PendingTasks() {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-grotesk text-lg">Pending Tasks</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex h-40 items-center justify-center">
                    <p className="text-muted-foreground">No pending tasks.</p>
                </div>
            </CardContent>
        </Card>
    );
}
