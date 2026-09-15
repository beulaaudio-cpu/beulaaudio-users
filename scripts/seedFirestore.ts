/**
 * BEULA AUDIO - Firestore Seeding Script
 * Populates Firestore with source-of-truth packages from Setup.txt,
 * physical inventory from ItemQuantity.txt, and site settings.
 *
 * SAFETY GUARD:
 * Must be run with SEED_CONFIRM=true:
 *   npx tsx scripts/seedFirestore.ts
 */

import { getServerFirestore } from "../lib/firebase/server";
import { ALL_PACKAGES } from "../lib/firestore/packages";
import { INITIAL_INVENTORY } from "../lib/firestore/inventory";

async function main() {
  if (process.env.SEED_CONFIRM !== "true") {
    console.error(`
=======================================================================
[SAFETY ERROR] Seeding aborted!
To prevent accidental data loss or overwrite in production, you must
explicitly set SEED_CONFIRM=true to run this script.

Usage:
  SEED_CONFIRM=true npx tsx scripts/seedFirestore.ts
  (or in PowerShell: $env:SEED_CONFIRM="true"; npx tsx scripts/seedFirestore.ts)
=======================================================================
    `);
    process.exit(1);
  }

  const db = getServerFirestore();
  if (!db) {
    console.error("Failed to initialize server Firestore. Please check Firebase configuration.");
    process.exit(1);
  }

  console.log(">>> [1/3] Seeding packages from Setup.txt...");
  const packagesCollection = db.collection("packages");
  for (const pkg of ALL_PACKAGES) {
    await packagesCollection.doc(pkg.id).set({
      ...pkg,
      updatedAt: new Date(),
    });
    console.log(`  ✔ Seeded package: [${pkg.id}] ${pkg.name} - ${pkg.basePrice ? `₹${pkg.basePrice}` : "Contact / Configure"}`);
  }

  console.log("\n>>> [2/3] Seeding inventory/current from ItemQuantity.txt...");
  const inventoryDoc = db.collection("inventory").doc("current");
  await inventoryDoc.set({
    ...INITIAL_INVENTORY,
    updatedAt: new Date(),
  });
  console.log("  ✔ Seeded inventory/current successfully.");

  console.log("\n>>> [3/3] Seeding default settings...");
  await db.collection("settings").doc("site").set({
    brandName: "BEULA AUDIO",
    tagline: "Professional Event Sound & Production",
    experienceYears: "9+",
    eventsCount: "1500+",
    phonePlaceholder: "[CLIENT PHONE]",
    emailPlaceholder: "[CLIENT EMAIL]",
    instagramPlaceholder: "[CLIENT INSTAGRAM]",
    transportDisclaimer: "Transportation / delivery charges are not included in the package price. Transportation charges may vary depending on event location.",
    updatedAt: new Date(),
  });

  await db.collection("settings").doc("booking").set({
    maxAuditRetentionRows: 100,
    timezone: "Asia/Kolkata",
    autoConfirmEnabled: false,
    updatedAt: new Date(),
  });
  console.log("  ✔ Seeded settings/site and settings/booking.");

  console.log("\n🎉 [SUCCESS] Firestore seeding completed successfully!");
  process.exit(0);
}

main().catch((err) => {
  console.error("Error during seeding:", err);
  process.exit(1);
});
