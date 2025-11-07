// A standalone script to seed the database.
// This is not part of the Next.js app, but a utility to run from the command line.
// Example: `npx tsx src/lib/seed.ts`

import { initializeApp, deleteApp } from 'firebase/app';
import { getFirestore, collection, doc, writeBatch } from 'firebase/firestore';
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { firebaseConfig } from '@/firebase/config';

import {
  samplePatients,
  sampleEncounters,
  sampleConditions,
  sampleDrugExposures,
  sampleBeds,
  sampleCareSites,
  sampleCosts,
  samplePayerPlanPeriods,
  sampleVisitDetails,
  sampleClinicalNotes,
  sampleProcedures,
  sampleLabResults,
  sampleImagingStudies,
  sampleUsers,
} from './sample-data';

// IMPORTANT: This script is destructive and will overwrite data.
// It is intended for development and testing purposes only.

/**
 * Initializes a temporary Firebase app for the script's execution.
 * We use a separate initialization function to avoid conflicts with the main app.
 */
function initializeAdminApp() {
  const adminApp = initializeApp(firebaseConfig, 'admin-app-for-seeding');
  return {
    app: adminApp,
    db: getFirestore(adminApp),
    auth: getAuth(adminApp),
  };
}

async function seedUsers(auth, db) {
  console.log(`Seeding ${sampleUsers.length} users...`);
  for (const user of sampleUsers) {
    try {
      // 1. Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        user.email,
        user.password
      );
      const authUser = userCredential.user;
      console.log(`Successfully created auth user: ${authUser.email}`);

      // 2. Add displayName to Auth user profile
      await updateProfile(authUser, { displayName: user.displayName });
      console.log(`Successfully updated profile for ${authUser.email}`);

      // 3. Create the user document in Firestore in a separate batch
      const userDocBatch = writeBatch(db);
      const userRef = doc(db, 'users', authUser.uid);
      const { password, ...userData } = user; // Do not store password in Firestore
      userDocBatch.set(userRef, { ...userData, uid: authUser.uid });
      await userDocBatch.commit();
      console.log(`Successfully created Firestore doc for ${authUser.email}`);
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        console.warn(
          `Auth user with email ${user.email} already exists. Skipping auth creation, but will attempt to seed data.`
        );
      } else {
        // Log other auth errors but continue if possible
        console.error(
          `Error creating auth user ${user.email}:`,
          error.message
        );
        // If user creation fails, we must skip to the next user.
        continue;
      }
    }
  }
}

async function seedCollections(db) {
  const batch = writeBatch(db);

  // Seed Patients
  console.log(`Seeding ${samplePatients.length} patients...`);
  samplePatients.forEach((patient) => {
    const ref = doc(db, 'patients', patient.personId);
    batch.set(ref, patient);
  });

  // Seed Encounters
  console.log(`Seeding ${sampleEncounters.length} encounters...`);
  sampleEncounters.forEach((encounter) => {
    const ref = doc(
      db,
      'patients',
      encounter.personId,
      'encounters',
      encounter.encounterId
    );
    batch.set(ref, encounter);
  });

  // Seed Conditions
  console.log(`Seeding ${sampleConditions.length} conditions...`);
  sampleConditions.forEach((condition) => {
    const ref = doc(
      db,
      'patients',
      condition.personId,
      'conditions',
      condition.diagnosisId
    );
    batch.set(ref, condition);
  });

  // Seed Drug Exposures
  console.log(`Seeding ${sampleDrugExposures.length} drug exposures...`);
  sampleDrugExposures.forEach((drug) => {
    const ref = doc(
      db,
      'patients',
      drug.personId,
      'drugExposures',
      drug.medicationId
    );
    batch.set(ref, drug);
  });

  // Seed Clinical Notes
  console.log(`Seeding ${sampleClinicalNotes.length} clinical notes...`);
  sampleClinicalNotes.forEach((note) => {
    const encounter = sampleEncounters.find(e => e.encounterId === note.encounterId);
    if(encounter) {
        const ref = doc(db, 'patients', encounter.personId, 'clinicalNotes', note.noteId);
        batch.set(ref, note);
    }
  });

  // Seed Procedures
  console.log(`Seeding ${sampleProcedures.length} procedures...`);
  sampleProcedures.forEach((procedure) => {
    const patientRef = doc(db, 'patients', procedure.personId, 'procedures', procedure.procedureId);
    batch.set(patientRef, procedure);
    const topLevelRef = doc(db, 'procedures', procedure.procedureId);
    batch.set(topLevelRef, procedure);
  });
  
  // Seed Lab Results
  console.log(`Seeding ${sampleLabResults.length} lab results...`);
  sampleLabResults.forEach((labResult) => {
    const ref = doc(db, 'patients', labResult.personId, 'labResults', labResult.labOrderId);
    batch.set(ref, labResult);
  });

  // Seed Imaging Studies
  console.log(`Seeding ${sampleImagingStudies.length} imaging studies...`);
  sampleImagingStudies.forEach((study) => {
    const ref = doc(db, 'patients', study.personId, 'imagingStudies', study.imagingOrderId);
    batch.set(ref, study);
  });

  // Seed Beds
  console.log(`Seeding ${sampleBeds.length} beds...`);
  sampleBeds.forEach((bed) => {
    const ref = doc(db, 'beds', bed.bedId);
    batch.set(ref, bed);
  });

  // Seed Care Sites (Hospitals)
  console.log(`Seeding ${sampleCareSites.length} care sites...`);
  sampleCareSites.forEach((site) => {
    const ref = doc(db, 'careSites', site.careSiteId);
    batch.set(ref, site);
  });

  // Seed Costs
  console.log(`Seeding ${sampleCosts.length} costs...`);
  sampleCosts.forEach((cost) => {
    const ref = doc(db, 'patients', cost.personId, 'costs', cost.chargeId);
    batch.set(ref, cost);
  });

  // Seed Payer Plan Periods
  console.log(`Seeding ${samplePayerPlanPeriods.length} payer plan periods...`);
  samplePayerPlanPeriods.forEach((plan) => {
    const ref = doc(db, 'patients', plan.personId, 'payerPlanPeriods', plan.planId);
    batch.set(ref, plan);
  });

  // Seed Visit Details
  console.log(`Seeding ${sampleVisitDetails.length} visit details...`);
  sampleVisitDetails.forEach((detail) => {
    const ref = doc(db, 'patients', detail.personId, 'visitDetails', detail.visitDetailId);
    batch.set(ref, detail);
  });

  // Commit the master batch for all collections
  console.log('Committing all collection data...');
  await batch.commit();
}

async function main() {
  console.log('Starting to seed the database...');
  const { app, auth, db } = initializeAdminApp();

  try {
    // We must seed users first and separately, as other data may depend on them.
    await seedUsers(auth, db);

    // Now seed the rest of the collections
    await seedCollections(db);

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('An error occurred during database seeding:', error);
  } finally {
    // Clean up the temporary Firebase app
    await deleteApp(app);
    console.log('Firebase admin app disconnected.');
  }
}

main()
  .then(() => {
    console.log('Seed script finished.');
    process.exit(0);
  })
  .catch((e) => {
    console.error('Seed script failed with an unhandled error:', e);
    process.exit(1);
  });
