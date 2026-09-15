"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowDown, Sparkles, Sliders, Music2 } from "lucide-react";
import { useLanguage } from "../../lib/i18n/LanguageContext";
import { subscribeSiteSettings, DEFAULT_SETTINGS, SiteSettings } from "../../lib/firestore/settings";

interface HeroSceneOverlayProps {
  onExplore: () => void;
  onCustomBuild?: () => void;
}

export function HeroSceneOverlay({
  onExplore,
  onCustomBuild,
}: HeroSceneOverlayProps) {
  const { dict } = useLanguage();
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    const unsub = subscribeSiteSettings((data) => {
      setSiteSettings(data);
    });
    return () => unsub();
  }, []);

  return (
    <div className="relative w-full min-h-screen flex flex-col justify-between pt-28 pb-12 px-6 md:px-14 lg:px-16 pointer-events-none select-none z-10">
      {/* Top spacer */}
      <div className="h-6" />

      {/* Main Hero Header: Left aligned so the full 3D stage shines prominently across the background */}
      {/* -ml-2 nudges the whole block a touch further left */}
      <div className="my-auto max-w-xl lg:max-w-xl pointer-events-auto pt-6 -ml-2">
        {/* Pre-title badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-amber-400/30 bg-amber-400/10 backdrop-blur-md mb-6 text-amber-300 font-mono text-xs tracking-[0.25em] uppercase shadow-[0_0_20px_rgba(251,191,36,0.15)]"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>{dict.heroHeadline}</span>
        </motion.div>

        {/* Title — Beula Audio text only */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mb-6"
        >
          <h1 className="font-serif text-5xl sm:text-7xl md:text-8xl lg:text-8xl xl:text-9xl font-bold tracking-tight text-white leading-[0.92] uppercase drop-shadow-[0_4px_30px_rgba(0,0,0,0.9)]">
            {dict.brandName}
          </h1>
        </motion.div>

        {/* Simplified Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="mt-4 font-sans text-base sm:text-lg text-zinc-300 leading-relaxed font-light drop-shadow-lg"
        >
          {dict.heroSubheadline}
        </motion.p>

        {/* Interactive Magnetic CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 flex flex-wrap items-center gap-4"
        >
          <button
            onClick={onExplore}
            data-cursor="SETUPS"
            className="px-8 py-4 rounded-full bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 text-black font-mono text-xs font-bold tracking-[0.2em] uppercase hover:shadow-[0_0_35px_rgba(251,191,36,0.5)] transition-all duration-300 active:scale-95 flex items-center gap-2 hover:scale-[1.03]"
          >
            <Music2 className="w-4 h-4" />
            <span>{dict.heroExploreBtn}</span>
          </button>

          {onCustomBuild && (
            <button
              onClick={onCustomBuild}
              data-cursor="CUSTOM"
              className="px-8 py-4 rounded-full border border-white/25 bg-black/60 backdrop-blur-md text-white font-mono text-xs tracking-[0.2em] uppercase hover:border-amber-400/70 hover:bg-white/10 hover:shadow-[0_0_20px_rgba(251,191,36,0.2)] transition-all duration-300 active:scale-95 flex items-center gap-2 hover:scale-[1.03]"
            >
              <Sliders className="w-4 h-4 text-amber-400" />
              <span>{dict.heroCustomBtn}</span>
            </button>
          )}
        </motion.div>
      </div>

      {/* Bottom Floating Stats Strip & Scroll Cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.7 }}
        className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 pointer-events-auto pt-6 border-t border-white/10"
      >
        {/* Experience metrics */}
        <div className="flex items-center gap-8 sm:gap-12">
          <div className="flex flex-col">
            <span className="font-serif text-3xl sm:text-4xl font-bold text-white tracking-tight">
              {siteSettings.statYears || "9+"}
            </span>
            <span className="font-mono text-[9px] sm:text-[10px] tracking-[0.22em] text-amber-300 uppercase mt-0.5">
              {dict.statYears}
            </span>
          </div>

          <div className="h-8 w-[1px] bg-white/15" />

          <div className="flex flex-col">
            <span className="font-serif text-3xl sm:text-4xl font-bold text-white tracking-tight">
              {siteSettings.statEvents || "1,500+"}
            </span>
            <span className="font-mono text-[9px] sm:text-[10px] tracking-[0.22em] text-amber-300 uppercase mt-0.5">
              {dict.statEvents}
            </span>
          </div>

          <div className="h-8 w-[1px] bg-white/15 hidden sm:block" />

          <div className="hidden sm:flex flex-col">
            <span className="font-serif text-3xl sm:text-4xl font-bold text-white tracking-tight">
              {siteSettings.statReliability || "100%"}
            </span>
            <span className="font-mono text-[9px] sm:text-[10px] tracking-[0.22em] text-amber-300 uppercase mt-0.5">
              {dict.statReliability}
            </span>
          </div>
        </div>

        {/* Scroll To Explore Cue */}
        <button
          onClick={onExplore}
          className="flex items-center gap-3 text-zinc-400 hover:text-amber-300 transition-colors group cursor-pointer focus:outline-none"
          aria-label="Scroll down to explore packages"
        >
          <span className="font-mono text-[10px] tracking-[0.25em] uppercase">
            {dict.heroExploreBtn}
          </span>
          <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center group-hover:border-amber-400 animate-bounce">
            <ArrowDown className="w-3.5 h-3.5 text-white group-hover:text-amber-300" />
          </div>
        </button>
      </motion.div>
    </div>
  );
}

export default HeroSceneOverlay;
