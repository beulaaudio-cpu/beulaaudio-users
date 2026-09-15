"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, ShieldCheck, Music2, Headphones, Radio } from "lucide-react";
import { useLanguage } from "../../lib/i18n/LanguageContext";

interface FinalCTAProps {
  onCheckAvailability: () => void;
  onExplorePackages: () => void;
}

export function FinalCTA({ onCheckAvailability, onExplorePackages }: FinalCTAProps) {
  const { dict } = useLanguage();

  return (
    <section className="relative py-32 px-6 md:px-16 max-w-7xl mx-auto text-center overflow-hidden">
      {/* Glow Centerpiece */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-96 bg-amber-500/[0.08] blur-[160px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 max-w-4xl mx-auto space-y-8"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-400/30 bg-amber-400/10 text-amber-300 font-mono text-xs tracking-[0.25em] uppercase shadow-[0_0_20px_rgba(251,191,36,0.2)]"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <span>{dict.finalCtaPre}</span>
        </motion.div>

        <h2 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white uppercase leading-[0.95] drop-shadow-[0_4px_30px_rgba(0,0,0,0.9)]">
          {dict.finalCtaHeadline}
        </h2>

        <p className="font-sans text-base sm:text-lg text-zinc-300 max-w-xl mx-auto leading-relaxed font-light">
          {dict.finalCtaSub}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.96 }}
            onClick={onCheckAvailability}
            data-cursor="BOOK"
            className="px-10 py-4 rounded-full bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 text-black font-mono text-xs font-bold tracking-[0.2em] uppercase shadow-[0_0_35px_rgba(251,191,36,0.45)] transition-all duration-300 active:scale-95 flex items-center gap-2 hover:shadow-[0_0_45px_rgba(251,191,36,0.6)]"
          >
            <span>{dict.finalCtaBtn}</span>
            <ArrowRight className="w-4 h-4" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.96 }}
            onClick={onExplorePackages}
            data-cursor="PACKAGES"
            className="px-8 py-4 rounded-full border border-white/20 bg-black/60 backdrop-blur-md text-white font-mono text-xs tracking-[0.2em] uppercase hover:border-amber-400/60 hover:bg-white/10 transition-all duration-300 active:scale-95 hover:shadow-[0_0_20px_rgba(251,191,36,0.2)]"
          >
            {dict.heroExploreBtn}
          </motion.button>
        </div>

        {/* Credentials and Disclaimer */}
        <div className="pt-10 border-t border-white/10 max-w-2xl mx-auto space-y-4">
          <p className="font-mono text-xs tracking-[0.25em] text-zinc-400 uppercase">
            9+ YEARS • 1,500+ EVENTS POWERED • FAIL-SAFE LIVE PRODUCTION
          </p>

          <div className="flex items-center justify-center gap-2 text-xs font-sans text-zinc-400">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>{dict.transportDisclaimer}</span>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
