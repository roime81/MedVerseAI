export const samplePatients = [
  {
    personId: '1',
    nationalId: '123-456-7890',
    fullName: 'John Doe',
    dateOfBirth: '1985-05-15',
    gender: 'Male',
    race: 'White',
    ethnicity: 'Not Hispanic',
    maritalStatus: 'Married',
    contactInfo: 'j.doe@email.com',
    address: '123 Main St, Anytown, USA',
    emergencyContact: 'Jane Doe, Spouse, 555-1234',
    primaryProviderId: '11',
    insuranceNumber: 'UHC12345',
    allergyFlag: 'Penicillin',
    activeProblemList: 'Hypertension',
  },
  {
    personId: '2',
    nationalId: '987-654-3210',
    fullName: 'Jane Smith',
    dateOfBirth: '1992-08-22',
    gender: 'Female',
    race: 'Black',
    ethnicity: 'Not Hispanic',
    maritalStatus: 'Single',
    contactInfo: 'j.smith@email.com',
    address: '456 Oak Ave, Anytown, USA',
    emergencyContact: 'John Smith, Father, 555-5678',
    primaryProviderId: '12',
    insuranceNumber: 'BCBS67890',
    allergyFlag: 'None',
    activeProblemList: 'Type 2 Diabetes',
  },
];

export const sampleEncounters = [
  {
    encounterId: '101',
    personId: '1',
    facilityId: 'HOS-001',
    encounterType: 'Outpatient',
    admissionDatetime: '2023-01-10T09:00:00Z',
    dischargeDatetime: '2023-01-10T09:45:00Z',
    attendingProviderId: '11',
    visitReason: 'Annual Check-up',
    visitStatus: 'Discharged',
  },
  {
    encounterId: '102',
    personId: '2',
    facilityId: 'HOS-001',
    encounterType: 'Inpatient',
    admissionDatetime: '2023-02-15T11:00:00Z',
    dischargeDatetime: '2023-02-20T17:00:00Z',
    attendingProviderId: '12',
    visitReason: 'Pneumonia',
    visitStatus: 'Discharged',
  },
];

export const sampleConditions = [
  {
    diagnosisId: '201',
    personId: '1',
    encounterId: '101',
    icd10Code: 'I10',
    diagnosisType: 'Principal',
    onsetDate: '2022-05-20',
    resolutionDate: '',
    status: 'Active',
    certainty: 'Confirmed',
  },
  {
    diagnosisId: '202',
    personId: '2',
    encounterId: '102',
    icd10Code: 'E11.9',
    diagnosisType: 'Principal',
    onsetDate: '2021-11-30',
    resolutionDate: '',
    status: 'Active',
    certainty: 'Confirmed',
  },
];

export const sampleDrugExposures = [
  {
    medicationId: '501',
    personId: '1',
    encounterId: '101',
    drugCode: 'RxNorm:856335',
    drugName: 'Lisinopril 10 MG Oral Tablet',
    dose: '10mg',
    startDate: '2022-05-20T08:00:00Z',
    endDate: '',
    prescribingPhysicianId: '11',
    dispenseStatus: 'Dispensed',
  },
  {
    medicationId: '502',
    personId: '2',
    encounterId: '102',
    drugCode: 'RxNorm:860975',
    drugName: 'Metformin 500 MG Oral Tablet',
    dose: '500mg',
    startDate: '2021-11-30T09:00:00Z',
    endDate: '',
    prescribingPhysicianId: '12',
    dispenseStatus: 'Dispensed',
  },
];

export const sampleBeds = [
  {
    bedId: 'B-101-A',
    location: 'Ward A, Room 101',
    status: 'Occupied',
    patientId: '2',
    careSiteId: '1',
  },
  {
    bedId: 'B-101-B',
    location: 'Ward A, Room 101',
    status: 'Available',
    patientId: null,
    careSiteId: '1',
  },
  {
    bedId: 'B-102-A',
    location: 'Ward A, Room 102',
    status: 'Maintenance',
    patientId: null,
    careSiteId: '1',
  },
  {
    bedId: 'C-201-A',
    location: 'Ward C, Room 201',
    status: 'Available',
    patientId: null,
    careSiteId: '1',
  },
];

