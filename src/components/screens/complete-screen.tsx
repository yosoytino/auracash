"use client";

import { CheckCircle2, Home, LockOpen, MapPin } from "lucide-react";
import { TouchTarget } from "@/components/ui/touch-target";
import { DELIVERY_ADDRESS, formatCurrency } from "@/lib/flow-state";

type CompleteScreenProps = {
  amount: number;
  onReturnHome: () => void;
};

export function CompleteScreen({ amount, onReturnHome }: CompleteScreenProps) {
  return (
    <div className="flex min-h-full flex-col items-center justify-center px-5 py-12">
      <div className="flex w-full max-w-sm flex-col items-center text-center">
        <div className="relative mb-6">
          <span className="flex h-24 w-24 items-center justify-center rounded-full bg-success/15">
            <LockOpen
              className="h-12 w-12 text-success"
              aria-hidden="true"
              strokeWidth={2}
            />
          </span>
          <CheckCircle2
            className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full bg-white text-success"
            aria-hidden="true"
          />
        </div>

        <span className="font-display mb-3 inline-flex min-h-[54px] items-center rounded-full bg-success/15 px-5 text-sm font-bold tracking-wide text-success">
          Delivered
        </span>

        <h1 className="font-display text-2xl font-bold text-brand-navy">
          Cash unlocked
        </h1>
        <p className="font-body mt-2 text-base text-brand-navy/60">
          Your withdrawal is ready. Thank you for using AuraCash.
        </p>

        <section
          aria-label="Transaction summary"
          className="mt-8 w-full rounded-3xl bg-white p-6 text-left shadow-sm ring-1 ring-brand-navy/5"
        >
          <h2 className="font-display mb-4 text-sm font-bold uppercase tracking-wide text-brand-navy/50">
            Transaction summary
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-body text-sm text-brand-navy/60">
                Amount
              </span>
              <span className="font-display text-lg font-bold text-brand-navy">
                {formatCurrency(amount)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-body text-sm text-brand-navy/60">
                Delivered to
              </span>
              <span className="font-body flex items-center gap-1 text-sm font-medium text-brand-navy">
                <MapPin className="h-3.5 w-3.5 text-electric" aria-hidden="true" />
                {DELIVERY_ADDRESS}
              </span>
            </div>
            <div className="flex items-center justify-between border-t border-brand-navy/8 pt-3">
              <span className="font-body text-sm text-brand-navy/60">Status</span>
              <span className="font-body text-sm font-semibold text-success">
                Complete
              </span>
            </div>
          </div>
        </section>

        <div className="mt-8 w-full">
          <TouchTarget variant="primary" fullWidth onClick={onReturnHome}>
            <Home className="h-5 w-5" aria-hidden="true" />
            Return to home
          </TouchTarget>
        </div>
      </div>
    </div>
  );
}
