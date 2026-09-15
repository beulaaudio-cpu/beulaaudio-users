import { test, describe } from "node:test";
import assert from "node:assert/strict";
import {
  DJ_PACKAGES,
  INSTRUMENT_SETUP,
  CUSTOM_ITEMS_CATALOG,
  formatINR,
  TRANSPORT_DISCLAIMER,
} from "../lib/data/packages.js";
import { calculateAuthoritativePrice } from "../lib/inventory/availability.js";

describe("Pricing and Setup Catalog Verification", () => {
  test("DJ package prices match Setup.txt strictly", () => {
    const essential = DJ_PACKAGES.find((p) => p.id === "dj-essential");
    assert.equal(essential?.basePrice, 8000, "Essential Setup must be ₹8000");

    const premium = DJ_PACKAGES.find((p) => p.id === "dj-premium");
    assert.equal(premium?.basePrice, 12000, "Premium Setup must be ₹12000");

    const honeycomb = DJ_PACKAGES.find((p) => p.id === "dj-honeycomb");
    assert.equal(honeycomb?.basePrice, 15000, "Honey Comb Setup must be ₹15000");

    const honeycombPlus = DJ_PACKAGES.find((p) => p.id === "dj-honeycomb-plus");
    assert.equal(honeycombPlus?.basePrice, 20000, "Honey Comb Plus must be ₹20000");

    const honeycombPro = DJ_PACKAGES.find((p) => p.id === "dj-honeycomb-pro");
    assert.equal(
      honeycombPro?.basePrice,
      null,
      "Honey Comb Pro must NOT have an invented base price; must be null"
    );
  });

  test("Instruments setup price matches Setup.txt", () => {
    assert.equal(
      INSTRUMENT_SETUP.basePrice,
      10000,
      "Instruments setup must be ₹10000"
    );
  });

  test("Honey Comb Pro Dance Floor options match Setup.txt", () => {
    const pricing12 = calculateAuthoritativePrice({
      category: "dj",
      packageId: "dj-honeycomb-pro",
      danceFloor: { size: "12x12" },
    });
    assert.equal(pricing12.danceFloorPrice, 25000, "12x12 Dance Floor is ₹25,000");
    assert.equal(pricing12.totalPrice, 25000);
    assert.equal(pricing12.isCustomQuote, true);

    const pricing16 = calculateAuthoritativePrice({
      category: "dj",
      packageId: "dj-honeycomb-pro",
      danceFloor: { size: "16x16" },
    });
    assert.equal(pricing16.danceFloorPrice, 30000, "16x16 Dance Floor is ₹30,000");
    assert.equal(pricing16.totalPrice, 30000);
  });

  test("Custom setup item pricing matches Setup.txt unit prices", () => {
    const normalTop = CUSTOM_ITEMS_CATALOG.find((c) => c.id === "normal-top");
    assert.equal(normalTop?.unitPrice, 3500, "Normal top 1 pair is ₹3500");

    const vrxTop = CUSTOM_ITEMS_CATALOG.find((c) => c.id === "vrx-top");
    assert.equal(vrxTop?.unitPrice, 2500, "VRX top 1 pair is ₹2500");

    const bass18 = CUSTOM_ITEMS_CATALOG.find((c) => c.id === "bass-18");
    assert.equal(bass18?.unitPrice, 2000, "18\" Bass 1 pair is ₹2000");

    const sharpy = CUSTOM_ITEMS_CATALOG.find((c) => c.id === "sharpy-pair");
    assert.equal(sharpy?.unitPrice, 3000, "Sharpy 1 pair is ₹3000");

    const parcan = CUSTOM_ITEMS_CATALOG.find((c) => c.id === "parcan-unit");
    assert.equal(parcan?.unitPrice, 500, "Parcan 1 unit is ₹500");

    const smoke = CUSTOM_ITEMS_CATALOG.find((c) => c.id === "smoke-package");
    assert.equal(smoke?.unitPrice, 1000, "Smoke + 1L oil is ₹1000");

    const cordlessMic = CUSTOM_ITEMS_CATALOG.find((c) => c.id === "cordless-mic-pair");
    assert.equal(cordlessMic?.unitPrice, 1000, "Cordless mic 1 pair is ₹1000");

    const cordMic = CUSTOM_ITEMS_CATALOG.find((c) => c.id === "cord-mic-pair");
    assert.equal(cordMic?.unitPrice, 500, "Cord mic pair is ₹500");
  });

  test("Custom price calculation aggregates accurately without client tampering", () => {
    // 2 pairs Normal Top (7000) + 4 Parcans (2000) + 1 Smoke (1000) = ₹10,000
    const pricing = calculateAuthoritativePrice({
      category: "custom",
      customItems: [
        { itemId: "normal-top", quantity: 2 },
        { itemId: "parcan-unit", quantity: 4 },
        { itemId: "smoke-package", quantity: 1 },
      ],
    });

    assert.equal(pricing.customPrice, 10000);
    assert.equal(pricing.totalPrice, 10000);
  });

  test("Transportation disclaimer text is verified", () => {
    assert.match(
      TRANSPORT_DISCLAIMER,
      /Transportation \/ delivery charges are not included/i
    );
  });
});
