/**
 * Firestore Inventory Service
 * Interfaces with inventory/current document in Firestore.
 */

import { INITIAL_INVENTORY, INVENTORY_ITEM_NAMES } from "../data/inventory";
import type { CurrentInventory } from "../data/inventory";
import { getClientFirestore } from "../firebase/client";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export { INITIAL_INVENTORY, INVENTORY_ITEM_NAMES };
export type { CurrentInventory };

/**
 * Retrieve current inventory totals from inventory/current.
 * Falls back to INITIAL_INVENTORY from ItemQuantity.txt if offline or not seeded.
 */
export async function getCurrentInventory(): Promise<CurrentInventory> {
  try {
    const db = getClientFirestore();
    if (!db) return INITIAL_INVENTORY;

    const docRef = doc(db, "inventory", "current");
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data() as CurrentInventory;
    }
    return INITIAL_INVENTORY;
  } catch (err) {
    console.warn("Failed to fetch inventory from Firestore, using initial inventory fallback:", err);
    return INITIAL_INVENTORY;
  }
}

/**
 * Admin: Update inventory document in Firestore
 */
export async function updateInventory(updates: Partial<CurrentInventory>): Promise<boolean> {
  try {
    const db = getClientFirestore();
    if (!db) throw new Error("Firestore client not initialized");

    const docRef = doc(db, "inventory", "current");
    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
    return true;
  } catch (err) {
    console.error("Error updating inventory:", err);
    throw err;
  }
}
