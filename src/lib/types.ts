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

export interface Encounter {
    id: string;
    encounterId: string;
    personId: string;
    facilityId?: string;
    encounterType?: string;
    admissionDatetime: string;
    dischargeDatetime?: string;
    attendingProviderId?: string;
    visitReason?: string;
    visitStatus?: 'Scheduled' | 'In Progress' | 'Completed' | 'Waiting' | 'Cancelled';
}

// Add other type definitions as needed, e.g., for User, Condition, etc.
