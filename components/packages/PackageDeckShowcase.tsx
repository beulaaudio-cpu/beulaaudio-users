"use client";

import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Check, ArrowRight, Sparkles, Star, AlertCircle, Eye } from "lucide-react";
import { DJ_PACKAGES, PackageDefinition, formatINR } from "../../lib/data/packages";
import { useLanguage } from "../../lib/i18n/LanguageContext";

interface PackageDeckShowcaseProps {
  packages?: PackageDefinition[];
  onSelectPackage: (pkg: PackageDefinition) => void;
  onBookPackage: (pkg: PackageDefinition) => void;
  stockStatus?: Record<string, { isOutOfOrder: boolean; bottleneck?: string }>;
}

// 3D Fanning parameters matching natural stage deck
const CARD_DECK_ANGLES = [
  { rotateY: 15, rotateZ: -6, x: -70, y: 18, zIndex: 10 },
  { rotateY: 7.5, rotateZ: -3, x: -35, y: 8, zIndex: 20 },
  { rotateY: 0, rotateZ: 0, x: 0, y: 0, zIndex: 30 },
  { rotateY: -7.5, rotateZ: 3, x: 35, y: 8, zIndex: 20 },
  { rotateY: -15, rotateZ: 6, x: 70, y: 18, zIndex: 10 },
];

