import { SummarizeForm } from './summarize-form';

export default function SummarizePage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <header>
        <h1 className="font-headline text-3xl font-bold tracking-tight">
          Patient Record Summarization
        </h1>
        <p className="text-muted-foreground">
          Use AI to generate a concise summary of a patient's medical record.
        </p>
      </header>
      <SummarizeForm />
    </div>
  );
}
