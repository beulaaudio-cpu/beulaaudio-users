import { getFirebaseAdmin } from "../firebase/server";
import { BookingSubmission } from "../validation/bookingSchema";
import {
  calculateAuthoritativePrice,
  getRequiredInventoryForSetup,
  checkInventoryAvailability,
} from "../inventory/availability";
import { INITIAL_INVENTORY, CurrentInventory } from "../data/inventory";

export interface BookingRecord {
  id: string;
  trackingId?: string;
  requestId: string;
  userId?: string;
  userEmail?: string;
  createdAt: string;
  updatedAt: string;
  source: "website" | "admin";
  status: "pending" | "confirmed" | "cancelled" | "completed" | "rejected";
  stageStatus?: string;
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
  inventoryRequirements: any[];
  totalPriceBeforeTransport: number | null;
  isCustomQuote: boolean;
  notes?: string;
}

export interface AuditRecord {
  id: string;
  bookingId: string;
  action: "created" | "updated" | "cancelled" | "confirmed" | "completed";
  source: "website" | "admin";
  actorUid?: string;
  timestamp: string;
  sequenceNumber?: number;
  details: {
    customerName: string;
    eventDate: string;
    category: string;
    totalPrice: number | null;
  };
}

// In-memory persistent stores for local dev/testing
const inMemoryBookings: Map<string, BookingRecord> = new Map();
const inMemoryAudits: AuditRecord[] = [];
let auditSequence = 0;

