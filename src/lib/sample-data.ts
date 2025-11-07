



export const staffProfiles: { [key: string]: { name: string; role: string; email: string, avatarId: string } } = {
  'Dr. Sarah Anderson': {
    name: 'Dr. Sarah Anderson',
    role: 'Physician',
    email: 'physician@medverse.com',
    avatarId: 'staff-dr-anderson',
  },
  'Dr. Ben Carter': {
    name: 'Dr. Ben Carter',
    role: 'Physician',
    email: 'physician2@medverse.com',
    avatarId: 'staff-nurse-smith', // Placeholder
  },
  'Dr. Olivia Garcia': {
    name: 'Dr. Olivia Garcia',
    role: 'Physician',
    email: 'physician3@medverse.com',
    avatarId: 'user-avatar', // Placeholder
  },
  'Michael Smith': {
    name: 'Michael Smith, RN',
    role: 'Nurse',
    email: 'nurse@medverse.com',
    avatarId: 'staff-nurse-smith',
  },
   'Laura Williams': {
    name: 'Laura Williams, RN',
    role: 'Nurse',
    email: 'nurse2@medverse.com',
    avatarId: 'tele-patient-2',
  },
  'David Chen': {
    name: 'David Chen, RN',
    role: 'Nurse',
    email: 'nurse3@medverse.com',
    avatarId: 'tele-patient-3',
  },
  'Admin User': {
    name: 'Admin User',
    role: 'Admin',
    email: 'admin@medverse.com',
    avatarId: 'user-avatar',
  },
  'Alex Carter': {
      name: 'Alex Carter',
      role: 'Pharmacist',
      email: 'pharmacist@medverse.com',
      avatarId: 'tele-patient-1'
  },
  'Emily White': {
      name: 'Emily White',
      role: 'Scheduler',
      email: 'scheduler@medverse.com',
      avatarId: 'tele-patient-4'
  },
  'John Davis': {
      name: 'John Davis',
      role: 'Billing',
      email: 'billing@medverse.com',
      avatarId: 'tele-patient-5'
  },
  'Frank Miller': {
    name: 'Frank Miller',
    role: 'Business',
    email: 'business@medverse.com',
    avatarId: 'tele-patient-5'
  },
  'Linda Green': {
    name: 'Linda Green',
    role: 'Lab',
    email: 'lab@medverse.com',
    avatarId: 'tele-patient-2'
  },
  'Susan Harris': {
    name: 'Susan Harris',
    role: 'Lab',
    email: 'lab2@medverse.com',
    avatarId: 'tele-patient-4'
  },
  'Robert Turner': {
    name: 'Robert Turner',
    role: 'Lab',
    email: 'lab3@medverse.com',
    avatarId: 'tele-patient-1'
  },
  'Mary Adams': {
    name: 'Mary Adams',
    role: 'Radiology',
    email: 'radiology@medverse.com',
    avatarId: 'tele-patient-2'
  },
  'James Clark': {
    name: 'James Clark',
    role: 'Radiology',
    email: 'radiology2@medverse.com',
    avatarId: 'tele-patient-3'
  },
  'Patricia Nelson': {
    name: 'Patricia Nelson',
    role: 'Radiology',
    email: 'radiology3@medverse.com',
    avatarId: 'tele-patient-4'
  }
};

export type Patient = {
  id: number;
  name: string;
  ward: string;
  hospital: string;
  consultant: string;
  status: 'Occupied' | 'Discharging' | 'Admitted';
  mrn?: string;
  visitHistory?: any[]; // Simplified for this example
  conditions?: any[];
  lastSeen?: string;
  alerts?: number;
  dob?: string;
  gender?: 'Male' | 'Female' | 'Other';
  ssnLast4?: string;
  maritalStatus?: 'Married' | 'Single' | 'Divorced' | 'Widowed';
  contact?: any;
  emergencyContact?: any;
  insurance?: any;
  vitals?: any[];
  medications?: any[];
  labResults?: any[];
  immunizationHistory?: any[];
  socialHistory?: any;
  familyHistory?: any[];
};

export type Ward = {
    name: string;
    hospital: string;
    totalBeds: number;
    occupiedBeds: number;
};

export type Task = {
  description: string;
  patient: string;
  mrn: string;
  time: string;
  priority: 'High' | 'Medium' | 'Low';
};

export type Claim = {
  id: string;
  patient: string;
  created: string;
  total: number;
  provider: string;
  status: 'active' | 'cancelled' | 'draft' | 'entered-in-error';
};

