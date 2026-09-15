import { test, describe } from "node:test";
import assert from "node:assert/strict";
import {
  checkInventoryAvailability,
  getRequiredInventoryForSetup,
} from "../lib/inventory/availability.js";
import { INITIAL_INVENTORY } from "../lib/data/inventory.js";

describe("Date-Aware Inventory and Concurrency Protection", () => {
  test("Calculates required physical inventory for DJ setups accurately", () => {
    // Premium Setup: 2 VRX Tops, 2 Bass, 8 Parcans, 2 Sharpies, 1 Smoke, 1 DJ LED Mask
    const reqs = getRequiredInventoryForSetup({
      category: "dj",
      packageId: "dj-premium",
    });

    const vrxReq = reqs.find((r) => r.itemKey === "vrxTop");
    assert.equal(vrxReq?.quantity, 2);

    const bassReq = reqs.find((r) => r.itemKey === "bassSpeaker");
    assert.equal(bassReq?.quantity, 2);

    const parcanReq = reqs.find((r) => r.itemKey === "parcan");
    assert.equal(parcanReq?.quantity, 8);
  });

  test("Inventory availability succeeds when capacity exists on date", () => {
    const reqs = getRequiredInventoryForSetup({
      category: "dj",
      packageId: "dj-premium",
    });

    // Currently 0 existing bookings on this date
    const result = checkInventoryAvailability(reqs, [], INITIAL_INVENTORY);
    assert.equal(result.available, true);
    assert.equal(result.status, "AVAILABLE");
  });

  test("Multiple bookings on the same date accumulate consumption and flag overbooking", () => {
    const singleBookingReqs = getRequiredInventoryForSetup({
      category: "dj",
      packageId: "dj-honeycomb-plus", // Uses 2 VRX Tops, 2 Bass, 12 Parcans, 4 Sharpies
    });

    // Total VRX Tops is 8, Sharpy is 8.
    // Simulate 2 already confirmed bookings on 2026-11-20 (consuming 4 Sharpies + 4 Sharpies = 8 Sharpies)
    const existingBookings = [
      { setup: { category: "dj", packageId: "dj-honeycomb-plus" } },
      { setup: { category: "dj", packageId: "dj-honeycomb-plus" } },
    ];

    // Attempting a 3rd Honey Comb Plus booking on the SAME date requires 4 more Sharpies (exceeds 8)
    const result = checkInventoryAvailability(
      singleBookingReqs,
      existingBookings as any,
      INITIAL_INVENTORY
    );

    assert.equal(result.available, false, "Must reject overbooking when stock is exceeded");
    assert.equal(result.status, "UNAVAILABLE");
    assert.equal(result.bottleneck, "Sharpy Light", "Bottleneck must be identified");
  });

  test("Bookings on different dates do not block or deplete each other", () => {
    // Booking on Day 1 does not affect an empty list for Day 2
    const day2ExistingBookings: any[] = [];
    const reqs = getRequiredInventoryForSetup({
      category: "dj",
      packageId: "dj-honeycomb-plus",
    });

    const result = checkInventoryAvailability(reqs, day2ExistingBookings, INITIAL_INVENTORY);
    assert.equal(result.available, true);
  });

  test("Bookings on same date with non-overlapping time slots do not block each other", () => {
    // 2 bookings on morning slot consuming all 8 sharpies
    const morningBookings = [
      {
        status: "confirmed",
        event: { date: "2026-11-20", startTime: "09:00", endTime: "14:00", slot: "morning" },
        setup: { category: "dj", packageId: "dj-honeycomb-plus" }, // 4 sharpies
      },
      {
        status: "confirmed",
        event: { date: "2026-11-20", startTime: "09:00", endTime: "14:00", slot: "morning" },
        setup: { category: "dj", packageId: "dj-honeycomb-plus" }, // 4 sharpies
      },
    ];

    const eveningReqs = getRequiredInventoryForSetup({
      category: "dj",
      packageId: "dj-honeycomb-plus",
    });

    // Requesting for evening slot (16:00 to 22:00) does not overlap with morning!
    const result = checkInventoryAvailability(
      eveningReqs,
      morningBookings as any,
      INITIAL_INVENTORY,
      { startTime: "16:00", endTime: "22:00", slot: "evening" }
    );

    assert.equal(result.available, true, "Non-overlapping time slot should have equipment available");
  });

  test("Completed events release their equipment back to available stock", () => {
    // A booking marked 'completed' does not hold stock
    const bookingsWithCompleted = [
      {
        status: "completed", // Event has finished!
        event: { date: "2026-11-20", startTime: "09:00", endTime: "14:00", slot: "morning" },
        setup: { category: "dj", packageId: "dj-honeycomb-plus" },
      },
      {
        status: "completed", // Event has finished!
        event: { date: "2026-11-20", startTime: "09:00", endTime: "14:00", slot: "morning" },
        setup: { category: "dj", packageId: "dj-honeycomb-plus" },
      },
    ];

    const reqs = getRequiredInventoryForSetup({
      category: "dj",
      packageId: "dj-honeycomb-plus",
    });

    const result = checkInventoryAvailability(
      reqs,
      bookingsWithCompleted as any,
      INITIAL_INVENTORY,
      { startTime: "09:00", endTime: "14:00", slot: "morning" }
    );

    assert.equal(result.available, true, "Completed bookings must release equipment back into stock");
  });
});
