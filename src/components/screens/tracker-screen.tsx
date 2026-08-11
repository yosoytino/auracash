"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { MapPin, ScanFace, ShieldAlert } from "lucide-react";
import { PoweredByBadge } from "@/components/bank/powered-by-badge";
import { DeliveryMap } from "@/components/map/delivery-map-loader";
import { MapErrorBoundary } from "@/components/map/map-error-boundary";
import { MapFallback } from "@/components/map/map-fallback";
import { CancelDeliverySheet } from "@/components/screens/cancel-delivery-sheet";
import { TouchTarget } from "@/components/ui/touch-target";
import type { BankConfig } from "@/lib/bank-config";
import { DELIVERY_ADDRESS } from "@/lib/flow-state";
import { interpolateRoute } from "@/lib/map-route";
import { triggerHaptic } from "@/lib/haptics";

type TrackerScreenProps = {
  bank: BankConfig;
  onConfirmCancel: () => void;
  onHazardStop: () => void;
  onUnlock: () => void;
};

const HAZARD_ALERT_MS = 1800;

const TOTAL_ETA_SECONDS = 12;
const TRACK_DURATION_MS = 14000;
const PROGRESS_TICK_MS = 120;

export function TrackerScreen({
  bank,
  onConfirmCancel,
  onHazardStop,
  onUnlock,
}: TrackerScreenProps) {
  const reduceMotion = useReducedMotion();
  const hazardTimerRef = useRef<number | null>(null);
  const [progress, setProgress] = useState(0);
  const [etaSeconds, setEtaSeconds] = useState(TOTAL_ETA_SECONDS);
  const [isVerifying, setIsVerifying] = useState(false);
  const [hasSignaledArrival, setHasSignaledArrival] = useState(false);
  const [mapReady, setMapReady] = useState(false);
  const [showCancelSheet, setShowCancelSheet] = useState(false);
  const [showHazardAlert, setShowHazardAlert] = useState(false);

  const hasArrived = progress >= 1;
  const vehiclePosition = interpolateRoute(progress);
  const etaMinutes = hasArrived ? 0 : Math.max(1, etaSeconds);

  useEffect(() => {
    const mountTimer = window.setTimeout(() => setMapReady(true), 300);
    return () => window.clearTimeout(mountTimer);
  }, []);

  useEffect(() => {
    return () => {
      if (hazardTimerRef.current !== null) {
        window.clearTimeout(hazardTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const startTime = Date.now();

    const interval = window.setInterval(() => {
      const elapsed = Date.now() - startTime;
      const nextProgress = Math.min(elapsed / TRACK_DURATION_MS, 1);
      setProgress(nextProgress);
      setEtaSeconds(
        Math.max(0, Math.ceil(TOTAL_ETA_SECONDS * (1 - nextProgress))),
      );

      if (nextProgress >= 1) {
        window.clearInterval(interval);
      }
    }, PROGRESS_TICK_MS);

    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    if (hasArrived && !hasSignaledArrival) {
      triggerHaptic("success");
      setHasSignaledArrival(true);
    }
  }, [hasArrived, hasSignaledArrival]);

  const handleBiometric = () => {
    triggerHaptic("heavy");
    setIsVerifying(true);
    window.setTimeout(() => {
      triggerHaptic("success");
      setIsVerifying(false);
      onUnlock();
    }, 1200);
  };

  const handleSimulateHazard = () => {
    if (showHazardAlert) return;

    triggerHaptic("warning");
    setShowCancelSheet(false);
    setShowHazardAlert(true);

    hazardTimerRef.current = window.setTimeout(() => {
      triggerHaptic("error");
      onHazardStop();
    }, HAZARD_ALERT_MS);
  };

  return (
    <div className="relative flex min-h-full flex-col">
      <header className="border-b border-brand-navy/8 bg-white px-5 py-4">
        <PoweredByBadge bank={bank} />
        <h1 className="font-display mt-2 text-lg font-bold text-brand-navy">
          Live transit
        </h1>
        <p className="font-body mt-0.5 text-sm text-brand-navy/60">
          Tracking your autonomous cash delivery
        </p>
      </header>

      <div className="relative flex-1 overflow-hidden bg-brand-navy/5">
        <div className="relative mx-5 mt-6 aspect-[4/5] min-h-[280px] overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-brand-navy/10">
          <MapErrorBoundary progress={progress} hasArrived={hasArrived}>
            {mapReady ? (
              <DeliveryMap progress={progress} hasArrived={hasArrived} />
            ) : (
              <MapFallback progress={progress} hasArrived={hasArrived} />
            )}
          </MapErrorBoundary>

          <div
            className="pointer-events-none absolute left-1/2 z-[500] -translate-x-1/2 transition-all duration-300 ease-out"
            style={{
              top: hasArrived ? "18%" : "12%",
            }}
          >
            <div className="rounded-2xl bg-brand-navy px-4 py-2.5 shadow-xl">
              <p className="font-display whitespace-nowrap text-[11px] font-bold tracking-wide text-electric">
                ETA: {hasArrived ? "ARRIVED" : `${etaSeconds} MIN AWAY`}
              </p>
              <p className="font-body mt-0.5 flex items-center gap-1 whitespace-nowrap text-[10px] text-white/80">
                <MapPin className="h-3 w-3 shrink-0" aria-hidden="true" />
                {DELIVERY_ADDRESS}
              </p>
            </div>
            <div className="mx-auto h-0 w-0 border-x-8 border-t-8 border-x-transparent border-t-brand-navy" />
          </div>

          <div className="absolute bottom-4 left-4 right-4 z-[500] rounded-2xl bg-white/95 px-4 py-3 shadow-md backdrop-blur-sm">
            <p className="font-body text-xs font-medium text-brand-navy/60">
              Destination
            </p>
            <p className="font-display text-sm font-bold text-brand-navy">
              {DELIVERY_ADDRESS}
            </p>
            <p className="font-body mt-1 text-[10px] text-brand-navy/45">
              {vehiclePosition[0].toFixed(4)}°N ·{" "}
              {Math.abs(vehiclePosition[1]).toFixed(4)}°W
            </p>
          </div>
        </div>

        <div className="mx-5 mt-5 rounded-2xl border border-error/20 bg-error/5 px-4 py-3">
          <div className="flex items-start gap-3">
            <ShieldAlert
              className="mt-0.5 h-5 w-5 shrink-0 text-error"
              aria-hidden="true"
            />
            <div className="min-w-0 flex-1">
              <p className="font-display text-sm font-bold text-error">
                Safety valve
              </p>
              <p className="font-body mt-0.5 text-xs text-brand-navy/70">
                Cancel anytime if plans change or you feel unsafe.
              </p>
              <button
                type="button"
                onClick={handleSimulateHazard}
                disabled={showHazardAlert}
                className="font-body mt-3 text-left text-[11px] font-medium text-brand-navy/45 underline decoration-brand-navy/20 underline-offset-2 transition-colors hover:text-amber-700 hover:decoration-amber-400/50 disabled:opacity-50"
              >
                Simulate route safety event (demo)
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3 border-t border-brand-navy/8 bg-white px-5 py-4">
        <TouchTarget
          variant="danger"
          fullWidth
          haptic="error"
          onClick={() => setShowCancelSheet(true)}
        >
          Cancel Order
        </TouchTarget>

        <TouchTarget
          variant="success"
          fullWidth
          haptic={hasArrived ? "heavy" : false}
          disabled={!hasArrived || isVerifying}
          onClick={handleBiometric}
        >
          <ScanFace className="h-5 w-5" aria-hidden="true" />
          {isVerifying
            ? "Verifying…"
            : hasArrived
              ? "Unlock with Face ID"
              : "Awaiting arrival…"}
        </TouchTarget>
      </div>

      <CancelDeliverySheet
        open={showCancelSheet}
        etaMinutes={etaMinutes}
        onConfirm={() => {
          setShowCancelSheet(false);
          onConfirmCancel();
        }}
        onDismiss={() => setShowCancelSheet(false)}
      />

      <AnimatePresence>
        {showHazardAlert && (
          <motion.div
            role="alert"
            aria-live="assertive"
            className="absolute inset-0 z-[900] flex items-center justify-center bg-brand-navy/70 px-6 backdrop-blur-sm"
            initial={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-full max-w-sm rounded-3xl bg-brand-navy px-6 py-8 text-center shadow-2xl ring-1 ring-amber-400/30"
              initial={
                reduceMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.94 }
              }
              animate={{ opacity: 1, scale: 1 }}
              transition={
                reduceMotion
                  ? { duration: 0.12 }
                  : { type: "spring", stiffness: 420, damping: 32 }
              }
            >
              <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-400/15 ring-1 ring-amber-400/35">
                <ShieldAlert
                  className="h-7 w-7 text-amber-400"
                  aria-hidden="true"
                />
              </span>
              <p className="font-display text-lg font-bold text-white">
                Route safety event detected
              </p>
              <p className="font-body mt-2 text-sm leading-relaxed text-white/65">
                Halting your delivery as a precaution. Stand by…
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
