'use server';

/**
 * @fileOverview AI-powered appointment scheduler.
 *
 * - optimizeAppointmentScheduling - A function that handles the appointment scheduling process.
 * - OptimizeAppointmentSchedulingInput - The input type for the optimizeAppointmentScheduling function.
 * - OptimizeAppointmentSchedulingOutput - The return type for the optimizeAppointmentScheduling function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const OptimizeAppointmentSchedulingInputSchema = z.object({
  patientHistory: z
    .string()
    .describe('The patient medical history.'),
  physicianAvailability: z
    .string()
    .describe('The availability of the physician.'),
  resourceAllocation: z
    .string()
    .describe('The resource allocation for the appointment.'),
  appointmentPreferences: z
    .string()
    .describe('Any specific appointment preferences the patient may have.'),
});
export type OptimizeAppointmentSchedulingInput = z.infer<
  typeof OptimizeAppointmentSchedulingInputSchema
>;

const OptimizeAppointmentSchedulingOutputSchema = z.object({
  optimizedSchedule: z.string().describe('The optimized appointment schedule.'),
  justification: z.string().describe('Explanation of why the schedule was optimized this way.'),
});
export type OptimizeAppointmentSchedulingOutput = z.infer<
  typeof OptimizeAppointmentSchedulingOutputSchema
>;

export async function optimizeAppointmentScheduling(
  input: OptimizeAppointmentSchedulingInput
): Promise<OptimizeAppointmentSchedulingOutput> {
  return optimizeAppointmentSchedulingFlow(input);
}

const prompt = ai.definePrompt({
  name: 'optimizeAppointmentSchedulingPrompt',
  input: {schema: OptimizeAppointmentSchedulingInputSchema},
  output: {schema: OptimizeAppointmentSchedulingOutputSchema},
  prompt: `You are an AI assistant that optimizes hospital appointment schedules.

  Given the following information, create an optimized appointment schedule:

  Patient History: {{{patientHistory}}}
  Physician Availability: {{{physicianAvailability}}}
  Resource Allocation: {{{resourceAllocation}}}
  Appointment Preferences: {{{appointmentPreferences}}}

  Provide the optimized schedule and a brief justification for the schedule.
  Follow the structure of OptimizeAppointmentSchedulingOutputSchema in your output.`,
});

const optimizeAppointmentSchedulingFlow = ai.defineFlow(
  {
    name: 'optimizeAppointmentSchedulingFlow',
    inputSchema: OptimizeAppointmentSchedulingInputSchema,
    outputSchema: OptimizeAppointmentSchedulingOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
