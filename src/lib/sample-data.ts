export type Patient = {
  id: string;
  name: string;
  hospital: string;
  ward: string;
  bed: string;
  status: 'Occupied' | 'Discharging' | 'Admitted';
  consultant?: string;
};

export type Ward = {
  name: string;
  hospital: string;
  totalBeds: number;
  occupiedBeds: number;
};

export type Hospital = {
  name: string;
  wards: Ward[];
  patients: Patient[];
};

export type User = {
  id: string;
  name:string;
  email: string;
  role: string;
  hospital: string;
};

const hospitalNames = [
  'City General Hospital',
  'St. Jude\'s Medical Center',
  'Northside Regional Hospital',
  'Southwest Community Health',
  'Lakeview General Hospital',
  'Pine Ridge Medical Center',
  'Riverbend University Hospital',
  'Oceanfront Medical Center',
  'Mountainview General',
  'Eastwood Regional',
  'Westwood Medical',
  'Crestwood General Hospital',
  'Sunnyvale Medical Center',
  'Oakwood Community Hospital',
  'Maple Valley General',
  'Greenwood Medical Center',
  'Elmwood Community Hospital',
  'Cedar Springs Regional',
  'Aspen Grove Medical',
  'Willow Creek General',
];

const wardTypes = [
  'Cardiology',
  'Orthopedics',
  'Neurology',
  'Oncology',
  'Pediatrics',
  'Maternity',
  'General Surgery',
  'Intensive Care Unit'
];

const consultants: { [key: string]: string[] } = {
    Cardiology: ["Dr. Evans", "Dr. Chen"],
    Orthopedics: ["Dr. Rodriguez", "Dr. Patel"],
    Neurology: ["Dr. Kim", "Dr. Singh"],
    Oncology: ["Dr. Williams", "Dr. Gupta"],
    Pediatrics: ["Dr. Allen", "Dr. Lee"],
    Maternity: ["Dr. Carter", "Dr. Wong"],
    "General Surgery": ["Dr. Baker", "Dr. Nguyen"],
    "Intensive Care Unit": ["Dr. Clark", "Dr. Scott"],
};

const firstNames = ["John", "Jane", "Peter", "Mary", "David", "Sarah", "Michael", "Jennifer", "Robert", "Emily", "William", "Jessica", "James", "Ashley", "Charles", "Amanda", "Joseph", "Melissa", "Daniel", "Laura"];
const lastNames = ["Smith", "Doe", "Jones", "Johnson", "Williams", "Brown", "Davis", "Miller", "Wilson", "Moore", "Taylor", "Anderson", "Thomas", "Jackson", "White", "Harris", "Martin", "Thompson", "Garcia", "Martinez"];

const personas = [
  "Physician / Specialist",
  "Nurse / Care Coordinator",
  "Allied Health Professional",
  "Laboratory Technician / Pathologist",
  "Radiologist / Imaging Technician",
  "Pharmacist",
  "Clinical Researcher / Investigator",
  "Admissions & Scheduling Officer",
  "Billing & Claims Officer",
  "Hospital Admin / COO",
  "Data Steward / Governance Lead",
  "Cybersecurity / Compliance Officer",
  "Integration Engineer / API Manager",
  "Patient / Caregiver",
];


const hospitals: Hospital[] = [];
let patientIdCounter = 1;

// Create a pool of patient names to allow for duplicates across hospitals
const patientNames = Array.from({ length: 1000 }, () => `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`);


hospitalNames.forEach(hospitalName => {
  const hospitalWards: Ward[] = [];
  const hospitalPatients: Patient[] = [];
  
  const numWards = Math.floor(Math.random() * 4) + 4; // 4 to 7 wards
  const selectedWardTypes = [...wardTypes].sort(() => 0.5 - Math.random()).slice(0, numWards);

  selectedWardTypes.forEach(wardType => {
    const totalBeds = Math.floor(Math.random() * 15) + 10; // 10 to 24 beds
    const occupiedBeds = Math.floor(Math.random() * totalBeds);
    hospitalWards.push({
      name: wardType,
      hospital: hospitalName,
      totalBeds: totalBeds,
      occupiedBeds: occupiedBeds,
    });
  });

  const totalPatientsInHospital = Math.floor(1000 / hospitalNames.length);

  for (let i = 0; i < totalPatientsInHospital && patientIdCounter <= 1000; i++) {
    const ward = hospitalWards[Math.floor(Math.random() * hospitalWards.length)];
    if (ward.occupiedBeds < ward.totalBeds) {
      const statusOptions: Patient['status'][] = ['Occupied', 'Discharging', 'Admitted'];
      const wardConsultants = consultants[ward.name] || ["Dr. General"];

      const patient: Patient = {
        id: `P${String(patientIdCounter).padStart(4, '0')}`,
        name: patientNames[Math.floor(Math.random() * patientNames.length)],
        hospital: hospitalName,
        ward: ward.name,
        bed: `${ward.name.substring(0,1)}-${Math.floor(Math.random() * ward.totalBeds) + 101}`,
        status: statusOptions[Math.floor(Math.random() * statusOptions.length)],
        consultant: wardConsultants[Math.floor(Math.random() * wardConsultants.length)],
      };
      
      if(patient.status === 'Occupied') {
        ward.occupiedBeds++;
      }

      hospitalPatients.push(patient);
      patientIdCounter++;
    }
  }

  hospitals.push({
    name: hospitalName,
    wards: hospitalWards,
    patients: hospitalPatients,
  });
});

export const sampleHospitals = hospitals;
export const allWards = hospitals.flatMap(h => h.wards);
export const allPatients = hospitals.flatMap(h => h.patients);


const generateUsers = (count: number): User[] => {
  const users: User[] = [];
  const usedNames = new Set<string>();

  // Ensure one unique user per persona
  personas.forEach((role, i) => {
    let firstName, lastName, fullName, email, hospital;
    do {
      firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      fullName = `${firstName} ${lastName}`;
    } while (usedNames.has(fullName));
    
    usedNames.add(fullName);
    hospital = hospitalNames[Math.floor(Math.random() * hospitalNames.length)];
    email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${hospital.toLowerCase().replace(/ /g, '').replace(/'/g, '').split(',')[0]}.org`;

    users.push({
      id: `U${String(i + 1).padStart(4, '0')}`,
      name: fullName,
      email: email,
      role: role,
      hospital: hospital,
    });
  });

  // Generate remaining users randomly
  for (let i = personas.length; i < count; i++) {
    let firstName, lastName, fullName, email, hospital, role;
    do {
      firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      fullName = `${firstName} ${lastName}`;
    } while (usedNames.has(fullName));

    usedNames.add(fullName);
    role = personas[Math.floor(Math.random() * personas.length)];
    hospital = hospitalNames[Math.floor(Math.random() * hospitalNames.length)];
    email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${Math.floor(Math.random()*100)}@${hospital.toLowerCase().replace(/ /g, '').replace(/'/g, '').split(',')[0]}.org`;
    
    users.push({
      id: `U${String(i + 1).padStart(4, '0')}`,
      name: fullName,
      email: email,
      role: role,
      hospital: hospital,
    });
  }
  return users;
};

export const allUsers = generateUsers(500);
