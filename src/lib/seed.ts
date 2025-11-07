// A standalone script to seed the database.
// This is not part of the Next.js app, but a utility to run from the command line.
// Example: `npx tsx src/lib/seed.ts`

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, writeBatch } from 'firebase/firestore';
import { firebaseConfig } from '@/firebase/config';

import {
  samplePatients,
  sampleEncounters,
  sampleConditions,
  sampleObservations,
  sampleMeasurements,
  sampleDrugExposures,
} from './sample-data';

async function seedDatabase() {
  console.log('Starting to seed the database...');

  // Initialize Firebase
  const firebaseApp = initializeApp(firebaseConfig);
  const db = getFirestore(firebaseApp);

  try {
    const batch = writeBatch(db);

    // Seed Patients
    console.log(`Seeding ${samplePatients.length} patients...`);
    for (const patient of samplePatients) {
      const patientRef = doc(db, 'patients', patient.personId);
      batch.set(patientRef, patient);
    }

    // Seed Encounters
    console.log(`Seeding ${sampleEncounters.length} encounters...`);
    for (const encounter of sampleEncounters) {
      const encounterRef = doc(
        collection(db, 'patients', encounter.personId, 'encounters'),
        encounter.visitOccurrenceId
      );
      batch.set(encounterRef, encounter);
    }

    // Seed Conditions
    console.log(`Seeding ${sampleConditions.length} conditions...`);
    for (const condition of sampleConditions) {
      const conditionRef = doc(
        collection(db, 'patients', condition.personId, 'conditions'),
        condition.conditionOccurrenceId
      );
      batch.set(conditionRef, condition);
    }

    // Seed Observations
    console.log(`Seeding ${sampleObservations.length} observations...`);
    for (const observation of sampleObservations) {
      const observationRef = doc(
        collection(db, 'patients', observation.personId, 'observations'),
        observation.observationId
      );
      batch.set(observationRef, observation);
    }

    // Seed Measurements
    console.log(`Seeding ${sampleMeasurements.length} measurements...`);
    for (const measurement of sampleMeasurements) {
      const measurementRef = doc(
        collection(db, 'patients', measurement.personId, 'measurements'),
        measurement.measurementId
      );
      batch.set(measurementRef, measurement);
    }

    // Seed Drug Exposures
    console.log(`Seeding ${sampleDrugExposures.length} drug exposures...`);
    for (const drug of sampleDrugExposures) {
      const drugRef = doc(
        collection(db, 'patients', drug.personId, 'drugExposures'),
        drug.drugExposureId
      );
      batch.set(drugRef, drug);
    }

    // Commit the batch
    await batch.commit();
    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

seedDatabase().then(() => {
    // Manually exit the process because the Firebase connection keeps it alive.
    process.exit();
});
