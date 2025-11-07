'use server';

/**
 * @fileOverview AI-powered drug interaction analysis.
 *
 * - analyzeDrugInteractions - A function that analyzes potential drug interactions.
 * - AnalyzeDrugInteractionsInput - The input type for the function.
 * - AnalyzeDrugInteractionsOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeDrugInteractionsInputSchema = z.object({
  currentMedications: z
    .array(z.string())
    .describe("A list of the patient's current active medications, including name and dosage."),
  newMedication: z
    .string()
    .describe('The new medication to be added, including name and dosage.'),
});
export type AnalyzeDrugInteractionsInput = z.infer<
  typeof AnalyzeDrugInteractionsInputSchema
>;

const AnalyzeDrugInteractionsOutputSchema = z.object({
  riskLevel: z
    .enum(['None', 'Low', 'Moderate', 'High'])
    .describe('The overall risk level of adding the new medication.'),
  summary: z
    .string()
    .describe('A concise, one-sentence summary of the findings.'),
  details: z
    .string()
    .describe('A detailed explanation of any potential interactions, contraindications, or dosage concerns. If none, state that clearly.'),
});
export type AnalyzeDrugInteractionsOutput = z.infer<
  typeof AnalyzeDrugInteractionsOutputSchema
>;

export async function analyzeDrugInteractions(
  input: AnalyzeDrugInteractionsInput
): Promise<AnalyzeDrugInteractionsOutput> {
  return analyzeDrugInteractionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeDrugInteractionsPrompt',
  input: {schema: AnalyzeDrugInteractionsInputSchema},
  output: {schema: AnalyzeDrugInteractionsOutputSchema},
  prompt: `You are an expert clinical pharmacist AI. Your task is to analyze a patient's medication list for potential drug-drug interactions when adding a new medication.

  You must assess the risk and provide a clear, structured analysis.

  Patient's Current Medications:
  {{#each currentMedications}}- {{{this}}}
  {{/each}}

  New Medication to Add:
  - {{{newMedication}}}

  Analyze for:
  1.  **Pharmacokinetic interactions** (absorption, distribution, metabolism, excretion).
  2.  **Pharmacodynamic interactions** (additive, synergistic, or antagonistic effects).
  3.  **Contraindications** based on the combination of drugs.
  4.  **Dosage adjustments** that might be necessary.
  5.  **QT prolongation** risks or other significant adverse effects.

  Based on your analysis, determine the overall risk level ('None', 'Low', 'Moderate', 'High') and provide a concise summary and detailed explanation. If there are no significant interactions, state that clearly.
  `,
});

const analyzeDrugInteractionsFlow = ai.defineFlow(
  {
    name: 'analyzeDrugInteractionsFlow',
    inputSchema: AnalyzeDrugInteractionsInputSchema,
    outputSchema: AnalyzeDrugInteractionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
