"use client";

import React, { useEffect, useState } from "react";

export function CustomCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [targetPos, setTargetPos] = useState({ x: -100, y: -100 });
  const [label, setLabel] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    // Disable on touch devices
    if (window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 1024) {
      setIsTouch(true);
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      setTargetPos({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);

      // Inspect hovered target for custom cursor label
      const target = e.target;
      if (target && target instanceof Element) {
        const cursorEl = target.closest("[data-cursor]");
        if (cursorEl) {
          const cursorText = cursorEl.getAttribute("data-cursor");
          setLabel(cursorText || null);
          setIsHovered(true);
          return;
        }

        const clickable = target.closest("button, a, input, select, textarea, [role='button']");
        if (clickable) {
          setLabel(null);
          setIsHovered(true);
          return;
        }
      }

      setLabel(null);
      setIsHovered(false);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [isVisible]);

  // Smooth lerp animation loop for physical, weighted follow
  useEffect(() => {
    if (isTouch) return;

    let animId: number;
    const lerp = () => {
      setPos((prev) => ({
        x: prev.x + (targetPos.x - prev.x) * 0.22,
        y: prev.y + (targetPos.y - prev.y) * 0.22,
      }));
      animId = requestAnimationFrame(lerp);
    };
    animId = requestAnimationFrame(lerp);
    return () => cancelAnimationFrame(animId);
  }, [targetPos, isTouch]);

  if (isTouch || !isVisible) return null;

  return (
    <div
      className="pointer-events-none fixed z-50 transition-opacity duration-300"
      style={{
        left: `${pos.x}px`,
        top: `${pos.y}px`,
        transform: "translate(-50%, -50%)",
        opacity: isVisible ? 1 : 0,
      }}
    >
      {label ? (
        <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/90 text-black shadow-2xl backdrop-blur-md animate-in fade-in zoom-in-90 duration-200">
          <span className="font-mono text-[10px] font-bold tracking-[0.2em] uppercase">
            {label}
          </span>
        </div>
      ) : (
        <div
          className={`rounded-full border border-white/60 transition-all duration-200 ease-out flex items-center justify-center ${
            isHovered
              ? "w-10 h-10 bg-white/10 backdrop-blur-[2px] border-white"
              : "w-4 h-4 bg-transparent"
          }`}
        >
          <div
            className={`rounded-full bg-white transition-all duration-200 ${
              isHovered ? "w-1.5 h-1.5" : "w-1 h-1"
            }`}
          />
        </div>
      )}
    </div>
  );
}
