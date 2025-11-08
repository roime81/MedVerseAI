// Type definitions for your data models
import type { Patient as PatientSchema, Encounter, Condition as ConditionSchema, PendingTask as PendingTaskSchema } from "@/lib/schemas";


export interface Patient extends PatientSchema {
    id: string;
    lastSeen?: string;
    conditions?: Condition[];
    alerts?: number;
    initials?: string;
    name?: string;
    age?: number;
    reason?: string;
}

export interface Appointment {
  time: string;
  patient: Patient;
  status: 'Completed' | 'In Progress' | 'Waiting' | 'Scheduled';
}

export interface PendingTask extends PendingTaskSchema {
  priority: 'High' | 'Medium' | 'Low';
}

export interface RecentPatient {
  id: string;
  initials: string;
  name: string;
  lastSeen: string;
  conditions: string[];
  alerts: number;
}

export interface Condition extends ConditionSchema {}
