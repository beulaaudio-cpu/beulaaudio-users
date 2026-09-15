"use client";

import React from "react";
import { motion } from "framer-motion";
import { Award, ShieldCheck, Zap, Layers, Sparkles } from "lucide-react";
import { useLanguage } from "../../lib/i18n/LanguageContext";
import { SpotlightCard } from "../ui/SpotlightCard";

export function ExperienceSection() {
  const { dict } = useLanguage();

  const pillars = [
    {
      icon: Zap,
      title: dict.pillar1Title,
      desc: dict.pillar1Desc,
    },
    {
      icon: ShieldCheck,
      title: dict.pillar2Title,
      desc: dict.pillar2Desc,
    },
    {
      icon: Layers,
      title: dict.pillar3Title,
      desc: dict.pillar3Desc,
    },
    {
      icon: Award,
      title: dict.pillar4Title,
      desc: dict.pillar4Desc,
    },
  ];

  return (
    <section id="experience" className="relative py-28 px-6 md:px-14 lg:px-16 max-w-7xl mx-auto">
      {/* Top Numbers Showcase with Windows 10 Reveal Highlight */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="mb-16"
      >
        <SpotlightCard className="shadow-2xl">
          <div className="p-8 sm:p-14">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12">
              <div>
                <span className="font-mono text-xs tracking-[0.3em] text-amber-300 uppercase block mb-3 font-bold flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>{dict.experiencePreTitle}</span>
                </span>
                <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white uppercase leading-tight">
                  {dict.experienceTitle}
                </h2>
              </div>

              <div className="flex flex-wrap items-center gap-8 sm:gap-14 border-t lg:border-t-0 lg:border-l border-white/15 pt-8 lg:pt-0 lg:pl-14">
                <div>
                  <span className="font-serif text-5xl sm:text-6xl font-bold text-white tracking-tight block">
                    9+
                  </span>
                  <span className="font-mono text-xs tracking-[0.22em] text-amber-300 uppercase mt-1 block font-semibold">
                    {dict.statYears}
                  </span>
                </div>

                <div className="w-[1px] h-14 bg-white/15 hidden sm:block" />

                <div>
                  <span className="font-serif text-5xl sm:text-6xl font-bold text-white tracking-tight block">
                    1,500+
                  </span>
                  <span className="font-mono text-xs tracking-[0.22em] text-amber-300 uppercase mt-1 block font-semibold">
                    {dict.statEvents}
                  </span>
                </div>

                <div className="w-[1px] h-14 bg-white/15 hidden sm:block" />

                <div>
                  <span className="font-serif text-5xl sm:text-6xl font-bold text-white tracking-tight block">
                    100%
                  </span>
                  <span className="font-mono text-xs tracking-[0.22em] text-amber-300 uppercase mt-1 block font-semibold">
                    {dict.statReliability}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </SpotlightCard>
      </motion.div>

      {/* 4 Core Pillars Grid with Windows 10 Glow & Animations */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {pillars.map((pillar, idx) => {
          const Icon = pillar.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              whileHover={{ y: -6 }}
            >
              <SpotlightCard className="h-full shadow-lg">
                <div className="p-7 flex flex-col justify-between h-full">
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-300 mb-6 group-hover:scale-110 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>

                    <h3 className="font-serif text-lg font-bold text-white uppercase tracking-wider mb-2.5">
                      {pillar.title}
                    </h3>

                    <p className="font-sans text-xs text-zinc-400 leading-relaxed font-light">
                      {pillar.desc}
                    </p>
                  </div>
                </div>
              </SpotlightCard>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

export default ExperienceSection;
