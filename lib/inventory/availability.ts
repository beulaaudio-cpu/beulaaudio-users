import { ALL_PACKAGES, CUSTOM_ITEMS_CATALOG, PackageDefinition } from "../data/packages";
import { INITIAL_INVENTORY, CurrentInventory } from "../data/inventory";

export interface ItemRequirement {
  itemKey: string;
  quantity: number;
  name: string;
}

export interface EventTiming {
  startTime?: string;
  endTime?: string;
  slot?: "morning" | "evening" | "night" | "full_day" | string;
  timing?: string;
}

export interface ExistingBookingContext {
  status?: string; // 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'rejected'
  event?: {
    date?: string;
    startTime?: string;
    endTime?: string;
    timing?: string;
    slot?: string;
  };
  setup: {
    category: any;
    packageId?: string;
    customItems?: any[];
  };
}

/**
 * Checks whether two event timing windows overlap.
 * If either is full day or unspecified, treats as overlapping.
 */
export function doTimingsOverlap(a?: EventTiming, b?: EventTiming): boolean {
  if (!a || !b) return true;
  if (!a.startTime || !a.endTime || !b.startTime || !b.endTime) return true;
  if (a.slot === "full_day" || b.slot === "full_day") return true;

  // Convert HH:mm to minutes from midnight
  const toMins = (t: string) => {
    const parts = t.split(":");
    if (parts.length < 2) return 0;
    return parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
  };

  const startA = toMins(a.startTime);
  const endA = toMins(a.endTime);
  const startB = toMins(b.startTime);
  const endB = toMins(b.endTime);

  // Overlap condition: startA < endB && startB < endA
  return startA < endB && startB < endA;
}

export function calculateAuthoritativePrice(setup: {
  category: "dj" | "instrument" | "custom";
  packageId?: string;
  customItems?: { itemId: string; quantity: number }[];
  danceFloor?: { size: "12x12" | "16x16" } | null;
}): {
  basePrice: number | null;
  customPrice: number;
  danceFloorPrice: number;
  totalPrice: number | null;
  isCustomQuote: boolean;
} {
  let basePrice: number | null = 0;
  let customPrice = 0;
  let danceFloorPrice = 0;

  if (setup.category === "custom") {
    const items = setup.customItems || [];
    for (const item of items) {
      const catalogItem = CUSTOM_ITEMS_CATALOG.find((c) => c.id === item.itemId);
      if (catalogItem) {
        customPrice += catalogItem.unitPrice * item.quantity;
      }
    }
    return {
      basePrice: null,
      customPrice,
      danceFloorPrice: 0,
      totalPrice: customPrice,
      isCustomQuote: false,
    };
  }

  const pkg = ALL_PACKAGES.find((p) => p.id === setup.packageId);
  if (!pkg) {
    throw new Error(`Invalid package selected: ${setup.packageId}`);
  }

  basePrice = pkg.basePrice;

  // Honey Comb Pro has no base price
  if (pkg.id === "dj-honeycomb-pro") {
    if (setup.danceFloor) {
      danceFloorPrice = setup.danceFloor.size === "12x12" ? 25000 : 30000;
    }
    return {
      basePrice: null,
      customPrice: 0,
      danceFloorPrice,
      totalPrice: danceFloorPrice > 0 ? danceFloorPrice : null,
      isCustomQuote: true,
    };
  }

  return {
    basePrice,
    customPrice: 0,
    danceFloorPrice: 0,
    totalPrice: basePrice,
    isCustomQuote: false,
  };
}

export function getRequiredInventoryForSetup(setup: {
  category: "dj" | "instrument" | "custom";
  packageId?: string;
  customItems?: { itemId: string; quantity: number }[];
}): ItemRequirement[] {
  const requirements: ItemRequirement[] = [];

  if (setup.category === "custom") {
    const items = setup.customItems || [];
    for (const item of items) {
      const catalog = CUSTOM_ITEMS_CATALOG.find((c) => c.id === item.itemId);
      if (catalog) {
        requirements.push({
          itemKey: catalog.inventoryKey,
          quantity: item.quantity * catalog.multiplier,
          name: catalog.name,
        });
      }
    }
    return requirements;
  }

  const pkg = ALL_PACKAGES.find((p) => p.id === setup.packageId);
  if (!pkg) return requirements;

  for (const item of pkg.items) {
    if (item.inventoryKey) {
      requirements.push({
        itemKey: item.inventoryKey,
        quantity: item.quantity,
        name: item.name,
      });
    }
  }

  return requirements;
}