export function PackageDeckShowcase({
  packages,
  onSelectPackage,
  onBookPackage,
  stockStatus = {},
}: PackageDeckShowcaseProps) {
  const displayedPackages = packages && packages.length > 0 ? packages : DJ_PACKAGES;
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [cursorPos, setCursorPos] = useState<Record<number, { x: number; y: number }>>({});
  const { dict, language } = useLanguage();

  const handleMouseMoveCard = (idx: number, e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setCursorPos((prev) => ({
      ...prev,
      [idx]: {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      },
    }));
  };

  return (
    <section id="packages" className="py-24 px-4 sm:px-8 md:px-14 max-w-7xl mx-auto w-full relative">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 border-b border-white/10 pb-8">
        <div>
          <span className="font-mono text-xs tracking-[0.3em] text-amber-300 uppercase block mb-3 font-bold flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{dict.djSectionPre}</span>
          </span>
          <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white uppercase">
            {dict.djSectionTitle}
          </h2>
        </div>
        <p className="max-w-md font-sans text-sm sm:text-base text-zinc-400 leading-relaxed font-light">
          {dict.djSectionSubtitle}
        </p>
      </div>

      {/* Desktop 3D Perspective Fanned Deck */}
      <div className="hidden lg:block w-full py-12">
        <div
          className="relative mx-auto flex items-center justify-center min-h-[700px]"
          style={{ perspective: "1600px" }}
          onMouseLeave={() => setHoveredIdx(null)}
        >
          {displayedPackages.map((pkg, idx) => {
            const isHovered = hoveredIdx === idx;
            const anyHovered = hoveredIdx !== null;
            const config = CARD_DECK_ANGLES[idx] || {
              rotateY: 0,
              rotateZ: 0,
              x: 0,
              y: 0,
              zIndex: 10,
            };
            const isPopular = pkg.id === "dj-premium";
            const isFlagship = pkg.id === "dj-honeycomb-pro";
            const stock = stockStatus[pkg.id];
            const isOutOfOrder = stock?.isOutOfOrder || false;

            // Refined transform: reduced distance pop-out so it doesn't jump forward excessively
            let currentX = config.x;
            let currentY = config.y;
            let currentRotateY = config.rotateY;
            let currentRotateZ = config.rotateZ;
            let currentScale = 1;
            let currentZIndex = config.zIndex;
            let currentOpacity = 1;

            if (isHovered) {
              currentX = config.x * 0.65;
              currentY = -16; // Reduced from -40 as requested
              currentRotateY = 0;
              currentRotateZ = 0;
              currentScale = 1.03; // Reduced from 1.08 as requested
              currentZIndex = 60;
              currentOpacity = 1;
            } else if (anyHovered) {
              currentOpacity = 0.6;
              currentScale = 0.98;
            }

            const mouse = cursorPos[idx] || { x: 150, y: 250 };

            return (
              <motion.div
                key={pkg.id}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseMove={(e) => handleMouseMoveCard(idx, e)}
                animate={{
                  x: currentX,
                  y: currentY,
                  rotateY: currentRotateY,
                  rotateZ: currentRotateZ,
                  scale: currentScale,
                  zIndex: currentZIndex,
                  opacity: currentOpacity,
                }}
                transition={{
                  type: "spring",
                  stiffness: 350,
                  damping: 28,
                  mass: 0.7,
                }}
                style={{
                  transformStyle: "preserve-3d",
                  transformOrigin: "bottom center",
                  width: "320px",
                  marginLeft: idx === 0 ? 0 : "-115px",
                }}
                className="relative cursor-pointer select-none shrink-0"
              >
                {/* Honeycomb Rig Outline Accent on Card 2, 3, 4 */}
                {(idx === 1 || idx === 2 || idx === 3) && (
                  <div className="absolute -top-6 -right-6 w-24 h-24 pointer-events-none opacity-20 group-hover:opacity-40 transition-opacity">
                    <svg viewBox="0 0 100 100" className="w-full h-full text-amber-400 stroke-current fill-none stroke-[2]">
                      <polygon points="50,5 90,27 90,73 50,95 10,73 10,27" />
                    </svg>
                  </div>
                )}

                {/* Card Outer Container with Side Border Glow */}
                <div
                  className={`relative rounded-3xl p-[1px] transition-all duration-300 ${
                    isHovered
                      ? "border border-amber-400/80 shadow-[0_0_30px_rgba(251,191,36,0.25)]"
                      : isPopular
                      ? "border border-amber-400/30"
                      : "border border-white/10 hover:border-white/25"
                  }`}
                >
                  {/* Card Content Interior — Solid crisp dark background without backdrop-blur for 100% sharp text */}
                  <div
                    className={`relative rounded-[calc(1.5rem-1px)] p-6 flex flex-col justify-between min-h-[640px] transition-all duration-300 ${
                      isHovered
                        ? "bg-[#0c0c0e] shadow-[0_20px_50px_rgba(0,0,0,0.95)]"
                        : isPopular
                        ? "bg-[#09090b]"
                        : "bg-[#070709]"
                    }`}
                  >

                    {/* Card Header & Badge */}
                    <div className="relative z-10">
                      <div className="flex items-center justify-between gap-2 mb-4">
                        <span className="font-mono text-[10px] tracking-[0.25em] text-zinc-400 uppercase">
                          0{idx + 1} // {dict.stageSetupBadge}
                        </span>
                        {isPopular && (
                          <span className="px-2.5 py-1 rounded-full bg-amber-400/20 border border-amber-400/60 text-amber-300 font-mono text-[9px] tracking-wider uppercase font-bold flex items-center gap-1 shadow-[0_0_12px_rgba(251,191,36,0.3)]">
                            <Star className="w-2.5 h-2.5 fill-amber-400" />
                            <span>{dict.mostPopularBadge}</span>
                          </span>
                        )}
                        {isFlagship && (
                          <span className="px-2.5 py-1 rounded-full bg-amber-400/10 border border-white/30 text-white font-mono text-[9px] tracking-wider uppercase font-bold">
                            {dict.flagshipBadge}
                          </span>
                        )}
                      </div>

                      {/* Setup Title */}
                      <h3 className="font-serif text-2xl font-bold tracking-tight text-white uppercase mb-2">
                        {dict[`pkg0${idx + 1}Name` as keyof typeof dict] || pkg.name}
                      </h3>

                      {/* Tagline */}
                      <p className="font-sans text-xs text-zinc-400 leading-relaxed min-h-[38px] line-clamp-2 font-light">
                        {dict[`pkg0${idx + 1}Desc` as keyof typeof dict] || pkg.tagline}
                      </p>

                      {/* Price Section */}
                      <div className="mt-5 pt-4 border-t border-white/10">
                        <span className="font-mono text-[9px] tracking-[0.2em] text-zinc-500 uppercase block mb-1 font-semibold">
                          {dict.baseInvestmentLabel}
                        </span>
                        <div className="font-serif text-3xl font-bold text-white tracking-tight">
                          {pkg.basePrice !== null ? formatINR(pkg.basePrice) : (
                            <span className="text-xl text-amber-300">Contact / Configure</span>
                          )}
                        </div>
                        <p className="font-mono text-[9px] text-zinc-500 mt-1">
                          {dict.transportDisclaimer}
                        </p>
                      </div>
                    </div>

                    {/* Included Equipment Modules List */}
                    <div className="my-6 pt-4 border-t border-white/10 flex-grow relative z-10">
                      <span className="font-mono text-[9px] tracking-[0.22em] text-zinc-400 uppercase block mb-3 font-semibold">
                        {dict.includedEquipmentLabel} ({(pkg.items || []).length} ITEMS)
                      </span>
                      <ul className="space-y-2.5">
                        {(pkg.items || []).slice(0, 5).map((item, iIdx) => (
                          <li key={iIdx} className="flex items-center gap-2.5 text-xs text-zinc-300">
                            <div className="w-4 h-4 rounded-full bg-amber-400/10 border border-amber-400/30 flex items-center justify-center shrink-0">
                              <Check className="w-2.5 h-2.5 text-amber-400 stroke-[3]" />
                            </div>
                            <span className="truncate">
                              {item.name} ({item.quantity} {item.unit || "unit"})
                            </span>
                          </li>
                        ))}
                        {(pkg.items || []).length > 5 && (
                          <li className="font-mono text-[10px] text-zinc-400 italic pt-1 pl-6">
                            + {(pkg.items || []).length - 5} {dict.moreModulesText}
                          </li>
                        )}
                      </ul>
                    </div>

                    {/* Out of Order Notice if stock unavailable */}
                    {isOutOfOrder && (
                      <div className="mb-4 p-2.5 rounded-xl border border-red-500/40 bg-red-950/30 text-red-300 flex items-center gap-2 text-[11px] font-sans relative z-10">
                        <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                        <span>{stock?.bottleneck ? `Booked out: ${stock.bottleneck}` : dict.outOfOrderBadge}</span>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="space-y-2.5 pt-4 border-t border-white/10 relative z-10">
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectPackage(pkg);
                          }}
                          data-cursor="DETAILS"
                          className="py-2.5 px-3 rounded-full border border-white/20 bg-white/5 hover:bg-white/15 text-white font-mono text-[10px] tracking-wider uppercase transition-colors flex items-center justify-center gap-1"
                        >
                          <Eye className="w-3 h-3 text-zinc-400" />
                          <span>{dict.viewDetailsBtn}</span>
                        </button>

                        <button
                          disabled={isOutOfOrder}
                          onClick={(e) => {
                            e.stopPropagation();
                            onBookPackage(pkg);
                          }}
                          data-cursor="BOOK"
                          className={`py-2.5 px-3 rounded-full font-mono text-[10px] font-bold tracking-wider uppercase transition-all flex items-center justify-center gap-1 ${
                            isOutOfOrder
                              ? "bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700"
                              : "bg-amber-400 hover:bg-amber-300 text-black shadow-[0_0_20px_rgba(251,191,36,0.35)] active:scale-95 hover:scale-[1.02]"
                          }`}
                        >
                          <span>{isOutOfOrder ? dict.outOfOrderBtn : dict.reserveBtn}</span>
                          {!isOutOfOrder && <ArrowRight className="w-3 h-3" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Mobile & Tablet Vertical Stack */}
      <div className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-6">
        {displayedPackages.map((pkg, idx) => {
          const isPopular = pkg.id === "dj-premium";
          const isFlagship = pkg.id === "dj-honeycomb-pro";
          const stock = stockStatus[pkg.id];
          const isOutOfOrder = stock?.isOutOfOrder || false;

          return (
            <div
              key={pkg.id}
              className={`rounded-3xl p-6 border flex flex-col justify-between backdrop-blur-xl transition-all ${
                isPopular
                  ? "bg-zinc-950 border-amber-400/60 shadow-[0_10px_35px_rgba(251,191,36,0.15)]"
                  : "bg-[#0b0c13] border-white/15"
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="font-mono text-[10px] tracking-[0.2em] text-zinc-400 uppercase">
                    0{idx + 1} // {dict.stageSetupBadge}
                  </span>
                  {isPopular && (
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 border border-amber-400/60 text-amber-300 font-mono text-[9px] tracking-wider uppercase font-bold">
                      {dict.mostPopularBadge}
                    </span>
                  )}
                  {isFlagship && (
                    <span className="px-2.5 py-0.5 rounded-full bg-white/10 border border-white/20 text-white font-mono text-[9px] tracking-wider uppercase font-bold">
                      {dict.flagshipBadge}
                    </span>
                  )}
                </div>

                <h3 className="font-serif text-2xl font-bold text-white uppercase mb-1">
                  {dict[`pkg0${idx + 1}Name` as keyof typeof dict] || pkg.name}
                </h3>
                <p className="font-sans text-xs text-zinc-400 mb-4 font-light">
                  {dict[`pkg0${idx + 1}Desc` as keyof typeof dict] || pkg.tagline}
                </p>

                <div className="pt-3 border-t border-white/10 mb-4">
                  <span className="font-mono text-[9px] tracking-wider text-zinc-500 uppercase block font-semibold">
                    {dict.baseInvestmentLabel}
                  </span>
                  <div className="font-serif text-2xl font-bold text-white mt-0.5">
                    {pkg.basePrice !== null ? formatINR(pkg.basePrice) : (
                      <span className="text-lg text-amber-300">Contact / Configure</span>
                    )}
                  </div>
                </div>

                <ul className="space-y-2 mb-6 text-xs text-zinc-300">
                  {(pkg.items || []).slice(0, 4).map((item, iIdx) => (
                    <li key={iIdx} className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>{item.name} ({item.quantity} {item.unit || "unit"})</span>
                    </li>
                  ))}
                  {(pkg.items || []).length > 4 && (
                    <li className="font-mono text-[10px] text-zinc-400 italic pl-5">
                      + {(pkg.items || []).length - 4} {dict.moreModulesText}
                    </li>
                  )}
                </ul>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-4 border-t border-white/10">
                <button
                  onClick={() => onSelectPackage(pkg)}
                  className="py-3 px-2 rounded-full border border-white/20 text-white font-mono text-[10px] tracking-wider uppercase flex items-center justify-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>{dict.viewDetailsBtn}</span>
                </button>

                <button
                  disabled={isOutOfOrder}
                  onClick={() => onBookPackage(pkg)}
                  className={`py-3 px-2 rounded-full font-mono text-[10px] font-bold tracking-wider uppercase flex items-center justify-center gap-1 ${
                    isOutOfOrder
                      ? "bg-zinc-800 text-zinc-500 border border-zinc-700"
                      : "bg-amber-400 text-black shadow-[0_0_20px_rgba(251,191,36,0.3)]"
                  }`}
                >
                  <span>{isOutOfOrder ? dict.outOfOrderBtn : dict.reserveBtn}</span>
                  {!isOutOfOrder && <ArrowRight className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default PackageDeckShowcase;
