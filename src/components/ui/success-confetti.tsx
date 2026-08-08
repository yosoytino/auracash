"use client";

import { useEffect } from "react";
import confetti from "canvas-confetti";
import { useReducedMotion } from "framer-motion";

const BRAND_COLORS = ["#00E676", "#00D2FF", "#0A2540", "#F4F6F9"];

/** Delay so confetti fires after the screen spring transition finishes. */
const CONFETTI_DELAY_MS = 520;

function fireSuccessBurst() {
  const defaults: confetti.Options = {
    origin: { y: 0.55, x: 0.5 },
    colors: BRAND_COLORS,
    zIndex: 9999,
    disableForReducedMotion: false,
  };

  const burst = (particleRatio: number, opts: confetti.Options) => {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(160 * particleRatio),
    });
  };

  burst(0.25, { spread: 26, startVelocity: 55, scalar: 0.95 });
  burst(0.2, { spread: 62, startVelocity: 48 });
  burst(0.35, { spread: 105, decay: 0.9, scalar: 0.88 });
  burst(0.1, { spread: 125, startVelocity: 32, decay: 0.91, scalar: 1.15 });
  burst(0.1, { spread: 130, startVelocity: 42 });
}

export function SuccessConfetti() {
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) return;

    let cancelled = false;

    const timer = window.setTimeout(() => {
      if (!cancelled) fireSuccessBurst();
    }, CONFETTI_DELAY_MS);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [reduceMotion]);

  return null;
}
