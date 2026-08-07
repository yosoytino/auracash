"use client";

import { type ButtonHTMLAttributes, type ReactNode } from "react";
import { type HapticPattern, triggerHaptic } from "@/lib/haptics";

type PressableChipProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  selected?: boolean;
  haptic?: HapticPattern;
  /** primary = navy fill; accent = electric ring (bill denominations) */
  tone?: "primary" | "accent";
};

export function PressableChip({
  children,
  selected = false,
  haptic = "selection",
  tone = "primary",
  className = "",
  onClick,
  ...props
}: PressableChipProps) {
  const selectedStyles =
    tone === "accent"
      ? "bg-electric/20 text-brand-navy ring-2 ring-electric shadow-sm"
      : "bg-brand-navy text-white shadow-md";

  return (
    <button
      type="button"
      onClick={(event) => {
        triggerHaptic(haptic);
        onClick?.(event);
      }}
      className={[
        "touch-press flex min-h-[54px] min-w-[54px] w-full items-center justify-center rounded-2xl font-display text-base font-bold",
        "transition-all duration-150",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-electric",
        selected
          ? selectedStyles
          : "bg-surface-light text-brand-navy hover:bg-brand-navy/5",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {children}
    </button>
  );
}
