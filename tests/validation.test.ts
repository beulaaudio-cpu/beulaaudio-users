import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { bookingSubmissionSchema } from "../lib/validation/bookingSchema.js";

describe("Booking Validation Schema Verification", () => {
  const validBasePayload = {
    requestId: "REQ-TEST-12345",
    source: "website" as const,
    customer: {
      name: "Arun Kumar",
      phone: "+91 98765 43210",
    },
    event: {
      type: "marriage" as const,
      date: "2026-12-15",
      district: "Chennai",
      address: "ITC Grand Chola, Guindy",
    },
    setup: {
      category: "dj" as const,
      packageId: "dj-premium",
      packageName: "Premium Setup",
    },
  };

  test("Valid DJ package booking passes schema", () => {
    const result = bookingSubmissionSchema.safeParse(validBasePayload);
    assert.equal(result.success, true);
  });

  test("Short or invalid customer name fails validation", () => {
    const invalid = {
      ...validBasePayload,
      customer: { ...validBasePayload.customer, name: "A" },
    };
    const result = bookingSubmissionSchema.safeParse(invalid);
    assert.equal(result.success, false);
  });

  test("Invalid phone number fails validation", () => {
    const invalid = {
      ...validBasePayload,
      customer: { ...validBasePayload.customer, phone: "123" },
    };
    const result = bookingSubmissionSchema.safeParse(invalid);
    assert.equal(result.success, false);
  });

  test("Alphabetical characters in phone number strictly fail validation", () => {
    const stringPhone = {
      ...validBasePayload,
      customer: { ...validBasePayload.customer, phone: "abcdefghijk" },
    };
    const result = bookingSubmissionSchema.safeParse(stringPhone);
    assert.equal(result.success, false);
  });

  test("Valid 10-digit Indian phone passes validation", () => {
    const validPhone = {
      ...validBasePayload,
      customer: { ...validBasePayload.customer, phone: "9876543210" },
    };
    const result = bookingSubmissionSchema.safeParse(validPhone);
    assert.equal(result.success, true);
  });

  test("Custom setup with VRX Top but WITHOUT 18\" Bass fails constraint", () => {
    const invalidCustom = {
      ...validBasePayload,
      setup: {
        category: "custom" as const,
        customItems: [
          {
            itemId: "vrx-top",
            name: "VRX Top speaker (1 pair)",
            quantity: 2,
            unitPrice: 2500,
            unitLabel: "pair",
          },
          {
            itemId: "parcan-unit",
            name: "Parcan Light (1 unit)",
            quantity: 4,
            unitPrice: 500,
            unitLabel: "unit",
          },
        ],
      },
    };
    const result = bookingSubmissionSchema.safeParse(invalidCustom);
    assert.equal(result.success, false);
    if (!result.success) {
      const msg = result.error.issues.map((e) => e.message).join(" ");
      assert.match(msg, /18" bass is compulsory/i);
    }
  });

  test("Custom setup with VRX Top AND 18\" Bass passes constraint", () => {
    const validCustom = {
      ...validBasePayload,
      setup: {
        category: "custom" as const,
        customItems: [
          {
            itemId: "vrx-top",
            name: "VRX Top speaker (1 pair)",
            quantity: 2,
            unitPrice: 2500,
            unitLabel: "pair",
          },
          {
            itemId: "bass-18",
            name: "18\" Bass (1 pair)",
            quantity: 2,
            unitPrice: 2000,
            unitLabel: "pair",
          },
          {
            itemId: "sharpy-pair",
            name: "Sharpy Light (1 pair)",
            quantity: 1,
            unitPrice: 3000,
            unitLabel: "pair",
          },
        ],
      },
    };
    const result = bookingSubmissionSchema.safeParse(validCustom);
    assert.equal(result.success, true);
  });

  test("Custom event type is required when event type is 'others'", () => {
    const invalidOthers = {
      ...validBasePayload,
      event: {
        ...validBasePayload.event,
        type: "others" as const,
        customType: "",
      },
    };
    const result = bookingSubmissionSchema.safeParse(invalidOthers);
    assert.equal(result.success, false);
  });
});
