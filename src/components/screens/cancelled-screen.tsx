"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Bot, ShieldAlert, X } from "lucide-react";
import { TouchTarget } from "@/components/ui/touch-target";
import type { BankConfig } from "@/lib/bank-config";
import {
  DELIVERY_ADDRESS,
  type BillDenomination,
  type CancellationReason,
  formatCancelledDate,
  formatCancelledTime,
  formatCurrency,
} from "@/lib/flow-state";

type CancelledScreenProps = {
  bank: BankConfig;
  amount: number;
  denomination: BillDenomination;
  cancellationRef: string;
  cancelledAt: string;
  reason: CancellationReason;
  onReturnHome: () => void;
};

const springSoft = {
  type: "spring" as const,
  stiffness: 320,
  damping: 28,
  mass: 0.9,
};

export function CancelledScreen({
  bank,
  amount,
  denomination,
  cancellationRef,
  cancelledAt,
  reason,
  onReturnHome,
}: CancelledScreenProps) {
  const reduceMotion = useReducedMotion();
  const isHazard = reason === "hazard";

  const summaryRows: [string, string][] = [
    ["Date", formatCancelledDate(cancelledAt)],
    ["Time", formatCancelledTime(cancelledAt)],
    ["Delivery address", DELIVERY_ADDRESS],
    ["Denomination", `$${denomination} bills`],
    ...(isHazard
      ? ([["Reason", "Route safety event"]] as [string, string][])
      : []),
    [
      isHazard ? "Safety stop fee" : "Cancellation fee",
      isHazard ? "Waived" : "None applied",
    ],
    ["Reference", cancellationRef],
  ];

  return (
    <div className="flex min-h-full flex-col bg-brand-navy px-5 pb-10 pt-14">
      <motion.div
        className="flex flex-1 flex-col items-center"
        initial={reduceMotion ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={reduceMotion ? { duration: 0.15 } : springSoft}
      >
        <div className="relative mb-6">
          {isHazard ? (
            <>
              <span className="absolute inset-0 scale-150 rounded-full bg-amber-400/15 animate-pulse-ring" />
              <span className="absolute inset-0 scale-[1.85] rounded-full bg-amber-400/8 animate-pulse-ring" />
              <span className="relative flex h-20 w-20 items-center justify-center rounded-full bg-amber-500 shadow-lg ring-4 ring-amber-400/30">
                <ShieldAlert
                  className="h-10 w-10 text-white"
                  strokeWidth={2.25}
                  aria-hidden="true"
                />
              </span>
            </>
          ) : (
            <>
              <span className="absolute inset-0 scale-150 rounded-full bg-error/10 animate-pulse-ring" />
              <span className="absolute inset-0 scale-[1.85] rounded-full bg-error/5 animate-pulse-ring" />
              <span className="relative flex h-20 w-20 items-center justify-center rounded-full bg-error shadow-lg ring-4 ring-error/25">
                <X
                  className="h-10 w-10 text-white"
                  strokeWidth={2.5}
                  aria-hidden="true"
                />
              </span>
            </>
          )}
        </div>

        <h1 className="font-display text-center text-2xl font-bold text-white">
          {isHazard
            ? "Delivery stopped for your safety"
            : "Order Cancelled"}
        </h1>
        <p className="font-body mt-3 max-w-xs text-center text-sm leading-relaxed text-white/65">
          {isHazard ? (
            <>
              We detected a safety event on your delivery route and halted the
              order. No cash left the vault and your funds remain securely with{" "}
              {bank.name}.
            </>
          ) : (
            <>Your delivery has been safely stopped. No cash left the vault.</>
          )}
        </p>

        <section
          aria-label={
            isHazard ? "Stopped order summary" : "Cancelled order summary"
          }
          className="mt-8 w-full rounded-3xl bg-white/5 p-5 ring-1 ring-white/10"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-body text-[11px] font-semibold uppercase tracking-wider text-white/45">
                {isHazard ? "Stopped order" : "Cancelled order"}
              </p>
              <p className="font-display mt-1 text-3xl font-bold text-white">
                {formatCurrency(amount)}
              </p>
            </div>
            <span
              className={[
                "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5",
                isHazard ? "bg-amber-400/15" : "bg-error/15",
              ].join(" ")}
            >
              <span
                className={[
                  "h-2 w-2 rounded-full",
                  isHazard ? "bg-amber-400" : "bg-error",
                ].join(" ")}
                aria-hidden="true"
              />
              <span
                className={[
                  "font-body text-xs font-semibold",
                  isHazard ? "text-amber-300" : "text-error",
                ].join(" ")}
              >
                {isHazard ? "Stopped for safety" : "Cancelled"}
              </span>
            </span>
          </div>

          <dl className="mt-5 space-y-3 border-t border-white/10 pt-5">
            {summaryRows.map(([label, value]) => (
              <div
                key={label}
                className="flex items-center justify-between gap-4"
              >
                <dt className="font-body text-sm text-white/50">{label}</dt>
                <dd className="font-body text-right text-sm font-medium text-white">
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        {isHazard && (
          <section
            aria-label="What happens next"
            className="mt-5 w-full rounded-3xl bg-white/5 p-5 ring-1 ring-white/10"
          >
            <p className="font-body text-[11px] font-semibold uppercase tracking-wider text-white/45">
              What happens next
            </p>
            <ol className="font-body mt-4 space-y-3 text-sm leading-relaxed text-white/70">
              <li className="flex gap-3">
                <span className="font-display shrink-0 font-bold text-amber-300">
                  1
                </span>
                <span>
                  The hold on {formatCurrency(amount)} is being released. No
                  withdrawal was processed.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="font-display shrink-0 font-bold text-amber-300">
                  2
                </span>
                <span>{bank.name} has been notified automatically.</span>
              </li>
              <li className="flex gap-3">
                <span className="font-display shrink-0 font-bold text-amber-300">
                  3
                </span>
                <span>
                  A specialist may contact you within 24 hours if more
                  information is needed.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="font-display shrink-0 font-bold text-amber-300">
                  4
                </span>
                <span>
                  You can schedule a new delivery anytime from home.
                </span>
              </li>
            </ol>
          </section>
        )}

        <div className="mt-6 flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-electric/15 ring-1 ring-electric/30">
            <Bot className="h-5 w-5 text-electric" aria-hidden="true" />
          </span>
          <p className="font-body max-w-[240px] text-sm text-white/55">
            {isHazard
              ? `AuraCash Assistant logged this safety stop and shared details with ${bank.name}.`
              : "AuraCash Assistant has logged this cancellation"}
          </p>
        </div>
      </motion.div>

      <div className="mt-8 space-y-3">
        <TouchTarget
          variant="secondary"
          fullWidth
          className="!bg-white !text-brand-navy hover:!bg-white/90"
          onClick={onReturnHome}
        >
          Return to Home
        </TouchTarget>

        {isHazard && (
          <a
            href={`tel:8005550199`}
            className="touch-press font-body flex min-h-[54px] w-full items-center justify-center rounded-2xl border-2 border-white/20 bg-transparent text-base font-semibold text-white transition-colors hover:bg-white/5"
          >
            Contact support
          </a>
        )}
      </div>

      <p className="font-body mt-4 text-center text-[11px] text-white/35">
        {isHazard ? (
          <>
            This stop was automatic. Funds remain with {bank.name}. Any hold
            will clear within 1–2 business days.
          </>
        ) : (
          <>
            Funds remain securely with {bank.name}. No withdrawal was processed.
          </>
        )}
      </p>
    </div>
  );
}
