"use client";

import {
  doc,
  setDoc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  orderBy,
  limit,
} from "firebase/firestore";
import { getFirebaseClient } from "../firebase/client";

export type OrderStageStatus =
  | "ordered"
  | "accepted"
  | "declined"
  | "shipped"
  | "on_live"
  | "completed";

export interface FirestoreBookingDoc {
  id: string;
  trackingId: string;
  requestId: string;
  userId?: string;
  userEmail?: string;
  source: "website" | "admin";
  status: "pending" | "confirmed" | "cancelled" | "completed" | "rejected";
  stageStatus: OrderStageStatus;
  createdAt: string;
  updatedAt: string;
  customer: {
    name: string;
    phone: string;
  };
  event: {
    type: string;
    customType?: string;
    date: string;
    startTime?: string;
    endTime?: string;
    timing?: string;
    district: string;
    address: string;
  };
  setup: {
    category: "dj" | "instrument" | "custom";
    packageId?: string;
    packageName?: string;
    customItems?: any[];
    effectLights?: any[];
    danceFloor?: any;
    basePrice: number | null;
    customPrice: number;
    danceFloorPrice: number;
    transportCharge: null;
  };
  totalPriceBeforeTransport: number | null;
  isCustomQuote: boolean;
  notes?: string;
  cancellationReason?: string;
  cancelledBy?: string;
}

/**
 * Saves a new booking directly to Firestore client database.
 */
/**
 * Recursively removes undefined fields from an object so Firestore setDoc does not throw
 * "Unsupported field value: undefined".
 */
function cleanUndefinedFields<T>(obj: T): T {
  if (obj === null || obj === undefined || typeof obj !== "object") {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map((item) => cleanUndefinedFields(item)) as unknown as T;
  }
  const cleaned: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
      cleaned[key] = cleanUndefinedFields(value);
    }
  }
  return cleaned as T;
}

export async function saveClientBookingToFirestore(booking: FirestoreBookingDoc): Promise<{
  success: boolean;
  bookingId: string;
  error?: string;
}> {
  const { db } = getFirebaseClient();
  if (!db) {
    console.warn("Firestore client not initialized.");
    return { success: false, bookingId: booking.id, error: "Database not connected" };
  }

  try {
    const sanitizedBooking = cleanUndefinedFields(booking);
    const bookingRef = doc(db, "bookings", booking.id);
    await setDoc(bookingRef, sanitizedBooking);

    return { success: true, bookingId: booking.id };
  } catch (err: any) {
    console.error("Firestore client write error:", err);
    return { success: false, bookingId: booking.id, error: err?.message || "Write failed" };
  }
}

/**
 * Retrieves all bookings created by a specific user UID.
 */
export async function fetchUserBookings(userId: string): Promise<FirestoreBookingDoc[]> {
  const { db } = getFirebaseClient();
  if (!db || !userId) return [];

  try {
    const q = query(
      collection(db, "bookings"),
      where("userId", "==", userId)
    );

    const snapshot = await getDocs(q);
    const bookings: FirestoreBookingDoc[] = [];

    snapshot.forEach((docSnap) => {
      const data = docSnap.data() as FirestoreBookingDoc;
      bookings.push({
        ...data,
        id: docSnap.id,
        trackingId: data.trackingId || docSnap.id,
        stageStatus: data.stageStatus || (data.status === "confirmed" ? "accepted" : "ordered"),
      });
    });

    // Sort by createdAt desc
    bookings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return bookings;
  } catch (err) {
    console.warn("fetchUserBookings error:", err);
    return [];
  }
}

/**
 * Searches for a single booking by Tracking ID or Booking ID.
 */
export async function fetchBookingByTrackingId(
  trackingId: string
): Promise<FirestoreBookingDoc | null> {
  const { db } = getFirebaseClient();
  if (!db || !trackingId.trim()) return null;

  const cleanId = trackingId.trim();

  try {
    // 1. Check direct doc ID
    const docRef = doc(db, "bookings", cleanId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data() as FirestoreBookingDoc;
      return {
        ...data,
        id: docSnap.id,
        trackingId: data.trackingId || docSnap.id,
        stageStatus: data.stageStatus || (data.status === "confirmed" ? "accepted" : "ordered"),
      };
    }

    // 2. Query by trackingId field
    const q1 = query(collection(db, "bookings"), where("trackingId", "==", cleanId), limit(1));
    const snap1 = await getDocs(q1);
    if (!snap1.empty) {
      const d = snap1.docs[0];
      const data = d.data() as FirestoreBookingDoc;
      return {
        ...data,
        id: d.id,
        trackingId: data.trackingId || d.id,
        stageStatus: data.stageStatus || (data.status === "confirmed" ? "accepted" : "ordered"),
      };
    }

    // 3. Query by requestId
    const q2 = query(collection(db, "bookings"), where("requestId", "==", cleanId), limit(1));
    const snap2 = await getDocs(q2);
    if (!snap2.empty) {
      const d = snap2.docs[0];
      const data = d.data() as FirestoreBookingDoc;
      return {
        ...data,
        id: d.id,
        trackingId: data.trackingId || d.id,
        stageStatus: data.stageStatus || (data.status === "confirmed" ? "accepted" : "ordered"),
      };
    }

    return null;
  } catch (err) {
    console.warn("fetchBookingByTrackingId error:", err);
    return null;
  }
}
