import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

/**
 * Public web config from `apps:sdkconfig` for virtual-internship-b25d1.
 * Env vars override it so a different project can be used without editing
 * this file. The API key is not a secret: Firestore rules decide who can read.
 */
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyAjlvSh_Y2AGAum4H8wpGowYznOsyGoT5o",
  authDomain:
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "virtual-internship-b25d1.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "virtual-internship-b25d1",
  storageBucket:
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "virtual-internship-b25d1.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "1063423671058",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:1063423671058:web:ac36a17bd9a763fba011cb",
  measurementId: "G-448R6D589E",
};

/**
 * Enterprise database in nam5. It is not the `(default)` database, so every
 * Firestore call has to name it or the SDK talks to a database that does not exist.
 */
export const FIRESTORE_DATABASE_ID = "virtual-internship-app";

export function isFirebaseConfigured() {
  return Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);
}

function getFirebaseApp(): FirebaseApp {
  if (!isFirebaseConfigured()) {
    throw new Error(
      "Firebase is not configured. Copy .env.example to .env.local and add your project keys.",
    );
  }
  return getApps().length ? getApp() : initializeApp(firebaseConfig);
}

export function getFirebaseAuth(): Auth {
  return getAuth(getFirebaseApp());
}

export function getDb(): Firestore {
  return getFirestore(getFirebaseApp(), FIRESTORE_DATABASE_ID);
}
