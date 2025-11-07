'use client';
import { useState } from 'react';
import { summarizePatientRecord } from '@/ai/flows/summarize-patient-record';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Wand2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

const exampleRecord = `Patient: Jane Doe, DOB: 1985-05-15

Presenting Complaint:
Patient presents with a 3-day history of intermittent, sharp chest pain, radiating to the left arm. Pain is exacerbated by exertion and relieved by rest. Patient also reports shortness of breath.

Past Medical History:
- Hypertension, diagnosed 2018, managed with Lisinopril 10mg daily.
- Type 2 Diabetes Mellitus, diagnosed 2020, managed with Metformin 500mg BID.
- No history of previous cardiac events.

Family History:
- Father had a myocardial infarction at age 55.

Social History:
- Smoker, 10 pack-years. Quit 2 years ago.
- Occasional alcohol use.

Allergies:
- Penicillin (rash).

Review of Systems:
- Constitutional: No fever, chills, or weight loss.
- Cardiovascular: As per presenting complaint. No palpitations or edema.
- Respiratory: Shortness of breath on exertion. No cough or wheezing.
- GI: No nausea, vomiting, or abdominal pain.

Physical Examination:
- Vitals: BP 145/90, HR 88, RR 18, Temp 98.6°F, SpO2 98% on room air.
- Heart: Regular rate and rhythm, no murmurs.
- Lungs: Clear to auscultation bilaterally.
- Extremities: No peripheral edema.

Labs & Imaging:
- EKG: Normal sinus rhythm, no significant ST changes.
- Troponin: Pending.
- Chest X-ray: No acute cardiopulmonary process.

Assessment & Plan:
1. Acute Chest Pain: Likely angina pectoris given risk factors. Rule out Acute Coronary Syndrome.
   - Admit to telemetry unit.
   - Serial Troponins and EKGs.
   - Start Aspirin 325mg.
   - Start Nitroglycerin paste.
   - Consider cardiology consult for stress testing.
2. Hypertension: Continue Lisinopril. Monitor BP.
3. Type 2 Diabetes: Continue Metformin. Monitor glucose.`;


export function SummarizeForm() {
  const [patientRecord, setPatientRecord] = useState('');
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!patientRecord.trim()) {
      toast({
        title: 'Error',
        description: 'Patient record cannot be empty.',
        variant: 'destructive',
      });
      return;
    }
    setIsLoading(true);
    setSummary('');
    try {
      const result = await summarizePatientRecord({ patientRecord });
      setSummary(result.summary);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error Summarizing Record',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleUseExample = () => {
    setPatientRecord(exampleRecord);
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Patient Record</CardTitle>
          <CardDescription>
            Paste the full patient record below.
            <Button variant="link" size="sm" className="ml-2 p-0 h-auto" onClick={handleUseExample}>
              Use Example
            </Button>          
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Textarea
              placeholder="Enter one patient record here..."
              value={patientRecord}
              onChange={(e) => setPatientRecord(e.target.value)}
              className="min-h-[400px] text-sm"
              disabled={isLoading}
            />
            <Button type="submit" disabled={isLoading || !patientRecord.trim()} className="mt-4 w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Summarizing...
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-4 w-4" />
                  Generate Summary
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>AI-Generated Summary</CardTitle>
          <CardDescription>A concise overview of the record.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[460px] rounded-md border bg-secondary/50 p-4">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <Loader2 className="h-8 w-8 animate-spin" />
                  <p>Generating summary...</p>
                </div>
              </div>
            ) : summary ? (
              <ScrollArea className="h-full">
                <div className="whitespace-pre-wrap text-sm pr-4">{summary}</div>
              </ScrollArea>
            ) : (
              <div className="flex items-center justify-center h-full text-center text-muted-foreground">
                <p>The summary will appear here once generated.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
