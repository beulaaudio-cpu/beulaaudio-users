// lib/firestore/reviews.ts — server/client-safe Firestore service (no "use client")

import { getClientFirestore } from "../firebase/client";
import {
  collection,
  doc,
  addDoc,
  getDocs,
  setDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";

export interface ReviewDoc {
  id: string;
  userId?: string;
  userName: string;
  userEmail?: string;
  rating: number; // 1 to 5
  comment: string;
  eventTypeName?: string;
  district?: string;
  approved: boolean; // default true for instant display, admin can moderate/toggle
  createdAt: string;
  updatedAt?: string;
}

export const FALLBACK_REVIEWS: ReviewDoc[] = [

];

/**
 * Fetch all approved customer reviews in real time or single query.
 */
export async function getApprovedReviews(): Promise<ReviewDoc[]> {
  try {
    const db = getClientFirestore();
    if (!db) return FALLBACK_REVIEWS;

    const snap = await getDocs(collection(db, "reviews"));
    if (snap.empty) return FALLBACK_REVIEWS;

    const all = snap.docs.map((docSnap) => ({
      ...docSnap.data(),
      id: docSnap.id,
    })) as ReviewDoc[];

    const approved = all
      .filter((r) => r.approved !== false)
      .sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''))
      .slice(0, 50);

    return approved.length > 0 ? approved : FALLBACK_REVIEWS;
  } catch (err) {
    console.warn("Could not fetch reviews from Firestore:", err);
    return FALLBACK_REVIEWS;
  }
}

/**
 * Real-time listener for approved reviews
 */
export function subscribeApprovedReviews(
  onReviews: (reviews: ReviewDoc[]) => void
): () => void {
  const db = getClientFirestore();
  if (!db) {
    onReviews(FALLBACK_REVIEWS);
    return () => { };
  }

  try {
    return onSnapshot(
      collection(db, "reviews"),
      (snapshot) => {
        const reviews = snapshot.docs
          .map((docSnap) => ({
            ...docSnap.data(),
            id: docSnap.id,
          })) as ReviewDoc[];

        const approvedReviews = reviews
          .filter((r) => r.approved !== false)
          .sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''))
          .slice(0, 50);

        if (approvedReviews.length === 0) {
          onReviews(FALLBACK_REVIEWS);
        } else if (approvedReviews.length < 3) {
          // Combine user db reviews with curated fallback reviews to prevent sparse awkward single-card display
          const combined = [...approvedReviews];
          for (const fb of FALLBACK_REVIEWS) {
            if (!combined.some(r => r.id === fb.id || r.userName === fb.userName)) {
              combined.push(fb);
            }
          }
          onReviews(combined);
        } else {
          onReviews(approvedReviews);
        }
      },
      (error) => {
        console.warn("Reviews onSnapshot listener error:", error);
        onReviews(FALLBACK_REVIEWS);
      }
    );
  } catch (err) {
    console.warn("Could not setup review subscription:", err);
    onReviews(FALLBACK_REVIEWS);
    return () => { };
  }
}

/**
 * Submit a new customer review directly to Firestore.
 * Reviews are approved: true by default for instant display; admin can un-approve.
 */
export async function submitReview(
  review: Omit<ReviewDoc, "id" | "createdAt" | "approved"> & { userId?: string }
): Promise<{ success: boolean; reviewId?: string; error?: string }> {
  try {
    const db = getClientFirestore();
    if (!db) throw new Error("Firestore client not initialized");

    const now = new Date().toISOString();
    const reviewId = "REV-" + Math.random().toString(36).substring(2, 9).toUpperCase();
    const docRef = doc(db, "reviews", reviewId);

    // Strip undefined fields so Firestore doesn't reject them
    const payload: Record<string, unknown> = {
      id: reviewId,
      userName: review.userName,
      rating: review.rating,
      comment: review.comment,
      approved: true,
      createdAt: now,
      updatedAt: now,
    };
    if (review.userId) payload.userId = review.userId;
    if (review.userEmail) payload.userEmail = review.userEmail;
    if (review.district && review.district.trim()) payload.district = review.district.trim();
    if (review.eventTypeName && review.eventTypeName.trim()) payload.eventTypeName = review.eventTypeName.trim();

    await setDoc(docRef, payload);
    return { success: true, reviewId };
  } catch (err: any) {
    console.error("Error submitting review:", err);
    return { success: false, error: err?.message || "Failed to submit review" };
  }
}

/**
 * Admin: Get ALL reviews (approved + pending/unapproved) for admin moderation panel.
 */
export async function adminGetAllReviews(): Promise<ReviewDoc[]> {
  try {
    const db = getClientFirestore();
    if (!db) return [];
    const q = query(collection(db, "reviews"), orderBy("createdAt", "desc"), limit(200));
    const snap = await getDocs(q);
    if (snap.empty) return [];
    return snap.docs.map((d) => ({ ...d.data(), id: d.id })) as ReviewDoc[];
  } catch (err) {
    console.warn("adminGetAllReviews error:", err);
    return [];
  }
}

/**
 * Admin: Update or moderate a review (edit comment, rating, toggle approved state).
 */
export async function adminUpdateReview(
  reviewId: string,
  updates: Partial<ReviewDoc>
): Promise<boolean> {
  try {
    const db = getClientFirestore();
    if (!db) throw new Error("Firestore client not initialized");

    const docRef = doc(db, "reviews", reviewId);
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
    console.error("Error admin updating review:", err);
    throw err;
  }
}

/**
 * Admin: Delete a review.
 */
export async function adminDeleteReview(reviewId: string): Promise<boolean> {
  try {
    const db = getClientFirestore();
    if (!db) throw new Error("Firestore client not initialized");

    const docRef = doc(db, "reviews", reviewId);
    await deleteDoc(docRef);
    return true;
  } catch (err) {
    console.error("Error admin deleting review:", err);
    throw err;
  }
}
