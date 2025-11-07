import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function Home() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-headline text-3xl font-bold tracking-tight">
          Welcome to MedVerseAI
        </h1>
        <p className="text-muted-foreground">
          A distributed, microservices-based Health Information System with
          Analytics & AI.
        </p>
      </header>
      <Card>
        <CardHeader>
          <CardTitle>Getting Started</CardTitle>
          <CardDescription>
            This is a starter template. You can edit this file at{' '}
            <code>src/app/page.tsx</code>.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>
            The app is built with Next.js, ShadCN, and Tailwind CSS. Explore the
            project structure to start building your application.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
