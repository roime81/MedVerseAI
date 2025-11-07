
export const staffProfiles: { [key: string]: { name: string; role: string; email: string, avatarId: string } } = {
  'Dr. Anderson': {
    name: 'Dr. Sarah Anderson',
    role: 'Physician, Cardiology',
    email: 's.anderson@medverse.com',
    avatarId: 'staff-dr-anderson',
  },
  'Nurse Smith': {
    name: 'Michael Smith, RN',
    role: 'Registered Nurse, Cardiology',
    email: 'm.smith@medverse.com',
    avatarId: 'staff-nurse-smith',
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

const firstNames = ["John", "Jane", "Peter", "Mary", "David", "Sarah", "Michael", "Emily", "Jessica", "James", "Robert", "Patricia", "Linda", "William", "Elizabeth", "Richard", "Susan", "Joseph", "Karen", "Thomas"];
const lastNames = ["Smith", "Doe", "Jones", "Johnson", "Williams", "Brown", "Davis", "Miller", "Garcia", "Rodriguez", "Wilson", "Martinez", "Anderson", "Taylor", "Moore", "Jackson", "Martin", "Lee", "Perez", "Thompson"];
const hospitals = ["City General", "St. Lukes", "MetroWest", "County General", "University Hospital", "Riverside Medical", "Mountain View", "Central Hospital", "Oceanic Medical", "Sunnyside General"];
const wards = ["Cardiology", "Orthopedics", "Neurology", "Pediatrics", "Oncology", "Geriatrics", "ICU", "Maternity", "Surgery", "Psychiatry"];
const consultants = ["Dr. Evans", "Dr. Chen", "Dr. Rodriguez", "Dr. Williams", "Dr. Smith", "Dr. Jones"];
const statuses: Patient['status'][] = ['Occupied', 'Discharging', 'Admitted'];

const generateRandomPatient = (id: number): Patient => {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const name = `${firstName} ${lastName}`;
    const hospital = hospitals[Math.floor(Math.random() * hospitals.length)];

    return {
        id: id,
        name: name,
        ward: wards[Math.floor(Math.random() * wards.length)],
        hospital: hospital,
        consultant: consultants[Math.floor(Math.random() * consultants.length)],
        status: statuses[Math.floor(Math.random() * statuses.length)],
        mrn: `MRN-${1000 + id}`,
        dob: new Date(1950 + Math.floor(Math.random() * 50), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
        gender: Math.random() > 0.5 ? 'Male' : 'Female',
        lastSeen: new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toLocaleDateString(),
        visitHistory: [{
          type: 'Admission',
          date: new Date().toISOString(),
          doctor: consultants[Math.floor(Math.random() * consultants.length)],
          chiefComplaint: 'Initial check-up',
          diagnosis: 'Routine physical',
          notes: 'Patient admitted for routine observation.',
          hospital: hospital
        }],
    };
};

const generateAllPatients = (): Patient[] => {
    const patients: Patient[] = [];
    for (let i = 0; i < 1000; i++) {
        patients.push(generateRandomPatient(i + 1));
    }

    // Add multi-hospital history to 70% of patients
    for (let i = 0; i < 700; i++) {
        const patient = patients[i];
        const currentHospital = patient.hospital;
        let otherHospital = currentHospital;
        while(otherHospital === currentHospital) {
            otherHospital = hospitals[Math.floor(Math.random() * hospitals.length)];
        }
        patient.visitHistory?.push({
            type: 'Consultation',
            date: new Date(2022, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString(),
            doctor: consultants[Math.floor(Math.random() * consultants.length)],
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
