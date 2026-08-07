"use client";

import { type ButtonHTMLAttributes, type ReactNode } from "react";
import { type HapticPattern, triggerHaptic } from "@/lib/haptics";

type TouchTargetProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: "primary" | "secondary" | "danger" | "ghost" | "success";
  fullWidth?: boolean;
  haptic?: HapticPattern | false;
};

const variantStyles: Record<NonNullable<TouchTargetProps["variant"]>, string> =
  {
    primary:
      "bg-brand-navy text-white hover:bg-brand-navy/90 active:bg-brand-navy/80",
    secondary:
      "bg-white text-brand-navy border-2 border-brand-navy/10 hover:border-electric/50 active:bg-surface-light",
    danger: "bg-error text-white hover:bg-error/90 active:bg-error/80",
    ghost:
      "bg-transparent text-brand-navy hover:bg-brand-navy/5 active:bg-brand-navy/10",
    success:
      "bg-success text-brand-navy hover:bg-success/90 active:bg-success/80 font-semibold",
  };

const defaultHaptic: Record<
  NonNullable<TouchTargetProps["variant"]>,
  HapticPattern
> = {
  primary: "medium",
  secondary: "light",
  danger: "warning",
  ghost: "light",
  success: "success",
};

export function TouchTarget({
  children,
  variant = "primary",
  fullWidth = false,
  haptic,
  className = "",
  onClick,
  ...props
}: TouchTargetProps) {
  const hapticPattern = haptic === false ? null : (haptic ?? defaultHaptic[variant]);

  return (
    <button
      type="button"
      onClick={(event) => {
        if (hapticPattern) triggerHaptic(hapticPattern);
        onClick?.(event);
      }}
      className={[
        "touch-press inline-flex min-h-[54px] min-w-[54px] items-center justify-center gap-2 rounded-2xl px-5 py-3",
        "font-body text-base font-semibold transition-[transform,background-color,box-shadow] duration-150",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-electric",
        "disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100",
        fullWidth ? "w-full" : "",
        variantStyles[variant],
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
