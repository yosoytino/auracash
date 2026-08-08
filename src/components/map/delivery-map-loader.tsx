"use client";

import dynamic from "next/dynamic";

export const DeliveryMap = dynamic(
  () => import("./delivery-map").then((mod) => mod.DeliveryMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full min-h-[280px] w-full items-center justify-center bg-brand-navy/5">
        <div className="flex flex-col items-center gap-3">
          <span className="h-8 w-8 animate-spin rounded-full border-2 border-brand-navy/20 border-t-electric" />
          <p className="font-body text-sm text-brand-navy/50">Loading map…</p>
        </div>
      </div>
    ),
  },
);
