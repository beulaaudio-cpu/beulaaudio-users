# BEULA AUDIO — Master Admin Backend & Database Architecture Specification

> **AUTHORITATIVE HANDBOOK FOR THE BEULA AUDIO ADMIN CONTROL PANEL**  
> This document details the complete backend data structures, Firebase configuration, authentication rules, and API contracts shared between the client website (`beulaaudio`) and the forthcoming separate Admin Control Panel project.

---

## 1. Firebase Project Connection Details

Both applications connect to the exact same Firebase production environment:

| Property | Value | Notes |
| :--- | :--- | :--- |
| **Project ID** | `beulaaudi0` | Google Cloud project identifier |
| **Auth Domain** | `beulaaudi0.firebaseapp.com` | Google OAuth redirect domain |
| **Storage Bucket** | `beulaaudi0.firebasestorage.app` | Media & asset storage |
| **Messaging Sender ID** | `431295679857` | Cloud Messaging |
| **App ID** | `1:431295679857:web:fbb88e4071dd1d4c5cbad0` | Web Client Registration |
| **Measurement ID** | `G-F8CKE9JX5Y` | Google Analytics 4 |
| **Root Admin Google ID** | `beulaaudio@gmail.com` | Primary administrative operator |

### Environment Variables for Admin App (`.env.local`):
```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyCXG17OuyL-mN9C2UTX_BztGtvSfH2_8ps
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=beulaaudi0.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=beulaaudi0
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=beulaaudi0.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=431295679857
NEXT_PUBLIC_FIREBASE_APP_ID=1:431295679857:web:fbb88e4071dd1d4c5cbad0
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-F8CKE9JX5Y
```

---

## 2. Shared Firestore Database Schema

```
Firestore Root (beulaaudi0)
├── settings/
│   ├── site                      <-- Brand metadata, disclaimers, business contacts
│   └── booking                   <-- 100-row audit limit, timezone, policy flags
├── inventory/
│   └── current                   <-- Master warehouse inventory (ItemQuantity.txt)
├── packages/
│   ├── dj-essential              <-- Package specifications (Setup.txt)
│   ├── dj-premium
│   ├── dj-honeycomb
│   ├── dj-honeycomb-plus
│   ├── dj-honeycomb-pro
│   ├── instrument-setup
│   └── custom
├── bookings/
│   └── {bookingId}               <-- Authoritative customer bookings & orders
├── bookingAudit/
│   └── {auditId}                 <-- Rolling 100-row FIFO audit history
├── diagnostics/
│   └── admin_connection_ping     <-- Real-time latency & client-side database probe
└── admins/
    └── {uid}                     <-- Admin profile whitelist: { enabled: true, role: 'superadmin' }
```

---

## 3. Authoritative Booking Document Schema (`bookings/{bookingId}`)

```typescript
export type OrderStageStatus = 
  | "ordered"       // Customer submitted; awaiting engineer allocation
  | "accepted"      // Stage logistics approved by admin
  | "declined"      // Stage slot declined / equipment unavailable
  | "shipped"       // Logistics team en route with hardware
  | "on_live"       // Stage live & operating at the venue
  | "completed";    // Event concluded & hardware inspected

export interface BookingDocument {
  id: string;                       // Unique ID (e.g. BK-20261015-X9Q2)
  trackingId: string;               // Customer-facing tracking code (usually matches id)
  requestId: string;                // Client idempotency key (prevents duplicates)
  userId?: string;                  // Firebase Auth UID of the ordering customer
  userEmail?: string;               // Firebase Auth Email of customer
  source: "website" | "admin";      // Order origin

  // High-level status
  status: "pending" | "confirmed" | "cancelled" | "completed" | "rejected";

  // Visual 5-Stage Dispatch Status (displayed on Track Package section)
  stageStatus: OrderStageStatus;

  createdAt: string;                // ISO 8601 string
  updatedAt: string;                // ISO 8601 string

  customer: {
    name: string;                   // Customer full name
    phone: string;                  // 10-digit Indian phone (e.g. 9876543210)
  };

  event: {
    type: "marriage" | "birthday" | "ear_piercing" | "corporate" | "others";
    customType?: string;            // Required if type is 'others'
    date: string;                   // YYYY-MM-DD in Asia/Kolkata
    startTime?: string;             // HH:mm format
    endTime?: string;               // HH:mm format
    timing?: string;                // e.g. "MORNING: 09:00 - 14:00"
    district: string;               // District / City in Tamil Nadu
    address: string;                // Venue hall / location
  };

  setup: {
    category: "dj" | "instrument" | "custom";
    packageId?: string;             // e.g. "dj-premium", "instrument-setup"
    packageName?: string;
    customItems?: Array<{
      itemId: string;               // e.g. "vrx-top", "bass-18"
      name: string;
      quantity: number;
      unitPrice: number;
      unitLabel: string;
      inventoryKey?: string;
    }>;
    effectLights?: Array<{
      itemId: string;
      name: string;
      quantity: number;
    }>;
    danceFloor?: {
      size: "12x12" | "16x16";
      price: number;                // 25000 or 30000
    } | null;
    basePrice: number | null;
    customPrice: number;
    danceFloorPrice: number;
    transportCharge: number | null; // Calculated offline at dispatch
  };

  totalPriceBeforeTransport: number | null;
  isCustomQuote: boolean;
  notes?: string;
}
```

