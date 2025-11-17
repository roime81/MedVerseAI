
import { faker } from '@faker-js/faker';

// Static base data
const baseUsers = [
    // Doctors
    {
        email: 'emily.carter@medverse.com',
        password: 'password',
        role: 'physician',
        displayName: 'Dr. Emily Carter',
        department: 'Cardiology',
        id: 'dr_emily_carter'
    },
    {
        email: 'ben.stone@medverse.com',
        password: 'password',
        role: 'physician',
        displayName: 'Dr. Ben Stone',
        department: 'Emergency Medicine',
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
        department: 'System',
        id: 'super_admin'
    },
    // New Admin roles
    {
        email: 'hr.credentialing@medverse.com',
        password: 'password',
        role: 'admin',
        displayName: 'HR / Medical Credentialing',
        department: 'HR/Credentialing',
        id: 'hr_medical_credentialing'
    },
    {
        email: 'medical.affairs@medverse.com',
        password: 'password',
        role: 'admin',
        displayName: 'Medical Affairs / Clinical Gov.',
        department: 'Medical Affairs/Clinical Gov',
        id: 'medical_affairs_clinical_gov'
    },
    {
        email: 'department.head@medverse.com',
        password: 'password',
        role: 'admin',
        displayName: 'Department Head (HOD)',
        department: 'Department Head',
        id: 'department_head_hod'
    },
    {
        email: 'it.iam@medverse.com',
        password: 'password',
        role: 'admin',
        displayName: 'IT Identity & Access Management',
        department: 'IT/IAM',
        id: 'it_identity_access_management'
    },
    {
        email: 'cybersecurity@medverse.com',
        password: 'password',
        role: 'admin',
        displayName: 'Cybersecurity',
        department: 'Cybersecurity',
        id: 'cybersecurity'
    },
    {
        email: 'his.emr@medverse.com',
        password: 'password',
        role: 'admin',
        displayName: 'HIS/EMR Application Team',
        department: 'HIS/EMR',
        id: 'his_emr_application_team'
    },
    {
        email: 'compliance.audit@medverse.com',
        password: 'password',
        role: 'admin',
        displayName: 'Compliance / Internal Audit',
        department: 'Compliance/Audit',
        id: 'compliance_internal_audit'
    },
    // Other clinical roles
    {
        email: 'sam.radiologist@medverse.com',
        password: 'password',
        role: 'radiology',
        displayName: 'Sam Radiologist',
        id: 'sam_radiologist'
    },
    {
        email: 'larry.labtech@medverse.com',
        password: 'password',
        role: 'lab',
        displayName: 'Larry Labtech',
        id: 'larry_labtech'
    },
    {
        email: 'bill.billington@medverse.com',
        password: 'password',
        role: 'billing',
        displayName: 'Bill Billington',
        id: 'bill_billington'
    },
    {
        email: 'penny.pharmacist@medverse.com',
        password: 'password',
        role: 'pharmacist',
        displayName: 'Penny Pharmacist',
        id: 'penny_pharmacist'
    }
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
const drCarterId = 'dr_emily_carter';
const drBenStoneId = 'dr_ben_stone';
const drCarterHospitalIds = ['HOS-001', 'HOS-002']; // General Hospital & City Medical Center

const sampleOrderSets = [
    { orderSetId: 'os-001', name: 'ED Chest Pain Protocol', description: 'Standard protocol for emergency department chest pain workup', orderCount: 8 },
    { orderSetId: 'os-002', name: 'Sepsis Bundle', description: 'Initial management bundle for patients with suspected sepsis', orderCount: 6 },
    { orderSetId: 'os-003', name: 'Abdominal Pain Workup', description: 'Standard set of orders for undifferentiated abdominal pain', orderCount: 7 },
];

const sampleCommonOrders = [
    { orderId: 'co-001', name: 'CBC' }, { orderId: 'co-002', name: 'CMP' },
    { orderId: 'co-003', name: 'Chest X-Ray' }, { orderId: 'co-004', name: 'ECG - 12 Lead' },
    { orderId: 'co-005', name: 'Urinalysis' }, { orderId: 'co-006', name: 'CT Head without contrast' },
    { orderId: 'co-007', name: 'Troponin I' }, { orderId: 'co-008', name: 'D-Dimer' },
    { orderId: 'co-009', name: 'Lactate' }, { orderId: 'co-010', name: 'Blood Cultures' }
];

// Helper function to get a random item from an array
const getRandomItem = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)];


