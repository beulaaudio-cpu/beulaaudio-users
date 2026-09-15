"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Disc3, Music2, Sliders, ArrowRight, Sparkles } from "lucide-react";
import { useLanguage } from "../../lib/i18n/LanguageContext";
import { SpotlightCard } from "../ui/SpotlightCard";

interface CategoryShowcaseProps {
  onSelectCategory: (category: "dj" | "instrument" | "custom") => void;
  selectedCategory: "dj" | "instrument" | "custom";
}

export function CategoryShowcase({
  onSelectCategory,
  selectedCategory,
}: CategoryShowcaseProps) {
  const { dict } = useLanguage();

  const categories = [
    {
      id: "dj" as const,
      number: "01",
      title: dict.category01Name,
      subtitle: dict.category01Desc,
      priceRange: dict.category01Price,
      desc: dict.category01Detail,
      icon: Disc3,
      tag: dict.category01Tag,
    },
    {
      id: "instrument" as const,
      number: "02",
      title: dict.category02Name,
      subtitle: dict.category02Desc,
      priceRange: dict.category02Price,
      desc: dict.category02Detail,
      icon: Music2,
      tag: dict.category02Tag,
    },
    {
      id: "custom" as const,
      number: "03",
      title: dict.category03Name,
      subtitle: dict.category03Desc,
      priceRange: dict.category03Price,
      desc: dict.category03Detail,
      icon: Sliders,
      tag: dict.category03Tag,
    },
  ];

  return (
    <section id="services" className="relative py-28 px-6 md:px-14 lg:px-16 max-w-7xl mx-auto">
      {/* Editorial Header with Simple Clear Titles */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 border-b border-white/10 pb-8">
        <div>
          <span className="font-mono text-xs tracking-[0.3em] text-amber-300 uppercase block mb-3 font-bold flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{dict.servicesPre}</span>
          </span>
          <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white uppercase">
            {dict.servicesTitle}
          </h2>
        </div>
        <p className="max-w-md font-sans text-sm sm:text-base text-zinc-400 leading-relaxed font-light">
          {dict.servicesSubtitle}
        </p>
      </div>

      {/* 3 Physical Category Cards with Windows 10 Reveal Highlight & 3D Hover Animation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {categories.map((cat, idx) => {
          const isSelected = selectedCategory === cat.id;
          const Icon = cat.icon;

          return (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, delay: idx * 0.15, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -10, scale: 1.02, transition: { duration: 0.25 } }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectCategory(cat.id)}
              data-cursor="SELECT"
              className="cursor-pointer group h-full"
            >
              <SpotlightCard
                className={`h-full min-h-[480px] transition-all duration-500 ${
                  isSelected
                    ? "shadow-[0_25px_60px_rgba(251,191,36,0.25)] border-amber-400/50"
                    : "shadow-[0_15px_40px_rgba(0,0,0,0.7)] group-hover:shadow-[0_20px_50px_rgba(251,191,36,0.15)]"
                }`}
                spotlightColor="rgba(251, 191, 36, 0.14)"
                borderGlowColor={isSelected ? "rgba(251, 191, 36, 0.85)" : "rgba(251, 191, 36, 0.55)"}
              >
                <div className="p-8 sm:p-9 flex flex-col justify-between h-full">
                  {/* Card Top Strip */}
                  <div>
                    <div className="flex items-center justify-between mb-8">
                      <span className="font-mono text-xs tracking-[0.25em] text-amber-300 font-bold px-2.5 py-1 rounded-md bg-amber-400/10 border border-amber-400/20">
                        {cat.number}
                      </span>
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-amber-400/30 bg-amber-400/10 group-hover:bg-amber-400/20 group-hover:border-amber-400/50 transition-colors shadow-sm">
                        <Icon className="w-3.5 h-3.5 text-amber-300 group-hover:rotate-12 transition-transform duration-300" />
                        <span className="font-mono text-[9px] tracking-[0.2em] text-amber-200 uppercase font-semibold">
                          {cat.tag}
                        </span>
                      </div>
                    </div>

                    <h3 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-white uppercase mb-2 group-hover:text-amber-300 transition-colors duration-300">
                      {cat.title}
                    </h3>
                    <p className="font-sans text-xs text-amber-200/90 leading-relaxed mb-4 font-medium">
                      {cat.subtitle}
                    </p>

                    <p className="font-sans text-sm text-zinc-400 leading-relaxed font-light">
                      {cat.desc}
                    </p>
                  </div>

                  {/* Card Bottom Meta & Button */}
                  <div className="pt-8 border-t border-white/10 mt-8">
                    <span className="font-mono text-xs text-amber-300 block mb-4 font-bold tracking-wide">
                      {cat.priceRange}
                    </span>

                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] tracking-[0.2em] text-zinc-400 group-hover:text-white transition-colors uppercase">
                        {dict.exploreSectionBtn}
                      </span>
                      <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center bg-white/5 group-hover:border-amber-400 group-hover:bg-amber-400 group-hover:text-black transition-all duration-300 group-hover:scale-110 shadow-md">
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
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

export default CategoryShowcase;
