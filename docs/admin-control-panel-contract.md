# ARCHITECTURAL CONTRACT: BEULA AUDIO ADMIN CONTROL PANEL

This document serves as the exact schema, API contract, and operational interface between the **Client WebApp** (`beulaaudio`) and the dedicated **Admin Control Panel** (`beulaaudio-admin`).

---

## 1. Firebase Project Identity

Both applications share the exact same Firebase / Firestore project:

- **Project ID**: `beulaaudi0`
- **Auth Domain**: `beulaaudi0.firebaseapp.com`
- **Storage Bucket**: `beulaaudi0.firebasestorage.app`
- **Database Location**: `asia-south2` (Delhi)
- **Primary Admin Operator Email**: `beulaaudio@gmail.com`

---

## 2. Firestore Schema & Collections Specification

### 2.1 Collection: `packages` (Dynamic Catalog)
Stores all concert setup packages displayed to users on the front-end. The client webapp now dynamically fetches from this collection.

- **Document ID**: `packageId` (e.g. `dj-essential`, `dj-premium`, `dj-honeycomb`, `dj-honeycomb-plus`, `dj-honeycomb-pro`, `instrument-setup`)
- **Document Structure**:
```typescript
interface PackageDefinition {
  id: string;                      // e.g. "dj-premium"
  name: string;                    // e.g. "Premium Setup"
  category: "dj" | "instrument" | "custom";
  basePrice: number | null;        // e.g. 12000 (null for variable quote packages)
  priceLabel: string;              // e.g. "₹12,000"
  description: string;             // Detailed package breakdown
  tagline: string;                 // High-impact hook
  items: {
    name: string;                  // Equipment name (e.g. "VRX Top speaker")
    quantity: number;              // e.g. 2
    unit: "unit" | "pair" | "set" | "package";
    inventoryKey?: string;         // e.g. "vrxTop" (links to inventory collection)
    notes?: string;
  }[];
  transportIncluded: boolean;      // false (always false per company policy)
  published: boolean;              // true (if false, hidden from public front-end)
  order: number;                   // Display order (1, 2, 3...)
  featured?: boolean;              // Highlight badge
  danceFloorOptions?: {
    id: string;
    label: string;
    size: "12x12" | "16x16";
    price: number;
  }[];
}
```

**Admin Capabilities**:
- Edit base price (instant price updates on user site).
- Add new items or change item quantities inside any package.
- Toggle `published` state to show/hide packages.
- Create brand-new packages (which instantly render in user UI cards).

---

### 2.2 Collection: `inventory` (Physical Equipment Warehouse)
Tracks total physical stock owned by Beula Audio for concurrency and overbooking protection.

- **Document ID**: `current`
- **Document Structure**:
```typescript
interface CurrentInventory {
  vrxTop: number;                  // Default: 8
  bassSpeaker: number;             // Default: 12 (18" / standard bass)
  topSpeaker: number;              // Default: 8
  sharpy: number;                  // Default: 8
  parcan: number;                  // Default: 50
  honeyComb: number;               // Default: 2
  blinder: number;                 // Default: 10
  moving: number;                  // Default: 1
  spyder: number;                  // Default: 4
  dandiya: number;                 // Default: 2
  monitor: number;                 // Default: 8
  mic: number;                     // Default: 30
  djMaskWhiteBlack: number;        // Default: 2
  djLedMask: number;               // Default: 2
  truss: {
    widthFeet: number;             // 20
    lengthFeet: number;            // 60
    count: number;                 // 1
  };
  boxTruss: {
    widthFeet: number;             // 40
    lengthFeet: number;            // 60
    count: number;                 // 1
  };
  effectLights: {
    dandiya: number;
    lazer: number;
    movingLight: number;
    discoBall: number;
    spyderLight: number;
  };
  customItemsCatalog?: {           // Dynamic items available for custom setups
    id: string;
    name: string;
    unitPrice: number;
    unit: string;
    stock: number;
    category: string;
  }[];
  updatedAt: string;               // ISO 8601
}
```

