export type Patient = {
  id: string;
  name: string;
  hospital: string;
  ward: string;
  bed: string;
  status: 'Occupied' | 'Discharging' | 'Admitted';
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

const firstNames = ["John", "Jane", "Peter", "Mary", "David", "Sarah", "Michael", "Jennifer", "Robert", "Emily", "William", "Jessica", "James", "Ashley", "Charles", "Amanda", "Joseph", "Melissa", "Daniel", "Laura"];
const lastNames = ["Smith", "Doe", "Jones", "Johnson", "Williams", "Brown", "Davis", "Miller", "Wilson", "Moore", "Taylor", "Anderson", "Thomas", "Jackson", "White", "Harris", "Martin", "Thompson", "Garcia", "Martinez"];

const hospitals: Hospital[] = [];
let patientIdCounter = 1;

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
      const patient: Patient = {
        id: `P${String(patientIdCounter).padStart(4, '0')}`,
        name: `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`,
        hospital: hospitalName,
        ward: ward.name,
        bed: `${ward.name.substring(0,1)}-${Math.floor(Math.random() * ward.totalBeds) + 101}`,
        status: statusOptions[Math.floor(Math.random() * statusOptions.length)],
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
