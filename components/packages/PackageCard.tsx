"use client";

import React from "react";
import { PackageDefinition, formatINR, TRANSPORT_DISCLAIMER } from "../../lib/data/packages";
import { Check, Sparkles, ArrowRight, ShieldCheck } from "lucide-react";

interface PackageCardProps {
  pkg: PackageDefinition;
  index: number;
  onSelect: (pkg: PackageDefinition) => void;
  onBook: (pkg: PackageDefinition) => void;
  isOutOfOrder?: boolean;
  outOfOrderReason?: string;
}

export function PackageCard({
  pkg,
  index,
  onSelect,
  onBook,
  isOutOfOrder = false,
  outOfOrderReason,
}: PackageCardProps) {
  const isHoneyCombPro = pkg.id === "dj-honeycomb-pro";

  return (
    <div
      data-cursor={isOutOfOrder ? "UNAVAILABLE" : "VIEW"}
      onClick={() => onSelect(pkg)}
      className={`group relative cursor-pointer rounded-2xl border p-8 flex flex-col justify-between transition-all duration-500 ${
        isOutOfOrder
          ? "border-red-500/30 bg-gradient-to-b from-red-950/20 via-black to-zinc-950 opacity-80"
          : "border-white/10 bg-gradient-to-b from-zinc-900/80 via-black to-zinc-950 hover:border-amber-300/50 hover:shadow-[0_20px_60px_rgba(0,0,0,0.8)] hover:-translate-y-2"
      }`}
    >
      {/* Top Banner & Number */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <span className="font-mono text-xs tracking-[0.3em] text-zinc-500 font-bold">
            0{index + 1} // STAGE SETUP
          </span>

          {isOutOfOrder && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-red-500/50 bg-red-500/20 text-red-400">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
              <span className="font-mono text-[9px] font-bold tracking-[0.2em] uppercase">
                OUT OF ORDER
              </span>
            </div>
          )}

          {!isOutOfOrder && pkg.featured && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-amber-400/30 bg-amber-400/10 text-amber-300">
              <Sparkles className="w-3 h-3" />
              <span className="font-mono text-[9px] font-bold tracking-[0.2em] uppercase">
                MOST POPULAR
              </span>
            </div>
          )}

          {!isOutOfOrder && isHoneyCombPro && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/20 bg-white/5 text-zinc-300">
              <span className="font-mono text-[9px] font-bold tracking-[0.2em] uppercase">
                FLAGSHIP
              </span>
            </div>
          )}
        </div>

        {/* Title & Tagline */}
        <h3 className="font-serif text-3xl font-bold tracking-tight text-white group-hover:text-amber-300 transition-colors uppercase">
          {pkg.name}
        </h3>
        <p className="font-mono text-xs text-zinc-400 mt-1 tracking-wide">
          {pkg.tagline}
        </p>

        {/* Pricing Display */}
        <div className="mt-8 mb-6 pb-6 border-b border-white/10">
          <span className="font-mono text-[10px] tracking-[0.2em] text-zinc-500 uppercase block mb-1">
            BASE SETUP INVESTMENT
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-4xl sm:text-5xl font-bold text-white tracking-tight">
              {pkg.basePrice !== null ? formatINR(pkg.basePrice) : "Contact / Configure"}
            </span>
          </div>

          {isHoneyCombPro && (
            <p className="font-mono text-[11px] text-amber-300/90 mt-2">
              Dance floor options: 12x12 (₹25,000) • 16x16 (₹30,000)
            </p>
          )}

          <p className="font-sans text-[11px] text-zinc-500 mt-2 italic">
            * Transportation not included in package price
          </p>
        </div>

        {/* Equipment Highlights List */}
        <div className="space-y-3">
          <span className="font-mono text-[10px] tracking-[0.25em] text-zinc-400 uppercase font-bold block mb-2">
            INCLUDED EQUIPMENT ({pkg.items.length} KEY MODULES)
          </span>

          <div className="grid grid-cols-1 gap-2">
            {pkg.items.slice(0, 5).map((item, idx) => (
              <div key={idx} className="flex items-center gap-2.5 text-xs text-zinc-300">
                <div className="w-4 h-4 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                  <Check className="w-2.5 h-2.5 text-amber-300" />
                </div>
                <span className="font-sans">
                  {item.name}{" "}
                  <span className="font-mono text-zinc-500 text-[11px]">
                    ({item.quantity} {item.unit})
                  </span>
                </span>
              </div>
            ))}

            {pkg.items.length > 5 && (
              <p className="font-mono text-[10px] text-zinc-500 pt-1">
                + {pkg.items.length - 5} more stage modules included
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Card Action Buttons */}
      <div className="pt-8 mt-8 border-t border-white/10 flex items-center gap-3">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSelect(pkg);
          }}
          data-cursor="VIEW"
          className="flex-1 py-3 px-4 rounded-xl border border-white/15 bg-white/5 font-mono text-[11px] tracking-[0.18em] uppercase font-semibold text-white hover:bg-white hover:text-black transition-all duration-300 flex items-center justify-center gap-2"
        >
          <span>VIEW DETAILS</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            if (!isOutOfOrder) onBook(pkg);
            else onSelect(pkg);
          }}
          disabled={isOutOfOrder}
          data-cursor={isOutOfOrder ? "UNAVAILABLE" : "BOOK"}
          className={`py-3 px-5 rounded-xl font-mono text-[11px] tracking-[0.18em] uppercase font-bold transition-all duration-300 ${
            isOutOfOrder
              ? "bg-zinc-800 text-zinc-500 cursor-not-allowed border border-white/10"
              : "bg-amber-300 text-black hover:bg-amber-200 hover:shadow-[0_0_20px_rgba(251,191,36,0.3)] active:scale-95"
          }`}
        >
          {isOutOfOrder ? "OUT OF ORDER" : "RESERVE"}
        </button>
      </div>
    </div>
  );
}
