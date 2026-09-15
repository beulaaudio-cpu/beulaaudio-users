"use client";

import React, { useRef, useState, useCallback, ReactNode, HTMLAttributes } from "react";

interface SpotlightCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
  spotlightColor?: string; // e.g. "rgba(251, 191, 36, 0.35)" (Gold)
  borderGlowColor?: string; // e.g. "rgba(251, 191, 36, 0.55)"
  spotlightSize?: number;
}

/**
 * Windows 10 / Fluent Design "Reveal Highlight" Card
 * As the user hovers and moves across the box, a subtle spotlight emerges
 * and tracks the cursor, illuminating borders and corners near the pointer.
 */
export function SpotlightCard({
  children,
  className = "",
  spotlightColor = "rgba(251, 191, 36, 0.06)",
  borderGlowColor = "rgba(251, 191, 36, 0.45)",
  spotlightSize = 340,
  ...props
}: SpotlightCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: -1000, y: -1000 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      setPosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
      setOpacity(1);
    },
    []
  );

  const handleMouseLeave = useCallback(() => {
    setOpacity(0);
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden rounded-3xl p-[1px] transition-all duration-300 ${className}`}
      {...props}
    >
      {/* 1. Dynamic Border Reveal Spotlight (Windows 10 border light) */}
      <div
        className="pointer-events-none absolute inset-0 rounded-3xl transition-opacity duration-300"
        style={{
          opacity,
          background: `radial-gradient(${spotlightSize}px circle at ${position.x}px ${position.y}px, ${borderGlowColor}, transparent 70%)`,
        }}
        aria-hidden="true"
      />

      {/* 2. Static subtle border underneath */}
      <div
        className="pointer-events-none absolute inset-0 rounded-3xl border border-white/10"
        aria-hidden="true"
      />

      {/* 3. Inner Card Content with solid surface and edge border glow */}
      <div className="relative h-full w-full rounded-[calc(1.5rem-1px)] bg-[#09090b] transition-colors flex flex-col">
        <div className="relative z-10 flex flex-col flex-1 h-full w-full">{children}</div>
      </div>
    </div>
  );
}

export default SpotlightCard;
