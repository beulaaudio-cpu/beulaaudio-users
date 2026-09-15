export interface PackageItem {
  name: string;
  quantity: number;
  unit: 'unit' | 'pair' | 'set' | 'package';
  inventoryKey?: string;
  notes?: string;
}

export interface PackageDefinition {
  id: string;
  name: string;
  category: 'dj' | 'instrument' | 'custom';
  basePrice: number | null; // null for Honey Comb Pro where no base price is provided
  priceLabel: string;
  description: string;
  tagline: string;
  items: PackageItem[];
  transportIncluded: boolean;
  published: boolean;
  order: number;
  featured?: boolean;
  danceFloorOptions?: {
    id: string;
    label: string;
    size: '12x12' | '16x16';
    price: number;
  }[];
}

export const TRANSPORT_DISCLAIMER =
  "Transportation / delivery charges are not included in the package price. Transportation charges may vary depending on event location.";

export const DJ_PACKAGES: PackageDefinition[] = [
  {
    id: "dj-essential",
    name: "Essential Setup",
    category: "dj",
    basePrice: 8000,
    priceLabel: "₹8,000",
    tagline: "High-impact sound & atmosphere for intimate events",
    description: "Equipped with dual top and bass speakers, ambient parcan illumination, atmospheric smoke, and DJ front mask.",
    items: [
      { name: "Top speaker", quantity: 2, unit: "unit", inventoryKey: "topSpeaker" },
      { name: "Bass speaker", quantity: 2, unit: "unit", inventoryKey: "bassSpeaker" },
      { name: "Parcan Lights", quantity: 6, unit: "unit", inventoryKey: "parcan" },
      { name: "Smoke", quantity: 1, unit: "unit", inventoryKey: "smoke" },
      { name: "Front Black Mask", quantity: 1, unit: "unit", inventoryKey: "djMaskWhiteBlack" },
      { name: "Effect Lights", quantity: 2, unit: "unit", inventoryKey: "effectLights" },
      { name: "DJ Player", quantity: 1, unit: "unit", inventoryKey: "djPlayer" },
    ],
    transportIncluded: false,
    published: true,
    order: 1,
  },
  {
    id: "dj-premium",
    name: "Premium Setup",
    category: "dj",
    basePrice: 12000,
    priceLabel: "₹12,000",
    tagline: "Precision line-array VRX clarity with dual sharpy beams",
    description: "Upgrades to VRX line array audio, twin moving sharpy beams, 8 parcans, and iconic DJ LED Mask.",
    items: [
      { name: "VRX Top speaker", quantity: 2, unit: "unit", inventoryKey: "vrxTop" },
      { name: "Bass speaker", quantity: 2, unit: "unit", inventoryKey: "bassSpeaker" },
      { name: "Parcan Lights", quantity: 8, unit: "unit", inventoryKey: "parcan" },
      { name: "Sharpy Light", quantity: 2, unit: "unit", inventoryKey: "sharpy" },
      { name: "Smoke", quantity: 1, unit: "unit", inventoryKey: "smoke" },
      { name: "Effect Lights", quantity: 2, unit: "unit", inventoryKey: "effectLights" },
      { name: "DJ LED Mask", quantity: 1, unit: "unit", inventoryKey: "djLedMask" },
    ],
    transportIncluded: false,
    published: true,
    order: 2,
    featured: true,
  },
  {
    id: "dj-honeycomb",
    name: "Honey Comb Setup",
    category: "dj",
    basePrice: 15000,
    priceLabel: "₹15,000",
    tagline: "Architectural honeycomb lighting rig & overhead truss",
    description: "Features custom honeycomb geometry, structural light truss, top smoke immersion, and sharp stage illumination.",
    items: [
      { name: "VRX Top speaker", quantity: 2, unit: "unit", inventoryKey: "vrxTop" },
      { name: "Bass speaker", quantity: 2, unit: "unit", inventoryKey: "bassSpeaker" },
      { name: "Parcan Lights", quantity: 8, unit: "unit", inventoryKey: "parcan" },
      { name: "Sharpy Light", quantity: 2, unit: "unit", inventoryKey: "sharpy" },
      { name: "Effect Lights", quantity: 2, unit: "unit", inventoryKey: "effectLights" },
      { name: "Top Smoke", quantity: 1, unit: "unit", inventoryKey: "smoke" },
      { name: "Honey Comb", quantity: 1, unit: "unit", inventoryKey: "honeyComb" },
      { name: "Light Truss", quantity: 1, unit: "unit", inventoryKey: "truss" },
    ],
    transportIncluded: false,
    published: true,
    order: 3,
  },
  {
    id: "dj-honeycomb-plus",
    name: "Honey Comb Plus(+)",
    category: "dj",
    basePrice: 20000,
    priceLabel: "₹20,000",
    tagline: "20F hydraulic stand production with 12 parcans & blinders",
    description: "Massive concert setup featuring 4 Sharpy beams, 2 crowd-facing Blinder lights, 12 Parcan washes, and 20F hydraulic stand.",
    items: [
      { name: "VRX Top speaker", quantity: 2, unit: "unit", inventoryKey: "vrxTop" },
      { name: "Bass speaker", quantity: 2, unit: "unit", inventoryKey: "bassSpeaker" },
      { name: "Parcan Lights", quantity: 12, unit: "unit", inventoryKey: "parcan" },
      { name: "Sharpy Light", quantity: 4, unit: "unit", inventoryKey: "sharpy" },
      { name: "Effect Lights", quantity: 2, unit: "unit", inventoryKey: "effectLights" },
      { name: "Blinder Lights", quantity: 2, unit: "unit", inventoryKey: "blinder" },
      { name: "Top Smoke", quantity: 1, unit: "unit", inventoryKey: "smoke" },
      { name: "DJ LED Mask", quantity: 1, unit: "unit", inventoryKey: "djLedMask" },
      { name: "Light Truss - 20F Hydraulic Stand", quantity: 1, unit: "unit", inventoryKey: "truss" },
    ],
    transportIncluded: false,
    published: true,
    order: 4,
  },
  {
    id: "dj-honeycomb-pro",
    name: "Honey Comb Pro",
    category: "dj",
    basePrice: null, // As specified in Setup.txt, no base price is provided
    priceLabel: "Contact / Configure",
    tagline: "Flagship concert stage with illuminated LED dance floor",
    description: "The complete festival-grade production. Paired with modular LED dance floor configurations for weddings and luxury galas.",
    items: [
      { name: "VRX Top speaker", quantity: 2, unit: "unit", inventoryKey: "vrxTop" },
      { name: "Bass speaker", quantity: 2, unit: "unit", inventoryKey: "bassSpeaker" },
      { name: "Parcan Lights", quantity: 8, unit: "unit", inventoryKey: "parcan" },
      { name: "Sharpy Light", quantity: 2, unit: "unit", inventoryKey: "sharpy" },
      { name: "Effect Lights", quantity: 2, unit: "unit", inventoryKey: "effectLights" },
      { name: "Top Smoke", quantity: 1, unit: "unit", inventoryKey: "smoke" },
      { name: "Honey Comb", quantity: 1, unit: "unit", inventoryKey: "honeyComb" },
      { name: "Light Truss", quantity: 1, unit: "unit", inventoryKey: "truss" },
    ],
    danceFloorOptions: [
      { id: "df-12", label: "12 feet x 12 feet Dance Floor", size: "12x12", price: 25000 },
      { id: "df-16", label: "16 feet x 16 feet Dance Floor", size: "16x16", price: 30000 },
    ],
    transportIncluded: false,
    published: true,
    order: 5,
  },
];

