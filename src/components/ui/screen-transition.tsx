"use client";

import { type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { FlowStage } from "@/lib/flow-state";

export type TransitionDirection = "forward" | "back";

const STAGE_ORDER: Record<FlowStage, number> = {
  bank_home: 0,
  dashboard: 1,
  assistant: 2,
  tracker: 3,
  complete: 4,
  cancelled: 4,
};

export function getTransitionDirection(
  from: FlowStage,
  to: FlowStage,
): TransitionDirection {
  return STAGE_ORDER[to] >= STAGE_ORDER[from] ? "forward" : "back";
}

const springTransition = {
  type: "spring" as const,
  stiffness: 420,
  damping: 38,
  mass: 0.85,
};

type ScreenTransitionProps = {
  stage: FlowStage;
  direction: TransitionDirection;
  children: ReactNode;
};

export function ScreenTransition({
  stage,
  direction,
  children,
}: ScreenTransitionProps) {
  const reduceMotion = useReducedMotion();
  const dir = direction === "forward" ? 1 : -1;

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={stage}
        initial={
          reduceMotion
            ? { opacity: 0 }
            : { opacity: 0, x: dir * 48, scale: 0.985 }
        }
        animate={{ opacity: 1, x: 0, scale: 1 }}
        exit={
          reduceMotion
            ? { opacity: 0 }
            : { opacity: 0, x: dir * -32, scale: 0.99 }
        }
        transition={
          reduceMotion ? { duration: 0.12, ease: "easeOut" } : springTransition
        }
        className="min-h-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
