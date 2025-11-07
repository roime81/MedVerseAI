'use client';
import { useState } from 'react';
import { optimizeAppointmentScheduling } from '@/ai/flows/optimize-appointment-scheduling';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Wand2 } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';

export function ScheduleForm() {
  const [formState, setFormState] = useState({
    patientHistory: 'Previous cardiac patient, requires follow-up with cardiologist. Prefers morning appointments.',
    physicianAvailability: 'Dr. Evans (Cardiologist): Mon 9am-12pm, Wed 2pm-5pm. Dr. Smith (General): Available all week.',
    resourceAllocation: 'Cardiology Clinic Room 1 is equipped for ECG. Room 2 is standard consult. Ultrasound room available Mon AM.',
    appointmentPreferences: 'As soon as possible, morning preferred.',
  });
  const [result, setResult] = useState<{ optimizedSchedule: string; justification: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (Object.values(formState).some(val => !val.trim())) {
      toast({
        title: 'Error',
        description: 'All fields are required.',
        variant: 'destructive',
      });
      return;
    }
    setIsLoading(true);
    setResult(null);
    try {
      const apiResult = await optimizeAppointmentScheduling(formState);
      setResult(apiResult);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error Optimizing Schedule',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Scheduling Parameters</CardTitle>
          <CardDescription>Provide details to generate an optimized schedule.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="patientHistory">Patient History</Label>
              <Textarea
                id="patientHistory"
                name="patientHistory"
                value={formState.patientHistory}
                onChange={handleInputChange}
                disabled={isLoading}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="physicianAvailability">Physician Availability</Label>
              <Textarea
                id="physicianAvailability"
                name="physicianAvailability"
                value={formState.physicianAvailability}
                onChange={handleInputChange}
                disabled={isLoading}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="resourceAllocation">Resource Allocation</Label>
              <Textarea
                id="resourceAllocation"
                name="resourceAllocation"
                value={formState.resourceAllocation}
                onChange={handleInputChange}
                disabled={isLoading}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="appointmentPreferences">Appointment Preferences</Label>
              <Textarea
                id="appointmentPreferences"
                name="appointmentPreferences"
                value={formState.appointmentPreferences}
                onChange={handleInputChange}
                disabled={isLoading}
                rows={2}
              />
            </div>
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Optimizing...
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-4 w-4" />
                  Optimize Schedule
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Optimized Schedule</CardTitle>
          <CardDescription>AI-generated appointment proposal.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[520px] rounded-md border bg-secondary/50 p-4">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <Loader2 className="h-8 w-8 animate-spin" />
                  <p>Generating schedule...</p>
                </div>
              </div>
            ) : result ? (
              <ScrollArea className="h-full">
                <div className="space-y-4 pr-4">
                  <div>
                    <h3 className="font-semibold text-lg font-headline">Proposed Schedule</h3>
                    <p className="whitespace-pre-wrap text-sm">{result.optimizedSchedule}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg font-headline mt-4">Justification</h3>
                    <p className="whitespace-pre-wrap text-sm text-muted-foreground">{result.justification}</p>
                  </div>
                </div>
              </ScrollArea>
            ) : (
              <div className="flex items-center justify-center h-full text-center text-muted-foreground">
                <p>The optimized schedule will appear here.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
