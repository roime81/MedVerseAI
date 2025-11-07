// A standalone script to seed the database.
// This is not part of the Next.js app, but a utility to run from the command line.
// Example: `npx tsx src/lib/seed.ts`

import { initializeApp, deleteApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  writeBatch,
  Timestamp,
} from 'firebase/firestore';
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

async function seedDatabase() {
  console.log('Starting to seed the database...');

  // Initialize Firebase
  const firebaseApp = initializeApp(firebaseConfig);
  const db = getFirestore(firebaseApp);
  const auth = getAuth(firebaseApp);

  try {
    // Seed Users and create Auth accounts
    console.log(`Seeding ${sampleUsers.length} users...`);
    for (const user of sampleUsers) {
      try {
        // Create user in Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          user.email,
          user.password
        );
        const authUser = userCredential.user;
        console.log(`Successfully created auth user: ${authUser.email}`);

        // Add displayName to Auth user profile
        await updateProfile(authUser, { displayName: user.displayName });
        console.log(`Successfully updated profile for ${authUser.email}`);

        // Create a separate batch for this user's Firestore document
        const userDocBatch = writeBatch(db);
        const userRef = doc(db, 'users', authUser.uid);
        const { password, ...userData } = user; // Don't store password in Firestore
        userDocBatch.set(userRef, { ...userData, uid: authUser.uid });
        await userDocBatch.commit();
        console.log(`Successfully created Firestore doc for ${authUser.email}`);
      } catch (error: any) {
        if (error.code === 'auth/email-already-in-use') {
          console.warn(
            `Auth user with email ${user.email} already exists. Skipping auth creation.`
          );
        } else {
          console.error(`Error creating auth user ${user.email}:`, error);
          // If user creation fails, we should not proceed with seeding for this user
          continue;
        }
      }
    }

    const dataBatch = writeBatch(db);

    // Seed Patients
    console.log(`Seeding ${samplePatients.length} patients...`);
    for (const patient of samplePatients) {
      const patientRef = doc(db, 'patients', patient.personId);
      dataBatch.set(patientRef, patient);
    }

    // Seed Encounters
    console.log(`Seeding ${sampleEncounters.length} encounters...`);
    for (const encounter of sampleEncounters) {
      const encounterRef = doc(
        collection(db, 'patients', encounter.personId, 'encounters'),
        encounter.encounterId
      );
      dataBatch.set(encounterRef, encounter);
    }

    // Seed Conditions
    console.log(`Seeding ${sampleConditions.length} conditions...`);
    for (const condition of sampleConditions) {
      const conditionRef = doc(
        collection(db, 'patients', condition.personId, 'conditions'),
        condition.diagnosisId
      );
      dataBatch.set(conditionRef, condition);
    }

    // Seed Drug Exposures
    console.log(`Seeding ${sampleDrugExposures.length} drug exposures...`);
    for (const drug of sampleDrugExposures) {
      const drugRef = doc(
        collection(db, 'patients', drug.personId, 'drugExposures'),
        drug.medicationId
      );
      dataBatch.set(drugRef, drug);
    }

    // Seed Clinical Notes
    console.log(`Seeding ${sampleClinicalNotes.length} clinical notes...`);
    for (const note of sampleClinicalNotes) {
      const encounter = sampleEncounters.find(
        (e) => e.encounterId === note.encounterId
      );
      if (encounter) {
        const noteRef = doc(
          collection(db, 'patients', encounter.personId, 'clinicalNotes'),
          note.noteId
        );
        dataBatch.set(noteRef, note);
      }
    }

    // Seed Procedures
    console.log(`Seeding ${sampleProcedures.length} procedures...`);
    for (const procedure of sampleProcedures) {
      const procedureRef = doc(
        collection(db, 'patients', procedure.personId, 'procedures'),
        procedure.procedureId
      );
      dataBatch.set(procedureRef, procedure);
      const topLevelProcedureRef = doc(db, 'procedures', procedure.procedureId);
      dataBatch.set(topLevelProcedureRef, procedure);
    }

    // Seed Lab Results
    console.log(`Seeding ${sampleLabResults.length} lab results...`);
    for (const labResult of sampleLabResults) {
      const labResultRef = doc(
        collection(db, 'patients', labResult.personId, 'labResults'),
        labResult.labOrderId
      );
      dataBatch.set(labResultRef, labResult);
    }

    // Seed Imaging Studies
    console.log(`Seeding ${sampleImagingStudies.length} imaging studies...`);
    for (const study of sampleImagingStudies) {
      const studyRef = doc(
        collection(db, 'patients', study.personId, 'imagingStudies'),
        study.imagingOrderId
      );
      dataBatch.set(studyRef, study);
    }

    // Seed Beds
    console.log(`Seeding ${sampleBeds.length} beds...`);
    for (const bed of sampleBeds) {
      const bedRef = doc(db, 'beds', bed.bedId);
      dataBatch.set(bedRef, bed);
    }

    // Seed Care Sites (Hospitals)
    console.log(`Seeding ${sampleCareSites.length} care sites...`);
    for (const careSite of sampleCareSites) {
      const careSiteRef = doc(db, 'careSites', careSite.careSiteId);
      dataBatch.set(careSiteRef, careSite);
    }

    // Seed Costs
    console.log(`Seeding ${sampleCosts.length} costs...`);
    for (const cost of sampleCosts) {
      const costRef = doc(
        collection(db, 'patients', cost.personId, 'costs'),
        cost.chargeId
      );
      dataBatch.set(costRef, cost);
    }

    // Seed Payer Plan Periods
    console.log(
      `Seeding ${samplePayerPlanPeriods.length} payer plan periods...`
    );
    for (const plan of samplePayerPlanPeriods) {
      const planRef = doc(
        collection(db, 'patients', plan.personId, 'payerPlanPeriods'),
        plan.planId
      );
      dataBatch.set(planRef, plan);
    }

    // Seed Visit Details
    console.log(`Seeding ${sampleVisitDetails.length} visit details...`);
    for (const detail of sampleVisitDetails) {
      const detailRef = doc(
        collection(db, 'patients', detail.personId, 'visitDetails'),
        detail.visitDetailId
      );
      dataBatch.set(detailRef, detail);
    }

    // Commit the batch
    await dataBatch.commit();
    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    // Disconnect from Firebase
    await deleteApp(firebaseApp);
    console.log('Firebase app disconnected.');
  }
}

seedDatabase().then(() => {
  // Manually exit the process because the Firebase connection might keep it alive.
  console.log('Seed script finished. Exiting.');
  process.exit(0);
});