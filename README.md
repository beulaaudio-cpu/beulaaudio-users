# BEULA AUDIO — Interactive 3D Production Experience & Client Platform

> **Professional Event Sound & Production**  
> 9+ Years of Experience | 1500+ Events

A high-performance, cinematic, editorial web experience for **BEULA AUDIO**. Features an interactive WebGL stage world on desktop, a fluid mobile background video mode, spatial audio package catalogs inspired by editorial book showcases, live date-aware inventory validation, and a shared Firebase/Firestore architecture designed to power the future Beula Audio Admin application.

---

## 1. Tech Stack

- **Framework**: Next.js (App Router, Turbopack) & React 19
- **3D & Graphics**: Three.js (Procedural concert stage, moving head beams, line arrays, subwoofers, dynamic lighting, particles, WebGL context loss recovery)
- **Styling & Motion**: Tailwind CSS v4 & Framer Motion
- **Backend & Database**: Firebase & Google Cloud Firestore (Transactions, atomic idempotency, date-aware reservations)
- **Validation**: Zod v4 (Strict schema verification, VRX 18" bass dependency check, Indian phone format)
- **Testing**: Native Node.js Test Runner with `tsx`

---

## 2. Prerequisites & Installation

- **Node.js**: `v20.x` or `v22.x` or `v24.x`
- **Package Manager**: `npm`

```bash
# Clone and navigate to project root
cd beulaaudio

# Install dependencies
npm install
```

---

## 3. Environment Variables Configuration

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Populate the values from your Firebase Project Console:

```env
# Public Client Firebase Config
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id

# Server-Side Firebase Admin (Never prefix with NEXT_PUBLIC_)
SERVER_FIREBASE_PROJECT_ID=your-project-id
SERVER_FIREBASE_CLIENT_EMAIL=firebase-adminsdk@your-project.iam.gserviceaccount.com
SERVER_FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgk...-----END PRIVATE KEY-----\n"
```

---

## 4. Local Development

```bash
# Run local dev server (Turbopack)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 5. Running Automated Tests

The test suite validates pricing integrity against `Setup.txt`, inventory calculations against `ItemQuantity.txt`, VRX bass constraints, and the 100-row FIFO audit log retention:

```bash
npm test
```

---

## 6. Firestore Seeding & Deployment

### Step A: Deploy Security Rules & Indexes
Ensure you have the Firebase CLI installed (`npm install -g firebase-tools`):

```bash
# Login to your Firebase account
firebase login

# Deploy rules and indexes
firebase deploy --only firestore:rules,firestore:indexes
```

### Step B: Seed Firestore Database
Run the seed script with the mandatory safety confirmation flag:

```bash
# On Linux/macOS:
SEED_CONFIRM=true npx tsx scripts/seedFirestore.ts

# On Windows PowerShell:
$env:SEED_CONFIRM="true"; npx.cmd tsx scripts/seedFirestore.ts
```

This populates:
- All 5 DJ setups, Instruments setup, and Custom items strictly from `Setup.txt`.
- Master physical inventory strictly from `ItemQuantity.txt`.
- Site metadata and disclaimers.

---

## 7. Asset Customization

### Adding / Replacing the Blender 3D Model
Place your `.glb` file at `public/models/beula-stage.glb`.  
Refer to [`docs/blender-handoff.md`](docs/blender-handoff.md) for coordinate systems, material rules, and semantic object naming (`beula-speaker-vrx`, `beula-bass`, `beula-truss`, etc.).

### Adding / Replacing the Mobile Video
Place your vertical background video at `public/videos/mobile-hero.mp4` and poster frame at `public/videos/mobile-hero-poster.webp`.  
Refer to [`docs/mobile-video.md`](docs/mobile-video.md) for bitrate and autoplay requirements.

---

## 8. Source Data & Pricing Rules

- **Honey Comb Pro Base Price**: In strict adherence to `Setup.txt`, Honey Comb Pro has no invented base price. It displays as **"Contact / Configure"** with optional Dance Floor add-ons (12ft × 12ft for ₹25,000, 16ft × 16ft for ₹30,000).
- **Custom Setup Dependency**: In strict adherence to `Setup.txt`, selecting VRX Top speakers enforces selecting 18" Bass speakers.
- **Transportation Disclaimer**: Displayed prominently across every package view and quotation:
  > *"Transportation / delivery charges are not included in the package price. Transportation charges may vary depending on event location."*
- **Audit History Cap**: The `bookings` collection stores all authoritative bookings permanently, while `bookingAudit` caps event history to a strict rolling maximum of 100 rows.

---

## 9. Future Admin Application Integration

The backend is 100% prepared for the upcoming Beula Audio Admin app. Both the website and admin app write to the same `bookings` collection (`source: "website"` or `source: "admin"`).  
See [`docs/admin-backend-contract.md`](docs/admin-backend-contract.md) for schema details and authentication hooks.

---

## 10. Production Build

```bash
npm run build
npm start
```
