"use client";

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { CUSTOM_ITEMS_CATALOG, formatINR } from "../../lib/data/packages";
import { Plus, Minus, AlertTriangle, ArrowRight, RotateCcw, Sparkles, Check } from "lucide-react";
import { useLanguage } from "../../lib/i18n/LanguageContext";
import { SpotlightCard } from "../ui/SpotlightCard";

interface CustomConfiguratorProps {
  onRequestBooking: (customItems: { itemId: string; quantity: number }[], total: number) => void;
}

export function CustomConfigurator({ onRequestBooking }: CustomConfiguratorProps) {
  const { dict } = useLanguage();

  // Quantities keyed strictly by CUSTOM_ITEMS_CATALOG item IDs
  const [quantities, setQuantities] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    CUSTOM_ITEMS_CATALOG.forEach((item) => {
      initial[item.id] = 0;
    });
    return initial;
  });

  const updateQuantity = (id: string, delta: number) => {
    setQuantities((prev) => {
      const current = prev[id] || 0;
      const next = Math.max(0, current + delta);
      return { ...prev, [id]: next };
    });
  };

  const resetAll = () => {
    const reset: Record<string, number> = {};
    CUSTOM_ITEMS_CATALOG.forEach((item) => {
      reset[item.id] = 0;
    });
    setQuantities(reset);
  };

  // Preset Handlers
  const applyPreset = (preset: "standard" | "full") => {
    const next: Record<string, number> = {};
    CUSTOM_ITEMS_CATALOG.forEach((item) => {
      next[item.id] = 0;
    });

    if (preset === "standard") {
      next["vrx-top"] = 2;
      next["bass-18"] = 2;
      next["cordless-mic-pair"] = 1;
    } else {
      next["vrx-top"] = 4;
      next["bass-18"] = 4;
      next["parcan-unit"] = 8;
      next["sharpy-pair"] = 2;
      next["smoke-package"] = 1;
      next["cordless-mic-pair"] = 1;
    }
    setQuantities(next);
  };

  // Check VRX dependency constraint: VRX Top > 0 requires 18" Bass > 0
  const vrxSelected = (quantities["vrx-top"] || 0) > 0;
  const bass18Selected = (quantities["bass-18"] || 0) > 0;
  const vrxDependencyError = vrxSelected && !bass18Selected;

  // Calculate selected count and active items (prices omitted per specification)
  const { selectedCount, activeItems } = useMemo(() => {
    let count = 0;
    const active: { itemId: string; quantity: number }[] = [];

    for (const item of CUSTOM_ITEMS_CATALOG) {
      const qty = quantities[item.id] || 0;
      if (qty > 0) {
        count += qty;
        active.push({ itemId: item.id, quantity: qty });
      }
    }

    return { selectedCount: count, activeItems: active };
  }, [quantities]);

  const handleProceed = () => {
    if (selectedCount === 0 || vrxDependencyError) return;
    onRequestBooking(activeItems, 0);
  };

  return (
    <section id="custom" className="relative py-28 px-6 md:px-14 lg:px-16 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 border-b border-white/10 pb-8">
        <div>
          <span className="font-mono text-xs tracking-[0.3em] text-amber-300 uppercase block mb-3 font-bold flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{dict.customPre}</span>
          </span>
          <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white uppercase">
            {dict.customTitle}
          </h2>
        </div>
        <p className="max-w-md font-sans text-sm sm:text-base text-zinc-400 leading-relaxed font-light">
          {dict.customSubtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Interactive Catalog Grid with Windows 10 Reveal Highlight */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-2">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => applyPreset("standard")}
                className="px-3 py-1.5 rounded-full border border-amber-400/40 bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 font-mono text-xs font-semibold uppercase transition-colors"
              >
                {dict.customStandardRigPreset}
              </button>
              <button
                type="button"
                onClick={() => applyPreset("full")}
                className="px-3 py-1.5 rounded-full border border-white/20 bg-white/5 hover:bg-white/15 text-zinc-300 font-mono text-xs uppercase transition-colors"
              >
                {dict.customFullStagePreset}
              </button>
            </div>

            <button
              onClick={resetAll}
              className="font-mono text-xs text-zinc-400 hover:text-white uppercase tracking-wider flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{dict.customResetBtn}</span>
            </button>
          </div>

          {/* Acoustic Warning */}
          {vrxDependencyError && (
            <div className="p-4 rounded-2xl border border-amber-400/50 bg-amber-950/40 flex items-center justify-between gap-4 text-xs text-amber-200">
              <div className="flex items-center gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{dict.customVrxWarning}</span>
              </div>
              <button
                onClick={() => updateQuantity("bass-18", 1)}
                className="px-3 py-1 rounded-full bg-amber-400 text-black font-mono text-[10px] font-bold uppercase shrink-0 hover:bg-amber-300 transition-colors"
              >
                + Add 18&quot; Bass
              </button>
            </div>
          )}

          {/* Catalog Items Grid with Windows 10 Reveal Highlight */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {CUSTOM_ITEMS_CATALOG.map((item, cIdx) => {
              const qty = quantities[item.id] || 0;

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.5, delay: cIdx * 0.05, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className="h-full"
                >
                  <SpotlightCard
                    className={`transition-all duration-300 h-full ${
                      qty > 0 ? "shadow-[0_12px_35px_rgba(251,191,36,0.2)] border-amber-400/50" : ""
                    }`}
                    borderGlowColor={qty > 0 ? "rgba(251, 191, 36, 0.85)" : "rgba(251, 191, 36, 0.45)"}
                  >
                    <div className="p-5 sm:p-6 flex flex-col justify-between h-full">
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h4 className="font-serif text-base font-bold text-white leading-snug">
                            {item.name}
                          </h4>
                          <span className="font-mono text-xs font-bold text-amber-300 shrink-0 px-2 py-0.5 rounded bg-amber-400/10 border border-amber-400/20">
                            {formatINR(item.unitPrice)}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 mb-4">
                          <span className="font-mono text-[10px] text-zinc-400 uppercase tracking-widest">
                            Per {item.unitLabel || "Unit"}
                          </span>
                          {item.notes && (
                            <span className="font-mono text-[9px] text-amber-300 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                              {item.notes}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Quantity Stepper */}
                      <div className="flex items-center justify-between pt-3 border-t border-white/10">
                        <span className={`font-mono text-[11px] font-medium transition-colors ${
                          qty > 0 ? "text-amber-400 font-bold" : "text-zinc-500"
                        }`}>
                          {qty > 0 ? `${qty} selected` : "Add to quote"}
                        </span>

                        <div className="flex items-center gap-2 bg-black/60 rounded-xl p-1 border border-white/15">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, -1)}
                            disabled={qty === 0}
                            aria-label={`Decrease ${item.name}`}
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-white hover:bg-white/20 disabled:opacity-30 disabled:hover:bg-transparent transition-all active:scale-90"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="font-mono text-xs font-bold text-white w-6 text-center">
                            {qty}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, 1)}
                            aria-label={`Increase ${item.name}`}
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-white hover:bg-amber-400 hover:text-black transition-all active:scale-90"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </SpotlightCard>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Right Summary Sidebar with Windows 10 Glow */}
        <div className="lg:col-span-4 sticky top-28">
          <SpotlightCard className="shadow-2xl">
            <div className="p-8 space-y-6">
              <div>
                <span className="font-mono text-xs tracking-[0.25em] text-amber-300 uppercase block mb-1 font-semibold">
                  {dict.customSelectedTotal}
                </span>
                <h3 className="font-serif text-3xl font-bold text-white uppercase">
                  {selectedCount} {dict.customUnitsSelected}
                </h3>
              </div>

              {/* Custom Quote Notice (Price Entered Manually by Admin) */}
              <div className="p-5 rounded-2xl border border-amber-400/40 bg-amber-400/5">
                <span className="font-mono text-[10px] uppercase text-zinc-400 tracking-wider block mb-1 font-semibold">
                  Pricing Method
                </span>
                <div className="font-serif text-2xl font-bold text-amber-300 uppercase">
                  Custom Quote
                </div>
                <span className="font-mono text-[11px] text-zinc-300 mt-2 block leading-relaxed">
                  Price is manually quoted by admin based on venue, stage requirements, and distance.
                </span>
              </div>

              {/* Admin Effect Lights Note */}
              <div className="p-4 rounded-2xl border border-white/10 bg-white/[0.02] space-y-1">
                <span className="font-mono text-[10px] text-amber-300 uppercase font-bold block">
                  {dict.adminEffectLightsTitle}
                </span>
                <p className="font-sans text-xs text-zinc-400 leading-relaxed font-light">
                  {dict.adminEffectLightsDesc}
                </p>
              </div>

              {/* Selected Items Breakdown */}
              {activeItems.length > 0 && (
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {activeItems.map((ai) => {
                    const def = CUSTOM_ITEMS_CATALOG.find((c) => c.id === ai.itemId);
                    if (!def) return null;
                    return (
                      <div
                        key={ai.itemId}
                        className="flex items-center justify-between text-xs py-1 border-b border-white/5 text-zinc-300"
                      >
                        <span className="truncate pr-2">{def.name} × {ai.quantity}</span>
                        <span className="font-mono text-amber-300 font-semibold shrink-0">
                          {formatINR(def.unitPrice * ai.quantity)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Action Button */}
              <button
                type="button"
                disabled={selectedCount === 0 || vrxDependencyError}
                onClick={handleProceed}
                data-cursor="RESERVE"
                className={`w-full py-4 rounded-full font-mono text-xs font-bold tracking-[0.2em] uppercase transition-all flex items-center justify-center gap-2 ${
                  selectedCount === 0 || vrxDependencyError
                    ? "bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700"
                    : "bg-amber-400 hover:bg-amber-300 text-black shadow-[0_0_30px_rgba(251,191,36,0.35)] active:scale-95 hover:scale-[1.02]"
                }`}
              >
                <span>{dict.customRequestBookingBtn}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </SpotlightCard>
        </div>
      </div>
    </section>
  );
}

export default CustomConfigurator;
