You are an expert full-stack developer and AI system architect building the dedicated **Admin Control Panel Web Application** for **Beula Audio** (`beulaaudio-admin`).

### 1. Context & Architecture
- **Company**: Beula Audio — Premier Stage Sound, Concert Production & DJ Audio rental service in Tamil Nadu (9+ years, 1500+ events).
- **Client App**: Next.js 16 (Turbopack) frontend where users browse 3D concert stages, configure audio/lighting setups, submit reservations, and track dispatch status via `/track`.
- **Firebase Project Details** (Shared with main client webapp):
  - `projectId`: "beulaaudi0"
  - `authDomain`: "beulaaudi0.firebaseapp.com"
  - `storageBucket`: "beulaaudi0.firebasestorage.app"
  - `databaseLocation`: "asia-south2" (Delhi)
  - `primaryAdminEmail`: "beulaaudio@gmail.com"

---

### 2. Admin Authentication & Role Protection
- Use Firebase Client SDK with Google Sign-In (`GoogleAuthProvider`).
- Restrict access strictly: Only authenticated users with email `beulaaudio@gmail.com` or documents in `admins/{uid}` with `enabled: true` may access the control panel.
- Unauthorized users must see an access denied notice with sign-out.

---

### 3. Core Admin Capabilities to Build

#### Module 1: Dynamic Packages Manager (`packages` Collection)
Admin must have full CRUD control over all packages shown on the user website:
1. **Package List & Editor**:
   - View all current packages (`dj-essential`, `dj-premium`, `dj-honeycomb`, `dj-honeycomb-plus`, `dj-honeycomb-pro`, `instrument-setup`).
   - Edit package name, tagline, description, base investment price (e.g. ₹8,000, ₹12,000, etc.), and published status.
2. **Item Recipe Manager**:
   - For any package, add/remove equipment items and change quantities (e.g. changing Parcan count from 8 to 12, or adding a second Smoke unit).
   - Link each item to an `inventoryKey` for warehouse deduction.
3. **Create New Package**:
   - Ability to add a new package tier with custom items and pricing. New packages will automatically appear in the user showcase.

#### Module 2: Warehouse Equipment Inventory (`inventory/current`)
1. **Physical Stock Tallies**:
   - Live editable grid of total owned stock (VRX Top, Bass 18", Sharpy moving heads, Parcans, Smoke, Honeycomb rig, 20F/40F Trusses, Microphones, DJ LED Masks).
   - Real-time save directly to Firestore `inventory/current`.
2. **Add New Equipment Items**:
   - Add new custom equipment into `customItemsCatalog` with name, unit price (₹), and available quantity.
   - When a new item is added, it immediately becomes selectable in the client webapp's custom configurator.
3. **Availability & Concurrency Monitor**:
   - Date-picker calendar showing equipment booked vs available for any selected date to prevent double-booking.

#### Module 3: Bookings & Dispatch Pipeline Manager (`bookings` Collection)
1. **Orders Dashboard**:
   - Live stream of all incoming reservations with real-time Firestore listeners (`onSnapshot`).
   - Filter by status: All, Pending, Confirmed, Shipped, Live, Completed, Cancelled.
2. **Dispatch Pipeline Stepper**:
   - Step control to advance order through the 5 pipeline stages:
     `Ordered` ➔ `Package Accepted` ➔ `Shipped / In Transit` ➔ `On Live (Stage Active)` ➔ `Completed`
   - Any stage change made by admin here updates the customer's `/track` view in real time.
3. **Price & Transport Quotation**:
   - For custom quotes or standard packages, admin can enter the calculated transportation charge based on the event district/address.
4. **Offline Booking Entry**:
   - Modal form for admin to record walk-in or phone call bookings so physical inventory is reserved on the selected date.

#### Module 4: Tamper-Proof Audit Trail (`bookingAudit` Collection)
- View chronological list of recent system actions (booking creation, stage advancement, price quotation, inventory adjustments).

---

### 4. Design & Aesthetics
- **Theme**: Pure black (`#000000` / `#050508`) with industrial amber gold accents (`#FBBF24`), sleek dark-mode glass cards, and crisp monospaced telemetry typography (`JetBrains Mono` / `Syne`).
- Responsive desktop-first dashboard with high data density, tabular views, quick filters, and status badges.
