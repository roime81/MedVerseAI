import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function VitalsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <header>
        <h1 className="font-headline text-3xl font-bold tracking-tight">
          Vitals
        </h1>
        <p className="text-muted-foreground">
          Capture and review patient vital signs.
        </p>
      </header>
      <Card>
        <CardHeader>
          <CardTitle>Vitals Capture</CardTitle>
          <CardDescription>This page will be used for capturing patient vitals like BP, HR, SpO2, etc.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Content for the Vitals page is under construction.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
