"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { SiteNavigation, smoothTravelTo } from "../components/navigation/SiteNavigation";
import { HeroSceneOverlay } from "../components/hero/HeroSceneOverlay";
import { CategoryShowcase } from "../components/packages/CategoryShowcase";
import { PackageDeckShowcase } from "../components/packages/PackageDeckShowcase";
import { PackageDetailModal } from "../components/packages/PackageDetailModal";
import { InstrumentSection } from "../components/packages/InstrumentSection";
import { CustomConfigurator } from "../components/packages/CustomConfigurator";
import { ReviewSection } from "../components/reviews/ReviewSection";
import { TrackingSection } from "../components/tracking/TrackingSection";
import { FinalCTA } from "../components/sections/FinalCTA";
import { SiteFooter } from "../components/sections/SiteFooter";
import { BookingDrawer } from "../components/booking/BookingDrawer";
import { CustomCursor } from "../components/ui/CustomCursor";
import { MobileHero } from "../components/mobile/MobileHero";
import { ModelLoadingScreen } from "../components/3d/ModelLoadingScreen";
import { AuthProvider } from "../lib/firebase/AuthContext";
import { AuthModal } from "../components/auth/AuthModal";
import { UserStatusNotification } from "../components/navigation/UserStatusNotification";
import { FirestoreDiagnosticButton } from "../components/admin/FirestoreDiagnosticButton";
import { DJ_PACKAGES, PackageDefinition } from "../lib/data/packages";
import { getPublishedPackages } from "../lib/firestore/packages";
import { useLanguage } from "../lib/i18n/LanguageContext";

// Dynamic import for desktop Three.js Blender Hero 3D Stage (SSR safe, loads only for Section 1)
const HeroStage3D = dynamic(
  () => import("../components/3d/HeroStage3D").then((mod) => mod.HeroStage3D),
  { ssr: false }
);

