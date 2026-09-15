import { getApps, initializeApp, cert, App } from "firebase-admin/app";
import { getFirestore, Firestore } from "firebase-admin/firestore";
import { getAuth, Auth } from "firebase-admin/auth";

let adminApp: App | null = null;

export function getFirebaseAdmin(): {
  app: App | null;
  db: Firestore | null;
  auth: Auth | null;
} {
  const apps = getApps();

  if (apps.length > 0) {
    adminApp = apps[0];
  } else {
    const projectId =
      process.env.FIREBASE_ADMIN_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY
      ? process.env.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, "\n")
      : undefined;

    // Only initialize Admin SDK if valid service account credentials exist
    if (projectId && clientEmail && privateKey) {
      try {
        adminApp = initializeApp({
          credential: cert({
            projectId,
            clientEmail,
            privateKey,
          }),
        });
      } catch (err) {
        console.warn("Could not initialize Firebase Admin SDK with service account:", err);
      }
    }
  }

  const db = adminApp ? getFirestore(adminApp) : null;
  const auth = adminApp ? getAuth(adminApp) : null;

  return { app: adminApp, db, auth };
}

export function getServerFirestore(): Firestore | null {
  return getFirebaseAdmin().db;
}
