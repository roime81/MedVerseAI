'use server';
/**
 * @fileOverview A patient chart summarization AI agent.
 *
 * - summarizePatientChart - A function that handles the patient chart summarization process.
 * - SummarizePatientChartInput - The input type for the summarizePatientChart function.
 * - SummarizePatientChartOutput - The return type for the summarizePatientChart function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';
import {
  PatientSchema,
  ConditionSchema,
  DrugExposureSchema,
  ClinicalNoteSchema,
} from '@/lib/schemas';

export const SummarizePatientChartInputSchema = z.object({
  patient: PatientSchema,
  conditions: z.array(ConditionSchema).optional(),
  medications: z.array(DrugExposureSchema).optional(),
  recentNotes: z.array(ClinicalNoteSchema).optional(),
});
export type SummarizePatientChartInput = z.infer<
  typeof SummarizePatientChartInputSchema
>;

export const SummarizePatientChartOutputSchema = z.string();
export type SummarizePatientChartOutput = z.infer<
  typeof SummarizePatientChartOutputSchema
>;

// New internal schema for the prompt
const PromptInputSchema = SummarizePatientChartInputSchema.extend({
    age: z.number().optional(),
});

export async function summarizePatientChart(
  input: SummarizePatientChartInput
): Promise<SummarizePatientChartOutput> {
  return await summarizePatientChartFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizePatientChartPrompt',
  input: {schema: PromptInputSchema},
  output: {format: 'text'},
  prompt: `You are an expert medical AI assistant. Your task is to generate a concise, clinical summary of a patient's chart for a busy healthcare professional.
Focus on the most critical information.

PATIENT DEMOGRAPHICS:
- Name: {{{patient.fullName}}}
- Age: {{age}}
- Gender: {{{patient.gender}}}

ALLERGIES:
- {{{patient.allergyFlag}}}

ACTIVE CONDITIONS:
{{#if conditions}}
  {{#each conditions}}
  - {{{this.icd10Code}}} (Status: {{{this.status}}}, Onset: {{{this.onsetDate}}})
  {{/each}}
{{else}}
- None listed.
{{/if}}

CURRENT MEDICATIONS:
{{#if medications}}
  {{#each medications}}
  - {{{this.drugName}}} (Dose: {{{this.dose}}})
  {{/each}}
{{else}}
- None listed.
{{/if}}

RECENT CLINICAL NOTES:
{{#if recentNotes}}
  {{#each recentNotes}}
  - Note by {{{this.authorId}}} on {{{this.dateTimeCreated}}}: {{{this.noteText}}}
  {{/each}}
{{else}}
- None available.
{{/if}}

Based on the information above, provide a summary covering:
1. A brief one-sentence patient descriptor.
2. Key active medical problems.
3. Important medications and allergies.
4. Any urgent considerations from recent notes.

Keep the summary clear, structured, and under 150 words.
`,
});

const summarizePatientChartFlow = ai.defineFlow(
  {
    name: 'summarizePatientChartFlow',
    inputSchema: SummarizePatientChartInputSchema,
    outputSchema: SummarizePatientChartOutputSchema,
  },
  async (input) => {
    const calculateAge = (dob: string) => {
      if (!dob) return undefined;
      const birthDate = new Date(dob);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return age;
    };

    const age = calculateAge(input.patient.dateOfBirth);
    
    const {text} = await prompt({...input, age});
    return text;
  }
);
