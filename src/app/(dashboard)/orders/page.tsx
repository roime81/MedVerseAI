import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function OrdersPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <header>
        <h1 className="font-headline text-3xl font-bold tracking-tight">
          Orders
        </h1>
        <p className="text-muted-foreground">
          Manage clinical orders for labs, imaging, and procedures.
        </p>
      </header>
      <Card>
        <CardHeader>
          <CardTitle>Order Management</CardTitle>
          <CardDescription>This page will allow for integrated order entry and tracking.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Content for the Orders page is under construction.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
