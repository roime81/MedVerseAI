// Type definitions for your data models
import type { Patient as PatientSchema, Encounter, Condition } from "@/lib/schemas";


export interface Patient extends PatientSchema {
    id: string;
    lastSeen?: string;
    conditions?: Condition[];
    alerts?: number;
    initials?: string;
}

export interface Appointment {
  time: string;
  patient: {
    initials: string;
    name: string;
    age: number;
    reason: string;
  };
  status: 'Completed' | 'In Progress' | 'Waiting' | 'Scheduled';
}

export interface PendingTask {
  description: string;
  time: string;
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
