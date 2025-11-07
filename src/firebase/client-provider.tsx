'use client';
import React, { ReactNode } from 'react';
import { initializeFirebase, FirebaseProvider } from '@/firebase';

// Initialize Firebase and get service instances
const { firebaseApp, firestore, auth } = initializeFirebase();

/**
 * A client-side component that wraps the core FirebaseProvider.
 * This ensures that Firebase initialization only happens on the client,
 * preventing server-side execution issues.
 */
export function FirebaseClientProvider({ children }: { children: ReactNode }) {
  // Pass the initialized services as props to the main provider
  return (
    <FirebaseProvider
      firebaseApp={firebaseApp}
      firestore={firestore}
      auth={auth}
    >
      {children}
    </FirebaseProvider>
  );
}
