"use client";

import React from "react";
import { motion } from "framer-motion";
import { INSTRUMENT_SETUP, formatINR } from "../../lib/data/packages";
import { Mic2, Radio, SlidersHorizontal, Volume2, ArrowRight, Music, Sparkles } from "lucide-react";
import { useLanguage } from "../../lib/i18n/LanguageContext";
import { SpotlightCard } from "../ui/SpotlightCard";

interface InstrumentSectionProps {
  onBookInstrument: () => void;
}

export function InstrumentSection({ onBookInstrument }: InstrumentSectionProps) {
  const { dict } = useLanguage();

  const highlightIcons: Record<string, any> = {
    "18\" VRX Top speaker": Volume2,
    "18\" Bass speaker": Volume2,
    "Digital Mixer": SlidersHorizontal,
    "Monitor (QSC K12)": Radio,
    "Instrument Cable - Mono, Stereo": Music,
    "Mic, Cord, Stand": Mic2,
  };

  return (
    <section id="instruments" className="relative py-28 px-6 md:px-14 lg:px-16 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 border-b border-white/10 pb-8">
        <div>
          <span className="font-mono text-xs tracking-[0.3em] text-amber-300 uppercase block mb-3 font-bold flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{dict.instrumentPre}</span>
          </span>
          <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white uppercase">
            {dict.instrumentTitle}
          </h2>
        </div>
        <p className="max-w-md font-sans text-sm sm:text-base text-zinc-400 leading-relaxed font-light">
          {dict.instrumentSubtitle}
        </p>
      </div>

      {/* Main Feature Showcase Grid with Windows 10 Reveal Highlight Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
        {/* Left Specification Card */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.96 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-7 h-full"
        >
          <SpotlightCard className="h-full shadow-2xl" spotlightColor="rgba(251, 191, 36, 0.12)" borderGlowColor="rgba(251, 191, 36, 0.65)">
            <div className="p-8 sm:p-12 flex flex-col justify-between h-full">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="font-mono text-xs tracking-[0.25em] text-amber-300 font-bold uppercase px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30">
                    {dict.instrumentBadge}
                  </span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-mono text-[10px] text-zinc-400 uppercase tracking-widest font-semibold">
                    ZERO FEEDBACK
                  </span>
                </div>

                <h3 className="font-serif text-3xl sm:text-4xl font-bold text-white uppercase mb-3">
                  {dict.instrumentMainTitle}
                </h3>
                <p className="font-sans text-sm text-zinc-300 leading-relaxed mb-8 font-light">
                  {dict.instrumentSubtitle}
                </p>

                {/* Equipment Highlights Grid with micro-glow tiles */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
                  {INSTRUMENT_SETUP.items.map((item, idx) => {
                    const IconComponent = highlightIcons[item.name] || Volume2;
                    return (
                      <motion.div
                        key={idx}
                        whileHover={{ scale: 1.03, y: -2 }}
                        transition={{ duration: 0.2 }}
                        className="p-4 rounded-2xl border border-white/10 bg-white/[0.03] hover:border-amber-400/40 hover:bg-white/[0.06] transition-all flex items-center gap-4 group shadow-sm"
                      >
                        <div className="p-3 rounded-xl bg-amber-400/10 border border-amber-400/30 text-amber-300 shrink-0 group-hover:rotate-6 transition-transform duration-300 shadow-[0_0_15px_rgba(251,191,36,0.15)]">
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="font-serif text-sm font-bold text-white block group-hover:text-amber-300 transition-colors">
                            {item.name}
                          </span>
                          <span className="font-mono text-xs text-amber-300 font-semibold">
                            {item.quantity} {item.unit || "Units"}
                          </span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Pricing & Reservation Action */}
              <div className="pt-8 border-t border-white/10 mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div>
                  <span className="font-mono text-[10px] tracking-[0.2em] text-zinc-400 uppercase block font-semibold">
                    {dict.instrumentPriceLabel}
                  </span>
                  <div className="font-serif text-4xl font-bold text-white tracking-tight mt-0.5">
                    {INSTRUMENT_SETUP.basePrice ? formatINR(INSTRUMENT_SETUP.basePrice) : "₹10,000"}
                  </div>
                  <span className="font-mono text-[9px] text-zinc-500 mt-1 block">
                    {dict.transportDisclaimer}
                  </span>
                </div>

                <button
                  onClick={onBookInstrument}
                  data-cursor="BOOK"
                  className="px-8 py-4 rounded-full bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 text-black font-mono text-xs font-bold tracking-[0.2em] uppercase transition-all shadow-[0_0_30px_rgba(251,191,36,0.4)] flex items-center justify-center gap-2 active:scale-95 hover:scale-[1.04]"
                >
                  <span>{dict.instrumentBookBtn}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </SpotlightCard>
        </motion.div>

        {/* Right Architectural Breakdown Card */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.96 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-5 h-full"
        >
          <SpotlightCard className="h-full shadow-2xl" spotlightColor="rgba(251, 191, 36, 0.12)" borderGlowColor="rgba(251, 191, 36, 0.65)">
            <div className="p-8 sm:p-10 flex flex-col justify-between h-full">
              <div>
                <span className="font-mono text-xs tracking-[0.25em] text-amber-300 uppercase block mb-3 font-semibold px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 w-fit">
                  {dict.instrumentFeaturesTitle}
                </span>
                <h4 className="font-serif text-2xl font-bold text-white uppercase mb-4">
                  {dict.instrumentFeature2Title}
                </h4>
                <p className="font-sans text-sm text-zinc-400 leading-relaxed font-light mb-6">
                  {dict.instrumentFeature2Desc}
                </p>

                <div className="space-y-4 pt-2">
                  <div className="p-4 rounded-2xl border border-white/10 bg-white/[0.02] hover:border-amber-400/30 transition-colors">
                    <div className="font-serif text-sm font-bold text-white mb-1">
                      {dict.instrumentFeature1Title}
                    </div>
                    <div className="font-sans text-xs text-zinc-400 font-light">
                      {dict.instrumentFeature1Desc}
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl border border-white/10 bg-white/[0.02] hover:border-amber-400/30 transition-colors">
                    <div className="font-serif text-sm font-bold text-white mb-1">
                      {dict.instrumentFeature3Title}
                    </div>
                    <div className="font-sans text-xs text-zinc-400 font-light">
                      {dict.instrumentFeature3Desc}
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-white/10 mt-6 flex items-center justify-between text-xs font-mono text-zinc-400">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  CONCERT QUALITY
                </span>
                <span className="text-amber-300 font-bold">{dict.instrumentGuarantee}</span>
              </div>
            </div>
          </SpotlightCard>
        </motion.div>
      </div>
    </section>
  );
}

export default InstrumentSection;
