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


export const allPatients: Patient[] = [
  { id: 1, name: 'Jane Doe', ward: 'Cardiology', hospital: 'City General', consultant: 'Dr. Evans', status: 'Occupied', mrn: 'MRN-0001' },
  { id: 2, name: 'John Smith', ward: 'Orthopedics', hospital: 'City General', consultant: 'Dr. Chen', status: 'Occupied', mrn: 'MRN-0002' },
  { id: 3, name: 'Peter Jones', ward: 'Neurology', hospital: 'St. Lukes', consultant: 'Dr. Rodriguez', status: 'Occupied', mrn: 'MRN-0003' },
  { id: 4, name: 'Mary Johnson', ward: 'Pediatrics', hospital: 'St. Lukes', consultant: 'Dr. Williams', status: 'Discharging', mrn: 'MRN-0004' },
  { id: 5, name: 'David Williams', ward: 'Oncology', hospital: 'City General', consultant: 'Dr. Evans', status: 'Admitted', mrn: 'MRN-0005' },
  { id: 6, name: 'Sarah Brown', ward: 'Cardiology', hospital: 'MetroWest', consultant: 'Dr. Evans', status: 'Occupied', mrn: 'MRN-0006' },
  { id: 7, name: 'Michael Davis', ward: 'Geriatrics', hospital: 'MetroWest', consultant: 'Dr. Smith', status: 'Occupied', mrn: 'MRN-0007' },
  { id: 8, name: 'Emily Miller', ward: 'ICU', hospital: 'City General', consultant: 'Dr. Evans', status: 'Occupied', mrn: 'MRN-0008' },
  { id: 9, name: 'Jessica Garcia', ward: 'Maternity', hospital: 'St. Lukes', consultant: 'Dr. Jones', status: 'Discharging', mrn: 'MRN-0009' },
  { id: 10, name: 'James Rodriguez', ward: 'Surgery', hospital: 'City General', consultant: 'Dr. Chen', status: 'Admitted', mrn: 'MRN-0010' },
  { id: 11, name: 'Jane Doe', ward: 'Psychiatry', hospital: 'MetroWest', consultant: 'Dr. Rodriguez', status: 'Occupied', mrn: 'MRN-0011' },
  { id: 12, name: 'John Smith', ward: 'Cardiology', hospital: 'St. Lukes', consultant: 'Dr. Evans', status: 'Occupied', mrn: 'MRN-0012' },
  { id: 13, name: 'Peter Jones', ward: 'Oncology', hospital: 'City General', consultant: 'Dr. Rodriguez', status: 'Discharging', mrn: 'MRN-0013' },
];

export const allWards: Ward[] = [
  { name: 'Cardiology', hospital: 'City General', totalBeds: 20, occupiedBeds: 18 },
  { name: 'Orthopedics', hospital: 'City General', totalBeds: 25, occupiedBeds: 22 },
  { name: 'Oncology', hospital: 'City General', totalBeds: 15, occupiedBeds: 14 },
  { name: 'ICU', hospital: 'City General', totalBeds: 10, occupiedBeds: 10 },
  { name: 'Surgery', hospital: 'City General', totalBeds: 30, occupiedBeds: 25 },
  { name: 'Neurology', hospital: 'St. Lukes', totalBeds: 18, occupiedBeds: 15 },
  { name: 'Pediatrics', hospital: 'St. Lukes', totalBeds: 12, occupiedBeds: 8 },
  { name: 'Maternity', hospital: 'St. Lukes', totalBeds: 15, occupiedBeds: 10 },
  { name: 'Cardiology', hospital: 'St. Lukes', totalBeds: 20, occupiedBeds: 19 },
  { name: 'Geriatrics', hospital: 'MetroWest', totalBeds: 30, occupiedBeds: 28 },
  { name: 'Psychiatry', hospital: 'MetroWest', totalBeds: 22, occupiedBeds: 20 },
  { name: 'Cardiology', hospital: 'MetroWest', totalBeds: 20, occupiedBeds: 15 },
];

export const allTasks: Task[] = [
    { description: 'Review lab results', patient: 'David Lee', mrn: 'MRN-1055', time: '30 min ago', priority: 'High' },
    { description: 'Sign prescription refill', patient: 'Patricia Brown', mrn: 'MRN-0921', time: '1 hour ago', priority: 'Medium' },
    { description: 'Complete discharge summary', patient: 'James Martinez', mrn: 'MRN-0847', time: '2 hours ago', priority: 'High' },
    { description: 'Review imaging results', patient: 'David Lee', mrn: 'MRN-1055', time: '3 hours ago', priority: 'Low' },
    { description: 'Call patient family for update', patient: 'Sarah Johnson', mrn: 'MRN-0921', time: '4 hours ago', priority: 'Low' },
    { description: 'Prepare for team huddle', patient: 'System Task', mrn: 'N/A', time: '4 hours ago', priority: 'Medium' },
];
