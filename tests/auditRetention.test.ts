import { test, describe, beforeEach } from "node:test";
import assert from "node:assert/strict";
import {
  processBookingSubmission,
  getInMemoryBookings,
  getInMemoryAudits,
  resetInMemoryStore,
} from "../lib/firestore/bookings.js";

describe("Audit History Retention (Strict 100-Row Rolling FIFO) & Idempotency", () => {
  beforeEach(() => {
    resetInMemoryStore();
  });

  test("Maintains rolling 100-row maximum in booking audit history", async () => {
    // 1. Insert 100 bookings across distinct dates so stock is not exceeded
    for (let i = 1; i <= 100; i++) {
      const day = (i % 28) + 1;
      const month = Math.floor(i / 28) + 1;
      const dateStr = `2027-${month.toString().padStart(2, "0")}-${day
        .toString()
        .padStart(2, "0")}`;

      const res = await processBookingSubmission({
        requestId: `REQ-SEED-${i}`,
        source: "website",
        customer: { name: `Client ${i}`, phone: "+91 98765 43210" },
        event: {
          type: "marriage",
          date: dateStr,
          district: "Chennai",
          address: `Banquet Hall ${i}`,
        },
        setup: {
          category: "dj",
          packageId: "dj-essential",
          packageName: "Essential Setup",
        },
      });

      assert.equal(res.success, true);
    }

    const auditsAfter100 = getInMemoryAudits();
    const bookingsAfter100 = getInMemoryBookings();

    assert.equal(auditsAfter100.length, 100, "Audit length must be exactly 100");
    assert.equal(bookingsAfter100.size, 100, "Authoritative bookings must be 100");
    assert.equal(auditsAfter100[0].sequenceNumber, 1, "First audit sequence is 1");
    assert.equal(auditsAfter100[99].sequenceNumber, 100, "100th audit sequence is 100");

    // 2. Insert 101st booking
    const res101 = await processBookingSubmission({
      requestId: "REQ-SEED-101",
      source: "website",
      customer: { name: "Client 101", phone: "+91 98765 43210" },
      event: {
        type: "corporate",
        date: "2027-06-01",
        district: "Coimbatore",
        address: "Le Meridien",
      },
      setup: {
        category: "dj",
        packageId: "dj-essential",
        packageName: "Essential Setup",
      },
    });

    assert.equal(res101.success, true);

    const auditsAfter101 = getInMemoryAudits();
    const bookingsAfter101 = getInMemoryBookings();

    // Verification of Section 100:
    // "Insert 101st. Verify oldest row removed. Verify 100 remain."
    assert.equal(auditsAfter101.length, 100, "Audit history must still be capped at 100");
    assert.equal(auditsAfter101[0].sequenceNumber, 2, "Oldest row (sequence 1) was evicted; first is now sequence 2");
    assert.equal(auditsAfter101[99].sequenceNumber, 101, "Latest row is sequence 101");

    // Section 85: "Do NOT delete actual booking records simply because the rolling audit/history reaches 100"
    assert.equal(bookingsAfter101.size, 101, "Authoritative bookings are preserved and must be 101");

    // 3. Insert 102nd booking
    const res102 = await processBookingSubmission({
      requestId: "REQ-SEED-102",
      source: "website",
      customer: { name: "Client 102", phone: "+91 98765 43210" },
      event: {
        type: "birthday",
        date: "2027-06-02",
        district: "Madurai",
        address: "Heritage Resort",
      },
      setup: {
        category: "dj",
        packageId: "dj-essential",
        packageName: "Essential Setup",
      },
    });

    assert.equal(res102.success, true);

    const auditsAfter102 = getInMemoryAudits();
    const bookingsAfter102 = getInMemoryBookings();

    assert.equal(auditsAfter102.length, 100, "Audit history must strictly remain at 100");
    assert.equal(auditsAfter102[0].sequenceNumber, 3, "Second-oldest row (sequence 2) was evicted; first is now sequence 3");
    assert.equal(auditsAfter102[99].sequenceNumber, 102, "Latest row is sequence 102");
    assert.equal(bookingsAfter102.size, 102, "Authoritative bookings must be 102");
  });

  test("Idempotency: Duplicate requestId returns existing booking without duplicate audit rows", async () => {
    const payload = {
      requestId: "REQ-IDEMPOTENT-TEST-999",
      source: "website" as const,
      customer: { name: "Suresh Raina", phone: "+91 98765 43210" },
      event: {
        type: "marriage" as const,
        date: "2026-11-25",
        district: "Chennai",
        address: "Leela Palace",
      },
      setup: {
        category: "dj" as const,
        packageId: "dj-premium",
        packageName: "Premium Setup",
      },
    };

    // First submission
    const firstRes = await processBookingSubmission(payload);
    assert.equal(firstRes.success, true);
    const initialBookingId = firstRes.bookingId;

    const auditCountBefore = getInMemoryAudits().length;

    // Duplicate submission with identical requestId (e.g. double click or network retry)
    const duplicateRes = await processBookingSubmission(payload);
    assert.equal(duplicateRes.success, true);
    assert.equal(duplicateRes.bookingId, initialBookingId, "Must return the same booking ID");
    assert.match(duplicateRes.message || "", /idempotent/i);

    const auditCountAfter = getInMemoryAudits().length;
    assert.equal(auditCountAfter, auditCountBefore, "Must not create a duplicate audit entry on retry");
  });
});