/**
 * Tally consumed items for a date & timing window.
 * Only pending and confirmed bookings reserve equipment.
 * Completed, rejected, or cancelled events release items back into stock!
 */
export function calculateInventoryTally(
  bookings: ExistingBookingContext[],
  timing?: EventTiming,
  currentInventory: CurrentInventory = INITIAL_INVENTORY
): Record<string, { total: number; consumed: number; remaining: number }> {
  const consumed: Record<string, number> = {};

  for (const b of bookings) {
    // If event is completed, cancelled, or rejected, inventory is returned!
    if (b.status && ["completed", "cancelled", "rejected"].includes(b.status.toLowerCase())) {
      continue;
    }

    // Check if time overlaps
    if (timing && b.event) {
      const bTiming: EventTiming = {
        startTime: b.event.startTime,
        endTime: b.event.endTime,
        timing: b.event.timing,
        slot: b.event.slot,
      };
      if (!doTimingsOverlap(timing, bTiming)) {
        continue;
      }
    }

    const reqs = getRequiredInventoryForSetup(b.setup);
    for (const r of reqs) {
      consumed[r.itemKey] = (consumed[r.itemKey] || 0) + r.quantity;
    }
  }

  const result: Record<string, { total: number; consumed: number; remaining: number }> = {};

  for (const key of Object.keys(currentInventory)) {
    const val = (currentInventory as any)[key];
    if (typeof val === "number") {
      const committed = consumed[key] || 0;
      result[key] = {
        total: val,
        consumed: committed,
        remaining: Math.max(0, val - committed),
      };
    }
  }

  return result;
}

/**
 * Check inventory availability for a requested setup against warehouse inventory.
 */
export function checkInventoryAvailability(
  requirements: ItemRequirement[],
  existingBookingsOnDate: ExistingBookingContext[],
  currentInventory: CurrentInventory = INITIAL_INVENTORY,
  timing?: EventTiming
): {
  available: boolean;
  status: "AVAILABLE" | "LIMITED" | "UNAVAILABLE";
  bottleneck?: string;
  bottleneckDetails?: string;
  remainingDetails?: Record<string, { total: number; remaining: number; needed: number }>;
} {
  const tally = calculateInventoryTally(existingBookingsOnDate, timing, currentInventory);
  let minRatio = 1.0;
  const remainingDetails: Record<string, { total: number; remaining: number; needed: number }> = {};

  for (const req of requirements) {
    const itemStock = tally[req.itemKey];
    if (!itemStock) continue;

    remainingDetails[req.itemKey] = {
      total: itemStock.total,
      remaining: itemStock.remaining,
      needed: req.quantity,
    };

    if (req.quantity > itemStock.remaining) {
      return {
        available: false,
        status: "UNAVAILABLE",
        bottleneck: req.name,
        bottleneckDetails: `${req.name} (${itemStock.remaining} left, ${req.quantity} needed)`,
        remainingDetails,
      };
    }

    const ratioAfterBooking = (itemStock.remaining - req.quantity) / itemStock.total;
    if (ratioAfterBooking < minRatio) {
      minRatio = ratioAfterBooking;
    }
  }

  return {
    available: true,
    status: minRatio <= 0.25 ? "LIMITED" : "AVAILABLE",
    remainingDetails,
  };
}

/**
 * Evaluates whether a package is "Out of Order" / Out of stock for a given date & timing.
 */
export function getPackageStockStatus(
  packageId: string,
  existingBookingsOnDate: ExistingBookingContext[],
  currentInventory: CurrentInventory = INITIAL_INVENTORY,
  timing?: EventTiming
): {
  isOutOfOrder: boolean;
  available: boolean;
  bottleneck?: string;
} {
  const reqs = getRequiredInventoryForSetup({ category: "dj", packageId });
  const check = checkInventoryAvailability(reqs, existingBookingsOnDate, currentInventory, timing);
  return {
    isOutOfOrder: !check.available,
    available: check.available,
    bottleneck: check.bottleneck,
  };
}
