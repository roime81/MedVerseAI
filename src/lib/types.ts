// Type definitions for your data models

export interface Patient {
    id: string;
    personId: string;
    nationalId?: string;
    fullName: string;
    dateOfBirth: string;
    gender?: string;
    race?: string;
    ethnicity?: string;
    maritalStatus?: string;
    contactInfo?: string;
    address?: string;
    emergencyContact?: string;
    primaryProviderId?: string;
    insuranceNumber?: string;
    allergyFlag?: string;
    activeProblemList?: string;
    lastSeen?: string;
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
  initials: string;
  name: string;
  lastSeen: string;
  conditions: string[];
  alerts: number;
}