export type ImagingStudy = {
  id: string;
  patient: string;
  study: string;
  date: string;
  imageUrl?: string;
  imageHint?: string;
  description?: string;
};

export type TelehealthAppointment = {
  patientName: string;
  time: string;
  status: 'Upcoming' | 'Waiting' | 'Completed';
  avatarId: string;
  notes?: string;
};


const firstNames = ["John", "Jane", "Peter", "Mary", "David", "Sarah", "Michael", "Emily", "Jessica", "James", "Robert", "Patricia", "Linda", "William", "Elizabeth", "Richard", "Susan", "Joseph", "Karen", "Thomas", "Charles", "Lisa", "Daniel", "Nancy", "Matthew", "Betty", "Anthony", "Dorothy", "Mark", "Sandra"];
const lastNames = ["Smith", "Doe", "Jones", "Johnson", "Williams", "Brown", "Davis", "Miller", "Garcia", "Rodriguez", "Wilson", "Martinez", "Anderson", "Taylor", "Moore", "Jackson", "Martin", "Lee", "Perez", "Thompson", "White", "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson", "Walker", "Young", "Allen"];
const hospitals = ["City General", "St. Lukes", "MetroWest", "County General", "University Hospital", "Riverside Medical", "Mountain View", "Central Hospital", "Oceanic Medical", "Sunnyside General"];
const wards = ["Cardiology", "Orthopedics", "Neurology", "Pediatrics", "Oncology", "Geriatrics", "ICU", "Maternity", "Surgery", "Psychiatry"];
const physicianNames = ['Dr. Sarah Anderson', 'Dr. Ben Carter', 'Dr. Olivia Garcia'];
const statuses: Patient['status'][] = ['Occupied', 'Discharging', 'Admitted'];

