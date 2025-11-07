import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function Patient360Page() {
  return (
    <div className="space-y-6 animate-fade-in">
      <header>
        <h1 className="font-headline text-3xl font-bold tracking-tight">
          Patient 360
        </h1>
        <p className="text-muted-foreground">
          Comprehensive, longitudinal view of a patient's record.
        </p>
      </header>
      <Card>
        <CardHeader>
          <CardTitle>Patient 360 View</CardTitle>
          <CardDescription>This page will provide a unified view of a patient's health record across all encounters.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Content for the Patient 360 page is under construction.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
