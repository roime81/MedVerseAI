'use server';

/**
 * @fileOverview Summarizes a single patient record for quick review.
 *
 * - summarizePatientRecord - A function that summarizes a patient record.
 * - SummarizePatientRecordInput - The input type for the summarizePatientRecord function.
 * - SummarizePatientRecordOutput - The return type for the summarizePatientRecord function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizePatientRecordInputSchema = z.object({
  patientRecord: z
    .string()
    .describe('The full medical record of a single patient to summarize.'),
});
export type SummarizePatientRecordInput = z.infer<typeof SummarizePatientRecordInputSchema>;

const SummarizePatientRecordOutputSchema = z.object({
  summary: z
    .string()
    .describe(
      'A concise summary of the patient medical history, key diagnoses, and treatment plans. If multiple patient records are provided, this should be an error message stating that only one record can be processed at a time.'
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
  prompt: `You are an expert medical summarizer. Your task is to process a single patient's medical record.

  - If the input contains a single patient record, summarize it, highlighting key medical history, diagnoses, and treatment plans.
  - If the input appears to contain records for more than one patient, you MUST respond with an error message: "Please submit only one patient record at a time."

  Patient Record: {{{patientRecord}}}`,
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