const generateRandomPatient = (id: number, consultant: string): Patient => {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const name = `${firstName} ${lastName}`;
    const hospital = hospitals[Math.floor(Math.random() * hospitals.length)];

    return {
        id: id,
        name: name,
        ward: wards[Math.floor(Math.random() * wards.length)],
        hospital: hospital,
        consultant: consultant,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        mrn: `MRN-${1000 + id}`,
        dob: new Date(1950 + Math.floor(Math.random() * 50), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
        gender: Math.random() > 0.5 ? 'Male' : 'Female',
        lastSeen: new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toLocaleDateString(),
        visitHistory: [{
          type: 'Admission',
          date: new Date().toISOString(),
          doctor: consultant,
          chiefComplaint: 'Initial check-up',
          diagnosis: 'Routine physical',
          notes: 'Patient admitted for routine observation.',
          hospital: hospital
        }],
    };
};

const generateAllPatients = (): Patient[] => {
    const patients: Patient[] = [];
    let patientId = 1;
    
    // Create 100 patients for each of the 3 physicians
    physicianNames.forEach(physician => {
        for (let i = 0; i < 100; i++) {
            patients.push(generateRandomPatient(patientId++, physician));
        }
    });


    // Add multi-hospital history to 70% of patients
    const patientsToGetHistory = patients.sort(() => 0.5 - Math.random()).slice(0, Math.floor(patients.length * 0.7));

    for (const patient of patientsToGetHistory) {
        const currentHospital = patient.hospital;
        let otherHospital = currentHospital;
        while(otherHospital === currentHospital) {
            otherHospital = hospitals[Math.floor(Math.random() * hospitals.length)];
        }
        patient.visitHistory?.push({
            type: 'Consultation',
            date: new Date(2022, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString(),
            doctor: physicianNames[Math.floor(Math.random() * physicianNames.length)],
            chiefComplaint: 'Follow-up',
            diagnosis: 'Stable',
            notes: 'Previous visit at another facility.',
            hospital: otherHospital
        });
    }

    return patients;
}


export const allPatients: Patient[] = generateAllPatients();

export const allWards: Ward[] = hospitals.flatMap(hospital => 
    wards.map(wardName => {
        const totalBeds = Math.floor(Math.random() * 11) + 15; // 15-25 beds
        const occupiedBeds = Math.floor(Math.random() * totalBeds);
        return {
            name: wardName,
            hospital: hospital,
            totalBeds: totalBeds,
            occupiedBeds: occupiedBeds,
        };
    })
);

export const allTasks: Task[] = [
    { description: 'Review lab results', patient: 'David Lee', mrn: 'MRN-1055', time: '30 min ago', priority: 'High' },
    { description: 'Sign prescription refill', patient: 'Patricia Brown', mrn: 'MRN-0921', time: '1 hour ago', priority: 'Medium' },
    { description: 'Complete discharge summary', patient: 'James Martinez', mrn: 'MRN-0847', time: '2 hours ago', priority: 'High' },
    { description: 'Review imaging results', patient: 'David Lee', mrn: 'MRN-1055', time: '3 hours ago', priority: 'Low' },
    { description: 'Call patient family for update', patient: 'Sarah Johnson', mrn: 'MRN-0921', time: '4 hours ago', priority: 'Low' },
    { description: 'Prepare for team huddle', patient: 'System Task', mrn: 'N/A', time: '4 hours ago', priority: 'Medium' },
];

export const allClaims: Claim[] = [
  { id: 'CL-001284', patient: 'Jane Doe', created: '2024-07-22', total: 450.75, provider: 'Blue Shield PPO', status: 'active' },
  { id: 'CL-001283', patient: 'Jane Doe', created: '2024-06-15', total: 125.0, provider: 'Blue Shield PPO', status: 'active' },
  { id: 'CL-001280', patient: 'Jane Doe', created: '2024-05-30', total: 890.5, provider: 'Blue Shield PPO', status: 'cancelled' },
  { id: 'CL-001279', patient: 'Jane Doe', created: '2024-05-1', total: 75.00, provider: 'Blue Shield PPO', status: 'draft' },
];

export const allImagingStudies: ImagingStudy[] = [
  { id: 'imaging-1', patient: 'John Doe', study: 'Chest X-Ray', date: '2024-07-21' },
  { id: 'imaging-2', patient: 'Jane Smith', study: 'Brain MRI', date: '2024-07-20' },
  { id: 'imaging-3', patient: 'Peter Jones', study: 'Knee Arthroscopy', date: '2024-07-19' },
  { id: 'imaging-4', patient: 'Mary Johnson', study: 'Abdominal Ultrasound', date: '2024-07-18' },
  { id: 'imaging-5', patient: 'David Williams', study: 'Dental X-Ray', date: '2024-07-17' },
  { id: 'imaging-6', patient: 'Sarah Brown', study: 'Thorax CT Scan', date: '2024-07-16' },
];

export const allTelehealthAppointments: TelehealthAppointment[] = [
  { patientName: 'Robert Brown', time: '10:00 AM - 10:20 AM', status: 'Upcoming', avatarId: 'tele-patient-1' },
  { patientName: 'Emily Davis', time: '10:30 AM - 10:50 AM', status: 'Waiting', avatarId: 'tele-patient-2' },
  { patientName: 'Michael Wilson', time: '11:00 AM - 11:20 AM', status: 'Upcoming', avatarId: 'tele-patient-3' },
  { patientName: 'Jessica Martinez', time: '09:00 AM', notes: 'Follow-up in 2 weeks.', avatarId: 'tele-patient-4', status: 'Completed' },
  { patientName: 'William Taylor', time: '09:30 AM', notes: 'Prescription for antibiotics sent.', avatarId: 'tele-patient-5', status: 'Completed' }
];

export const allMedicationsList = [
  { value: "lisinopril", label: "Lisinopril" },
  { value: "metformin", label: "Metformin" },
  { value: "aspirin", label: "Aspirin" },
  { value: "atorvastatin", label: "Atorvastatin" },
  { value: "simvastatin", label: "Simvastatin" },
  { value: "levothyroxine", label: "Levothyroxine" },
  { value: "amlodipine", label: "Amlodipine" },
  { value: "hydrochlorothiazide", label: "Hydrochlorothiazide" },
  { value: "ibuprofen", label: "Ibuprofen" },
  { value: "acetaminophen", label: "Acetaminophen" },
  { value: "warfarin", label: "Warfarin" },
  { value: "clopidogrel", label: "Clopidogrel" },
  { value: "sertraline", label: "Sertraline" },
];

export const initialPatientMedications = [
  { id: 1, name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily', status: 'Active' },
  { id: 2, name: 'Metformin', dosage: '500mg', frequency: 'Twice daily', status: 'Active' },
  { id: 3, name: 'Aspirin', dosage: '81mg', frequency: 'Once daily', status: 'Unverified' },
  { id: 4, name: 'Atorvastatin', dosage: '20mg', frequency: 'Once daily', status: 'Discontinued' },
];

    