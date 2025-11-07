import { faker } from '@faker-js/faker';

// Static base data
const baseUsers = [
    // Doctors
    {
        email: 'emily.carter@medverse.com',
        password: 'password',
        role: 'physician',
        displayName: 'Dr. Emily Carter',
        id: 'dr_emily_carter'
    },
    {
        email: 'ben.stone@medverse.com',
        password: 'password',
        role: 'physician',
        displayName: 'Dr. Ben Stone',
        id: 'dr_ben_stone'
    },
    // Nurses
    {
        email: 'olivia.rodriguez@medverse.com',
        password: 'password',
        role: 'nurse',
        displayName: 'Olivia Rodriguez, RN',
        id: 'olivia_rodriguez_rn'
    },
    // Admin
    {
        email: 'super.admin@medverse.com',
        password: 'password',
        role: 'admin',
        displayName: 'Super Admin',
        id: 'super_admin'
    },
];

const careSites = [
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

const physicians = baseUsers.filter(u => u.role === 'physician');

// Helper function to get a random item from an array
const getRandomItem = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)];


// --- DYNAMIC DATA GENERATION ---

const generatePatients = (count: number) => {
    const patients = [];
    for (let i = 0; i < count; i++) {
        const gender = faker.person.sexType();
        const fullName = faker.person.fullName({ sex: gender });
        patients.push({
            personId: faker.string.uuid(),
            nationalId: faker.string.nanoid(10),
            fullName: fullName,
            dateOfBirth: faker.date.birthdate({ min: 18, max: 85, mode: 'age' }).toISOString().split('T')[0],
            gender: gender.charAt(0).toUpperCase() + gender.slice(1),
            race: faker.helpers.arrayElement(['White', 'Black', 'Asian', 'Hispanic', 'Other']),
            ethnicity: 'Not Hispanic',
            maritalStatus: faker.helpers.arrayElement(['Married', 'Single', 'Divorced', 'Widowed']),
            contactInfo: faker.internet.email({firstName: fullName.split(' ')[0], lastName: fullName.split(' ')[1]}),
            address: faker.location.streetAddress(true),
            emergencyContact: `${faker.person.fullName()}, ${faker.helpers.arrayElement(['Spouse', 'Parent', 'Sibling', 'Friend'])}, ${faker.phone.number()}`,
            primaryProviderId: getRandomItem(physicians).id,
            insuranceNumber: `INS-${faker.string.alphanumeric(8).toUpperCase()}`,
            allergyFlag: faker.helpers.arrayElement(['None', 'Penicillin', 'Sulfa', 'Aspirin', 'Shellfish']),
            activeProblemList: '', // Will be populated later
        });
    }
    return patients;
};

const generateEncounters = (patients: any[]) => {
    const encounters: any[] = [];
    patients.forEach(patient => {
        const numEncounters = faker.number.int({ min: 2, max: 8 });
        const patientCareSites = new Set<string>();
        while(patientCareSites.size < 2) {
            patientCareSites.add(getRandomItem(careSites).careSiteId);
        }

        for (let i = 0; i < numEncounters; i++) {
            const admissionDate = faker.date.past({ years: 3 });
            const dischargeDate = new Date(admissionDate.getTime() + faker.number.int({ min: 1, max: 14 }) * 24 * 60 * 60 * 1000);
            encounters.push({
                encounterId: faker.string.uuid(),
                personId: patient.personId,
                facilityId: getRandomItem(Array.from(patientCareSites)),
                encounterType: faker.helpers.arrayElement(['Inpatient', 'Outpatient', 'Emergency', 'Telehealth']),
                admissionDatetime: admissionDate.toISOString(),
                dischargeDatetime: dischargeDate.toISOString(),
                attendingProviderId: getRandomItem(physicians).id,
                visitReason: faker.helpers.arrayElement(['Annual Check-up', 'Follow-up', 'New Complaint', 'Injury', 'Chronic Condition Management']),
                visitStatus: 'Discharged',
            });
        }
    });
    return encounters;
};

const generateConditions = (patients: any[], encounters: any[]) => {
    const conditions: any[] = [];
    const icd10Codes = [
        { code: 'I10', desc: 'Hypertension' }, { code: 'E11.9', desc: 'Type 2 Diabetes' }, { code: 'J45.909', desc: 'Asthma' },
        { code: 'F33.1', desc: 'Depression' }, { code: 'M10.00', desc: 'Gout' }, { code: 'I25.10', desc: 'Coronary Artery Disease' }
    ];
    patients.forEach(patient => {
        const numConditions = faker.number.int({ min: 1, max: 4 });
        const patientEncounters = encounters.filter(e => e.personId === patient.personId);
        for (let i = 0; i < numConditions; i++) {
            const icd10 = getRandomItem(icd10Codes);
            const encounter = getRandomItem(patientEncounters);
            conditions.push({
                diagnosisId: faker.string.uuid(),
                personId: patient.personId,
                encounterId: encounter.encounterId,
                icd10Code: icd10.code,
                diagnosisType: 'Principal',
                onsetDate: faker.date.past({ years: 5 }).toISOString().split('T')[0],
                status: 'Active',
                certainty: 'Confirmed',
            });
        }
    });
    return conditions;
};

