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
      "A concise summary of the patient's overall health status. If multiple patient records are provided, this should be an error message stating that only one record can be processed at a time."
    ),
  hospitalVisits: z.array(z.object({
    date: z.string().describe("Date of the visit."),
    hospital: z.string().describe("Name of the hospital."),
    reason: z.string().describe("Reason for the visit."),
  })).describe("A list of the patient's hospital visits."),
  treatingDoctors: z.array(z.object({
    name: z.string().describe("Name of the doctor."),
    specialty: z.string().describe("The doctor's specialty."),
  })).describe("A list of doctors who have treated the patient."),
  medications: z.array(z.object({
    name: z.string().describe("Name of the medication."),
    dosage: z.string().describe("Dosage of the medication."),
    frequency: z.string().describe("How often the medication is taken."),
  })).describe("A list of the patient's medications."),
  diagnoses: z.array(z.object({
    diagnosis: z.string().describe("The diagnosis."),
    date: z.string().describe("Date of diagnosis."),
  })).describe("A list of the patient's diagnoses."),
    billing: z.object({
    paymentMethod: z.enum(["Insurance", "Cash", "Unknown"]).describe("The method of payment (Insurance or Cash)."),
    details: z.string().describe("Details about the billing, such as insurance provider or payment status."),
  }).describe("Billing and payment information."),
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
  prompt: `You are an expert medical summarizer. Your task is to process a single patient's medical record and extract structured information.

  - If the input contains a single patient record, summarize it, highlighting key medical history, diagnoses, and treatment plans.
  - Extract detailed information about hospital visits, treating doctors, medications, diagnoses, and billing.
  - If the input appears to contain records for more than one patient, you MUST respond with an error message in the summary field.
  - Determine payment method from context. If not specified, default to "Unknown".

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
