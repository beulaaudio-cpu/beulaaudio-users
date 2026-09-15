"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Menu, X, Globe, User } from "lucide-react";
import { useLanguage } from "../../lib/i18n/LanguageContext";
import { useAuth } from "../../lib/firebase/AuthContext";

interface SiteNavigationProps {
  onOpenBooking: (initialPackageId?: string) => void;
  activeSection?: string;
  onNavigateSection?: (sectionId: string) => void;
}

/**
 * Custom smooth animated travel scroller with cubic easing
 */
export function smoothTravelTo(targetY: number, duration = 900) {
  if (typeof window === "undefined") return;
  const startY = window.scrollY;
  const distance = targetY - startY;
  if (Math.abs(distance) < 2) return;
  const startTime = performance.now();

  function step(currentTime: number) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const ease =
      progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;

    window.scrollTo(0, startY + distance * ease);

    if (progress < 1) {
      requestAnimationFrame(step);
    }
  }

  requestAnimationFrame(step);
}

export function SiteNavigation({
  onOpenBooking,
  activeSection = "hero",
  onNavigateSection,
}: SiteNavigationProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { language, setLanguage, toggleLanguage, dict } = useLanguage();
  const { user, openAuthModal, signOutUser } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: dict.navServices, id: "services" },
    { label: dict.navSetups, id: "packages" },
    { label: dict.navInstruments, id: "instruments" },
    { label: dict.navCustom, id: "custom" },
    { label: dict.navTrackPackage || "Track Package", id: "tracking" },
  ];

  const handleLinkClick = (id: string) => {
    setMobileMenuOpen(false);

    if (id === "tracking") {
      if (typeof window !== "undefined") {
        window.location.href = "/track";
      }
      return;
    }

    if (typeof window !== "undefined" && window.location.pathname !== "/") {
      window.location.href = id === "hero" ? "/" : `/#${id}`;
      return;
    }

    if (id === "hero") {
      smoothTravelTo(0, 950);
      if (onNavigateSection) onNavigateSection(id);
      return;
    }

    const el = document.getElementById(id);
    if (el) {
      const navOffset = 80;
      const targetY = Math.max(
        0,
        el.getBoundingClientRect().top + window.scrollY - navOffset
      );
      smoothTravelTo(targetY, 950);
    }

    if (onNavigateSection) {
      onNavigateSection(id);
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          scrolled
            ? "py-3 bg-black/85 backdrop-blur-2xl border-b border-white/10 shadow-2xl"
            : "py-5 bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          {/* Brand Logo & Name - BORDERLESS BIGGER LOGO */}
          <button
            onClick={() => handleLinkClick("hero")}
            data-cursor="BEULA"
            className="flex items-center gap-3.5 text-left group focus:outline-none"
            aria-label="Beula Audio Home"
          >
            {/* Border removed, larger logo */}
            <div className="relative w-12 h-12 md:w-14 md:h-14 shrink-0 group-hover:scale-105 transition-transform duration-300">
              <Image
                src="/Logo/BeulaAudio-BlackBG.jpg"
                alt="Beula Audio Logo"
                fill
                sizes="56px"
                className="object-contain drop-shadow-[0_0_20px_rgba(251,191,36,0.35)]"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-lg md:text-xl font-bold tracking-[0.22em] text-white group-hover:text-amber-300 transition-colors uppercase">
                {dict.brandName}
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links - Awwwards Glass Pill */}
          <nav className="hidden lg:flex items-center gap-2 p-1.5 rounded-full border border-white/15 bg-black/50 backdrop-blur-2xl shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleLinkClick(link.id)}
                  data-cursor="VIEW"
                  className={`relative px-4 py-2 rounded-full font-mono text-[11px] tracking-[0.18em] uppercase transition-all duration-300 ${
                    isActive
                      ? "text-black font-bold bg-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.4)]"
                      : "text-zinc-300 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action: Redesigned Segmented EN / தமிழ் Toggle Pill & Mobile Menu */}
          <div className="flex items-center gap-3">
            {/* User Account / Auth State */}
            {user ? (
              <div className="hidden sm:flex items-center gap-2 p-1 pl-2.5 pr-1 rounded-full border border-white/15 bg-black/60 backdrop-blur-xl">
                <span className="font-mono text-[10px] text-amber-300 font-bold max-w-[110px] truncate">
                  {user.displayName || user.email?.split("@")[0]}
                </span>
                <button
                  type="button"
                  onClick={() => signOutUser()}
                  className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-red-500/20 hover:text-red-300 text-zinc-400 font-mono text-[9px] uppercase transition-colors"
                  title="Sign Out"
                >
                  LOGOUT
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => openAuthModal("Sign in to manage bookings and track your stage setups.")}
                className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-amber-400/40 bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 font-mono text-[10px] font-bold tracking-wider uppercase transition-colors shadow-sm"
              >
                <User className="w-3 h-3" />
                <span>SIGN IN</span>
              </button>
            )}

            {/* Segmented Interactive Language Switcher */}
            <div
              className="flex items-center p-1 rounded-full border border-amber-400/40 bg-black/60 backdrop-blur-xl shadow-[0_0_20px_rgba(251,191,36,0.15)]"
              role="group"
              aria-label="Language selection"
            >
              <button
                type="button"
                onClick={() => setLanguage("en")}
                data-cursor="EN"
                className={`px-3 py-1 rounded-full font-mono text-[11px] font-bold tracking-wider uppercase transition-all ${
                  language === "en"
                    ? "bg-amber-400 text-black shadow-md"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                EN
              </button>

              <span className="text-zinc-600 px-0.5 text-xs">/</span>

              <button
                type="button"
                onClick={() => setLanguage("ta")}
                data-cursor="தமிழ்"
                className={`px-3 py-1 rounded-full font-sans text-[11px] font-bold transition-all ${
                  language === "ta"
                    ? "bg-amber-400 text-black shadow-md"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                தமிழ்
              </button>
            </div>

            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              data-cursor="MENU"
              aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              className="lg:hidden p-2 rounded-full border border-white/15 bg-black/60 backdrop-blur-md text-white hover:border-white/40 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden bg-black/95 backdrop-blur-2xl flex flex-col justify-between p-8 border-b border-white/10 animate-in fade-in duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 shrink-0">
                <Image
                  src="/Logo/BeulaAudio-BlackBG.jpg"
                  alt="Beula Audio Logo"
                  fill
                  sizes="40px"
                  className="object-contain"
                />
              </div>
              <span className="font-serif text-lg font-bold tracking-[0.2em] text-white">
                {dict.brandName}
              </span>
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-full border border-white/20 text-white"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="flex flex-col gap-6 my-auto">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id)}
                className="text-left font-serif text-2xl font-bold tracking-wider text-zinc-300 hover:text-amber-300 transition-colors uppercase"
              >
                {link.label}
              </button>
            ))}
          </nav>

          <div className="flex flex-col gap-4 pt-6 border-t border-white/10">
            {/* Mobile Auth Button */}
            {user ? (
              <div className="flex items-center justify-between p-3 rounded-2xl border border-white/15 bg-white/5">
                <span className="font-mono text-xs text-amber-300 font-bold truncate">
                  {user.displayName || user.email}
                </span>
                <button
                  onClick={() => {
                    signOutUser();
                    setMobileMenuOpen(false);
                  }}
                  className="px-3 py-1 rounded-lg bg-red-500/20 text-red-300 font-mono text-xs uppercase"
                >
                  Log out
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openAuthModal();
                }}
                className="w-full py-3 rounded-xl bg-amber-400 text-black font-mono text-xs font-bold uppercase tracking-wider text-center"
              >
                Sign In / Register
              </button>
            )}

            <div className="flex items-center justify-between p-2 rounded-2xl border border-amber-400/30 bg-amber-400/10">
              <div className="flex items-center gap-2 text-amber-300 text-xs font-mono">
                <Globe className="w-4 h-4" />
                <span>Language / மொழி</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setLanguage("en")}
                  className={`px-3 py-1 rounded-lg text-xs font-mono font-bold ${
                    language === "en" ? "bg-amber-400 text-black" : "text-zinc-400"
                  }`}
                >
                  EN
                </button>
                <button
                  onClick={() => setLanguage("ta")}
                  className={`px-3 py-1 rounded-lg text-xs font-sans font-bold ${
                    language === "ta" ? "bg-amber-400 text-black" : "text-zinc-400"
                  }`}
                >
                  தமிழ்
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default SiteNavigation;