function BeulaAudioLandingPageInner() {
  const [isMobile, setIsMobile] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const [model3dLoaded, setModel3dLoaded] = useState(false);
  const { dict } = useLanguage();

  // Selection states
  const [selectedCategory, setSelectedCategory] = useState<"dj" | "instrument" | "custom">("dj");
  const [activePackageModal, setActivePackageModal] = useState<PackageDefinition | null>(null);
  const [packagesList, setPackagesList] = useState<PackageDefinition[]>(DJ_PACKAGES);

  // Load packages dynamically from Firestore (reflects any admin edits)
  useEffect(() => {
    getPublishedPackages()
      .then((pkgs) => {
        if (pkgs && pkgs.length > 0) {
          const djOnly = pkgs.filter((p) => p.category === "dj");
          if (djOnly.length > 0) {
            setPackagesList(djOnly);
          }
        }
      })
      .catch(() => {});
  }, []);

  // Booking drawer states
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingInitialPackageId, setBookingInitialPackageId] = useState<string | undefined>("dj-premium");
  const [bookingCustomItems, setBookingCustomItems] = useState<{ itemId: string; quantity: number }[]>([]);
  const [bookingDanceFloor, setBookingDanceFloor] = useState<any>(null);

  const [packageStockStatus, setPackageStockStatus] = useState<
    Record<string, { isOutOfOrder: boolean; bottleneck?: string }>
  >({});

  // Viewport & device detection
  useEffect(() => {
    const checkDevice = () => {
      const isCoarse = window.matchMedia("(pointer: coarse)").matches;
      const isSmallScreen = window.innerWidth < 1024;
      setIsMobile(isCoarse || isSmallScreen);
    };

    checkDevice();
    window.addEventListener("resize", checkDevice);
    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  // Check initial stock for all DJ packages
  useEffect(() => {
    const checkStock = async () => {
      try {
        const today = new Intl.DateTimeFormat("en-CA", {
          timeZone: "Asia/Kolkata",
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }).format(new Date());

        const statuses: Record<string, { isOutOfOrder: boolean; bottleneck?: string }> = {};
        for (const pkg of DJ_PACKAGES) {
          const res = await fetch(`/api/availability?date=${today}&category=dj&packageId=${pkg.id}`);
          const data = await res.json();
          if (data && data.success) {
            statuses[pkg.id] = {
              isOutOfOrder: !data.available,
              bottleneck: data.bottleneck,
            };
          }
        }
        setPackageStockStatus(statuses);
      } catch (err) {
        console.warn("Could not fetch real-time package stock:", err);
      }
    };
    checkStock();
  }, []);

  // Track active navigation section based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const h = window.innerHeight;

      if (scrollY < h * 0.7) {
        setActiveSection("hero");
      } else if (scrollY < h * 1.5) {
        setActiveSection("services");
      } else if (scrollY < h * 2.5) {
        setActiveSection("packages");
      } else if (scrollY < h * 3.5) {
        setActiveSection("instruments");
      } else if (scrollY < h * 4.6) {
        setActiveSection("custom");
      } else {
        setActiveSection("tracking");
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Smooth travel to sections
  const scrollToSection = (id: string) => {
    if (id === "hero") {
      smoothTravelTo(0, 950);
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      const navOffset = 80;
      const targetY = Math.max(0, el.getBoundingClientRect().top + window.scrollY - navOffset);
      smoothTravelTo(targetY, 950);
    }
  };

  // Handlers for booking triggers
  const handleOpenBooking = (packageId?: string) => {
    setBookingInitialPackageId(packageId || (selectedCategory === "instrument" ? "instrument-setup" : "dj-premium"));
    setBookingCustomItems([]);
    setBookingDanceFloor(null);
    setIsBookingOpen(true);
  };

  const handleBookFromCard = (pkg: PackageDefinition) => {
    setBookingInitialPackageId(pkg.id);
    setBookingCustomItems([]);
    setBookingDanceFloor(null);
    setIsBookingOpen(true);
  };

  const handleBookFromModal = (
    pkg: PackageDefinition,
    options?: { danceFloor?: any }
  ) => {
    setActivePackageModal(null);
    setBookingInitialPackageId(pkg.id);
    setBookingCustomItems([]);
    if (options?.danceFloor) setBookingDanceFloor(options.danceFloor);
    setIsBookingOpen(true);
  };

  const handleBookFromCustom = (
    items: { itemId: string; quantity: number }[],
    total: number
  ) => {
    setSelectedCategory("custom");
    setBookingInitialPackageId(undefined);
    setBookingCustomItems(items);
    setBookingDanceFloor(null);
    setIsBookingOpen(true);
  };

  return (
    <div className="relative min-h-screen bg-black text-white selection:bg-amber-300 selection:text-black">
      {/* Full-screen 3D loading overlay — hides until GLB is ready */}
      {!isMobile && <ModelLoadingScreen isLoaded={model3dLoaded} />}

      {/* Subtle Custom Cursor for Desktop */}
      <CustomCursor />

      {/* Floating Cinematic Glass Navigation with Language Toggle */}
      <SiteNavigation
        activeSection={activeSection}
        onOpenBooking={() => handleOpenBooking()}
        onNavigateSection={scrollToSection}
      />

      {/* MAIN CONTENT WRAPPER — PURE BLACK BACKGROUND */}
      <main className="relative z-10 flex flex-col bg-black">
        {/* SECTION 1: HERO (With Real Blender 3D GLB Stage on Right / Background) */}
        <section id="hero" className="relative min-h-screen overflow-hidden bg-black">
          {/* Real Animated Blender GLB Background — right-shifted, paused when out of home section */}
          {!isMobile && (
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
              <HeroStage3D
                className="w-full h-full"
                onLoaded={() => setModel3dLoaded(true)}
                isActive={activeSection === "hero"}
              />
              {/* Subtle edge-only vignette so 3D model and concert lights shine through vibrantly */}
              <div className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-black to-transparent pointer-events-none" />
              <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black to-transparent pointer-events-none" />
            </div>
          )}

          {/* Hero UI Content (Left 40-45% text, buttons & branding) */}
          <div className="relative z-10">
            {isMobile ? (
              <MobileHero
                onExplore={() => scrollToSection("packages")}
                onOpenBooking={() => handleOpenBooking()}
              />
            ) : (
              <HeroSceneOverlay
                onExplore={() => scrollToSection("packages")}
                onCustomBuild={() => scrollToSection("custom")}
              />
            )}
          </div>
        </section>

        {/* SECTION 2: WHAT WE OFFER / SERVICES */}
        <section
          id="services"
          className="relative bg-black border-t border-white/5 overflow-hidden"
        >
          {/* Subtle top spotlight halo */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-80 bg-amber-500/5 blur-[120px] pointer-events-none" />

          <CategoryShowcase
            selectedCategory={selectedCategory}
            onSelectCategory={(cat) => {
              setSelectedCategory(cat);
              if (cat === "dj") scrollToSection("packages");
              else if (cat === "instrument") scrollToSection("instruments");
              else if (cat === "custom") scrollToSection("custom");
            }}
          />
        </section>

        {/* SECTION 3: DJ STAGE PACKAGES */}
        <section
          id="packages"
          className="relative bg-black border-t border-white/5 overflow-hidden"
        >
          {/* Warm Amber stage glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl h-96 bg-amber-500/[0.04] blur-[150px] pointer-events-none" />

          <PackageDeckShowcase
            packages={packagesList}
            onSelectPackage={(pkg) => setActivePackageModal(pkg)}
            onBookPackage={(pkg) => handleBookFromCard(pkg)}
            stockStatus={packageStockStatus}
          />
        </section>

        {/* SECTION 4: LIVE BAND SOUND SETUP */}
        <section
          id="instruments"
          className="relative bg-black border-t border-white/5 overflow-hidden"
        >
          <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-amber-500/[0.04] blur-[130px] pointer-events-none" />

          <InstrumentSection
            onBookInstrument={() => handleOpenBooking("instrument-setup")}
          />
        </section>

        {/* SECTION 5: BUILD YOUR OWN SETUP / CUSTOM CONFIGURATOR */}
        <section
          id="custom"
          className="relative bg-black border-t border-white/5 overflow-hidden"
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-80 bg-amber-500/[0.03] blur-[140px] pointer-events-none" />

          <CustomConfigurator
            onRequestBooking={(items, total) => handleBookFromCustom(items, total)}
          />
        </section>

        {/* SECTION 6: CLIENT REVIEWS */}
        <section
          id="reviews"
          className="relative bg-black border-t border-white/5 overflow-hidden"
        >
          <ReviewSection />
        </section>

        {/* SECTION 7: TRACK PACKAGE & ORDER HISTORY PORTAL */}
        <section
          id="tracking"
          className="relative bg-black border-t border-white/5 overflow-hidden"
        >
          <TrackingSection />
        </section>

        {/* FINAL CLOSING CTA */}
        <section className="relative bg-black border-t border-white/5">
          <FinalCTA
            onCheckAvailability={() => handleOpenBooking()}
            onExplorePackages={() => scrollToSection("packages")}
          />
        </section>

        {/* SITE FOOTER */}
        <SiteFooter
          onNavigate={scrollToSection}
          onOpenBooking={() => handleOpenBooking()}
        />
      </main>

      {/* CINEMATIC PACKAGE DETAIL MODAL (With scroll lock & admin effect lights) */}
      <PackageDetailModal
        pkg={activePackageModal}
        onClose={() => setActivePackageModal(null)}
        onBook={handleBookFromModal}
      />

      {/* COMPLETE CINEMATIC BOOKING DRAWER (With scroll lock & repaired custom presets) */}
      <BookingDrawer
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        initialPackageId={bookingInitialPackageId}
        initialCustomItems={bookingCustomItems}
        initialDanceFloor={bookingDanceFloor}
      />

      {/* CLIENT AUTHENTICATION MODAL */}
      <AuthModal />

      {/* REAL-TIME DISPATCH NOTIFICATION TOAST */}
      <UserStatusNotification />

      {/* ADMIN FIRESTORE TEST BUTTON (Visible strictly for beulaaudio@gmail.com) */}
      <FirestoreDiagnosticButton />
    </div>
  );
}

export default function BeulaAudioLandingPage() {
  return (
    <AuthProvider>
      <BeulaAudioLandingPageInner />
    </AuthProvider>
  );
}
