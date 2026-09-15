/**
 * Firestore Settings Service
 * Real-time listener and reader for settings/site in Firestore.
 */

import { getClientFirestore } from "../firebase/client";
import { doc, getDoc, onSnapshot, setDoc } from "firebase/firestore";

export interface SiteSettings {
  contactPhone: string;
  contactEmail: string;
  instagramHandle: string;
  instagramUrl: string;
  statYears: string;
  statEvents: string;
  statReliability: string;
  transportDisclaimer: string;
  updatedAt?: string;
}

export const DEFAULT_SETTINGS: SiteSettings = {
  contactPhone: "+91 89395 30757",
  contactEmail: "beulaaudio@gmail.com",
  instagramHandle: "beula_audio_dj_instruments",
  instagramUrl: "https://www.instagram.com/beula_audio_dj_instruments/",
  statYears: "9+",
  statEvents: "1,500+",
  statReliability: "100%",
  transportDisclaimer:
    "Transportation / delivery charges are not included in the package price. Transportation charges may vary depending on event location.",
};

/**
 * Real-time subscriber for settings/site document
 */
export function subscribeSiteSettings(callback: (settings: SiteSettings) => void): () => void {
  try {
    const db = getClientFirestore();
    if (!db) {
      callback(DEFAULT_SETTINGS);
      return () => {};
    }

    const docRef = doc(db, "settings", "site");
    return onSnapshot(
      docRef,
      (snap) => {
        if (snap.exists()) {
          callback({
            ...DEFAULT_SETTINGS,
            ...(snap.data() as Partial<SiteSettings>),
          });
        } else {
          callback(DEFAULT_SETTINGS);
        }
      },
      (err) => {
        console.warn("Error subscribing to site settings, using default:", err);
        callback(DEFAULT_SETTINGS);
      }
    );
  } catch (err) {
    console.warn("Failed to subscribe to site settings:", err);
    callback(DEFAULT_SETTINGS);
    return () => {};
  }
}

/**
 * Fetch global site settings from settings/site with local default fallback.
 */
export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const db = getClientFirestore();
    if (!db) return DEFAULT_SETTINGS;

    const docRef = doc(db, "settings", "site");
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return {
        ...DEFAULT_SETTINGS,
        ...(snap.data() as Partial<SiteSettings>),
      };
    }
    return DEFAULT_SETTINGS;
  } catch (err) {
    console.warn("Using default settings fallback:", err);
    return DEFAULT_SETTINGS;
  }
}

/**
 * Admin: Update site settings in Firestore
 */
export async function updateSiteSettings(updates: Partial<SiteSettings>): Promise<boolean> {
  try {
    const db = getClientFirestore();
    if (!db) throw new Error("Firestore client not initialized");

    const docRef = doc(db, "settings", "site");
    await setDoc(
      docRef,
      {
        ...updates,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
    return true;
  } catch (err) {
    console.error("Error updating site settings:", err);
    throw err;
  }
}
