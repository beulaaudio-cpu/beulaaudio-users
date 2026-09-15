"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ArrowUp, Phone, Mail } from "lucide-react";
import { useLanguage } from "../../lib/i18n/LanguageContext";
import { smoothTravelTo } from "../navigation/SiteNavigation";
import { subscribeSiteSettings, DEFAULT_SETTINGS, SiteSettings } from "../../lib/firestore/settings";

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="14"
      height="14"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

interface SiteFooterProps {
  onNavigate: (sectionId: string) => void;
  onOpenBooking: () => void;
}

export function SiteFooter({ onNavigate, onOpenBooking }: SiteFooterProps) {
  const { dict } = useLanguage();
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    const unsub = subscribeSiteSettings((data) => {
      setSiteSettings(data);
    });
    return () => unsub();
  }, []);

  const scrollToTop = () => {
    smoothTravelTo(0, 950);
  };

  const handleNav = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const navOffset = 80;
      const targetY = Math.max(
        0,
        el.getBoundingClientRect().top + window.scrollY - navOffset
      );
      smoothTravelTo(targetY, 950);
    }
    onNavigate(id);
  };

  const cleanPhone = (siteSettings.contactPhone || "+91 89395 30757").replace(/\s+/g, "");
  const instagramUrl =
    siteSettings.instagramUrl ||
    `https://instagram.com/${(siteSettings.instagramHandle || "beula_audio_dj_instruments").replace("@", "")}`;

  return (
    <footer className="border-t border-white/10 bg-black pt-16 pb-12 px-6 md:px-14 lg:px-16 text-white relative z-20">
      <div className="max-w-7xl mx-auto flex flex-col justify-between gap-12">
        {/* Main Footer Row */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          {/* BORDERLESS, BIGGER LOGO */}
          <div className="flex items-center gap-4">
            <div className="relative w-14 h-14 shrink-0">
              <Image
                src="/Logo/BeulaAudio-BlackBG.jpg"
                alt="Beula Audio Logo"
                fill
                sizes="56px"
                className="object-contain drop-shadow-[0_0_20px_rgba(251,191,36,0.35)]"
              />
            </div>
            <div>
              <span className="font-serif text-2xl sm:text-3xl font-bold tracking-[0.2em] uppercase text-white block">
                {dict.brandName}
              </span>
              <span className="font-mono text-xs tracking-[0.25em] text-zinc-400 uppercase mt-0.5 block">
                {dict.brandTagline}
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-wrap items-center gap-6 sm:gap-8 font-mono text-xs tracking-wider uppercase text-zinc-400">
            <button
              onClick={() => handleNav("services")}
              className="hover:text-white transition-colors"
            >
              {dict.navServices}
            </button>
            <button
              onClick={() => handleNav("packages")}
              className="hover:text-white transition-colors"
            >
              {dict.navSetups}
            </button>
            <button
              onClick={() => handleNav("instruments")}
              className="hover:text-white transition-colors"
            >
              {dict.navInstruments}
            </button>
            <button
              onClick={() => handleNav("custom")}
              className="hover:text-white transition-colors"
            >
              {dict.navCustom}
            </button>
            <button
              onClick={() => handleNav("experience")}
              className="hover:text-white transition-colors"
            >
              {dict.navExperience}
            </button>
          </nav>

          {/* Scroll to Top */}
          <button
            onClick={scrollToTop}
            aria-label="Scroll back to top"
            className="p-3 rounded-full border border-white/15 bg-white/5 hover:bg-white hover:text-black transition-all group cursor-pointer"
          >
            <ArrowUp className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>

        {/* Client Contact Links & Copyright */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 text-xs font-mono text-zinc-400">
          <div className="flex flex-wrap items-center gap-6 sm:gap-8">
            {/* Phone link */}
            <a
              href={`tel:${cleanPhone}`}
              className="flex items-center gap-2 hover:text-amber-300 transition-colors group"
            >
              <Phone className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
              <span>{siteSettings.contactPhone || "+91 89395 30757"}</span>
            </a>

            {/* Email link */}
            <a
              href={`mailto:${siteSettings.contactEmail || "beulaaudio@gmail.com"}`}
              className="flex items-center gap-2 hover:text-amber-300 transition-colors group"
            >
              <Mail className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
              <span>{siteSettings.contactEmail || "beulaaudio@gmail.com"}</span>
            </a>

            {/* Instagram link */}
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-amber-300 transition-colors group"
            >
              <InstagramIcon className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
              <span>{siteSettings.instagramHandle || "@beula_audio_dj_instruments"}</span>
            </a>
          </div>

          <div className="flex items-center gap-4 text-zinc-500 text-[11px]">
            <span>© {new Date().getFullYear()} BEULA AUDIO. {dict.footerCopyright}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default SiteFooter;
