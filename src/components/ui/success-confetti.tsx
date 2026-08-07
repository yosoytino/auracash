"use client";

import { useEffect, useRef } from "react";
import confetti from "canvas-confetti";

const BRAND_COLORS = ["#00E676", "#00D2FF", "#0A2540", "#F4F6F9"];

export function SuccessConfetti() {
  const firedRef = useRef(false);

  useEffect(() => {
    if (firedRef.current) return;
    firedRef.current = true;

    const frame = requestAnimationFrame(() => {
      const burst = (particleRatio: number, opts: confetti.Options) => {
        confetti({
          ...opts,
          origin: { y: 0.62, x: 0.5 },
          colors: BRAND_COLORS,
          particleCount: Math.floor(140 * particleRatio),
          disableForReducedMotion: true,
        });
      };

      burst(0.25, { spread: 26, startVelocity: 52, scalar: 0.9 });
      burst(0.2, { spread: 60, startVelocity: 44 });
      burst(0.35, { spread: 100, decay: 0.91, scalar: 0.85 });
      burst(0.1, { spread: 120, startVelocity: 28, decay: 0.92, scalar: 1.1 });
      burst(0.1, { spread: 120, startVelocity: 38 });
    });

    return () => cancelAnimationFrame(frame);
  }, []);

  return null;
}
