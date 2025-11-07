'use client'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { allTasks } from "@/lib/sample-data";

export default function TasksPage() {
    const getPriorityBadge = (priority: string) => {
        switch(priority) {
            case 'High': return <Badge variant="destructive">High</Badge>;
            case 'Medium': return <Badge className="bg-yellow-500 text-white hover:bg-yellow-400">Medium</Badge>;
            case 'Low': return <Badge variant="secondary">Low</Badge>;
            default: return <Badge>{priority}</Badge>;
        }
    }

  return (
    <div className="space-y-6 animate-fade-in">
      <header>
        <h1 className="font-headline text-3xl font-bold tracking-tight">
          All Pending Tasks
        </h1>
        <p className="text-muted-foreground">
          A complete list of tasks requiring your attention.
        </p>
      </header>
      <Card>
        <CardHeader>
          <CardTitle>Task List</CardTitle>
          <CardDescription>Overview of all pending physician tasks.</CardDescription>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Task</TableHead>
                        <TableHead>Patient</TableHead>
                        <TableHead>MRN</TableHead>
                        <TableHead>Due</TableHead>
                        <TableHead>Priority</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {allTasks.map((task, index) => (
                        <TableRow key={index} className="cursor-pointer">
                            <TableCell className="font-medium">{task.description}</TableCell>
                            <TableCell>{task.patient}</TableCell>
                            <TableCell>{task.mrn}</TableCell>
                            <TableCell>{task.time}</TableCell>
                            <TableCell>{getPriorityBadge(task.priority)}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </CardContent>
      </Card>
    </div>
  );
}
