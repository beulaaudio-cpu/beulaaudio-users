import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";
import { getAuth, Auth } from "firebase/auth";

const clientConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyCXG17OuyL-mN9C2UTX_BztGtvSfH2_8ps",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "beulaaudi0.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "beulaaudi0",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "beulaaudi0.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "431295679857",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:431295679857:web:fbb88e4071dd1d4c5cbad0",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-F8CKE9JX5Y",
};

let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let auth: Auth | null = null;

export function getFirebaseClient() {
  if (typeof window === "undefined") {
    return { app: null, db: null, auth: null };
  }

  if (!app) {
    if (getApps().length > 0) {
      app = getApp();
    } else if (clientConfig.apiKey && clientConfig.projectId) {
      try {
        app = initializeApp(clientConfig);
      } catch (err) {
        console.warn("Failed to initialize Firebase Client SDK:", err);
      }
    }
  }

  if (app && !db) {
    db = getFirestore(app);
  }

  if (app && !auth) {
    auth = getAuth(app);
  }

  return { app, db, auth };
}

export function getClientFirestore(): Firestore | null {
  return getFirebaseClient().db;
}
