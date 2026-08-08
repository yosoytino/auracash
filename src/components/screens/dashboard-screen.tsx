"use client";

import { Banknote, ChevronRight, Sparkles } from "lucide-react";
import { AVAILABLE_BALANCE, formatCurrency } from "@/lib/flow-state";
import { triggerHaptic } from "@/lib/haptics";

type DashboardScreenProps = {
  onScheduleDelivery: () => void;
};

export function DashboardScreen({ onScheduleDelivery }: DashboardScreenProps) {
  return (
    <div className="flex min-h-full flex-col px-5 pb-8 pt-12">
      <header className="mb-8">
        <p className="font-body text-sm font-medium text-brand-navy/60">
          Good afternoon
        </p>
        <h1 className="font-display mt-1 text-2xl font-bold tracking-tight text-brand-navy">
          AuraCash
        </h1>
      </header>

      <section
        aria-label="Available balance"
        className="mb-8 rounded-3xl bg-brand-navy p-6 text-white shadow-lg shadow-brand-navy/20"
      >
        <p className="font-body text-sm font-medium text-white/70">
          Available balance
        </p>
        <p className="font-display mt-2 text-4xl font-bold tracking-tight">
          {formatCurrency(AVAILABLE_BALANCE)}
        </p>
        <div className="mt-4 flex items-center gap-2 text-sm text-electric">
          <Sparkles className="h-4 w-4" aria-hidden="true" />
          <span className="font-body">Autonomous concierge active</span>
        </div>
      </section>

      <section aria-label="Quick actions" className="flex-1">
        <h2 className="font-display mb-4 text-lg font-semibold text-brand-navy">
          Quick actions
        </h2>

        <button
          type="button"
          onClick={() => {
            triggerHaptic("medium");
            onScheduleDelivery();
          }}
          className="touch-press tile-press group relative z-10 flex min-h-[54px] w-full cursor-pointer items-center gap-4 rounded-3xl bg-white p-5 text-left shadow-sm ring-1 ring-brand-navy/5 transition-all duration-150 hover:shadow-md hover:ring-electric/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-electric"
        >
          <span className="flex h-[54px] w-[54px] shrink-0 items-center justify-center rounded-2xl bg-electric/15 text-electric">
            <Banknote className="h-6 w-6" aria-hidden="true" />
          </span>
          <span className="flex-1">
            <span className="font-display block text-base font-bold text-brand-navy">
              AC Schedule Cash Delivery
            </span>
            <span className="font-body mt-0.5 block text-sm text-brand-navy/60">
              Autonomous vehicle to your door
            </span>
          </span>
          <ChevronRight
            className="h-5 w-5 shrink-0 text-brand-navy/40 transition-transform group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </button>
      </section>

      <footer className="mt-8 text-center">
        <p className="font-body text-xs text-brand-navy/40">
          FDIC insured · AuraCash v1.0 prototype
        </p>
      </footer>
    </div>
  );
}