// --- DYNAMIC DATA GENERATION ---

const hardcodedPatients = [
    {
        personId: 'leila_richardson_123',
        nationalId: '999-00-1111',
        fullName: 'Leila Richardson',
        dateOfBirth: '1982-08-22',
        gender: 'Female',
        race: 'Black',
        ethnicity: 'Not Hispanic',
        maritalStatus: 'Married',
        contactInfo: 'leila.richardson@example.com',
        address: '123 Wellness Way, Healington, MD 21201',
        emergencyContact: 'Mark Richardson, Spouse, 555-111-2222',
        primaryProviderId: drCarterId,
        insuranceNumber: 'INS-A9B8C7D6',
        allergyFlag: 'None',
        activeProblemList: 'Hypothyroidism, Iron Deficiency Anemia',
    },
    {
        personId: 'david_chen_456',
        nationalId: '999-00-2222',
        fullName: 'David Chen',
        dateOfBirth: '1975-04-12',
        gender: 'Male',
        race: 'Asian',
        ethnicity: 'Not Hispanic',
        maritalStatus: 'Married',
        contactInfo: 'david.chen@example.com',
        address: '456 Remedy Road, Vitality, VA 22030',
        emergencyContact: 'Susan Chen, Spouse, 555-333-4444',
        primaryProviderId: drCarterId,
        insuranceNumber: 'INS-E5F6G7H8',
        allergyFlag: 'Penicillin',
        activeProblemList: 'Hypertension, Type 2 Diabetes',
    },
    {
        personId: 'maria_garcia_789',
        nationalId: '999-00-3333',
        fullName: 'Maria Garcia',
        dateOfBirth: '1990-11-30',
        gender: 'Female',
        race: 'Hispanic',
        ethnicity: 'Hispanic',
        maritalStatus: 'Single',
        contactInfo: 'maria.garcia@example.com',
        address: '789 Cure Circle, Recovery, TX 75001',
        emergencyContact: 'Carlos Garcia, Brother, 555-555-6666',
        primaryProviderId: drBenStoneId,
        insuranceNumber: 'INS-I1J2K3L4',
        allergyFlag: 'None',
        activeProblemList: 'Asthma',
    },
    {
        personId: 'john_smith_101',
        nationalId: '999-00-4444',
        fullName: 'John Smith',
        dateOfBirth: '1968-01-15',
        gender: 'Male',
        race: 'White',
        ethnicity: 'Not Hispanic',
        maritalStatus: 'Divorced',
        contactInfo: 'john.smith@example.com',
        address: '101 Health Ave, Caretown, FL 33101',
        emergencyContact: 'Laura Smith, Daughter, 555-777-8888',
        primaryProviderId: drBenStoneId,
        insuranceNumber: 'INS-M5N6O7P8',
        allergyFlag: 'Sulfa',
        activeProblemList: 'Gout, Coronary Artery Disease',
    },
    {
        personId: 'michael_jackson_102',
        nationalId: '999-00-5555',
        fullName: 'Michael Jackson',
        dateOfBirth: '1958-08-29',
        gender: 'Male',
        race: 'Black',
        ethnicity: 'Not Hispanic',
        maritalStatus: 'Single',
        contactInfo: 'michael.jackson@example.com',
        address: '100 Neverland, Los Olivos, CA 93441',
        emergencyContact: 'Katherine Jackson, Mother, 555-123-9876',
        primaryProviderId: drBenStoneId,
        insuranceNumber: 'INS-Q9R8S7T6',
        allergyFlag: 'Demerol, Propofol',
        activeProblemList: 'Lupus, Vitiligo',
    }
];

