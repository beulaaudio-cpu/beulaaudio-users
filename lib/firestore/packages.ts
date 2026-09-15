/**
 * Firestore Package Service
 * Provides queries to fetch and update packages in Firestore,
 * with fallback to the local source-of-truth catalog.
 */

import {
  DJ_PACKAGES,
  INSTRUMENT_SETUP,
  ALL_PACKAGES,
  CUSTOM_ITEMS_CATALOG,
  EFFECT_LIGHT_OPTIONS,
  TRANSPORT_DISCLAIMER,
  formatINR,
  getPackageById as getLocalPackageById,
} from "../data/packages";
import type { PackageDefinition, PackageItem, CustomPricedItem } from "../data/packages";
import { getClientFirestore } from "../firebase/client";
import { collection, getDocs, doc, getDoc, setDoc, deleteDoc, query, where, orderBy } from "firebase/firestore";

export {
  DJ_PACKAGES,
  INSTRUMENT_SETUP,
  ALL_PACKAGES,
  CUSTOM_ITEMS_CATALOG,
  EFFECT_LIGHT_OPTIONS,
  TRANSPORT_DISCLAIMER,
  formatINR,
};
export type { PackageDefinition, PackageItem, CustomPricedItem };

/**
 * Fetch all published packages from Firestore.
 * Falls back to ALL_PACKAGES if offline or during local rendering.
 */
export async function getPublishedPackages(): Promise<PackageDefinition[]> {
  try {
    const db = getClientFirestore();
    if (!db) return ALL_PACKAGES;

    const snap = await getDocs(collection(db, "packages"));
    if (snap.empty) {
      return ALL_PACKAGES;
    }
    const docs = snap.docs
      .map((doc) => doc.data() as PackageDefinition)
      .filter((p) => p.published !== false);

    if (docs.length === 0) {
      return ALL_PACKAGES;
    }

    return docs.sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
  } catch (err) {
    console.warn("Failed to fetch packages from Firestore, using local catalog fallback:", err);
    return ALL_PACKAGES;
  }
}

/**
 * Admin: Create or update a package in Firestore
 */
export async function savePackage(pkg: PackageDefinition): Promise<boolean> {
  try {
    const db = getClientFirestore();
    if (!db) throw new Error("Firestore client not initialized");

    const docRef = doc(db, "packages", pkg.id);
    await setDoc(docRef, pkg, { merge: true });
    return true;
  } catch (err) {
    console.error("Error saving package:", err);
    throw err;
  }
}

/**
 * Admin: Delete a package from Firestore
 */
export async function deletePackage(packageId: string): Promise<boolean> {
  try {
    const db = getClientFirestore();
    if (!db) throw new Error("Firestore client not initialized");

    const docRef = doc(db, "packages", packageId);
    await deleteDoc(docRef);
    return true;
  } catch (err) {
    console.error("Error deleting package:", err);
    throw err;
  }
}

/**
 * Get a single package by ID
 */
export async function getPackageById(packageId: string): Promise<PackageDefinition | null> {
  try {
    const db = getClientFirestore();
    if (!db) {
      return getLocalPackageById(packageId) || null;
    }
    const docRef = doc(db, "packages", packageId);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data() as PackageDefinition;
    }
    return getLocalPackageById(packageId) || null;
  } catch (err) {
    console.warn(`Failed to fetch package ${packageId}, using fallback:`, err);
    return getLocalPackageById(packageId) || null;
  }
}
