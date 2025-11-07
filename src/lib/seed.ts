// A standalone script to seed the database.
// This is not part of the Next.js app, but a utility to run from the command line.
// Example: `npx tsx src/lib/seed.ts`

import { initializeApp, deleteApp } from 'firebase/app';
import { getFirestore, collection, doc, writeBatch, getDocs, query, where } from 'firebase/firestore';
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { firebaseConfig } from '@/firebase/config';
import { generatedData } from './sample-data';

const {
  sampleUsers,
  samplePatients,
  sampleEncounters,
  sampleConditions,
  sampleDrugExposures,
  sampleClinicalNotes,
  sampleProcedures,
  sampleCareSites,
  samplePendingTasks,
} = generatedData;


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
  const physicianUserIds = new Map();

  for (const user of sampleUsers) {
    let authUser;
    try {
      // Check if user already exists
      const q = query(collection(db, 'users'), where('email', '==', user.email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        console.warn(`User with email ${user.email} already exists. Skipping creation.`);
        authUser = { uid: querySnapshot.docs[0].id, email: user.email };
      } else {
         const userCredential = await createUserWithEmailAndPassword(
          auth,
          user.email,
          user.password
        );
        authUser = userCredential.user;
        console.log(`Successfully created auth user: ${authUser.email}`);

        await updateProfile(authUser, { displayName: user.displayName });
        console.log(`Successfully updated profile for ${authUser.email}`);
        
        const userRef = doc(db, 'users', authUser.uid);
        const { password, id, ...userData } = user; // Do not store password or static id
        await writeBatch(db).set(userRef, { ...userData, uid: authUser.uid }).commit();
        console.log(`Successfully created Firestore doc for ${authUser.email}`);
      }

      if (user.role === 'physician') {
        physicianUserIds.set(user.id, authUser.uid); // Map static ID to actual UID
      }

    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        console.warn(
          `Auth user with email ${user.email} already exists. Skipping auth creation.`
        );
      } else {
        console.error(
          `Error creating user ${user.email}:`,
          error.message
        );
      }
      continue;
    }
  }
  return physicianUserIds;
}

async function seedCollections(db, physicianUserIds) {
  const batch = writeBatch(db);

  // Remap attendingProviderId and authorId from static ID to actual UID
  const getMappedUid = (staticId) => physicianUserIds.get(staticId) || null;

  // Seed Patients
  console.log(`Seeding ${samplePatients.length} patients...`);
  samplePatients.forEach((patient) => {
    const ref = doc(db, 'patients', patient.personId);
    patient.primaryProviderId = getMappedUid(patient.primaryProviderId);
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
    encounter.attendingProviderId = getMappedUid(encounter.attendingProviderId);
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
    drug.prescribingPhysicianId = getMappedUid(drug.prescribingPhysicianId);
    batch.set(ref, drug);
  });

  // Seed Clinical Notes
  console.log(`Seeding ${sampleClinicalNotes.length} clinical notes...`);
  sampleClinicalNotes.forEach((note) => {
     const ref = doc(db, 'patients', note.personId, 'clinicalNotes', note.noteId);
     note.authorId = getMappedUid(note.authorId);
     const { personId, ...noteData } = note;
     batch.set(ref, noteData);
  });

  // Seed Procedures
  console.log(`Seeding ${sampleProcedures.length} procedures...`);
  sampleProcedures.forEach((procedure) => {
    const patientRef = doc(db, 'patients', procedure.personId, 'procedures', procedure.procedureId);
    procedure.performingClinicianId = getMappedUid(procedure.performingClinicianId);
    batch.set(patientRef, procedure);
    
    const topLevelRef = doc(db, 'procedures', procedure.procedureId);
    batch.set(topLevelRef, procedure);
  });
  
  // Seed Care Sites (Hospitals)
  console.log(`Seeding ${sampleCareSites.length} care sites...`);
  sampleCareSites.forEach((site) => {
    const ref = doc(db, 'careSites', site.careSiteId);
    batch.set(ref, site);
  });

  // Seed Pending Tasks
  console.log(`Seeding ${samplePendingTasks.length} pending tasks...`);
  samplePendingTasks.forEach((task) => {
      const userUid = getMappedUid(task.assignedTo);
      if(userUid) {
        const ref = doc(db, 'users', userUid, 'tasks', task.taskId);
        task.assignedTo = userUid;
        batch.set(ref, task);
      }
  });


  // Commit the master batch for all collections
  console.log('Committing all collection data...');
  await batch.commit();
}

async function main() {
  console.log('Starting to seed the database...');
  const { app, auth, db } = initializeAdminApp();

  try {
    // Seed users and get the mapping of static IDs to actual UIDs
    const physicianUserIds = await seedUsers(auth, db);

    // Now seed the rest of the collections, passing in the UID map
    await seedCollections(db, physicianUserIds);

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

    