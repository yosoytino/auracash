"use client";

import { type ReactNode } from "react";
import { triggerHaptic } from "@/lib/haptics";

type BankQuickActionProps = {
  label: string;
  icon: ReactNode;
  onClick?: () => void;
  highlight?: boolean;
  colors: {
    actionRing: string;
    actionIcon: string;
    text: string;
  };
};

export function BankQuickAction({
  label,
  icon,
  onClick,
  highlight = false,
  colors,
}: BankQuickActionProps) {
  return (
    <button
      type="button"
      onClick={() => {
        if (onClick) {
          triggerHaptic("medium");
          onClick();
        }
      }}
      disabled={!onClick}
      className={[
        "touch-press flex min-w-[72px] flex-1 flex-col items-center gap-2",
        onClick ? "cursor-pointer" : "cursor-default opacity-70",
      ].join(" ")}
    >
      <span
        className={[
          "flex h-[54px] w-[54px] items-center justify-center rounded-full",
          highlight ? "ring-2 ring-offset-2" : "",
        ].join(" ")}
        style={{
          backgroundColor: colors.actionRing,
          color: colors.actionIcon,
          ...(highlight
            ? { ringColor: colors.actionIcon, outlineColor: colors.actionIcon }
            : {}),
        }}
      >
        {icon}
      </span>
      <span
        className="font-body max-w-[80px] text-center text-[11px] font-medium leading-tight"
        style={{ color: colors.text }}
      >
        {label}
      </span>
    </button>
  );
}