export async function processBookingSubmission(
  submission: BookingSubmission,
  actor?: { uid: string; role: string }
): Promise<{
  success: boolean;
  bookingId?: string;
  message?: string;
  code?: string;
  totalPrice?: number | null;
  isCustomQuote?: boolean;
}> {
  const { db } = getFirebaseAdmin();

  // 1. Authoritative price recalculation
  const pricing = calculateAuthoritativePrice({
    category: submission.setup.category,
    packageId: submission.setup.packageId,
    customItems: submission.setup.customItems,
    danceFloor: submission.setup.danceFloor,
  });

  const requirements = getRequiredInventoryForSetup({
    category: submission.setup.category,
    packageId: submission.setup.packageId,
    customItems: submission.setup.customItems,
  });

  // 2. Real Firestore transaction branch
  if (db) {
    try {
      // Check idempotency first
      const existingReqQuery = await db
        .collection("bookings")
        .where("requestId", "==", submission.requestId)
        .limit(1)
        .get();

      if (!existingReqQuery.empty) {
        const doc = existingReqQuery.docs[0];
        const data = doc.data() as BookingRecord;
        return {
          success: true,
          bookingId: doc.id,
          totalPrice: data.totalPriceBeforeTransport,
          isCustomQuote: data.isCustomQuote,
          message: "Existing booking request returned (idempotent)",
        };
      }

      // Check current inventory
      const invDoc = await db.collection("inventory").doc("current").get();
      const currentInventory: CurrentInventory = invDoc.exists
        ? (invDoc.data() as CurrentInventory)
        : INITIAL_INVENTORY;

      // Query active bookings for overlapping date
      const activeBookingsSnapshot = await db
        .collection("bookings")
        .where("event.date", "==", submission.event.date)
        .where("status", "in", ["pending", "confirmed"])
        .get();

      const existingBookings = activeBookingsSnapshot.docs.map((d: any) => d.data());

      // Availability check taking event timing into account
      const timing = {
        startTime: submission.event.startTime,
        endTime: submission.event.endTime,
        timing: submission.event.timing,
      };

      const availCheck = checkInventoryAvailability(
        requirements,
        existingBookings as any,
        currentInventory,
        timing
      );

      if (!availCheck.available) {
        return {
          success: false,
          code: "DATE_UNAVAILABLE",
          message: `The setup cannot be reserved for this date and time due to limited availability of ${availCheck.bottleneck || "equipment"}. Please choose another time slot, date, or package.`,
        };
      }

      // Generate ID
      const bookingRef = db.collection("bookings").doc();
      const now = new Date().toISOString();

      const newBooking: BookingRecord = {
        id: bookingRef.id,
        trackingId: bookingRef.id,
        requestId: submission.requestId,
        userId: (submission as any).userId,
        userEmail: (submission as any).userEmail,
        createdAt: now,
        updatedAt: now,
        source: submission.source || "website",
        status: "pending",
        stageStatus: "ordered",
        customer: {
          name: submission.customer.name,
          phone: submission.customer.phone,
        },
        event: {
          type: submission.event.type,
          customType: submission.event.customType,
          date: submission.event.date,
          startTime: submission.event.startTime || "",
          endTime: submission.event.endTime || "",
          timing: submission.event.timing || "",
          district: submission.event.district,
          address: submission.event.address,
        },
        setup: {
          category: submission.setup.category,
          packageId: submission.setup.packageId,
          packageName: submission.setup.packageName,
          customItems: submission.setup.customItems || [],
          effectLights: submission.setup.effectLights || [],
          danceFloor: submission.setup.danceFloor || null,
          basePrice: pricing.basePrice,
          customPrice: pricing.customPrice,
          danceFloorPrice: pricing.danceFloorPrice,
          transportCharge: null,
        },
        inventoryRequirements: requirements,
        totalPriceBeforeTransport: pricing.totalPrice,
        isCustomQuote: pricing.isCustomQuote,
        notes: submission.notes || "",
      };

      await bookingRef.set(newBooking);

      return {
        success: true,
        bookingId: bookingRef.id,
        totalPrice: pricing.totalPrice,
        isCustomQuote: pricing.isCustomQuote,
      };
    } catch (err: any) {
      console.error("Firestore booking error:", err);
      // Fall through to in-memory handling if Firestore fails in development
    }
  }

  // 3. In-memory fallback engine (for dev & testing)
  // Idempotency check
  for (const b of inMemoryBookings.values()) {
    if (b.requestId === submission.requestId) {
      return {
        success: true,
        bookingId: b.id,
        totalPrice: b.totalPriceBeforeTransport,
        isCustomQuote: b.isCustomQuote,
        message: "Existing booking request returned (idempotent)",
      };
    }
  }

  // Check existing bookings on this date
  const existingBookingsOnDate = Array.from(inMemoryBookings.values()).filter(
    (b) => b.event.date === submission.event.date && (b.status === "pending" || b.status === "confirmed")
  );

  const timing = {
    startTime: submission.event.startTime,
    endTime: submission.event.endTime,
    timing: submission.event.timing,
  };

  const avail = checkInventoryAvailability(requirements, existingBookingsOnDate, INITIAL_INVENTORY, timing);
  if (!avail.available) {
    return {
      success: false,
      code: "DATE_UNAVAILABLE",
      message: `The setup cannot be reserved for this date and time due to limited availability of ${avail.bottleneck || "equipment"}. Please choose another time slot, date, or package.`,
    };
  }

  const bookingId = "BK-" + Math.random().toString(36).substring(2, 9).toUpperCase();
  const auditId = "AUD-" + Math.random().toString(36).substring(2, 9).toUpperCase();
  const now = new Date().toISOString();

  const newBooking: BookingRecord = {
    id: bookingId,
    trackingId: bookingId,
    requestId: submission.requestId,
    userId: (submission as any).userId,
    userEmail: (submission as any).userEmail,
    createdAt: now,
    updatedAt: now,
    source: submission.source || "website",
    status: "pending",
    stageStatus: "ordered",
    customer: {
      name: submission.customer.name,
      phone: submission.customer.phone,
    },
    event: {
      type: submission.event.type,
      customType: submission.event.customType,
      date: submission.event.date,
      startTime: submission.event.startTime || "",
      endTime: submission.event.endTime || "",
      timing: submission.event.timing || "",
      district: submission.event.district,
      address: submission.event.address,
    },
    setup: {
      category: submission.setup.category,
      packageId: submission.setup.packageId,
      packageName: submission.setup.packageName,
      customItems: submission.setup.customItems || [],
      effectLights: submission.setup.effectLights || [],
      danceFloor: submission.setup.danceFloor || null,
      basePrice: pricing.basePrice,
      customPrice: pricing.customPrice,
      danceFloorPrice: pricing.danceFloorPrice,
      transportCharge: null,
    },
    inventoryRequirements: requirements,
    totalPriceBeforeTransport: pricing.totalPrice,
    isCustomQuote: pricing.isCustomQuote,
    notes: submission.notes || "",
  };

  inMemoryBookings.set(bookingId, newBooking);

  auditSequence++;
  const newAudit: AuditRecord = {
    id: auditId,
    bookingId,
    action: "created",
    source: submission.source || "website",
    actorUid: actor?.uid,
    timestamp: now,
    sequenceNumber: auditSequence,
    details: {
      customerName: submission.customer.name,
      eventDate: submission.event.date,
      category: submission.setup.category,
      totalPrice: pricing.totalPrice,
    },
  };

  inMemoryAudits.push(newAudit);

  // Enforce 100-row limit in memory
  while (inMemoryAudits.length > 100) {
    inMemoryAudits.shift();
  }

  return {
    success: true,
    bookingId,
    totalPrice: pricing.totalPrice,
    isCustomQuote: pricing.isCustomQuote,
  };
}

// Helpers for automated test verification
export function getInMemoryBookings() {
  return inMemoryBookings;
}

export function getInMemoryAudits() {
  return inMemoryAudits;
}

export function resetInMemoryStore() {
  inMemoryBookings.clear();
  inMemoryAudits.length = 0;
  auditSequence = 0;
}
