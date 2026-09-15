import { NextRequest, NextResponse } from "next/server";
import {
  getRequiredInventoryForSetup,
  checkInventoryAvailability,
  calculateInventoryTally,
  EventTiming,
} from "@/lib/inventory/availability";
import { getFirebaseAdmin } from "@/lib/firebase/server";
import { INITIAL_INVENTORY, CurrentInventory } from "@/lib/data/inventory";
import { getInMemoryBookings } from "@/lib/firestore/bookings";

async function evaluateAvailability(params: {
  date: string;
  category: "dj" | "instrument" | "custom";
  packageId?: string;
  customItems?: { itemId: string; quantity: number }[];
  startTime?: string;
  endTime?: string;
  timing?: string;
  slot?: string;
}) {
  const { date, category, packageId, customItems, startTime, endTime, timing, slot } = params;
  const timingContext: EventTiming = { startTime, endTime, timing, slot };

  const requirements = getRequiredInventoryForSetup({
    category,
    packageId,
    customItems,
  });

  const { db } = getFirebaseAdmin();

  if (db) {
    try {
      const invDoc = await db.collection("inventory").doc("current").get();
      const currentInventory: CurrentInventory = invDoc.exists
        ? (invDoc.data() as CurrentInventory)
        : INITIAL_INVENTORY;

      const activeBookingsSnapshot = await db
        .collection("bookings")
        .where("event.date", "==", date)
        .where("status", "in", ["pending", "confirmed"])
        .get();

      const existingBookings = activeBookingsSnapshot.docs.map((d) => d.data());

      const tally = calculateInventoryTally(existingBookings as any, timingContext, currentInventory);
      const check = checkInventoryAvailability(
        requirements,
        existingBookings as any,
        currentInventory,
        timingContext
      );

      return {
        success: true,
        date,
        timing: timingContext,
        available: check.available,
        status: check.status,
        bottleneck: check.bottleneck,
        remainingDetails: check.remainingDetails,
        tally,
        message: check.available
          ? check.status === "LIMITED"
            ? "Setup has limited stock remaining for this date & time"
            : "Setup is fully available for your selected date & time slot"
          : `Out of Stock: ${check.bottleneck || "Equipment unavailable for this slot"}`,
      };
    } catch (err) {
      console.warn("Firestore availability check fallback:", err);
    }
  }

  // In-memory fallback
  const inMemoryBookings = Array.from(getInMemoryBookings().values()).filter(
    (b) => b.event.date === date && (b.status === "pending" || b.status === "confirmed")
  );

  const tally = calculateInventoryTally(inMemoryBookings, timingContext, INITIAL_INVENTORY);
  const check = checkInventoryAvailability(
    requirements,
    inMemoryBookings,
    INITIAL_INVENTORY,
    timingContext
  );

  return {
    success: true,
    date,
    timing: timingContext,
    available: check.available,
    status: check.status,
    bottleneck: check.bottleneck,
    remainingDetails: check.remainingDetails,
    tally,
    message: check.available
      ? check.status === "LIMITED"
        ? "Setup has limited stock remaining for this date & time"
        : "Setup is fully available for your selected date & time slot"
      : `Out of Stock: ${check.bottleneck || "Equipment unavailable for this slot"}`,
  };
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date");
    const category = searchParams.get("category") as "dj" | "instrument" | "custom" | null;
    const packageId = searchParams.get("packageId") || undefined;
    const startTime = searchParams.get("startTime") || undefined;
    const endTime = searchParams.get("endTime") || undefined;
    const timing = searchParams.get("timing") || undefined;
    const slot = searchParams.get("slot") || undefined;

    if (!date) {
      return NextResponse.json(
        { success: false, status: "DATE_REQUIRED", message: "Event date is required" },
        { status: 400 }
      );
    }

    if (!category) {
      return NextResponse.json(
        { success: false, status: "CATEGORY_REQUIRED", message: "Setup category is required" },
        { status: 400 }
      );
    }

    const result = await evaluateAvailability({
      date,
      category,
      packageId,
      startTime,
      endTime,
      timing,
      slot,
    });

    return NextResponse.json(result);
  } catch (err: any) {
    console.error("Availability API error:", err);
    return NextResponse.json(
      { success: false, status: "ERROR", message: "Failed to evaluate availability." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { date, category, packageId, customItems, startTime, endTime, timing, slot } = body;

    if (!date) {
      return NextResponse.json(
        { success: false, status: "DATE_REQUIRED", message: "Event date is required" },
        { status: 400 }
      );
    }

    if (!category) {
      return NextResponse.json(
        { success: false, status: "CATEGORY_REQUIRED", message: "Setup category is required" },
        { status: 400 }
      );
    }

    const result = await evaluateAvailability({
      date,
      category,
      packageId,
      customItems,
      startTime,
      endTime,
      timing,
      slot,
    });

    return NextResponse.json(result);
  } catch (err: any) {
    console.error("Availability API POST error:", err);
    return NextResponse.json(
      { success: false, status: "ERROR", message: "Failed to evaluate availability." },
      { status: 500 }
    );
  }
}
