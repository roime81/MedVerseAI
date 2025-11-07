'use server';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, writeBatch } from 'firebase/firestore';
import { firebaseConfig } from '@/firebase/config';
import { allPatients, allWards, allTasks, staffProfiles as allStaffProfiles } from './sample-data';

// Initialize a temporary Firebase app for the script
const seedApp = initializeApp(firebaseConfig, 'seedApp');
const db = getFirestore(seedApp);

export async function seedDatabase() {
  try {
    const batch = writeBatch(db);

    // Seed Patients
    const patientsCollection = collection(db, 'patients');
    allPatients.forEach(patient => {
      const docRef = collection(db, 'patients').doc(patient.mrn);
      batch.set(docRef, patient);
    });
    console.log('Patients prepared for batch.');

    // Seed Wards
    const wardsCollection = collection(db, 'wards');
    allWards.forEach(ward => {
        const docRef = collection(db, 'wards').doc();
        batch.set(docRef, ward);
    });
    console.log('Wards prepared for batch.');

    // Seed Tasks
    const tasksCollection = collection(db, 'tasks');
    allTasks.forEach(task => {
        const docRef = collection(db, 'tasks').doc();
        batch.set(docRef, task);
    });
    console.log('Tasks prepared for batch.');

    // Seed Staff Profiles
    const staffProfilesCollection = collection(db, 'staffProfiles');
    Object.entries(allStaffProfiles).forEach(([key, profile]) => {
        const docRef = collection(db, 'staffProfiles').doc(key.replace(/\s+/g, '-').toLowerCase());
        batch.set(docRef, profile);
    });
    console.log('Staff profiles prepared for batch.');


    await batch.commit();
    console.log('Database seeded successfully!');
    return { success: true, message: 'Database seeded successfully!' };
  } catch (error) {
    console.error('Error seeding database:', error);
    return { success: false, message: `Error seeding database: ${error}` };
  }
}
