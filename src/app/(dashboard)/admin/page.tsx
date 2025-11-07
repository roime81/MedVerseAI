import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function AdminPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <header>
        <h1 className="font-headline text-3xl font-bold tracking-tight">
          Admin
        </h1>
        <p className="text-muted-foreground">
          Manage system settings, users, and terminology.
        </p>
      </header>
      <Card>
        <CardHeader>
          <CardTitle>Administration Panel</CardTitle>
          <CardDescription>This page will be for system administration tasks.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Content for the Admin page is under construction.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
