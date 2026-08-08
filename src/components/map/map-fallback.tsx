"use client";

import { DELIVERY_ADDRESS } from "@/lib/flow-state";

type MapFallbackProps = {
  progress: number;
  hasArrived: boolean;
};

export function MapFallback({ progress, hasArrived }: MapFallbackProps) {
  const pinLeft = 14 + progress * 68;
  const pinTop = 58 - progress * 38;

  return (
    <div className="relative h-full w-full bg-[#eef1f5]">
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M 14 58 Q 38 44 58 34 T 86 22"
          fill="none"
          stroke="#0A2540"
          strokeWidth="1.5"
          opacity="0.12"
        />
        <path
          d={`M 14 58 Q 38 44 58 34 T ${14 + progress * 72} ${58 - progress * 36}`}
          fill="none"
          stroke="#00D2FF"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>

      <div
        className="absolute flex h-[54px] w-[54px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-brand-navy shadow-lg"
        style={{ left: `${pinLeft}%`, top: `${pinTop}%` }}
      >
        {!hasArrived && (
          <span className="absolute inset-0 rounded-full bg-electric/25 animate-pulse-ring" />
        )}
        <span className="relative text-xs font-bold text-electric">AC</span>
      </div>

      <div className="absolute bottom-3 left-3 right-3 rounded-xl bg-white/90 px-3 py-2 text-center backdrop-blur-sm">
        <p className="font-body text-[10px] text-brand-navy/50">Simplified route view</p>
        <p className="font-display text-xs font-bold text-brand-navy">
          {DELIVERY_ADDRESS}
        </p>
      </div>
    </div>
  );
}
