import { config } from 'dotenv';
config();

import '@/ai/flows/summarize-patient-record.ts';
import '@/ai/flows/optimize-appointment-scheduling.ts';
import '@/ai/flows/analyze-drug-interactions.ts';
