"use client";

import { useEffect, useState } from "react";
import { MapPin, ScanFace, ShieldAlert } from "lucide-react";
import { DeliveryMap } from "@/components/map/delivery-map-loader";
import { TouchTarget } from "@/components/ui/touch-target";
import { DELIVERY_ADDRESS } from "@/lib/flow-state";
import { interpolateRoute } from "@/lib/map-route";
import { triggerHaptic } from "@/lib/haptics";

type TrackerScreenProps = {
  onCancel: () => void;
  onUnlock: () => void;
};

const TOTAL_ETA_SECONDS = 12;
const TRACK_DURATION_MS = 14000;

export function TrackerScreen({ onCancel, onUnlock }: TrackerScreenProps) {
  const [progress, setProgress] = useState(0);
  const [etaSeconds, setEtaSeconds] = useState(TOTAL_ETA_SECONDS);
  const [isVerifying, setIsVerifying] = useState(false);
  const [hasSignaledArrival, setHasSignaledArrival] = useState(false);

  const hasArrived = progress >= 1;
  const vehiclePosition = interpolateRoute(progress);

  useEffect(() => {
    const startTime = Date.now();

    const tick = () => {
      const elapsed = Date.now() - startTime;
      const nextProgress = Math.min(elapsed / TRACK_DURATION_MS, 1);
      setProgress(nextProgress);
      setEtaSeconds(
        Math.max(0, Math.ceil(TOTAL_ETA_SECONDS * (1 - nextProgress))),
      );

      if (nextProgress < 1) {
        requestAnimationFrame(tick);
      }
    };

    const frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
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
    setTimeout(() => {
      triggerHaptic("success");
      setIsVerifying(false);
      onUnlock();
    }, 1200);
  };

  return (
    <div className="flex min-h-full flex-col">
      <header className="border-b border-brand-navy/8 bg-white px-5 py-4">
        <h1 className="font-display text-lg font-bold text-brand-navy">
          Live transit
        </h1>
        <p className="font-body mt-0.5 text-sm text-brand-navy/60">
          Tracking your autonomous cash delivery
        </p>
      </header>

      <div className="relative flex-1 overflow-hidden bg-brand-navy/5">
        <div className="relative mx-5 mt-6 aspect-[4/5] overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-brand-navy/10">
          <DeliveryMap progress={progress} hasArrived={hasArrived} />

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
            <div>
              <p className="font-display text-sm font-bold text-error">
                Safety valve
              </p>
              <p className="font-body mt-0.5 text-xs text-brand-navy/70">
                Cancel anytime if plans change or you feel unsafe.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3 border-t border-brand-navy/8 bg-white px-5 py-4">
        <TouchTarget variant="danger" fullWidth haptic="error" onClick={onCancel}>
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
    </div>
  );
}
