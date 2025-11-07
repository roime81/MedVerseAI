'use server';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, writeBatch, doc } from 'firebase/firestore';
import { firebaseConfig } from '@/firebase/config';
import { allPatients, allWards, allTasks, staffProfiles as allStaffProfiles, allClaims, allImagingStudies, allTelehealthAppointments, initialPatientMedications } from './sample-data';
import { placeholderImages } from './placeholder-images';


// Initialize a temporary Firebase app for the script
const seedApp = initializeApp(firebaseConfig, 'seedApp');
const db = getFirestore(seedApp);

export async function seedDatabase() {
  try {
    const batch = writeBatch(db);

    // Seed Patients
    allPatients.forEach(patient => {
      if (patient.mrn) {
        const docRef = doc(db, 'patients', patient.mrn);
        // Add sample medications to a specific patient for the medications page demo
        if (patient.mrn === 'MRN-1001') {
            patient.medications = initialPatientMedications as any[];
        }
        batch.set(docRef, patient);
      }
    });
    console.log('Patients prepared for batch.');

    // Seed Wards
    allWards.forEach(ward => {
        const docRef = doc(collection(db, 'wards'));
        batch.set(docRef, ward);
    });
    console.log('Wards prepared for batch.');

    // Seed Tasks
    allTasks.forEach(task => {
        const docRef = doc(collection(db, 'tasks'));
        batch.set(docRef, task);
    });
    console.log('Tasks prepared for batch.');

    // Seed Staff Profiles
    Object.entries(allStaffProfiles).forEach(([key, profile]) => {
        // Use email as the document ID for easy lookup
        const docRef = doc(db, 'staffProfiles', profile.email);
        batch.set(docRef, profile);
    });
    console.log('Staff profiles prepared for batch.');

    // Seed Claims
    allClaims.forEach(claim => {
        const docRef = doc(db, 'claims', claim.id);
         // Assign to a random patient for demo
        const randomPatient = allPatients[Math.floor(Math.random() * allPatients.length)];
        batch.set(docRef, {...claim, patient: randomPatient.name, patientId: randomPatient.mrn });
    });
    console.log('Claims prepared for batch.');

    // Seed Imaging Studies
    allImagingStudies.forEach(study => {
        const docRef = doc(db, 'imagingStudies', study.id);
        const randomPatient = allPatients[Math.floor(Math.random() * allPatients.length)];
        const placeholder = placeholderImages.find(p => p.id === study.id);
        batch.set(docRef, { 
            ...study, 
            patient: randomPatient.name, 
            patientId: randomPatient.mrn,
            imageUrl: placeholder?.imageUrl,
            imageHint: placeholder?.imageHint,
            description: placeholder?.description,
        });
    });
    console.log('Imaging Studies prepared for batch.');
    
    // Seed Telehealth Appointments
    allTelehealthAppointments.forEach(appt => {
        const docRef = doc(collection(db, 'telehealthAppointments'));
        batch.set(docRef, appt);
    });
    console.log('Telehealth appointments prepared for batch.');


    await batch.commit();
    console.log('Database seeded successfully!');
    return { success: true, message: 'Database seeded successfully!' };
  } catch (error) {
    console.error('Error seeding database:', error);
    return { success: false, message: `Error seeding database: ${error}` };
  }
}
