'use client';
import {
  Auth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from 'firebase/auth';

/** Initiates Google sign-in (non-blocking). */
export function initiateGoogleSignIn(authInstance: Auth): void {
  const provider = new GoogleAuthProvider();
  // CRITICAL: Call signInWithPopup directly. Do NOT use 'await'.
  signInWithPopup(authInstance, provider)
    .then((result) => {
        // Handle successful sign-in, maybe log or emit an event
        console.log("Sign-in successful for:", result.user.displayName);
    })
    .catch((error) => {
        // Handle errors, maybe log or emit an event
        console.error("Google sign-in error:", error.message);
    });
}

/** Initiates sign-out (non-blocking). */
export function initiateSignOut(authInstance: Auth): void {
    signOut(authInstance)
     .then(() => {
        console.log("Sign-out successful.");
    })
    .catch((error) => {
        console.error("Sign-out error:", error.message);
    });
}
