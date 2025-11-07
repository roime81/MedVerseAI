export const samplePatients = [
  {
    personId: '1',
    genderConceptId: 'M',
    yearOfBirth: 1985,
    monthOfBirth: 5,
    dayOfBirth: 15,
    raceConceptId: 'White',
    ethnicityConceptId: 'Not Hispanic',
    locationId: '101',
    providerId: '11',
    careSiteId: '1',
  },
  {
    personId: '2',
    genderConceptId: 'F',
    yearOfBirth: 1992,
    monthOfBirth: 8,
    dayOfBirth: 22,
    raceConceptId: 'Black',
    ethnicityConceptId: 'Not Hispanic',
    locationId: '102',
    providerId: '12',
    careSiteId: '1',
  },
];

export const sampleEncounters = [
  {
    visitOccurrenceId: '101',
    personId: '1',
    visitConceptId: 'Outpatient',
    visitStartDatetime: '2023-01-10T09:00:00Z',
    visitEndDatetime: '2023-01-10T09:45:00Z',
    careSiteId: '1',
  },
  {
    visitOccurrenceId: '102',
    personId: '2',
    visitConceptId: 'Inpatient',
    visitStartDatetime: '2023-02-15T11:00:00Z',
    visitEndDatetime: '2023-02-20T17:00:00Z',
    careSiteId: '1',
  },
];

export const sampleConditions = [
  {
    conditionOccurrenceId: '201',
    personId: '1',
    conditionConceptId: 'Hypertension',
    conditionStartDate: '2022-05-20',
    conditionEndDate: '',
  },
  {
    conditionOccurrenceId: '202',
    personId: '2',
    conditionConceptId: 'Type 2 Diabetes',
    conditionStartDate: '2021-11-30',
    conditionEndDate: '',
  },
];

export const sampleObservations = [
  {
    observationId: '301',
    personId: '1',
    observationConceptId: 'Smoking status',
    observationDate: '2023-01-10',
    valueAsString: 'Former smoker',
  },
  {
    observationId: '302',
    personId: '2',
    observationConceptId: 'Family history of heart disease',
    observationDate: '2023-02-15',
    valueAsString: 'Yes',
  },
];

export const sampleMeasurements = [
  {
    measurementId: '401',
    personId: '1',
    measurementConceptId: 'Blood Pressure',
    measurementDatetime: '2023-01-10T09:15:00Z',
    valueAsNumber: 140,
    unitConceptId: 'mmHg',
  },
  {
    measurementId: '402',
    personId: '2',
    measurementConceptId: 'HbA1c',
    measurementDatetime: '2023-02-15T11:30:00Z',
    valueAsNumber: 7.5,
    unitConceptId: '%',
  },
];

export const sampleDrugExposures = [
  {
    drugExposureId: '501',
    personId: '1',
    drugConceptId: 'Lisinopril',
    drugExposureStartDatetime: '2022-05-20T08:00:00Z',
    drugExposureEndDatetime: '',
    doseUnitConceptId: 'mg',
  },
  {
    drugExposureId: '502',
    personId: '2',
    drugConceptId: 'Metformin',
    drugExposureStartDatetime: '2021-11-30T09:00:00Z',
    drugExposureEndDatetime: '',
    doseUnitConceptId: 'mg',
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