**Admin Capabilities**:
- Update total count of any physical equipment item.
- Add new inventory items into `customItemsCatalog` so users can select them in the custom configurator.
- Real-time stock audit showing booked vs available counts for upcoming dates.

---

### 2.3 Collection: `bookings` (Orders & Dispatch Pipeline)
Every reservation submitted on the website or entered manually offline by admin.

- **Document ID**: `BK-XXXXXX` (e.g. `BK-VDJGV45`)
- **Document Structure**:
```typescript
interface FirestoreBookingDoc {
  id: string;                      // "BK-XXXXXX"
  trackingId: string;              // Same as ID, used by users on /track
  requestId: string;               // Idempotency token "REQ-..."
  userId?: string;                 // Google Auth UID of customer
  userEmail?: string;              // Customer email
  source: "website" | "admin";
  status: "pending" | "confirmed" | "cancelled" | "completed" | "rejected";
  stageStatus: "ordered" | "accepted" | "declined" | "shipped" | "on_live" | "completed";
  createdAt: string;
  updatedAt: string;
  customer: {
    name: string;
    phone: string;
  };
  event: {
    type: "marriage" | "birthday" | "ear_piercing" | "corporate" | "others";
    customType?: string;
    date: string;                  // "YYYY-MM-DD"
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
    customItems?: { itemId: string; name: string; quantity: number; unitPrice: number }[];
    effectLights?: any[];
    danceFloor?: { id: string; size: string; price: number };
    basePrice: number | null;
    customPrice: number;
    danceFloorPrice: number;
    transportCharge: number | null; // Set by admin after checking venue location
  };
  totalPriceBeforeTransport: number | null;
  isCustomQuote: boolean;
  notes?: string;
}
```

**Admin Capabilities**:
- Accept / Decline incoming booking requests.
- Advance dispatch stage status: `ordered` → `accepted` → `shipped` → `on_live` → `completed` (reflects live on user's `/track` page).
- Set final transport charge based on event location.
- Enter offline bookings taken via phone or in-person.

---

### 2.4 Collection: `bookingAudit` (Strict Rolling Audit Trail)
Maintains tamper-proof record of every booking creation, status advance, and inventory modification.

---

## 3. Authoritative Firestore Security Rules

Deploy this directly in the Firebase Console **Rules** tab:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    function isAuthenticated() {
      return request.auth != null;
    }

    function isAdmin() {
      return isAuthenticated() && (
        request.auth.token.email == 'beulaaudio@gmail.com' ||
        request.auth.token.admin == true ||
        (exists(/databases/$(database)/documents/admins/$(request.auth.uid)) &&
         get(/databases/$(database)/documents/admins/$(request.auth.uid)).data.enabled == true)
      );
    }

    // Public read for packages; admin has full CRUD
    match /packages/{packageId} {
      allow read: if true;
      allow write: if isAdmin();
    }

    // Inventory: Public read (for stock availability check); admin write
    match /inventory/{docId} {
      allow read: if true;
      allow write: if isAdmin();
    }

    // Settings (Site metadata, phone, disclaimers)
    match /settings/{settingId} {
      allow read: if true;
      allow write: if isAdmin();
    }

    // Bookings collection
    match /bookings/{bookingId} {
      allow get: if true; // Public tracking ID lookup on /track
      allow list: if isAdmin() || (isAuthenticated() && resource.data.userId == request.auth.uid);
      allow create: if isAuthenticated() || isAdmin();
      allow update, delete: if isAdmin();
    }

    // Booking audit history
    match /bookingAudit/{auditId} {
      allow read: if isAdmin();
      allow create: if isAuthenticated() || isAdmin();
      allow update, delete: if isAdmin();
    }

    // Diagnostics collection
    match /diagnostics/{docId} {
      allow read, write: if isAdmin();
    }

    // Admin authorization list
    match /admins/{uid} {
      allow read: if isAuthenticated() && (request.auth.uid == uid || isAdmin());
      allow write: if isAdmin();
    }
  }
}
```
