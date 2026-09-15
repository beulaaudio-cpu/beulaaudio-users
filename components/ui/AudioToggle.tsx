"use client";

import React, { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

export function AudioToggle() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const osc1Ref = useRef<OscillatorNode | null>(null);
  const osc2Ref = useRef<OscillatorNode | null>(null);

  useEffect(() => {
    // Check saved user preference
    const saved = localStorage.getItem("beula_audio_ambience");
    if (saved === "true") {
      // Browsers require gesture first, so we don't force autoplay immediately without user interaction
    }
  }, []);

  const startAtmosphericSynth = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;

      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }

      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      // Master gain node
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.001, ctx.currentTime);
      masterGain.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + 3);
      masterGain.connect(ctx.destination);
      gainNodeRef.current = masterGain;

      // Deep sub-bass warmth (55Hz - A1)
      const osc1 = ctx.createOscillator();
      osc1.type = "sine";
      osc1.frequency.setValueAtTime(55, ctx.currentTime);

      // Warm harmonic overtone (110Hz - A2) with soft detuning
      const osc2 = ctx.createOscillator();
      osc2.type = "triangle";
      osc2.frequency.setValueAtTime(110.5, ctx.currentTime);

      // Low-pass filter for velvety concert hall warmth
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(160, ctx.currentTime);
      filter.Q.setValueAtTime(2.0, ctx.currentTime);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(masterGain);

      osc1.start();
      osc2.start();

      osc1Ref.current = osc1;
      osc2Ref.current = osc2;
    } catch (e) {
      console.warn("Web Audio ambient setup:", e);
    }
  };

  const stopAtmosphericSynth = () => {
    if (gainNodeRef.current && audioCtxRef.current) {
      const ctx = audioCtxRef.current;
      gainNodeRef.current.gain.setValueAtTime(gainNodeRef.current.gain.value, ctx.currentTime);
      gainNodeRef.current.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.2);
      setTimeout(() => {
        try {
          osc1Ref.current?.stop();
          osc2Ref.current?.stop();
          osc1Ref.current?.disconnect();
          osc2Ref.current?.disconnect();
          osc1Ref.current = null;
          osc2Ref.current = null;
        } catch {
          // ignore
        }
      }, 1300);
    }
  };

  const toggleSound = () => {
    if (isPlaying) {
      stopAtmosphericSynth();
      setIsPlaying(false);
      localStorage.setItem("beula_audio_ambience", "false");
    } else {
      startAtmosphericSynth();
      setIsPlaying(true);
      localStorage.setItem("beula_audio_ambience", "true");
    }
  };

  return (
    <button
      onClick={toggleSound}
      data-cursor={isPlaying ? "MUTE" : "SOUND"}
      aria-label={isPlaying ? "Mute concert room ambience" : "Enable concert room ambience"}
      className="group relative flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-white/15 bg-black/60 backdrop-blur-md text-xs tracking-widest text-zinc-300 hover:text-white hover:border-white/40 transition-all duration-300 shadow-xl"
    >
      <span className="relative flex h-2 w-2">
        {isPlaying && (
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
        )}
        <span
          className={`relative inline-flex rounded-full h-2 w-2 transition-colors ${
            isPlaying ? "bg-amber-400" : "bg-zinc-600 group-hover:bg-zinc-400"
          }`}
        />
      </span>

      {isPlaying ? (
        <Volume2 className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
      ) : (
        <VolumeX className="w-3.5 h-3.5 text-zinc-400" />
      )}

      <span className="font-mono text-[10px] uppercase tracking-[0.2em]">
        {isPlaying ? "SOUND ON" : "STAGE AMBIENCE"}
      </span>
    </button>
  );
}
