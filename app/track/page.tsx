"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth, AuthProvider } from "../../lib/firebase/AuthContext";
import { AuthModal } from "../../components/auth/AuthModal";
import { UserStatusNotification } from "../../components/navigation/UserStatusNotification";
import { SiteNavigation } from "../../components/navigation/SiteNavigation";
import { SiteFooter } from "../../components/sections/SiteFooter";
import { TrackingSection } from "../../components/tracking/TrackingSection";
import { CustomCursor } from "../../components/ui/CustomCursor";
import { FirestoreDiagnosticButton } from "../../components/admin/FirestoreDiagnosticButton";

function TrackPageInner() {
  return (
    <div className="relative min-h-screen bg-black text-white selection:bg-amber-300 selection:text-black">
      <CustomCursor />

      {/* Navigation Header */}
      <SiteNavigation
        activeSection="tracking"
        onOpenBooking={() => {
          if (typeof window !== "undefined") {
            window.location.href = "/#packages";
          }
        }}
      />

      <main className="pt-24 pb-16 bg-black min-h-[calc(100vh-200px)]">
        <TrackingSection />
      </main>

      <SiteFooter
        onNavigate={(id) => {
          if (typeof window !== "undefined") {
            window.location.href = `/#${id}`;
          }
        }}
        onOpenBooking={() => {
          if (typeof window !== "undefined") {
            window.location.href = "/#packages";
          }
        }}
      />

      {/* Auth Modal, Notification Toast & Diagnostic Button */}
      <AuthModal />
      <UserStatusNotification />
      <FirestoreDiagnosticButton />
    </div>
  );
}

export default function TrackPage() {
  return (
    <AuthProvider>
      <TrackPageInner />
    </AuthProvider>
  );
}