---

## 4. The 5-Stage Visual Dispatch Pipeline

The client website features a live tracking pipeline in the `#tracking` section. The Admin Control Panel can update `stageStatus` directly:

| Stage Key | Label Displayed | Customer Meaning |
| :--- | :--- | :--- |
| `ordered` | **Ordered** | Reservation received; pending engineer review |
| `accepted` | **Package Accepted** | Stage logistics verified; crew assigned |
| `declined` | **Declined** | Slot declined; notification sent |
| `shipped` | **Shipped** | Hardware en route to event hall |
| `on_live` | **On Live** | Audio & stage lighting live & operational |
| `completed` | **Completed** | Event wrapped; equipment returned |

---

## 5. Security & Access Control

### Admin Authorization Strategy
1. **Google Login Whitelist**: The primary admin account is `beulaaudio@gmail.com`.
2. **Firestore Whitelist Collection (`admins/{uid}`)**:
   To grant admin privileges, create a document in `admins/{uid}`:
   ```json
   {
     "email": "beulaaudio@gmail.com",
     "enabled": true,
     "role": "superadmin",
     "grantedAt": "2026-09-09T00:00:00Z"
   }
   ```
3. **Firestore Security Rules**:
   - `bookings`: Admins have unrestricted `read`, `create`, `update`, `delete`.
   - `inventory`: Admins have full write control to adjust hardware totals.
   - `bookingAudit`: Strictly append-only audit trail capped to rolling 100 rows.
   - `diagnostics`: Restricted strictly to `beulaaudio@gmail.com` and admins.

---

## 6. How the Admin Control Panel Interacts With Orders

### Accepting an Order:
```typescript
import { doc, updateDoc } from "firebase/firestore";

async function acceptOrder(bookingId: string) {
  const ref = doc(db, "bookings", bookingId);
  await updateDoc(ref, {
    status: "confirmed",
    stageStatus: "accepted",
    updatedAt: new Date().toISOString(),
  });
}
```

### Dispatching Hardware (Status -> Shipped):
```typescript
async function shipOrder(bookingId: string) {
  const ref = doc(db, "bookings", bookingId);
  await updateDoc(ref, {
    stageStatus: "shipped",
    updatedAt: new Date().toISOString(),
  });
}
```

### Marking Stage Live (Status -> On Live):
```typescript
async function setLiveOrder(bookingId: string) {
  const ref = doc(db, "bookings", bookingId);
  await updateDoc(ref, {
    stageStatus: "on_live",
    updatedAt: new Date().toISOString(),
  });
}
```

---

## 7. Rolling 100-Row FIFO Audit History (`bookingAudit`)

To maintain ultra-high performance and zero bloat, every status update from the admin or client creates a record in `bookingAudit`:
- The client app and admin app trim records beyond 100 entries automatically.
- **Permanent Business Rule**: Authoritative booking records in `/bookings` are **NEVER deleted** by this rolling retention mechanism.
