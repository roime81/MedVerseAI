// A standalone script to seed the database.
// This is not part of the Next.js app, but a utility to run from the command line.
// Example: `npx tsx src/lib/seed.ts`

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, writeBatch, Timestamp } from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
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
    const batch = writeBatch(db);

    // Seed Users and create Auth accounts
    console.log(`Seeding ${sampleUsers.length} users...`);
    for (const user of sampleUsers) {
      try {
        // Create user in Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(auth, user.email, user.password);
        const authUser = userCredential.user;
        console.log(`Successfully created auth user: ${authUser.email}`);
        
        // Add user data to Firestore
        const userRef = doc(db, 'users', authUser.uid);
        const { password, ...userData } = user; // Don't store password in Firestore
        batch.set(userRef, { ...userData, uid: authUser.uid });

      } catch (error) {
        if (error.code === 'auth/email-already-in-use') {
          console.warn(`Auth user with email ${user.email} already exists. Skipping creation.`);
        } else {
          console.error(`Error creating auth user ${user.email}:`, error);
        }
      }
    }


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
        encounter.encounterId
      );
      batch.set(encounterRef, encounter);
    }

    // Seed Conditions
    console.log(`Seeding ${sampleConditions.length} conditions...`);
    for (const condition of sampleConditions) {
      const conditionRef = doc(
        collection(db, 'patients', condition.personId, 'conditions'),
        condition.diagnosisId
      );
      batch.set(conditionRef, condition);
    }

    // Seed Drug Exposures
    console.log(`Seeding ${sampleDrugExposures.length} drug exposures...`);
    for (const drug of sampleDrugExposures) {
      const drugRef = doc(
        collection(db, 'patients', drug.personId, 'drugExposures'),
        drug.medicationId
      );
      batch.set(drugRef, drug);
    }
    
    // Seed Clinical Notes
    console.log(`Seeding ${sampleClinicalNotes.length} clinical notes...`);
    for (const note of sampleClinicalNotes) {
        const encounter = sampleEncounters.find(e => e.encounterId === note.encounterId);
        if (encounter) {
            const noteRef = doc(collection(db, 'patients', encounter.personId, 'clinicalNotes'), note.noteId);
            batch.set(noteRef, note);
        }
    }

    // Seed Procedures
    console.log(`Seeding ${sampleProcedures.length} procedures...`);
    for (const procedure of sampleProcedures) {
        const procedureRef = doc(collection(db, 'patients', procedure.personId, 'procedures'), procedure.procedureId);
        batch.set(procedureRef, procedure);
        const topLevelProcedureRef = doc(db, 'procedures', procedure.procedureId);
        batch.set(topLevelProcedureRef, procedure);
    }

    // Seed Lab Results
    console.log(`Seeding ${sampleLabResults.length} lab results...`);
    for (const labResult of sampleLabResults) {
        const labResultRef = doc(collection(db, 'patients', labResult.personId, 'labResults'), labResult.labOrderId);
        batch.set(labResultRef, labResult);
    }

    // Seed Imaging Studies
    console.log(`Seeding ${sampleImagingStudies.length} imaging studies...`);
    for (const study of sampleImagingStudies) {
        const studyRef = doc(collection(db, 'patients', study.personId, 'imagingStudies'), study.imagingOrderId);
        batch.set(studyRef, study);
    }

    // Seed Beds
    console.log(`Seeding ${sampleBeds.length} beds...`);
    for (const bed of sampleBeds) {
      const bedRef = doc(db, 'beds', bed.bedId);
      batch.set(bedRef, bed);
    }

    // Seed Care Sites (Hospitals)
    console.log(`Seeding ${sampleCareSites.length} care sites...`);
    for (const careSite of sampleCareSites) {
      const careSiteRef = doc(db, 'careSites', careSite.careSiteId);
      batch.set(careSiteRef, careSite);
    }

    // Seed Costs
    console.log(`Seeding ${sampleCosts.length} costs...`);
    for (const cost of sampleCosts) {
      const costRef = doc(
        collection(db, 'patients', cost.personId, 'costs'),
        cost.chargeId
      );
      batch.set(costRef, cost);
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
      batch.set(planRef, plan);
    }

    // Seed Visit Details
    console.log(`Seeding ${sampleVisitDetails.length} visit details...`);
    for (const detail of sampleVisitDetails) {
      const detailRef = doc(
        collection(db, 'patients', detail.personId, 'visitDetails'),
        detail.visitDetailId
      );
      batch.set(detailRef, detail);
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
    console.log('Seed script finished. Exiting.');
    process.exit(0);
});