const generatePatients = (count: number, drCarterPatientCount: number) => {
    const patients = [...hardcodedPatients];
    const existingPatientCount = patients.length;

    for (let i = 0; i < count - existingPatientCount; i++) { 
        const gender = faker.person.sexType();
        const fullName = faker.person.fullName({ sex: gender });

        const primaryProviderId = i < drCarterPatientCount - hardcodedPatients.filter(p => p.primaryProviderId === drCarterId).length 
            ? drCarterId 
            : getRandomItem(physicians.filter(p => p.id !== drCarterId)).id;

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
            primaryProviderId: primaryProviderId,
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
        
        let facilityIds: string[];
        if (patient.primaryProviderId === drCarterId) {
            facilityIds = drCarterHospitalIds; // Ensure Dr. Carter's patients go to her hospitals
        } else {
            const patientCareSites = new Set<string>();
            while(patientCareSites.size < 2) {
                patientCareSites.add(getRandomItem(careSites).careSiteId);
            }
            facilityIds = Array.from(patientCareSites);
        }

        for (let i = 0; i < numEncounters; i++) {
            const admissionDate = faker.date.past({ years: 3 });
            const dischargeDate = new Date(admissionDate.getTime() + faker.number.int({ min: 1, max: 14 }) * 24 * 60 * 60 * 1000);
            
            const attendingProviderId = patient.primaryProviderId === drCarterId
                ? drCarterId
                : getRandomItem(physicians).id;

            encounters.push({
                encounterId: faker.string.uuid(),
                personId: patient.personId,
                facilityId: getRandomItem(facilityIds),
                encounterType: faker.helpers.arrayElement(['Inpatient', 'Outpatient', 'Emergency', 'Telehealth']),
                admissionDatetime: admissionDate.toISOString(),
                dischargeDatetime: dischargeDate.toISOString(),
                attendingProviderId: attendingProviderId,
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
        { code: 'F33.1', desc: 'Depression' }, { code: 'M10.00', desc: 'Gout' }, { code: 'I25.10', desc: 'Coronary Artery Disease' },
        { code: 'E03.9', desc: 'Hypothyroidism' }, { code: 'D50.9', desc: 'Iron Deficiency Anemia' }, { code: 'L93.0', desc: 'Lupus' }, { code: 'L81.5', desc: 'Vitiligo' }
    ];

    patients.forEach(patient => {
        const patientEncounters = encounters.filter(e => e.personId === patient.personId);
        if (patientEncounters.length === 0) return;

        // If the patient is hardcoded and has an activeProblemList, create conditions for them
        if (patient.activeProblemList && patient.activeProblemList.length > 0) {
            const problems = patient.activeProblemList.split(', ');
            problems.forEach(problemDesc => {
                const icd10 = icd10Codes.find(c => c.desc === problemDesc);
                if (icd10) {
                    conditions.push({
                        diagnosisId: faker.string.uuid(),
                        personId: patient.personId,
                        encounterId: getRandomItem(patientEncounters).encounterId,
                        icd10Code: icd10.code, // Use the matched code
                        diagnosisType: 'Principal',
                        onsetDate: faker.date.past({ years: 5 }).toISOString().split('T')[0],
                        status: 'Active',
                        certainty: 'Confirmed',
                    });
                }
            });
        } 
        // Otherwise, if it's a faker-generated patient, create random conditions
        else if (!hardcodedPatients.find(hp => hp.personId === patient.personId)) {
            const numConditions = faker.number.int({ min: 1, max: 4 });
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
        }
    });

    return conditions;
};


const generateProcedures = (patients: any[], encounters: any[], drCarterTodaysAppointments: number) => {
  const procedures = [];
  const procedureData = [
    { code: 'CPT:99213', name: 'Office Visit Level 3' },
    { code: 'CPT:92928', name: 'Stent Placement' },
    { code: 'CPT:31500', name: 'Endotracheal Intubation' },
    { code: 'CPT:71045', name: 'Chest X-Ray' }
  ];
  
  // Generate specific appointments for Dr. Carter for today
  const drCarterPatients = patients.filter(p => p.primaryProviderId === drCarterId);
  const today = new Date();
  for (let i = 0; i < drCarterTodaysAppointments; i++) {
      if (drCarterPatients.length > 0) {
          const patient = drCarterPatients[i % drCarterPatients.length];
          const proc = getRandomItem(procedureData);
          const appointmentTime = new Date(today.setHours(9 + i, (i * 15) % 60, 0, 0));

          procedures.push({
              procedureId: faker.string.uuid(),
              personId: patient.personId,
              encounterId: faker.string.uuid(), // Can create a dummy encounter or link to a real one
              procedureCode: proc.code,
              procedureName: proc.name,
              procedureDateTime: appointmentTime.toISOString(),
              performingClinicianId: drCarterId,
          });
      }
  }


  // Generate random procedures for other encounters
  encounters.forEach(encounter => {
    // Avoid creating duplicate procedures for today for Dr. Carter
    if (encounter.attendingProviderId === drCarterId && new Date(encounter.admissionDatetime).toDateString() === today.toDateString()) {
        return;
    }

    if (Math.random() > 0.5) { // 50% chance of a procedure
      const proc = getRandomItem(procedureData);
      
      const performingClinicianId = encounter.attendingProviderId;

      procedures.push({
        procedureId: faker.string.uuid(),
        personId: encounter.personId,
        encounterId: encounter.encounterId,
        procedureCode: proc.code,
        procedureName: proc.name,
        procedureDateTime: encounter.admissionDatetime,
        performingClinicianId: performingClinicianId,
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
    { name: 'Albuterol Inhaler', code: 'RxNorm:318134'},
    { name: 'Levothyroxine 75 mcg', code: 'RxNorm:866922'},
    { name: 'Ferrous Sulfate 325 MG', code: 'RxNorm:105261' },
    { name: 'Amoxicillin 500 MG', code: 'RxNorm:834042' },
    { name: 'Demerol 50mg', code: 'RxNorm:310192' },
    { name: 'Propofol 10mg/mL', code: 'RxNorm:8489' },
  ];
   patients.forEach(patient => {
        const numDrugs = faker.number.int({ min: 1, max: 3 });
        const patientEncounters = encounters.filter(e => e.personId === patient.personId);
        if (patientEncounters.length === 0) return;

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

const generateLabResults = (patients: any[], encounters: any[]) => {
    const results = [];
    const labTests = [
        { code: 'Troponin I', unit: 'ng/mL', normalRange: [0, 0.4], highValue: () => faker.number.float({ min: 0.5, max: 10, precision: 0.1 }) },
        { code: 'BNP', unit: 'pg/mL', normalRange: [0, 100], highValue: () => faker.number.int({ min: 101, max: 1000 }) },
        { code: 'Creatinine', unit: 'mg/dL', normalRange: [0.6, 1.2], highValue: () => faker.number.float({ min: 1.3, max: 5, precision: 0.1 }) }
    ];
    patients.forEach(patient => {
        const patientEncounters = encounters.filter(e => e.personId === patient.personId);
        if (patientEncounters.length === 0) return;
        const encounter = getRandomItem(patientEncounters);

        labTests.forEach(test => {
            const isHigh = Math.random() > 0.7; // 30% chance of high value
            const value = isHigh ? test.highValue() : faker.number.float({ min: test.normalRange[0], max: test.normalRange[1], precision: 0.1 });
            results.push({
                labOrderId: faker.string.uuid(),
                personId: patient.personId,
                encounterId: encounter.encounterId,
                testCode: test.code,
                resultValue: `${value} ${test.unit}`,
                resultDate: encounter.admissionDatetime,
                resultFlag: isHigh ? 'High' : 'Normal',
            });
        });
    });
    return results;
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

const generatePendingTasks = (users: any[], patients: any[], drCarterTaskCount: number) => {
    const tasks = [];
    const physicianUsers = users.filter(u => u.role === 'physician');
    
    // Create specific tasks for Dr. Carter
    const drCarter = physicianUsers.find(u => u.id === drCarterId);
    const drCarterPatients = patients.filter(p => p.primaryProviderId === drCarterId);
    if (drCarter && drCarterPatients.length > 0) {
        for(let i = 0; i < drCarterTaskCount; i++) {
            const patient = drCarterPatients[i % drCarterPatients.length];
            tasks.push({
                taskId: faker.string.uuid(),
                assignedTo: drCarter.id,
                description: `Review ${faker.helpers.arrayElement(['chest X-Ray', 'blood test', 'MRI results'])} for ${patient.fullName}`,
                priority: faker.helpers.arrayElement(['High', 'Medium', 'Low']),
                dueDate: faker.date.future({days: 14}).toISOString().split('T')[0],
                status: 'Pending',
                patientId: patient.personId,
            });
        }
    }

    // Create random tasks for other physicians
    const otherPhysicians = physicianUsers.filter(u => u.id !== drCarterId);
    otherPhysicians.forEach(user => {
        const numTasks = faker.number.int({ min: 1, max: 3 });
        for(let i = 0; i < numTasks; i++) {
            const patient = getRandomItem(patients);
            tasks.push({
                taskId: faker.string.uuid(),
                assignedTo: user.id, // using the static ID
                description: `Follow up on patient inquiry from ${patient.fullName}`,
                priority: faker.helpers.arrayElement(['Medium', 'Low']),
                dueDate: faker.date.future({days: 30}).toISOString().split('T')[0],
                status: 'Pending',
                patientId: patient.personId,
            });
        }
    });
    return tasks;
};


// Main generation function
const generateAllData = ({
    totalPatientCount,
    drCarterPatientCount,
    drCarterTodaysAppointments,
    drCarterTaskCount
}) => {
    const samplePatients = generatePatients(totalPatientCount, drCarterPatientCount);
    const sampleEncounters = generateEncounters(samplePatients);
    const sampleConditions = generateConditions(samplePatients, sampleEncounters);
    const sampleProcedures = generateProcedures(samplePatients, sampleEncounters, drCarterTodaysAppointments);
    const sampleDrugExposures = generateDrugExposures(samplePatients, sampleEncounters);
    const sampleLabResults = generateLabResults(samplePatients, sampleEncounters);
    const sampleClinicalNotes = generateClinicalNotes(sampleEncounters);
    const samplePendingTasks = generatePendingTasks(baseUsers, samplePatients, drCarterTaskCount);

    // Add active problem list to patients
    samplePatients.forEach(p => {
        // Skip for hardcoded patients, as it's set statically
        if (hardcodedPatients.some(hp => hp.personId === p.personId && hp.activeProblemList)) return;

        p.activeProblemList = sampleConditions
            .filter(c => c.personId === p.personId && c.status === 'Active')
            .map(c => c.icd10Code) // Using code now, can be mapped to description later
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
        sampleOrderSets,
        sampleCommonOrders,
        sampleLabResults,
        // Keep some other static data if needed, or make them dynamic too
        sampleBeds: [],
        sampleCosts: [],
        samplePayerPlanPeriods: [],
        sampleVisitDetails: [],
        sampleImagingStudies: [],
    };
};

// Exporting the generator
export const generatedData = generateAllData({
    totalPatientCount: 100,
    drCarterPatientCount: 20,
    drCarterTodaysAppointments: 10,
    drCarterTaskCount: 10,
});