export const INSTRUMENT_SETUP: PackageDefinition = {
  id: "instrument-setup",
  name: "Instruments Setup",
  category: "instrument",
  basePrice: 10000,
  priceLabel: "₹10,000",
  tagline: "Dedicated live stage engineering with 4 QSC K12 monitors",
  description: "Crafted specifically for live bands, acoustic performances, and vocal ensembles with digital mixing and multi-channel monitoring.",
  items: [
    { name: "18\" VRX Top speaker", quantity: 2, unit: "unit", inventoryKey: "vrxTop" },
    { name: "18\" Bass speaker", quantity: 2, unit: "unit", inventoryKey: "bassSpeaker" },
    { name: "Digital Mixer", quantity: 1, unit: "unit", inventoryKey: "mixer" },
    { name: "Monitor (QSC K12)", quantity: 4, unit: "unit", inventoryKey: "monitor" },
    { name: "Instrument Cable - Mono, Stereo", quantity: 1, unit: "set", inventoryKey: "cables" },
    { name: "Mic, Cord, Stand", quantity: 1, unit: "set", inventoryKey: "mic" },
  ],
  transportIncluded: false,
  published: true,
  order: 6,
};

export interface CustomPricedItem {
  id: string;
  name: string;
  unitPrice: number;
  unitLabel: string;
  unitType: 'pair' | 'unit' | 'package';
  multiplier: number; // 2 for pair, 1 for unit
  inventoryKey: string;
  requiresBass18?: boolean;
  notes?: string;
}

