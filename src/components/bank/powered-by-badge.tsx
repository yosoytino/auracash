"use client";

import type { BankConfig } from "@/lib/bank-config";
import { poweredByLabel } from "@/lib/bank-config";

type PoweredByBadgeProps = {
  bank: BankConfig;
  variant?: "header" | "footer";
};

export function PoweredByBadge({
  bank,
  variant = "header",
}: PoweredByBadgeProps) {
  if (variant === "footer") {
    return (
      <p className="font-body text-center text-[11px] text-brand-navy/45">
        {poweredByLabel(bank.name)}
      </p>
    );
  }

  return (
    <p className="font-body text-[11px] font-medium text-brand-navy/50">
      {poweredByLabel(bank.name)}
    </p>
  );
}
