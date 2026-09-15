"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { Sparkles, ArrowRight, ArrowDown, Music2 } from "lucide-react";
import { useLanguage } from "../../lib/i18n/LanguageContext";

interface MobileHeroProps {
  onExplore: () => void;
  onOpenBooking?: () => void;
}

export function MobileHero({ onExplore, onOpenBooking }: MobileHeroProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const { dict } = useLanguage();

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Autoplay may be restricted on some devices until interaction
      });
    }
  }, []);

  return (
    <section className="relative w-full min-h-[92vh] flex flex-col justify-between pt-24 pb-12 px-6 overflow-hidden">
      {/* Background Mobile Atmosphere */}
      <div className="absolute inset-0 z-0 bg-black">
        <video
          ref={videoRef}
          src="/videos/beula-mobile-hero.mp4"
          poster="/images/hero-poster.webp"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          onLoadedData={() => setVideoLoaded(true)}
          onError={() => setVideoError(true)}
          className={`w-full h-full object-cover transition-opacity duration-1000 ${
            videoLoaded ? "opacity-45" : "opacity-0"
          }`}
        />

        {(!videoLoaded || videoError) && (
          <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-black to-zinc-950">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/15 via-transparent to-black" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px]" />
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black pointer-events-none" />
        <div className="absolute inset-0 bg-radial-vignette pointer-events-none" />
      </div>

      {/* Top Mobile Tag */}
      <div className="relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-amber-400/30 bg-black/60 backdrop-blur-md text-amber-300 font-mono text-[10px] tracking-[0.2em] uppercase">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>{dict.heroHeadline}</span>
        </div>
      </div>

      {/* Hero Typography with BORDERLESS BIGGER LOGO */}
      <div className="relative z-10 my-auto py-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="relative w-20 h-20 shrink-0">
            <Image
              src="/Logo/BeulaAudio-BlackBG.jpg"
              alt="Beula Audio Logo"
              fill
              sizes="80px"
              className="object-contain drop-shadow-[0_0_20px_rgba(251,191,36,0.35)]"
              priority
            />
          </div>
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-white uppercase leading-none">
              {dict.brandName}
            </h1>
            <p className="font-mono text-[10px] tracking-[0.2em] text-amber-300 uppercase mt-1 font-semibold">
              {dict.brandTagline}
            </p>
          </div>
        </div>

        <p className="font-sans text-sm text-zinc-300 leading-relaxed max-w-sm font-light">
          {dict.heroSubheadline}
        </p>

        {/* Mobile Action CTA */}
        <div className="mt-8 flex flex-col gap-3">
          <button
            onClick={onExplore}
            className="w-full py-4 rounded-full bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 text-black font-mono text-xs font-bold tracking-[0.2em] uppercase shadow-[0_0_25px_rgba(251,191,36,0.35)] flex items-center justify-center gap-2 active:scale-95 transition-all"
          >
            <Music2 className="w-4 h-4" />
            <span>{dict.heroExploreBtn}</span>
          </button>
        </div>
      </div>

      {/* Mobile Stats Footer */}
      <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between text-zinc-400 font-mono text-[10px] tracking-widest">
        <span>9+ YEARS</span>
        <span>/</span>
        <span>1,500+ EVENTS</span>
        <span>/</span>
        <span>100% RELIABLE</span>
      </div>
    </section>
  );
}

export default MobileHero;
