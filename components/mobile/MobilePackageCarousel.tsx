"use client";

import React from "react";
import { PackageDefinition, DJ_PACKAGES, formatINR, TRANSPORT_DISCLAIMER } from "../../lib/data/packages";
import { Check, ArrowRight, Sparkles, ShieldCheck } from "lucide-react";

interface MobilePackageCarouselProps {
  onSelectPackage: (pkg: PackageDefinition) => void;
  onBookPackage: (pkg: PackageDefinition) => void;
}

export function MobilePackageCarousel({
  onSelectPackage,
  onBookPackage,
}: MobilePackageCarouselProps) {
  return (
    <section className="py-16 px-6 max-w-lg mx-auto">
      <div className="mb-8">
        <span className="font-mono text-[10px] tracking-[0.25em] text-amber-400 uppercase font-bold block mb-1">
          // CURATED SELECTIONS
        </span>
        <h2 className="font-serif text-3xl font-bold uppercase text-white tracking-tight">
          DJ STAGE SETUPS
        </h2>
        <p className="font-sans text-xs text-zinc-400 mt-1">
          Swipe or scroll through our five concert-calibrated setups.
        </p>
      </div>

      {/* Touch-Friendly Vertical Stack with Snap Cards */}
      <div className="space-y-6">
        {DJ_PACKAGES.map((pkg, idx) => {
          const isHoneyCombPro = pkg.id === "dj-honeycomb-pro";

          return (
            <div
              key={pkg.id}
              onClick={() => onSelectPackage(pkg)}
              className="rounded-2xl border border-white/15 bg-gradient-to-b from-zinc-900 via-black to-zinc-950 p-6 flex flex-col justify-between shadow-xl active:scale-[0.99] transition-transform"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-xs text-zinc-500 font-bold">
                    0{idx + 1} //
                  </span>
                  {pkg.featured && (
                    <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 font-mono text-[9px] tracking-wider uppercase font-semibold">
                      <Sparkles className="w-2.5 h-2.5" />
                      <span>POPULAR</span>
                    </div>
                  )}
                  {isHoneyCombPro && (
                    <span className="font-mono text-[9px] text-zinc-400 border border-white/10 px-2 py-0.5 rounded uppercase">
                      FLAGSHIP
                    </span>
                  )}
                </div>

                <h3 className="font-serif text-2xl font-bold uppercase text-white tracking-tight">
                  {pkg.name}
                </h3>
                <p className="font-sans text-xs text-zinc-400 mt-1">
                  {pkg.tagline}
                </p>

                {/* Price Display */}
                <div className="my-5 pb-4 border-b border-white/10">
                  <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-wider block mb-0.5">
                    BASE INVESTMENT
                  </span>
                  <span className="font-serif text-3xl font-bold text-white tracking-tight">
                    {pkg.basePrice !== null ? formatINR(pkg.basePrice) : "Contact / Configure"}
                  </span>
                  {isHoneyCombPro && (
                    <p className="font-mono text-[10px] text-amber-300 mt-1">
                      Dance floors: 12x12 (₹25k) • 16x16 (₹30k)
                    </p>
                  )}
                </div>

                {/* Key Inclusions Preview */}
                <div className="space-y-1.5 mb-6 text-xs text-zinc-300">
                  {pkg.items.slice(0, 4).map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Check className="w-3 h-3 text-amber-300 shrink-0" />
                      <span>{item.name} ({item.quantity} {item.unit})</span>
                    </div>
                  ))}
                  {pkg.items.length > 4 && (
                    <span className="font-mono text-[10px] text-zinc-500 block pt-1">
                      + {pkg.items.length - 4} more stage items
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectPackage(pkg);
                  }}
                  className="py-2.5 rounded-xl border border-white/20 text-white font-mono text-[11px] tracking-wider uppercase font-semibold text-center"
                >
                  DETAILS
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onBookPackage(pkg);
                  }}
                  className="py-2.5 rounded-xl bg-amber-300 text-black font-mono text-[11px] tracking-wider uppercase font-bold text-center flex items-center justify-center gap-1.5"
                >
                  <span>RESERVE</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Logistics Notice on Mobile */}
      <div className="mt-8 p-4 rounded-xl border border-white/10 bg-black/60 flex items-start gap-2.5 text-xs text-zinc-400">
        <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <span className="leading-snug">{TRANSPORT_DISCLAIMER}</span>
      </div>
    </section>
  );
}
