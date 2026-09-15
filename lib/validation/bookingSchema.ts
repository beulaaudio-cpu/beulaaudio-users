import { z } from "zod";

export const EventTypeEnum = z.enum([
  "marriage",
  "birthday",
  "ear_piercing",
  "corporate",
  "others",
]);

export const CategoryEnum = z.enum(["dj", "instrument", "custom"]);

export const CustomSelectedItemSchema = z.object({
  itemId: z.string().min(1),
  name: z.string().min(1),
  quantity: z.number().int().min(1).max(50),
  unitPrice: z.number().min(0),
  unitLabel: z.string(),
  inventoryKey: z.string().optional(),
});

export const EffectLightSelectionSchema = z.object({
  itemId: z.string().min(1),
  name: z.string().min(1),
  quantity: z.number().int().min(1).max(10).default(1),
});

export const DanceFloorSelectionSchema = z.object({
  id: z.string(),
  label: z.string(),
  size: z.enum(["12x12", "16x16"]),
  price: z.number().positive(),
});

export const BookingSubmissionSchema = z.object({
  requestId: z.string().min(6).max(100),
  userId: z.string().optional(),
  userEmail: z.string().email().optional(),
  customer: z.object({
    name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
    phone: z
      .string()
      .trim()
      .regex(
        /^(\+91[\-\s]?)?[6-9]\d{9}$|^(\+91[\-\s]?)?[6-9]\d{4}[\-\s]?\d{5}$/,
        "Please enter a valid 10-digit Indian phone number"
      ),
  }),
  event: z.object({
    type: EventTypeEnum,
    customType: z.string().trim().max(100).optional(),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
    startTime: z.string().optional(),
    endTime: z.string().optional(),
    timing: z.string().optional(),
    district: z.string().trim().min(2, "District is required").max(100),
    address: z.string().trim().min(5, "Full venue address is required").max(300),
  }),
  setup: z.object({
    category: CategoryEnum,
    packageId: z.string().optional(),
    packageName: z.string().optional(),
    customItems: z.array(CustomSelectedItemSchema).optional(),
    effectLights: z.array(EffectLightSelectionSchema).optional(),
    danceFloor: DanceFloorSelectionSchema.nullable().optional(),
  }),
  notes: z.string().trim().max(500).optional(),
  source: z.enum(["website", "admin"]).default("website"),
}).superRefine((data, ctx) => {
  // Validate 'others' event type requires customType
  if (data.event.type === "others" && (!data.event.customType || data.event.customType.trim().length === 0)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Please specify the custom event type",
      path: ["event", "customType"],
    });
  }

  // If category is dj or instrument, packageId is required
  if (data.setup.category !== "custom" && !data.setup.packageId) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "A setup package must be selected",
      path: ["setup", "packageId"],
    });
  }

  // If custom setup, validate items and VRX top dependency
  if (data.setup.category === "custom") {
    const items = data.setup.customItems || [];
    if (items.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please select at least one equipment item for custom setup",
        path: ["setup", "customItems"],
      });
      return;
    }

    const vrxItem = items.find((i) => i.itemId === "vrx-top");
    const vrxQty = vrxItem ? vrxItem.quantity : 0;
    const bass18Item = items.find((i) => i.itemId === "bass-18");
    const bass18Qty = bass18Item ? bass18Item.quantity : 0;

    // Rule: 18" bass is compulsory for VRX only
    if (vrxQty > 0 && bass18Qty <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "18\" bass is compulsory when selecting VRX Top speaker",
        path: ["setup", "customItems"],
      });
    }
  }

  // Validate event date is not in the past (using YYYY-MM-DD comparison in Asia/Kolkata)
  const today = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());

  if (data.event.date < today) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Event date cannot be in the past",
      path: ["event", "date"],
    });
  }
});

export const bookingSubmissionSchema = BookingSubmissionSchema;
export type BookingSubmission = z.infer<typeof BookingSubmissionSchema>;
