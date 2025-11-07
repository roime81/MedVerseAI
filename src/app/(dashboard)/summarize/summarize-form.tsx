'use client';
import { useState } from 'react';
import { summarizePatientRecord, SummarizePatientRecordOutput } from '@/ai/flows/summarize-patient-record';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Wand2, Hospital, Stethoscope, Pill, FileText, Banknote, User } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const exampleRecord = `Patient: Jane Doe, DOB: 1985-05-15

Presenting Complaint:
Patient presents with a 3-day history of intermittent, sharp chest pain, radiating to the left arm. Pain is exacerbated by exertion and relieved by rest. Patient also reports shortness of breath.

Past Medical History:
- Hypertension, diagnosed 2018, managed with Lisinopril 10mg daily by Dr. Evans.
- Type 2 Diabetes Mellitus, diagnosed 2020, managed with Metformin 500mg BID by Dr. Smith.
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

Visit History:
- 2024-07-21: Admitted to City General Hospital for acute chest pain.

Assessment & Plan:
1. Acute Chest Pain: Likely angina pectoris given risk factors. Rule out Acute Coronary Syndrome.
   - Admit to telemetry unit.
   - Serial Troponins and EKGs.
   - Start Aspirin 325mg.
   - Start Nitroglycerin paste.
   - Cardiology consult with Dr. Evans.
2. Hypertension: Continue Lisinopril. Monitor BP.
3. Type 2 Diabetes: Continue Metformin. Monitor glucose.

Billing Information:
- Insurance Provider: Blue Shield PPO
`;


export function SummarizeForm() {
  const [patientRecord, setPatientRecord] = useState('');
  const [result, setResult] = useState<SummarizePatientRecordOutput | null>(null);
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
    setResult(null);
    try {
      const apiResult = await summarizePatientRecord({ patientRecord });
      setResult(apiResult);
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
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card className="lg:col-span-1">
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
              className="min-h-[400px] text-sm lg:min-h-[600px]"
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

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>AI-Generated Summary</CardTitle>
          <CardDescription>A structured overview of the patient record.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-auto rounded-md border bg-secondary/50 p-4 lg:min-h-[668px]">
            {isLoading ? (
              <div className="flex items-center justify-center h-full min-h-[400px]">
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <Loader2 className="h-8 w-8 animate-spin" />
                  <p>Generating summary...</p>
                </div>
              </div>
            ) : result ? (
              <ScrollArea className="h-full max-h-[calc(100vh-20rem)]">
                <div className="space-y-6 pr-4">
                  <div>
                    <h3 className="font-semibold text-lg font-headline flex items-center gap-2"><User />Quick Summary</h3>
                    <p className="text-sm text-muted-foreground mt-1">{result.summary}</p>
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg font-headline flex items-center gap-2"><Banknote/>Billing</h3>
                    <div className="flex items-center gap-4 text-sm">
                      <Badge variant="outline">{result.billing.paymentMethod}</Badge>
                      <p className="text-muted-foreground">{result.billing.details}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg font-headline flex items-center gap-2"><Hospital/>Hospital Visits</h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Hospital</TableHead>
                          <TableHead>Reason</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {result.hospitalVisits.map((visit, i) => (
                          <TableRow key={i}>
                            <TableCell>{visit.date}</TableCell>
                            <TableCell>{visit.hospital}</TableCell>
                            <TableCell>{visit.reason}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg font-headline flex items-center gap-2"><Stethoscope/>Treating Doctors</h3>
                     <div className="flex flex-wrap gap-2">
                        {result.treatingDoctors.map((doc, i) => (
                          <Badge key={i} variant="secondary">{doc.name} ({doc.specialty})</Badge>
                        ))}
                      </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg font-headline flex items-center gap-2"><FileText/>Diagnoses</h3>
                    <Table>
                      <TableHeader><TableRow><TableHead>Date</TableHead><TableHead>Diagnosis</TableHead></TableRow></TableHeader>
                      <TableBody>
                        {result.diagnoses.map((diag, i) =>(
                          <TableRow key={i}><TableCell>{diag.date}</TableCell><TableCell>{diag.diagnosis}</TableCell></TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg font-headline flex items-center gap-2"><Pill/>Medications</h3>
                     <Table>
                      <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Dosage</TableHead><TableHead>Frequency</TableHead></TableRow></TableHeader>
                      <TableBody>
                        {result.medications.map((med, i) => (
                          <TableRow key={i}><TableCell>{med.name}</TableCell><TableCell>{med.dosage}</TableCell><TableCell>{med.frequency}</TableCell></TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                </div>
              </ScrollArea>
            ) : (
              <div className="flex items-center justify-center h-full min-h-[400px] text-center text-muted-foreground">
                <p>The summary will appear here once generated.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
