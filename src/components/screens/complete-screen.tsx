"use client";

import { motion, useReducedMotion } from "framer-motion";
import { CheckCircle2, Home, LockOpen, MapPin } from "lucide-react";
import { SuccessConfetti } from "@/components/ui/success-confetti";
import { TouchTarget } from "@/components/ui/touch-target";
import { DELIVERY_ADDRESS, formatCurrency } from "@/lib/flow-state";

type CompleteScreenProps = {
  amount: number;
  onReturnHome: () => void;
};

const springBounce = {
  type: "spring" as const,
  stiffness: 340,
  damping: 18,
  mass: 0.95,
};

const springSoft = {
  type: "spring" as const,
  stiffness: 300,
  damping: 28,
  mass: 0.9,
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.38 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: springSoft,
  },
};

export function CompleteScreen({ amount, onReturnHome }: CompleteScreenProps) {
  const reduceMotion = useReducedMotion();

  return (
    <div className="relative flex min-h-full flex-col items-center justify-center px-5 py-12">
      <SuccessConfetti />

      <motion.div
        className="flex w-full max-w-sm flex-col items-center text-center"
        variants={reduceMotion ? undefined : containerVariants}
        initial={reduceMotion ? false : "hidden"}
        animate="visible"
      >
        <motion.div
          className="relative mb-6"
          variants={reduceMotion ? undefined : itemVariants}
        >
          <motion.span
            className="flex h-24 w-24 items-center justify-center rounded-full bg-success/15 ring-4 ring-success/10"
            initial={reduceMotion ? false : { scale: 0.35, rotate: -18 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={reduceMotion ? { duration: 0.15 } : springBounce}
          >
            <LockOpen
              className="h-12 w-12 text-success"
              aria-hidden="true"
              strokeWidth={2}
            />
          </motion.span>
          <motion.span
            initial={reduceMotion ? false : { scale: 0, opacity: 0, rotate: -90 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={
              reduceMotion
                ? { duration: 0.15 }
                : { ...springBounce, delay: 0.22 }
            }
            className="absolute -bottom-1 -right-1"
          >
            <CheckCircle2
              className="h-8 w-8 rounded-full bg-white text-success shadow-sm"
              aria-hidden="true"
            />
          </motion.span>
        </motion.div>

        <motion.span
          variants={reduceMotion ? undefined : itemVariants}
          className="font-display mb-3 inline-flex min-h-[54px] items-center rounded-full bg-success/15 px-5 text-sm font-bold tracking-wide text-success"
        >
          Delivered
        </motion.span>

        <motion.h1
          variants={reduceMotion ? undefined : itemVariants}
          className="font-display text-2xl font-bold text-brand-navy"
        >
          Cash unlocked
        </motion.h1>
        <motion.p
          variants={reduceMotion ? undefined : itemVariants}
          className="font-body mt-2 text-base text-brand-navy/60"
        >
          Your withdrawal is ready. Thank you for using AuraCash.
        </motion.p>

        <motion.section
          variants={reduceMotion ? undefined : itemVariants}
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
        </motion.section>

        <motion.div
          variants={reduceMotion ? undefined : itemVariants}
          className="mt-8 w-full"
        >
          <TouchTarget variant="primary" fullWidth onClick={onReturnHome}>
            <Home className="h-5 w-5" aria-hidden="true" />
            Return to home
          </TouchTarget>
        </motion.div>
      </motion.div>
    </div>
  );
}
