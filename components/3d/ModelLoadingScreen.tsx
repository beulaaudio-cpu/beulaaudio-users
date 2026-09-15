"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ModelLoadingScreenProps {
  isLoaded: boolean;
}

export function ModelLoadingScreen({ isLoaded }: ModelLoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [show, setShow] = useState(true);

  // Animate a fake progress bar that accelerates then waits for real load
  useEffect(() => {
    if (isLoaded) return;
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 85) { clearInterval(interval); return 85; } // stall at 85% waiting for real load
        return p + Math.random() * 8;
      });
    }, 180);
    return () => clearInterval(interval);
  }, [isLoaded]);

  // When model is loaded, sprint to 100% then fade out
  useEffect(() => {
    if (!isLoaded) return;
    setProgress(100);
    const t = setTimeout(() => setShow(false), 900); // let bar fill then fade
    return () => clearTimeout(t);
  }, [isLoaded]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#040407] select-none"
        >
          {/* Ambient glow */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-amber-500/5 blur-[120px]" />
          </div>

          {/* Logo + Name */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center gap-6 relative z-10"
          >
            {/* Animated ring */}
            <div className="relative w-20 h-20">
              <svg
                viewBox="0 0 80 80"
                className="w-full h-full -rotate-90"
                fill="none"
              >
                {/* Track */}
                <circle cx="40" cy="40" r="34" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
                {/* Animated fill */}
                <motion.circle
                  cx="40"
                  cy="40"
                  r="34"
                  stroke="url(#amberGrad)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 34}`}
                  strokeDashoffset={`${2 * Math.PI * 34 * (1 - progress / 100)}`}
                  style={{ transition: "stroke-dashoffset 0.4s ease" }}
                />
                <defs>
                  <linearGradient id="amberGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#f59e0b" />
                    <stop offset="100%" stopColor="#fbbf24" />
                  </linearGradient>
                </defs>
              </svg>
              {/* Percent */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-mono text-xs text-amber-300 font-bold">
                  {Math.round(Math.min(progress, 100))}%
                </span>
              </div>
            </div>

            {/* Brand name */}
            <div className="text-center">
              <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-white uppercase leading-none drop-shadow-[0_0_30px_rgba(251,191,36,0.3)]">
                Beula Audio
              </h1>
              <p className="font-mono text-[10px] tracking-[0.3em] text-amber-400 uppercase mt-2">
                Professional Event Sound & Lighting
              </p>
            </div>

            {/* Status line */}
            <p className="font-mono text-[10px] tracking-[0.2em] text-zinc-500 uppercase mt-2">
              {isLoaded ? "Stage Ready" : "Loading Stage…"}
            </p>

            {/* Progress bar */}
            <div className="w-48 h-[2px] rounded-full bg-white/10 overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-amber-500 to-yellow-400"
                style={{ width: `${Math.min(progress, 100)}%`, transition: "width 0.4s ease" }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default ModelLoadingScreen;