export const sampleCareSites = [
  { careSiteId: 'HOS-001', careSiteName: 'General Hospital' },
  { careSiteId: 'HOS-002', careSiteName: 'City Medical Center' },
  { careSiteId: 'HOS-003', careSiteName: 'Sunrise Community Clinic' },
  { careSiteId: 'HOS-004', careSiteName: 'Hopewell Children\'s Hospital' },
  { careSiteId: 'HOS-005', careSiteName: 'Evergreen Surgical Center' },
  { careSiteId: 'HOS-006', careSiteName: 'Westside Regional Hospital' },
  { careSiteId: 'HOS-007', careSiteName: 'North Valley Medical Group' },
  { careSiteId: 'HOS-008', careSiteName: 'Bayview Mental Health Institute' },
  { careSiteId: 'HOS-009', careSiteName: 'Mountain Ridge Cancer Center' },
  { careSiteId: 'HOS-010', careSiteName: 'Riverside Rehabilitation Hospital' },
];

export const sampleCosts = [
  {
    chargeId: 'C-001',
    personId: '1',
    encounterId: '101',
    serviceCode: '99213',
    description: 'Office Visit Level 3',
    totalCharge: 150.0,
    patientResponsibility: 30.0,
    paymentStatus: 'Paid',
    claimId: 'CLAIM-101-1',
  },
  {
    chargeId: 'C-002',
    personId: '2',
    encounterId: '102',
    serviceCode: 'DRG-194',
    description: 'Inpatient Stay - Simple Pneumonia',
    totalCharge: 12500.0,
    patientResponsibility: 2500.0,
    paymentStatus: 'Pending',
    claimId: 'CLAIM-102-1',
  },
];

export const samplePayerPlanPeriods = [
  {
    planId: 'PPP-001',
    personId: '1',
    payerId: 'Payer-UHC',
    coverageStartDate: '2023-01-01',
    coverageEndDate: '2023-12-31',
    policyNumber: 'UHC12345',
  },
  {
    planId: 'PPP-002',
    personId: '2',
    payerId: 'Payer-BCBS',
    coverageStartDate: '2023-01-01',
    coverageEndDate: '2023-12-31',
    policyNumber: 'BCBS67890',
  },
];

export const sampleVisitDetails = [
  {
    visitDetailId: 'VD-001',
    personId: '1',
    encounterId: '101',
    serviceCode: '99213',
    serviceDate: '2023-01-10',
  },
  {
    visitDetailId: 'VD-002',
    personId: '2',
    encounterId: '102',
    serviceCode: '99223',
    serviceDate: '2023-02-15',
  },
  {
    visitDetailId: 'VD-003',
    personId: '2',
    encounterId: '102',
    serviceCode: '71045',
    serviceDate: '2023-02-16',
  },
];

export const sampleClinicalNotes = [
    {
        noteId: "CN-001",
        encounterId: "101",
        authorId: "11",
        noteType: "SOAP",
        noteText: "Patient presents for annual check-up. Reports feeling well. No new complaints. Vitals stable.",
        dateTimeCreated: "2023-01-10T09:30:00Z"
    },
    {
        noteId: "CN-002",
        encounterId: "102",
        authorId: "12",
        noteType: "Admission Note",
        noteText: "Patient admitted with fever, cough, and shortness of breath. Chest X-ray confirms pneumonia. Starting IV antibiotics.",
        dateTimeCreated: "2023-02-15T11:45:00Z"
    }
];

export const sampleProcedures = [
    {
        procedureId: "PROC-001",
        personId: "2",
        encounterId: "102",
        procedureCode: "CPT:31500",
        procedureName: "Emergency endotracheal intubation",
        procedureDateTime: "2023-02-15T12:00:00Z",
        performingClinicianId: "12"
    }
];

export const sampleLabResults = [
    {
        labOrderId: "LAB-001",
        personId: "1",
        encounterId: "101",
        testCode: "LOINC:1751-7",
        resultValue: "4.8 %",
        resultDate: "2023-01-10T10:00:00Z",
        resultFlag: "Normal"
    },
    {
        labOrderId: "LAB-002",
        personId: "2",
        encounterId: "102",
        testCode: "LOINC:6690-2",
        resultValue: "15.2 K/uL",
        resultDate: "2023-02-15T11:15:00Z",
        resultFlag: "High"
    }
];

export const sampleImagingStudies = [
    {
        imagingOrderId: "IMG-001",
        personId: "2",
        encounterId: "102",
        modality: "X-ray",
        procedureCode: "LOINC:24627-2",
        impression: "Right lower lobe infiltrate consistent with pneumonia."
    }
];
