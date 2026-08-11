"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";
import { TouchTarget } from "@/components/ui/touch-target";
import { DELIVERY_ADDRESS } from "@/lib/flow-state";
import { triggerHaptic } from "@/lib/haptics";

type CancelDeliverySheetProps = {
  open: boolean;
  etaMinutes: number;
  onConfirm: () => void;
  onDismiss: () => void;
};

export function CancelDeliverySheet({
  open,
  etaMinutes,
  onConfirm,
  onDismiss,
}: CancelDeliverySheetProps) {
  const reduceMotion = useReducedMotion();

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            type="button"
            aria-label="Dismiss cancel dialog"
            className="absolute inset-0 z-[700] bg-brand-navy/55 backdrop-blur-sm"
            initial={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onDismiss}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="cancel-delivery-title"
            className="absolute inset-x-0 bottom-0 z-[800] rounded-t-3xl bg-brand-navy px-5 pb-8 pt-3 shadow-2xl"
            initial={reduceMotion ? { y: 0 } : { y: "100%" }}
            animate={{ y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { y: "100%" }}
            transition={
              reduceMotion
                ? { duration: 0.12 }
                : { type: "spring", stiffness: 420, damping: 36 }
            }
          >
            <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-white/20" />

            <div className="mb-5 flex justify-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-error/15 ring-1 ring-error/30">
                <AlertTriangle
                  className="h-7 w-7 text-error"
                  aria-hidden="true"
                />
              </span>
            </div>

            <h2
              id="cancel-delivery-title"
              className="font-display text-center text-xl font-bold text-white"
            >
              Cancel Delivery?
            </h2>
            <p className="font-body mt-3 text-center text-sm leading-relaxed text-white/70">
              Your secure cash delivery is {etaMinutes} minute
              {etaMinutes === 1 ? "" : "s"} away. Are you sure you want to
              cancel?
            </p>

            <div className="mt-5 rounded-2xl border border-error/35 bg-error/10 px-4 py-3">
              <p className="font-body text-center text-sm leading-relaxed text-error">
                A cancellation fee may apply if the vehicle is already en route.
              </p>
            </div>

            <p className="font-body mt-4 text-center text-xs text-white/40">
              Delivering to {DELIVERY_ADDRESS}
            </p>

            <div className="mt-6 space-y-3">
              <TouchTarget
                variant="danger"
                fullWidth
                haptic="warning"
                onClick={() => {
                  triggerHaptic("error");
                  onConfirm();
                }}
              >
                Yes, Cancel Order
              </TouchTarget>
              <button
                type="button"
                onClick={() => {
                  triggerHaptic("light");
                  onDismiss();
                }}
                className="touch-press font-body min-h-[54px] w-full rounded-2xl border-2 border-white/20 bg-transparent text-base font-semibold text-white transition-colors hover:bg-white/5"
              >
                Keep My Order
              </button>
            </div>

            <button
              type="button"
              onClick={onDismiss}
              aria-label="Close"
              className="absolute right-4 top-4 flex h-[44px] w-[44px] items-center justify-center rounded-full text-white/40 hover:bg-white/10 hover:text-white/70"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
