"use client";

import { ArrowLeft, Bot, MapPin } from "lucide-react";
import { PoweredByBadge } from "@/components/bank/powered-by-badge";
import { PressableChip } from "@/components/ui/pressable-chip";
import { TouchTarget } from "@/components/ui/touch-target";
import type { BankConfig } from "@/lib/bank-config";
import {
  DELIVERY_ADDRESS,
  type BillDenomination,
  formatCurrency,
  PRESET_AMOUNTS,
} from "@/lib/flow-state";
import { triggerHaptic } from "@/lib/haptics";

type AssistantScreenProps = {
  bank: BankConfig;
  amount: number;
  denomination: BillDenomination;
  onAmountChange: (amount: number) => void;
  onDenominationChange: (denomination: BillDenomination) => void;
  onConfirm: () => void;
  onBack: () => void;
};

const DENOMINATIONS: BillDenomination[] = [5, 10, 20];

export function AssistantScreen({
  bank,
  amount,
  denomination,
  onAmountChange,
  onDenominationChange,
  onConfirm,
  onBack,
}: AssistantScreenProps) {
  const billCount = amount / denomination;
  const isValidAmount = amount > 0 && amount % denomination === 0;

  return (
    <div className="flex min-h-full flex-col">
      <header className="border-b border-brand-navy/8 bg-white px-5 py-4">
        <div className="mb-3 flex items-center gap-2">
          <button
            type="button"
            onClick={onBack}
            aria-label={`Back to ${bank.name}`}
            className="touch-press flex h-[54px] w-[54px] shrink-0 items-center justify-center rounded-2xl text-brand-navy/70 hover:bg-brand-navy/5"
          >
            <ArrowLeft className="h-5 w-5" aria-hidden="true" />
          </button>
          <PoweredByBadge bank={bank} />
        </div>
        <div className="flex items-center gap-3">
          <span className="flex h-[54px] w-[54px] items-center justify-center rounded-2xl bg-electric/15">
            <Bot className="h-6 w-6 text-electric" aria-hidden="true" />
          </span>
          <div>
            <p className="font-display text-sm font-bold text-brand-navy">
              AuraCash Assistant
            </p>
            <p className="font-body flex items-center gap-1 text-xs text-brand-navy/60">
              <MapPin className="h-3 w-3 shrink-0" aria-hidden="true" />
              Delivering to {DELIVERY_ADDRESS}… (~12 min)
            </p>
          </div>
        </div>
      </header>

      <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5">
        <div className="flex gap-3">
          <span className="flex h-[54px] w-[54px] shrink-0 items-center justify-center rounded-full bg-brand-navy text-white">
            <Bot className="h-5 w-5" aria-hidden="true" />
          </span>
          <div className="max-w-[85%] rounded-3xl rounded-tl-lg bg-white px-5 py-4 shadow-sm ring-1 ring-brand-navy/5">
            <p className="font-body text-[15px] leading-relaxed text-brand-navy">
              How much cash would you like withdrawn today? I&apos;ll prepare
              the exact bill mix for your delivery.
            </p>
          </div>
        </div>

        <section
          aria-label="Withdrawal amount picker"
          className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-brand-navy/5"
        >
          <h2 className="font-display mb-4 text-base font-bold text-brand-navy">
            Withdrawal amount
          </h2>
          <div className="grid grid-cols-3 gap-3">
            {PRESET_AMOUNTS.map((preset) => (
              <PressableChip
                key={preset}
                selected={amount === preset}
                aria-pressed={amount === preset}
                onClick={() => onAmountChange(preset)}
              >
                {formatCurrency(preset)}
              </PressableChip>
            ))}
          </div>

          <label
            htmlFor="custom-amount"
            className="font-body mt-4 block text-sm font-medium text-brand-navy/70"
          >
            Custom amount
          </label>
          <div className="relative mt-2">
            <span className="font-body pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-brand-navy/50">
              $
            </span>
            <input
              id="custom-amount"
              type="number"
              min={1}
              step={1}
              value={amount}
              onChange={(e) => {
                const value = parseInt(e.target.value, 10);
                if (!Number.isNaN(value) && value > 0) {
                  triggerHaptic("selection");
                  onAmountChange(value);
                }
              }}
              className="font-display min-h-[54px] w-full rounded-2xl border-2 border-brand-navy/10 bg-surface-light pl-8 pr-4 text-lg font-bold text-brand-navy transition-[border-color,box-shadow] duration-150 focus:border-electric focus:outline-none focus:ring-2 focus:ring-electric/20"
            />
          </div>
        </section>

        <section
          aria-label="Bill denomination selector"
          className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-brand-navy/5"
        >
          <h2 className="font-display mb-4 text-base font-bold text-brand-navy">
            Bill denomination
          </h2>
          <div
            role="group"
            aria-label="Select bill denomination"
            className="grid grid-cols-3 gap-3"
          >
            {DENOMINATIONS.map((denom) => (
              <PressableChip
                key={denom}
                tone="accent"
                selected={denomination === denom}
                aria-pressed={denomination === denom}
                aria-label={`${denom} dollar bills`}
                onClick={() => onDenominationChange(denom)}
              >
                ${denom}
              </PressableChip>
            ))}
          </div>
          {isValidAmount && (
            <p className="font-body mt-3 text-sm text-brand-navy/60">
              {billCount} × ${denomination} bills
            </p>
          )}
          {!isValidAmount && amount > 0 && (
            <p className="font-body mt-3 text-sm text-error" role="alert">
              Amount must be divisible by ${denomination}
            </p>
          )}
        </section>
      </div>

      <div className="border-t border-brand-navy/8 bg-white px-5 py-4">
        <TouchTarget
          variant="primary"
          fullWidth
          haptic="success"
          disabled={!isValidAmount}
          onClick={onConfirm}
        >
          Confirm — {formatCurrency(amount)} in ${denomination} bills
        </TouchTarget>
      </div>
    </div>
  );
}
