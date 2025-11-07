import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function AnalyticsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <header>
        <h1 className="font-headline text-3xl font-bold tracking-tight">
          Analytics
        </h1>
        <p className="text-muted-foreground">
          Visualize population health trends and operational KPIs.
        </p>
      </header>
      <Card>
        <CardHeader>
          <CardTitle>Analytics Dashboard</CardTitle>
          <CardDescription>This page will feature charts and graphs for data analysis based on the OMOP CDM.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Content for the Analytics page is under construction.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
