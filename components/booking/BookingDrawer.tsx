"use client";

import React, { useState, useEffect } from "react";
import {
  PackageDefinition,
  ALL_PACKAGES,
  CUSTOM_ITEMS_CATALOG,
  formatINR,
  TRANSPORT_DISCLAIMER,
} from "../../lib/data/packages";
import {
  X,
  Check,
  Calendar,
  MapPin,
  User,
  Phone,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  AlertCircle,
  Loader2,
  Sparkles,
  Clock,
  Plus,
  Minus,
  Sliders,
} from "lucide-react";
import confetti from "canvas-confetti";
import { useLanguage } from "../../lib/i18n/LanguageContext";
import { useAuth } from "../../lib/firebase/AuthContext";
import { saveClientBookingToFirestore } from "../../lib/firestore/clientBookings";

interface BookingDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  initialPackageId?: string;
  initialCustomItems?: { itemId: string; quantity: number }[];
  initialDanceFloor?: any;
  initialEffectLights?: string[];
}

export function BookingDrawer({
  isOpen,
  onClose,
  initialPackageId,
  initialCustomItems,
  initialDanceFloor,
  initialEffectLights,
}: BookingDrawerProps) {
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Form State
  const [category, setCategory] = useState<"dj" | "instrument" | "custom">("dj");
  const [selectedPackageId, setSelectedPackageId] = useState<string>("dj-premium");
  const [customItems, setCustomItems] = useState<{ itemId: string; quantity: number }[]>([]);
  const [danceFloor, setDanceFloor] = useState<any>(null);

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");

  const [eventType, setEventType] = useState<
    "marriage" | "birthday" | "ear_piercing" | "corporate" | "others"
  >("marriage");
  const [customEventType, setCustomEventType] = useState("");

  const [eventDate, setEventDate] = useState("");
  const [eventStartTime, setEventStartTime] = useState("09:00");
  const [eventEndTime, setEventEndTime] = useState("14:00");
  const [eventTimingSlot, setEventTimingSlot] = useState<
    "morning" | "evening" | "night" | "full_day" | "custom"
  >("morning");
  const [eventDistrict, setEventDistrict] = useState("Chennai");
  const [eventAddress, setEventAddress] = useState("");
  const [notes, setNotes] = useState("");

  // Validation & Server State
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isCheckingAvail, setIsCheckingAvail] = useState(false);
  const [availResult, setAvailResult] = useState<{
    available: boolean;
    status: "AVAILABLE" | "LIMITED" | "UNAVAILABLE";
    message?: string;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<{
    success: boolean;
    bookingId?: string;
    totalPrice?: number | null;
    isCustomQuote?: boolean;
    message?: string;
  } | null>(null);

  // Client-generated idempotency key
  const [requestId, setRequestId] = useState("");
  const { dict, language } = useLanguage();
  const { user, openAuthModal } = useAuth();

  // Scroll lock: Prevents underlying page from scrolling while drawer is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      setRequestId("REQ-" + Date.now() + "-" + Math.random().toString(36).substring(2, 7).toUpperCase());
      setErrorMsg(null);
      setSubmissionResult(null);
      setStep(1);

      if (initialPackageId) {
        if (initialPackageId === "instrument-setup") {
          setCategory("instrument");
        } else {
          setCategory("dj");
        }
        setSelectedPackageId(initialPackageId);
      }
      if (initialCustomItems && initialCustomItems.length > 0) {
        setCategory("custom");
        setCustomItems(initialCustomItems);
        // Custom setup configured from custom builder -> proceed to client details
        setStep(2);
      }
      if (initialDanceFloor) setDanceFloor(initialDanceFloor);
    } else {
      // Clear errors on close
      setErrorMsg(null);
      setStep(1);
    }
  }, [isOpen, initialPackageId, initialCustomItems, initialDanceFloor]);

  if (!isOpen) return null;

  const currentPkg = ALL_PACKAGES.find((p) => p.id === selectedPackageId);

  const handleUpdateCustomItem = (itemId: string, delta: number) => {
    setErrorMsg(null);
    setCustomItems((prev) => {
      const existing = prev.find((item) => item.itemId === itemId);
      const currentQty = existing ? existing.quantity : 0;
      const newQty = Math.max(0, currentQty + delta);

      if (newQty === 0) {
        return prev.filter((item) => item.itemId !== itemId);
      }
      if (existing) {
        return prev.map((item) =>
          item.itemId === itemId ? { ...item, quantity: newQty } : item
        );
      }
      return [...prev, { itemId, quantity: newQty }];
    });
  };

  // Corrected Preset handler using accurate CUSTOM_ITEMS_CATALOG IDs
  const handleApplyPreset = (preset: "starter" | "full") => {
    setErrorMsg(null);
    if (preset === "starter") {
      setCustomItems([
        { itemId: "vrx-top", quantity: 2 },
        { itemId: "bass-18", quantity: 2 },
        { itemId: "cordless-mic-pair", quantity: 1 },
      ]);
    } else {
      setCustomItems([
        { itemId: "vrx-top", quantity: 4 },
        { itemId: "bass-18", quantity: 4 },
        { itemId: "parcan-unit", quantity: 8 },
        { itemId: "sharpy-pair", quantity: 2 },
        { itemId: "smoke-package", quantity: 1 },
        { itemId: "cordless-mic-pair", quantity: 1 },
      ]);
    }
  };

  const customSubtotal = customItems.reduce((acc, ci) => {
    const def = CUSTOM_ITEMS_CATALOG.find((c) => c.id === ci.itemId);
    return acc + (def ? def.unitPrice * ci.quantity : 0);
  }, 0);

  const vrxQty = customItems.find((i) => i.itemId === "vrx-top")?.quantity || 0;
  const bassQty = customItems.find((i) => i.itemId === "bass-18")?.quantity || 0;
  const hasAcousticImbalance = vrxQty > 0 && bassQty === 0;

  const handleSelectCategory = (cat: "dj" | "instrument" | "custom") => {
    setCategory(cat);
    setErrorMsg(null);
    if (cat === "custom" && customItems.length === 0) {
      handleApplyPreset("starter");
    }
  };

  // Check availability when date or timing changes
  const checkAvailability = async (
    date: string = eventDate,
    startTime: string = eventStartTime,
    endTime: string = eventEndTime,
    slot: string = eventTimingSlot
  ) => {
    if (!date) return;
    setIsCheckingAvail(true);
    setErrorMsg(null);
    setAvailResult(null);

    try {
      const payload = {
        date,
        startTime,
        endTime,
        slot,
        timing: `${slot.toUpperCase()}: ${startTime} - ${endTime}`,
        category,
        packageId: category !== "custom" ? selectedPackageId : undefined,
        customItems: category === "custom" ? customItems : undefined,
      };

      const res = await fetch("/api/availability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setAvailResult({
          available: data.available,
          status: data.status,
          message: data.message,
        });
      } else {
        setAvailResult({
          available: false,
          status: "UNAVAILABLE",
          message: data.message || "Unable to reserve on this date and time.",
        });
      }
    } catch {
      // Local fallback in case server isn't reached
      setAvailResult({
        available: true,
        status: "AVAILABLE",
        message: "Available for selected slot.",
      });
    } finally {
      setIsCheckingAvail(false);
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const d = e.target.value;
    setEventDate(d);
    if (d) {
      checkAvailability(d, eventStartTime, eventEndTime, eventTimingSlot);
    }
  };

  const handleSlotChange = (slot: "morning" | "evening" | "full_day") => {
    setEventTimingSlot(slot);
    let s = "09:00";
    let e = "14:00";
    if (slot === "morning") { s = "09:00"; e = "14:00"; }
    else if (slot === "evening") { s = "16:00"; e = "23:00"; }
    else if (slot === "full_day") { s = "08:00"; e = "23:00"; }
    setEventStartTime(s);
    setEventEndTime(e);
    if (eventDate) {
      checkAvailability(eventDate, s, e, slot);
    }
  };

  // Submit booking to authoritative API and Firestore Database
  const handleSubmitBooking = async () => {
    // Auth Check: User must be signed in to submit and reserve
    if (!user) {
      openAuthModal("Please sign in with Google or Email to reserve your setup and track your dispatch.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    const submissionPayload = {
      requestId,
      source: "website",
      customer: {
        name: customerName.trim(),
        phone: customerPhone.trim(),
      },
      event: {
        type: eventType,
        customType: eventType === "others" ? customEventType.trim() : undefined,
        date: eventDate,
        startTime: eventStartTime,
        endTime: eventEndTime,
        timing: `${eventTimingSlot.toUpperCase()}: ${eventStartTime} - ${eventEndTime}`,
        district: eventDistrict.trim(),
        address: eventAddress.trim(),
      },
      setup: {
        category,
        packageId: category !== "custom" ? selectedPackageId : undefined,
        packageName: category !== "custom" ? currentPkg?.name : "Custom Audio Setup",
        customItems: category === "custom" ? customItems : undefined,
        // Admin curated effect lights
        effectLights: [{ itemId: "admin_curated", name: "Curated Effect Lights", quantity: 2 }],
        danceFloor: danceFloor || undefined,
      },
      notes: notes.trim(),
    };

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submissionPayload),
      });
      const data = await res.json();

      if (data.success) {
        const finalBookingId = data.bookingId || ("BK-" + Math.random().toString(36).substring(2, 9).toUpperCase());

        // Authoritatively persist directly into Firestore client SDK database
        await saveClientBookingToFirestore({
          id: finalBookingId,
          trackingId: finalBookingId,
          requestId,
          userId: user.uid,
          userEmail: user.email || undefined,
          source: "website",
          status: "pending",
          stageStatus: "ordered",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          customer: {
            name: customerName.trim(),
            phone: customerPhone.trim(),
          },
          event: {
            type: eventType,
            customType: eventType === "others" ? customEventType.trim() : undefined,
            date: eventDate,
            startTime: eventStartTime,
            endTime: eventEndTime,
            timing: `${eventTimingSlot.toUpperCase()}: ${eventStartTime} - ${eventEndTime}`,
            district: eventDistrict.trim(),
            address: eventAddress.trim(),
          },
          setup: {
            category,
            packageId: category !== "custom" ? selectedPackageId : undefined,
            packageName: category !== "custom" ? currentPkg?.name : "Custom Audio Setup",
            customItems: category === "custom" ? customItems : undefined,
            effectLights: [{ itemId: "admin_curated", name: "Curated Effect Lights", quantity: 2 }],
            danceFloor: danceFloor || undefined,
            basePrice: currentPkg?.basePrice || null,
            customPrice: customSubtotal,
            danceFloorPrice: danceFloor?.price || 0,
            transportCharge: null,
          },
          totalPriceBeforeTransport: data.totalPrice ?? (category === "custom" ? customSubtotal : currentPkg?.basePrice ?? 0),
          isCustomQuote: data.isCustomQuote ?? false,
          notes: notes.trim(),
        });

        setSubmissionResult({
          success: true,
          bookingId: finalBookingId,
          totalPrice: data.totalPrice,
          isCustomQuote: data.isCustomQuote,
        });
        setStep(5);
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
            colors: ["#FBBF24", "#FFFFFF", "#E2E8F0"],
          });
        } catch {
          // ignore
        }
      } else {
        setErrorMsg(data.message || "Failed to submit booking request. Please try again.");
      }
    } catch (err: any) {
      setErrorMsg("Network error. Your request could not be transmitted to the Beula server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step validation
  const validateStep1 = () => {
    if (category === "custom" && (!customItems || customItems.length === 0)) {
      setErrorMsg("Please select at least one item in your custom configuration.");
      return false;
    }
    setErrorMsg(null);
    return true;
  };

  const validateStep2 = () => {
    if (!customerName.trim() || customerName.trim().length < 2) {
      setErrorMsg("Please enter your full name (minimum 2 characters).");
      return false;
    }
    // Strict phone number validation: Must contain only digits and follow Indian mobile standard
    const digitsOnly = customerPhone.replace(/\D/g, "");
    const normalizedDigits = digitsOnly.length === 12 && digitsOnly.startsWith("91")
      ? digitsOnly.slice(2)
      : digitsOnly;

    if (!/^[6-9]\d{9}$/.test(normalizedDigits)) {
      setErrorMsg("Please enter a valid 10-digit Indian phone number starting with 6, 7, 8, or 9 (numbers only).");
      return false;
    }
    if (eventType === "others" && !customEventType.trim()) {
      setErrorMsg("Please describe your event occasion.");
      return false;
    }
    setErrorMsg(null);
    return true;
  };

  const validateStep3 = () => {
    if (!eventDate) {
      setErrorMsg("Please select your event date.");
      return false;
    }
    if (!eventDistrict.trim()) {
      setErrorMsg("Please enter your event district / city.");
      return false;
    }
    if (!eventAddress.trim() || eventAddress.length < 4) {
      setErrorMsg("Please enter the venue hall or location details.");
      return false;
    }
    if (availResult && !availResult.available) {
      setErrorMsg("Selected date is unavailable for this setup. Please pick another date.");
      return false;
    }
    setErrorMsg(null);
    return true;
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 bg-black/90 backdrop-blur-2xl animate-in fade-in duration-300 overflow-y-auto"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto rounded-3xl border border-white/20 bg-zinc-950 p-6 sm:p-10 shadow-2xl text-white my-auto"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          data-cursor="CLOSE"
          className="absolute top-6 right-6 p-2 rounded-full border border-white/15 bg-white/5 text-zinc-400 hover:text-white hover:border-white/40 focus:outline-none transition-colors"
          aria-label="Close booking modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Drawer Flow Header & Stepper */}
        {step < 5 && (
          <div className="border-b border-white/10 pb-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <span className="font-mono text-xs tracking-[0.3em] text-amber-400 font-bold uppercase">
                BEULA AUDIO // {dict.drawerTitle}
              </span>
              <span className="font-mono text-xs text-zinc-500 font-medium">
                STEP 0{step} OF 04
              </span>
            </div>

            {/* Stepper Progress Line */}
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map((s) => (
                <div
                  key={s}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    step >= s
                      ? "bg-gradient-to-r from-amber-400 to-amber-300 shadow-[0_0_10px_rgba(251,191,36,0.5)]"
                      : "bg-white/10"
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Error Banner */}
        {errorMsg && (
          <div className="mb-6 p-4 rounded-xl border border-red-500/50 bg-red-950/40 text-red-200 flex items-start gap-3 animate-in fade-in duration-200">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div className="text-xs font-sans leading-relaxed">{errorMsg}</div>
          </div>
        )}

        {/* STEP 1: SELECT SETUP */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold uppercase tracking-tight">
                {dict.step01Title}
              </h3>
              <p className="font-sans text-xs text-zinc-400 mt-1 font-light">
                {dict.step01Subtitle}
              </p>
            </div>

            {/* Category Switcher */}
            <div className="grid grid-cols-3 gap-3">
              {(["dj", "instrument", "custom"] as const).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => handleSelectCategory(cat)}
                  className={`p-3 rounded-xl border font-mono text-xs uppercase tracking-wider transition-all ${
                    category === cat
                      ? "border-amber-400 bg-amber-400/20 text-white font-bold shadow-[0_0_15px_rgba(251,191,36,0.2)]"
                      : "border-white/10 bg-white/5 text-zinc-400 hover:border-white/25"
                  }`}
                >
                  {cat === "dj" ? dict.navSetups : cat === "instrument" ? dict.navInstruments : dict.navCustom}
                </button>
              ))}
            </div>

            {/* If DJ Category, pick from packages */}
            {category === "dj" && (
              <div className="space-y-3">
                <span className="font-mono text-[10px] text-zinc-400 tracking-wider uppercase block font-semibold">
                  AVAILABLE DJ SETUPS:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {ALL_PACKAGES.filter((p) => p.category === "dj").map((pkg, pIdx) => (
                    <button
                      key={pkg.id}
                      type="button"
                      onClick={() => setSelectedPackageId(pkg.id)}
                      className={`p-4 rounded-xl border text-left transition-all ${
                        selectedPackageId === pkg.id
                          ? "border-amber-400 bg-amber-400/15 text-white shadow-lg"
                          : "border-white/10 bg-white/[0.02] text-zinc-400 hover:border-white/30"
                      }`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-serif font-bold text-sm text-white">
                          {dict[`pkg0${pIdx + 1}Name` as keyof typeof dict] || pkg.name}
                        </span>
                        <span className="font-mono text-xs text-amber-300 font-bold">
                          {pkg.basePrice !== null ? formatINR(pkg.basePrice) : "Contact / Configure"}
                        </span>
                      </div>
                      <p className="font-sans text-[11px] text-zinc-400 line-clamp-1 font-light">
                        {dict[`pkg0${pIdx + 1}Desc` as keyof typeof dict] || pkg.tagline}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* If Instrument Category */}
            {category === "instrument" && (
              <div className="p-6 rounded-2xl border border-white/15 bg-white/[0.02]">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-serif text-xl font-bold text-white">
                    {dict.instrumentMainTitle}
                  </h4>
                  <span className="font-mono text-sm text-amber-300 font-bold">₹10,000</span>
                </div>
                <p className="font-sans text-xs text-zinc-400 mb-4 font-light leading-relaxed">
                  {dict.instrumentSubtitle}
                </p>
              </div>
            )}

            {/* If Custom Category: Full Interactive In-Drawer Configurator */}
            {category === "custom" && (
              <div className="space-y-4">
                {/* Configurator Header & Presets */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-4 rounded-2xl border border-white/10 bg-white/[0.03]">
                  <div>
                    <h4 className="font-serif text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <Sliders className="w-4 h-4 text-amber-400" />
                      <span>{dict.customMainTitle}</span>
                    </h4>
                    <p className="font-sans text-[11px] text-zinc-400 mt-0.5 font-light">
                      {dict.customSubtitle}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleApplyPreset("starter")}
                      className="px-2.5 py-1 rounded-lg border border-amber-400/40 bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 font-mono text-[10px] uppercase transition-colors font-semibold"
                    >
                      {dict.customStandardRigPreset}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApplyPreset("full")}
                      className="px-2.5 py-1 rounded-lg border border-white/20 bg-white/5 hover:bg-white/15 text-zinc-300 font-mono text-[10px] uppercase transition-colors"
                    >
                      {dict.customFullStagePreset}
                    </button>
                  </div>
                </div>

                {/* Acoustic Rule Alert */}
                {hasAcousticImbalance && (
                  <div className="p-3 rounded-xl border border-amber-400/40 bg-amber-950/20 flex items-center justify-between gap-3 text-xs text-amber-200">
                    <span className="font-sans">
                      {dict.customVrxWarning}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleUpdateCustomItem("bass-18", 2)}
                      className="px-3 py-1 rounded-md bg-amber-400 text-black font-mono text-[10px] font-bold uppercase shrink-0"
                    >
                      + Add 2 Bass
                    </button>
                  </div>
                )}

                {/* Equipment Items Grid with +/- Steppers */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[320px] overflow-y-auto pr-1">
                  {CUSTOM_ITEMS_CATALOG.map((item) => {
                    const currentQty =
                      customItems.find((ci) => ci.itemId === item.id)?.quantity || 0;
                    return (
                      <div
                        key={item.id}
                        className={`p-3 rounded-xl border flex items-center justify-between transition-colors ${
                          currentQty > 0
                            ? "border-amber-400/50 bg-amber-400/[0.06]"
                            : "border-white/10 bg-white/[0.02]"
                        }`}
                      >
                        <div className="flex-grow mr-2">
                          <span className="font-serif text-xs font-bold text-white block">
                            {item.name}
                          </span>
                          <span className="font-mono text-[10px] text-amber-300 font-semibold">
                            {formatINR(item.unitPrice)} / {item.unitLabel || "unit"}
                          </span>
                        </div>

                        {/* Quantity Stepper */}
                        <div className="flex items-center gap-1.5 shrink-0 bg-black/60 rounded-lg p-1 border border-white/15">
                          <button
                            type="button"
                            onClick={() => handleUpdateCustomItem(item.id, -1)}
                            disabled={currentQty === 0}
                            aria-label={`Decrease ${item.name}`}
                            className="w-6 h-6 rounded flex items-center justify-center text-white hover:bg-white/20 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="font-mono text-xs font-bold text-white w-5 text-center">
                            {currentQty}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleUpdateCustomItem(item.id, 1)}
                            aria-label={`Increase ${item.name}`}
                            className="w-6 h-6 rounded flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                          >
                            <Plus className="w-3 h-3 text-amber-400" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Custom Subtotal Bar */}
                <div className="p-4 rounded-xl border border-amber-400/40 bg-black/60 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="font-mono text-[9px] tracking-wider text-zinc-400 uppercase font-semibold">
                      {dict.customTotalInvestment}:
                    </span>
                    <span className="font-sans text-[11px] text-zinc-400">
                      {customItems.reduce((sum, ci) => sum + ci.quantity, 0)} {dict.customUnitsSelected}
                    </span>
                  </div>
                  <div className="font-serif text-2xl font-bold text-amber-300">
                    {formatINR(customSubtotal)}
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={() => {
                  if (validateStep1()) setStep(2);
                }}
                className="px-8 py-3 rounded-full bg-amber-400 hover:bg-amber-300 text-black font-mono text-xs font-bold tracking-widest uppercase transition-colors flex items-center gap-2 active:scale-95 shadow-[0_0_20px_rgba(251,191,36,0.3)]"
              >
                <span>{dict.btnNextDetails}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: EVENT DETAILS */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold uppercase tracking-tight">
                {dict.step02Title}
              </h3>
              <p className="font-sans text-xs text-zinc-400 mt-1 font-light">
                {dict.step02Subtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-mono text-[10px] tracking-wider text-zinc-400 uppercase mb-1.5 font-semibold">
                  {dict.labelClientName}
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Suresh Kumar"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-white/15 bg-black text-white font-sans text-sm focus:border-amber-400 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-[10px] tracking-wider text-zinc-400 uppercase mb-1.5 font-semibold">
                  {dict.labelPhoneNumber}
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    inputMode="numeric"
                    value={customerPhone}
                    onChange={(e) => {
                      // Strictly filter input: Only allow numbers and optional leading +
                      const cleaned = e.target.value.replace(/[^\d+]/g, "").slice(0, 13);
                      setCustomerPhone(cleaned);
                    }}
                    placeholder="e.g. 9876543210"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-white/15 bg-black text-white font-sans text-sm focus:border-amber-400 focus:outline-none transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Event Category Options */}
            <div>
              <label className="block font-mono text-[10px] tracking-wider text-zinc-400 uppercase mb-2 font-semibold">
                {dict.labelOccasionType}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                {[
                  { id: "marriage", label: dict.occasionMarriage },
                  { id: "birthday", label: dict.occasionBirthday },
                  { id: "ear_piercing", label: dict.occasionEarPiercing },
                  { id: "corporate", label: dict.occasionCorporate },
                  { id: "others", label: dict.occasionOthers },
                ].map((ev) => (
                  <button
                    key={ev.id}
                    type="button"
                    onClick={() => setEventType(ev.id as any)}
                    className={`p-3 rounded-xl border font-sans text-xs font-medium transition-all ${
                      eventType === ev.id
                        ? "border-amber-400 bg-amber-400 text-black font-bold shadow-md"
                        : "border-white/10 bg-white/5 text-zinc-300 hover:border-white/30"
                    }`}
                  >
                    {ev.label}
                  </button>
                ))}
              </div>

              {eventType === "others" && (
                <div className="mt-3 animate-in fade-in duration-200">
                  <input
                    type="text"
                    required
                    value={customEventType}
                    onChange={(e) => setCustomEventType(e.target.value)}
                    placeholder={dict.specifyOccasion}
                    className="w-full px-4 py-3 rounded-xl border border-amber-400/50 bg-black text-white font-sans text-sm focus:border-amber-400 focus:outline-none transition-colors"
                  />
                </div>
              )}
            </div>

            <div className="flex justify-between items-center pt-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-6 py-2.5 rounded-full border border-white/20 text-zinc-400 hover:text-white font-mono text-xs tracking-wider uppercase transition-colors flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{dict.btnBack}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (validateStep2()) setStep(3);
                }}
                className="px-8 py-3 rounded-full bg-amber-400 hover:bg-amber-300 text-black font-mono text-xs font-bold tracking-widest uppercase transition-colors flex items-center gap-2 active:scale-95 shadow-[0_0_20px_rgba(251,191,36,0.3)]"
              >
                <span>{dict.btnNextDate}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: DATE & LOCATION */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold uppercase tracking-tight">
                {dict.step03Title}
              </h3>
              <p className="font-sans text-xs text-zinc-400 mt-1 font-light">
                {dict.step03Subtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-mono text-[10px] tracking-wider text-zinc-400 uppercase mb-1.5 font-semibold">
                  {dict.labelEventDate}
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split("T")[0]}
                    value={eventDate}
                    onChange={handleDateChange}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-white/15 bg-black text-white font-mono text-sm focus:border-amber-400 focus:outline-none transition-colors"
                  />
                </div>

                {/* Real-time availability indicator */}
                {isCheckingAvail && (
                  <div className="flex items-center gap-2 text-xs text-zinc-400 mt-2">
                    <Loader2 className="w-3 h-3 animate-spin text-amber-400" />
                    <span>Checking warehouse equipment inventory...</span>
                  </div>
                )}

                {availResult && !isCheckingAvail && (
                  <div
                    className={`mt-2 p-2.5 rounded-lg border text-xs flex items-center gap-2 ${
                      availResult.available
                        ? "border-emerald-500/40 bg-emerald-950/30 text-emerald-300"
                        : "border-red-500/40 bg-red-950/30 text-red-300"
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        availResult.available ? "bg-emerald-400" : "bg-red-400"
                      }`}
                    />
                    <span className="font-mono uppercase font-bold tracking-wider">
                      {availResult.status}:
                    </span>
                    <span className="font-sans">{availResult.message}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block font-mono text-[10px] tracking-wider text-zinc-400 uppercase mb-1.5 font-semibold">
                  {dict.labelDistrict}
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={eventDistrict}
                    onChange={(e) => setEventDistrict(e.target.value)}
                    placeholder="e.g. Chennai, Madurai, Coimbatore"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-white/15 bg-black text-white font-sans text-sm focus:border-amber-400 focus:outline-none transition-colors"
                  />
                </div>
              </div>
            </div>            {/* EVENT TIMING & TIME SLOTS */}
            <div>
              <label className="block font-mono text-[10px] tracking-wider text-zinc-400 uppercase mb-2 font-semibold">
                {dict.labelTimingWindow}
              </label>
              <div className="grid grid-cols-3 gap-2 mb-2">
                {[
                  { id: "morning", label: dict.slotMorning || "Morning" },
                  { id: "evening", label: dict.slotEvening || "Evening" },
                  { id: "full_day", label: dict.slotFullDay || "Full Day" },
                ].map((slot) => (
                  <button
                    key={slot.id}
                    type="button"
                    onClick={() => handleSlotChange(slot.id as any)}
                    className={`py-3 px-2 rounded-xl border text-center transition-all ${
                      eventTimingSlot === slot.id
                        ? "border-amber-400 bg-amber-400/20 text-amber-300 font-bold shadow-lg shadow-amber-500/10"
                        : "border-white/10 bg-white/[0.02] text-zinc-400 hover:border-white/30 hover:text-white"
                    }`}
                  >
                    <span className="block font-mono text-xs uppercase tracking-wider">
                      {slot.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-mono text-[10px] tracking-wider text-zinc-400 uppercase mb-1.5 font-semibold">
                {dict.labelVenueAddress}
              </label>
              <textarea
                rows={2}
                required
                value={eventAddress}
                onChange={(e) => setEventAddress(e.target.value)}
                placeholder="Hall name, door number, street, landmark"
                className="w-full px-4 py-3 rounded-xl border border-white/15 bg-black text-white font-sans text-sm focus:border-amber-400 focus:outline-none transition-colors"
              />
            </div>

            {/* Mandatory Transportation Disclaimer */}
            <div className="p-4 rounded-xl border border-white/10 bg-black/60 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div className="text-xs text-zinc-300 font-sans">
                <span className="font-mono text-[10px] text-amber-300 font-bold uppercase block mb-0.5">
                  {dict.logisticsNoticeTitle}
                </span>
                {dict.transportDisclaimer}
              </div>
            </div>

            <div className="flex justify-between items-center pt-4">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-6 py-2.5 rounded-full border border-white/20 text-zinc-400 hover:text-white font-mono text-xs tracking-wider uppercase transition-colors flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{dict.btnBack}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (validateStep3()) setStep(4);
                }}
                className="px-8 py-3 rounded-full bg-amber-400 hover:bg-amber-300 text-black font-mono text-xs font-bold tracking-widest uppercase transition-colors flex items-center gap-2 active:scale-95 shadow-[0_0_20px_rgba(251,191,36,0.3)]"
              >
                <span>{dict.btnNextReview}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: REVIEW & SUBMIT */}
        {step === 4 && (
          <div className="space-y-6">
            <div>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold uppercase tracking-tight">
                {dict.step04Title}
              </h3>
              <p className="font-sans text-xs text-zinc-400 mt-1 font-light">
                {dict.step04Subtitle}
              </p>
            </div>

            {/* Summary Card */}
            <div className="rounded-2xl border border-white/15 bg-white/[0.02] p-6 space-y-4">
              <div className="flex justify-between items-start border-b border-white/10 pb-4">
                <div>
                  <span className="font-mono text-[10px] text-amber-400 font-bold uppercase tracking-wider block">
                    SELECTED CONFIGURATION
                  </span>
                  <h4 className="font-serif text-2xl font-bold text-white">
                    {category === "dj"
                      ? currentPkg?.name
                      : category === "instrument"
                      ? dict.instrumentMainTitle
                      : dict.customMainTitle}
                  </h4>
                  <span className="font-sans text-xs text-zinc-400 capitalize font-light">
                    Occasion: {eventType === "others" ? customEventType : eventType.replace("_", " ")}
                  </span>
                </div>

                <div className="text-right">
                  <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest block font-semibold">
                    {dict.baseInvestmentLabel}
                  </span>
                  <span className="font-serif text-2xl font-bold text-amber-300">
                    {category === "dj" && currentPkg?.basePrice !== null
                      ? formatINR(currentPkg?.basePrice || 0)
                      : category === "instrument"
                      ? formatINR(10000)
                      : category === "custom"
                      ? formatINR(customSubtotal)
                      : "Contact / Configure"}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="font-mono text-[10px] text-zinc-500 uppercase block font-semibold">
                    CLIENT CONTACT
                  </span>
                  <p className="font-sans text-zinc-200 font-medium">{customerName}</p>
                  <p className="font-mono text-zinc-400">{customerPhone}</p>
                </div>

                <div>
                  <span className="font-mono text-[10px] text-zinc-500 uppercase block font-semibold">
                    LOGISTICS & VENUE
                  </span>
                  <p className="font-sans text-zinc-200 font-medium">
                    Date: {eventDate}
                  </p>
                  <p className="font-mono text-amber-300 text-[11px] font-bold">
                    Slot: {eventTimingSlot.toUpperCase()} ({eventStartTime} – {eventEndTime})
                  </p>
                  <p className="font-sans text-zinc-400 font-light">
                    {eventDistrict} — {eventAddress}
                  </p>
                </div>
              </div>

              {danceFloor && (
                <div className="pt-2 border-t border-white/10 flex justify-between text-xs">
                  <span className="text-zinc-300">LED Dance Floor ({danceFloor.size})</span>
                  <span className="font-mono text-amber-300 font-bold">
                    {formatINR(danceFloor.price)}
                  </span>
                </div>
              )}
            </div>

            {/* Additional Operational Notes */}
            <div>
              <label className="block font-mono text-[10px] tracking-wider text-zinc-400 uppercase mb-1.5 font-semibold">
                {dict.labelNotes}
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Ground floor hall, 3-phase power available"
                className="w-full px-4 py-2.5 rounded-xl border border-white/15 bg-black text-white font-sans text-sm focus:border-amber-400 focus:outline-none transition-colors"
              />
            </div>

            {/* Final Transportation Disclaimer */}
            <div className="p-4 rounded-xl border border-white/10 bg-black/60 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div className="text-xs text-zinc-300 font-sans leading-relaxed">
                <span className="font-mono text-[10px] text-amber-300 font-bold uppercase block mb-0.5">
                  {dict.logisticsNoticeTitle}
                </span>
                {dict.transportDisclaimer}
              </div>
            </div>

            <div className="flex justify-between items-center pt-4">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-6 py-2.5 rounded-full border border-white/20 text-zinc-400 hover:text-white font-mono text-xs tracking-wider uppercase transition-colors flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{dict.btnBack}</span>
              </button>

              <button
                type="button"
                onClick={handleSubmitBooking}
                disabled={isSubmitting}
                data-cursor="SUBMIT"
                className="px-10 py-4 rounded-full bg-amber-400 hover:bg-amber-300 text-black font-mono text-xs font-bold tracking-[0.2em] uppercase shadow-[0_0_30px_rgba(251,191,36,0.4)] transition-all duration-300 disabled:opacity-50 flex items-center gap-2 active:scale-95"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{dict.btnSubmitting}</span>
                  </>
                ) : (
                  <>
                    <span>{dict.btnSubmitBooking}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: RECEIPT CONFIRMATION */}
        {step === 5 && submissionResult && (
          <div className="py-8 text-center space-y-6 animate-in zoom-in-95 duration-500">
            <div className="w-16 h-16 rounded-full bg-amber-400/20 border border-amber-400/40 flex items-center justify-center mx-auto text-amber-300">
              <Sparkles className="w-8 h-8 animate-pulse" />
            </div>

            <div>
              <span className="font-mono text-xs tracking-[0.3em] text-amber-400 font-bold uppercase block mb-2">
                // {dict.step05Success}
              </span>
              <h3 className="font-serif text-3xl sm:text-4xl font-bold uppercase tracking-tight text-white">
                RESERVATION RECEIVED
              </h3>
              <p className="font-sans text-sm text-zinc-400 mt-2 max-w-md mx-auto font-light">
                Your Beula Audio event setup request has been recorded in our dispatch queue. Our production engineer will review stage logistics and call you shortly.
              </p>
            </div>

            {/* Receipt Summary Details */}
            <div className="max-w-md mx-auto rounded-2xl border border-white/15 bg-white/[0.03] p-6 text-left space-y-3 font-mono text-xs">
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-zinc-500 uppercase">REFERENCE ID:</span>
                <span className="text-amber-300 font-bold">{submissionResult.bookingId}</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-zinc-500 uppercase">EVENT DATE:</span>
                <span className="text-white">{eventDate}</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-zinc-500 uppercase">OCCASION:</span>
                <span className="text-white uppercase">{eventType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500 uppercase">STATUS:</span>
                <span className="text-amber-400 font-bold uppercase">PENDING ALLOCATION</span>
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  const el = document.getElementById("tracking");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-amber-400 hover:bg-amber-300 text-black font-mono text-xs font-bold tracking-widest uppercase transition-colors shadow-[0_0_20px_rgba(251,191,36,0.3)]"
              >
                TRACK THIS PACKAGE
              </button>
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-8 py-3.5 rounded-full border border-white/20 hover:border-white/40 text-zinc-300 hover:text-white font-mono text-xs tracking-widest uppercase transition-colors"
              >
                RETURN TO WEBSITE
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default BookingDrawer;
