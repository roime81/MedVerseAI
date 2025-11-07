'use server';

/**
 * @fileOverview Summarizes patient records for quick review.
 *
 * - summarizePatientRecord - A function that summarizes patient records.
 * - SummarizePatientRecordInput - The input type for the summarizePatientRecord function.
 * - SummarizePatientRecordOutput - The return type for the summarizePatientRecord function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizePatientRecordInputSchema = z.object({
  patientRecord: z
    .string()
    .describe('The full medical record of the patient to summarize.'),
});
export type SummarizePatientRecordInput = z.infer<typeof SummarizePatientRecordInputSchema>;

const SummarizePatientRecordOutputSchema = z.object({
  summary: z
    .string()
    .describe(
      'A concise summary of the patient medical history, key diagnoses, and treatment plans.'
    ),
});
export type SummarizePatientRecordOutput = z.infer<typeof SummarizePatientRecordOutputSchema>;

export async function summarizePatientRecord(
  input: SummarizePatientRecordInput
): Promise<SummarizePatientRecordOutput> {
  return summarizePatientRecordFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizePatientRecordPrompt',
  input: {schema: SummarizePatientRecordInputSchema},
  output: {schema: SummarizePatientRecordOutputSchema},
  prompt: `You are an expert medical summarizer. Please summarize the following patient record, highlighting key medical history, diagnoses, and treatment plans.\n\nPatient Record: {{{patientRecord}}}`,
});

const summarizePatientRecordFlow = ai.defineFlow(
  {
    name: 'summarizePatientRecordFlow',
    inputSchema: SummarizePatientRecordInputSchema,
    outputSchema: SummarizePatientRecordOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
