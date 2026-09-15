"use client";

import React, { useState, useEffect } from "react";
import { PackageDefinition, formatINR, TRANSPORT_DISCLAIMER } from "../../lib/data/packages";
import { X, Check, ArrowRight, ShieldCheck, Sparkles, Sliders } from "lucide-react";
import { useLanguage } from "../../lib/i18n/LanguageContext";

interface PackageDetailModalProps {
  pkg: PackageDefinition | null;
  onClose: () => void;
  onBook: (pkg: PackageDefinition, options?: { danceFloor?: any; effectLights?: string[] }) => void;
}

export function PackageDetailModal({ pkg, onClose, onBook }: PackageDetailModalProps) {
  const [selectedDanceFloor, setSelectedDanceFloor] = useState<"12x12" | "16x16" | null>(null);
  const { dict, language } = useLanguage();

  // Scroll lock on body to prevent background scrolling when modal is open
  useEffect(() => {
    if (pkg) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [pkg]);

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!pkg) return null;

  const isHoneyCombPro = pkg.id === "dj-honeycomb-pro";

  const handleBook = () => {
    let danceFloorObj = null;
    if (isHoneyCombPro && selectedDanceFloor) {
      danceFloorObj = {
        size: selectedDanceFloor,
        price: selectedDanceFloor === "12x12" ? 25000 : 30000,
      };
    }

    // Effect lights are curated by admin/engineers
    onBook(pkg, {
      danceFloor: danceFloorObj,
      effectLights: ["admin_curated"],
    });
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 bg-black/85 backdrop-blur-2xl animate-in fade-in duration-300 overflow-y-auto"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl border border-white/20 bg-zinc-950 p-6 sm:p-10 shadow-2xl text-white my-auto"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          data-cursor="CLOSE"
          className="absolute top-6 right-6 p-2 rounded-full border border-white/15 bg-white/5 text-zinc-400 hover:text-white hover:border-white/40 focus:outline-none transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="border-b border-white/10 pb-6 mb-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="font-mono text-xs tracking-[0.3em] text-amber-400 font-bold uppercase">
              BEULA AUDIO // {dict.specSheetTitle}
            </span>
            {pkg.featured && (
              <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 font-mono text-[9px] tracking-wider uppercase font-bold">
                {dict.mostPopularBadge}
              </span>
            )}
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-white uppercase">
            {pkg.name}
          </h2>
          <p className="font-sans text-sm sm:text-base text-zinc-300 mt-2 max-w-2xl font-light">
            {pkg.description}
          </p>

          {/* Pricing Highlight */}
          <div className="mt-6 flex flex-wrap items-baseline gap-4">
            <span className="font-mono text-xs text-zinc-400 uppercase tracking-widest font-semibold">
              {dict.baseInvestmentLabel}:
            </span>
            <span className="font-serif text-4xl sm:text-5xl font-bold text-white tracking-tight">
              {pkg.basePrice !== null ? formatINR(pkg.basePrice) : (
                <span className="text-3xl text-amber-300">Contact / Configure</span>
              )}
            </span>
            {isHoneyCombPro && (
              <span className="font-mono text-xs text-amber-300 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
                {dict.danceFloorTitle}
              </span>
            )}
          </div>
        </div>

        {/* Complete Included Equipment List */}
        <div className="mb-8">
          <h3 className="font-mono text-xs tracking-[0.25em] text-amber-300 uppercase font-bold mb-4">
            {dict.allEquipmentTitle} ({pkg.items.length} ITEMS)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {pkg.items.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3.5 rounded-2xl border border-white/10 bg-white/[0.03] hover:border-amber-400/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-amber-400/10 border border-amber-400/30 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-amber-300" />
                  </div>
                  <span className="font-sans text-sm text-zinc-200 font-medium">
                    {item.name}
                  </span>
                </div>
                <span className="font-mono text-xs text-amber-300 font-semibold">
                  {item.quantity} {item.unit}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Honey Comb Pro Dance Floor Configuration */}
        {isHoneyCombPro && (
          <div className="mb-8 p-6 rounded-3xl border border-amber-400/30 bg-amber-400/5">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <h4 className="font-mono text-xs tracking-[0.2em] text-amber-300 font-bold uppercase">
                {dict.danceFloorTitle}
              </h4>
            </div>
            <p className="font-sans text-xs text-zinc-400 mb-4 font-light">
              {dict.danceFloorSubtitle}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() =>
                  setSelectedDanceFloor(selectedDanceFloor === "12x12" ? null : "12x12")
                }
                className={`p-4 rounded-2xl border text-left transition-all ${
                  selectedDanceFloor === "12x12"
                    ? "border-amber-300 bg-amber-400/20 text-white shadow-lg"
                    : "border-white/15 bg-black/40 text-zinc-300 hover:border-white/30"
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-serif font-bold text-lg">{dict.danceFloor12Label}</span>
                  <span className="font-mono text-xs text-amber-300 font-bold">₹25,000</span>
                </div>
                <span className="font-mono text-[10px] text-zinc-400 uppercase tracking-wider">
                  Ideal for indoor halls and banquets
                </span>
              </button>

              <button
                type="button"
                onClick={() =>
                  setSelectedDanceFloor(selectedDanceFloor === "16x16" ? null : "16x16")
                }
                className={`p-4 rounded-2xl border text-left transition-all ${
                  selectedDanceFloor === "16x16"
                    ? "border-amber-300 bg-amber-400/20 text-white shadow-lg"
                    : "border-white/15 bg-black/40 text-zinc-300 hover:border-white/30"
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-serif font-bold text-lg">{dict.danceFloor16Label}</span>
                  <span className="font-mono text-xs text-amber-300 font-bold">₹30,000</span>
                </div>
                <span className="font-mono text-[10px] text-zinc-400 uppercase tracking-wider">
                  Grand concert & outdoor footprint
                </span>
              </button>
            </div>
          </div>
        )}

        {/* Admin Effect Lights Note (Replaced user selection as requested) */}
        <div className="mb-8 p-5 rounded-2xl border border-amber-400/30 bg-black/60 flex items-start gap-3.5">
          <div className="p-2 rounded-xl bg-amber-400/10 border border-amber-400/30 text-amber-300 shrink-0">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-mono text-xs tracking-[0.2em] text-amber-300 uppercase font-bold mb-1">
              {dict.adminEffectLightsTitle}
            </h4>
            <p className="font-sans text-xs text-zinc-300 leading-relaxed font-light">
              {dict.adminEffectLightsDesc}
            </p>
          </div>
        </div>

        {/* Transportation Disclaimer Banner */}
        <div className="mb-8 p-4 rounded-2xl border border-white/10 bg-black/40 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs text-zinc-300 leading-relaxed font-sans">
            <span className="font-mono text-[10px] uppercase font-bold text-amber-300 block mb-0.5">
              {dict.logisticsNoticeTitle}
            </span>
            {dict.transportDisclaimer}
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-4 pt-6 border-t border-white/10">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-3 rounded-full border border-white/20 text-zinc-400 hover:text-white font-mono text-xs tracking-widest uppercase transition-colors"
          >
            {dict.backToCatalogBtn}
          </button>

          <button
            onClick={handleBook}
            data-cursor="BOOK"
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-amber-400 hover:bg-amber-300 text-black font-mono text-xs font-bold tracking-[0.2em] uppercase shadow-[0_0_25px_rgba(251,191,36,0.35)] transition-all duration-300 flex items-center justify-center gap-2 active:scale-95 hover:scale-[1.02]"
          >
            <span>{dict.proceedToBookingBtn}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default PackageDetailModal;
