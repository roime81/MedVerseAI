'use client';
import {
  Auth,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from 'firebase/auth';

/** Initiates Google sign-in (non-blocking). */
export function initiateGoogleSignIn(authInstance: Auth): void {
  const provider = new GoogleAuthProvider();
  signInWithPopup(authInstance, provider)
    .then((result) => {
        console.log("Sign-in successful for:", result.user.displayName);
    })
    .catch((error) => {
        console.error("Google sign-in error:", error.message);
    });
}

/** Initiates Email/Password sign-in (non-blocking). */
export function initiateEmailSignIn(
  authInstance: Auth,
  email: string,
  password: string,
  onError: (errorMessage: string) => void
): void {
  signInWithEmailAndPassword(authInstance, email, password)
    .then((result) => {
      console.log("Email sign-in successful for:", result.user.email);
    })
    .catch((error) => {
      console.error("Email sign-in error:", error.message);
      let friendlyMessage = 'An unknown error occurred.';
      switch (error.code) {
        case 'auth/invalid-email':
          friendlyMessage = 'Please enter a valid email address.';
          break;
        case 'auth/user-disabled':
          friendlyMessage = 'This account has been disabled.';
          break;
        case 'auth/user-not-found':
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
          friendlyMessage = 'Invalid email or password.';
          break;
        default:
          friendlyMessage = 'Failed to sign in. Please try again.';
          break;
      }
      onError(friendlyMessage);
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
