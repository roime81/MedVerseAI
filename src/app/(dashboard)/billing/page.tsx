import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function BillingPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <header>
        <h1 className="font-headline text-3xl font-bold tracking-tight">
          Billing & Claims
        </h1>
        <p className="text-muted-foreground">
          View and manage patient billing, coverage, and claims.
        </p>
      </header>
      <Card>
        <CardHeader>
          <CardTitle>Billing Dashboard</CardTitle>
          <CardDescription>This page will provide an overview of financial interactions and claims status.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Content for the Billing page is under construction.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