export const CUSTOM_ITEMS_CATALOG: CustomPricedItem[] = [
  {
    id: "normal-top",
    name: "Normal Top speaker (1 pair)",
    unitPrice: 3500,
    unitLabel: "pair",
    unitType: "pair",
    multiplier: 2,
    inventoryKey: "topSpeaker",
  },
  {
    id: "vrx-top",
    name: "VRX Top speaker (1 pair)",
    unitPrice: 2500,
    unitLabel: "pair",
    unitType: "pair",
    multiplier: 2,
    inventoryKey: "vrxTop",
    requiresBass18: true,
    notes: "18\" bass is compulsory for VRX only",
  },
  {
    id: "bass-18",
    name: "18\" Bass (1 pair)",
    unitPrice: 2000,
    unitLabel: "pair",
    unitType: "pair",
    multiplier: 2,
    inventoryKey: "bassSpeaker",
  },
  {
    id: "sharpy-pair",
    name: "Sharpy Light (1 pair)",
    unitPrice: 3000,
    unitLabel: "pair",
    unitType: "pair",
    multiplier: 2,
    inventoryKey: "sharpy",
  },
  {
    id: "parcan-unit",
    name: "Parcan Light (1 unit)",
    unitPrice: 500,
    unitLabel: "unit",
    unitType: "unit",
    multiplier: 1,
    inventoryKey: "parcan",
  },
  {
    id: "smoke-package",
    name: "Smoke + 1L Smoke Oil",
    unitPrice: 1000,
    unitLabel: "package",
    unitType: "package",
    multiplier: 1,
    inventoryKey: "smoke",
  },
  {
    id: "cordless-mic-pair",
    name: "Cordless Mic (1 pair)",
    unitPrice: 1000,
    unitLabel: "pair",
    unitType: "pair",
    multiplier: 2,
    inventoryKey: "mic",
  },
  {
    id: "cord-mic-pair",
    name: "Cord Mic (1 pair)",
    unitPrice: 500,
    unitLabel: "pair",
    unitType: "pair",
    multiplier: 2,
    inventoryKey: "mic",
  },
];

export const EFFECT_LIGHT_OPTIONS = [
  { id: "dandiya", name: "Dandiya Light", inventoryKey: "dandiya" },
  { id: "lazer", name: "Lazer Effect", inventoryKey: "lazer" },
  { id: "moving", name: "Moving Light", inventoryKey: "moving" },
  { id: "disco_ball", name: "Disco Ball", inventoryKey: "discoBall" },
  { id: "spyder", name: "Spyder Light", inventoryKey: "spyder" },
];

export const ALL_PACKAGES = [...DJ_PACKAGES, INSTRUMENT_SETUP];

export function getPackageById(id: string): PackageDefinition | undefined {
  return ALL_PACKAGES.find((pkg) => pkg.id === id);
}

export function formatINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}