const generateProcedures = (patients: any[], encounters: any[]) => {
  const procedures = [];
  const procedureData = [
    { code: 'CPT:99213', name: 'Office Visit Level 3' },
    { code: 'CPT:92928', name: 'Stent Placement' },
    { code: 'CPT:31500', name: 'Endotracheal Intubation' },
    { code: 'CPT:71045', name: 'Chest X-Ray' }
  ];
  encounters.forEach(encounter => {
    if (Math.random() > 0.5) { // 50% chance of a procedure
      const proc = getRandomItem(procedureData);
      procedures.push({
        procedureId: faker.string.uuid(),
        personId: encounter.personId,
        encounterId: encounter.encounterId,
        procedureCode: proc.code,
        procedureName: proc.name,
        procedureDateTime: encounter.admissionDatetime,
        performingClinicianId: encounter.attendingProviderId,
      });
    }
  });
  return procedures;
}

const generateDrugExposures = (patients: any[], encounters: any[]) => {
  const drugs = [];
  const drugData = [
    { name: 'Lisinopril 10 MG', code: 'RxNorm:856335'},
    { name: 'Metformin 500 MG', code: 'RxNorm:860975'},
    { name: 'Atorvastatin 20 MG', code: 'RxNorm:628365'},
    { name: 'Albuterol Inhaler', code: 'RxNorm:318134'}
  ];
   patients.forEach(patient => {
        const numDrugs = faker.number.int({ min: 1, max: 3 });
        const patientEncounters = encounters.filter(e => e.personId === patient.personId);
        for(let i=0; i<numDrugs; i++){
          const drug = getRandomItem(drugData);
          const encounter = getRandomItem(patientEncounters);
           drugs.push({
            medicationId: faker.string.uuid(),
            personId: patient.personId,
            encounterId: encounter.encounterId,
            drugCode: drug.code,
            drugName: drug.name,
            dose: 'As prescribed',
            startDate: encounter.admissionDatetime,
            endDate: '',
            prescribingPhysicianId: encounter.attendingProviderId,
            dispenseStatus: 'Dispensed',
           });
        }
   });
  return drugs;
}

const generateClinicalNotes = (encounters: any[]) => {
    const notes = [];
    encounters.forEach(encounter => {
        notes.push({
            noteId: faker.string.uuid(),
            encounterId: encounter.encounterId,
            personId: encounter.personId, // Add personId for easier lookup
            authorId: encounter.attendingProviderId,
            noteType: faker.helpers.arrayElement(['SOAP', 'Progress', 'Admission', 'Discharge']),
            noteText: faker.lorem.paragraphs(2),
            dateTimeCreated: encounter.admissionDatetime,
        });
    });
    return notes;
}

const generatePendingTasks = (users: any[], patients: any[]) => {
    const tasks = [];
    const physicianUsers = users.filter(u => u.role === 'physician');
    physicianUsers.forEach(user => {
        const numTasks = faker.number.int({ min: 2, max: 5 });
        for(let i = 0; i < numTasks; i++) {
            const patient = getRandomItem(patients);
            tasks.push({
                taskId: faker.string.uuid(),
                assignedTo: user.id, // using the static ID
                description: `Review lab results for ${patient.fullName}`,
                priority: faker.helpers.arrayElement(['High', 'Medium', 'Low']),
                dueDate: faker.date.future().toISOString().split('T')[0],
                status: 'Pending',
                patientId: patient.personId,
            });
        }
    });
    return tasks;
};


// Main generation function
const generateAllData = (patientCount: number) => {
    const samplePatients = generatePatients(patientCount);
    const sampleEncounters = generateEncounters(samplePatients);
    const sampleConditions = generateConditions(samplePatients, sampleEncounters);
    const sampleProcedures = generateProcedures(samplePatients, sampleEncounters);
    const sampleDrugExposures = generateDrugExposures(samplePatients, sampleEncounters);
    const sampleClinicalNotes = generateClinicalNotes(sampleEncounters);
    const samplePendingTasks = generatePendingTasks(baseUsers, samplePatients);

    // Add active problem list to patients
    samplePatients.forEach(p => {
        p.activeProblemList = sampleConditions
            .filter(c => c.personId === p.personId && c.status === 'Active')
            .map(c => c.icd10Code)
            .join(', ');
    });

    return {
        sampleUsers: baseUsers,
        samplePatients,
        sampleEncounters,
        sampleConditions,
        sampleProcedures,
        sampleDrugExposures,
        sampleClinicalNotes,
        samplePendingTasks,
        sampleCareSites: careSites,
        // Keep some other static data if needed, or make them dynamic too
        sampleBeds: [],
        sampleCosts: [],
        samplePayerPlanPeriods: [],
        sampleVisitDetails: [],
        sampleLabResults: [],
        sampleImagingStudies: [],
    };
};

// Exporting the generator
export const generatedData = generateAllData(50);

    