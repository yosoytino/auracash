"use client";

import { useEffect, useMemo, useRef } from "react";
import L from "leaflet";
import {
  MapContainer,
  Marker,
  Polyline,
  TileLayer,
  useMap,
} from "react-leaflet";
import {
  getMapboxTileUrl,
  isMapboxEnabled,
  MINIMAL_TILE_ATTRIBUTION,
  MINIMAL_TILE_URL,
} from "@/lib/mapbox-config";
import {
  completedRoute,
  DESTINATION_COORDS,
  interpolateRoute,
  routeBounds,
  ROUTE_WAYPOINTS,
} from "@/lib/map-route";

type DeliveryMapProps = {
  progress: number;
  hasArrived: boolean;
};

/** Fit map once on mount — avoid calling fitBounds every progress tick (crashes mobile). */
function MapViewportSync() {
  const map = useMap();
  const fittedRef = useRef(false);

  useEffect(() => {
    if (fittedRef.current) return;
    fittedRef.current = true;

    const bounds = L.latLngBounds(ROUTE_WAYPOINTS);
    map.fitBounds(bounds, { padding: [52, 52], animate: false });
  }, [map]);

  return null;
}

function createVehicleIcon() {
  return L.divIcon({
    className: "",
    html: `
      <div class="relative flex h-[54px] w-[54px] items-center justify-center">
        <span class="absolute inset-0 rounded-full bg-electric/25 animate-pulse-ring"></span>
        <span class="relative flex h-11 w-11 items-center justify-center rounded-full bg-brand-navy shadow-lg ring-2 ring-electric/60">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00D2FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C1.4 11.3 1 12.1 1 13v3c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>
        </span>
      </div>
    `,
    iconSize: [54, 54],
    iconAnchor: [27, 27],
  });
}

function createDestinationIcon() {
  return L.divIcon({
    className: "",
    html: `
      <div class="flex h-10 w-10 items-center justify-center rounded-full bg-success shadow-md ring-2 ring-white">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0A2540" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg>
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  });
}

export function DeliveryMap({ progress, hasArrived }: DeliveryMapProps) {
  const vehiclePosition = useMemo(() => interpolateRoute(progress), [progress]);
  const traveledRoute = useMemo(() => completedRoute(progress), [progress]);
  const bounds = useMemo(() => routeBounds(), []);
  const mapboxTileUrl = useMemo(() => getMapboxTileUrl(), []);
  const useMapbox = isMapboxEnabled() && mapboxTileUrl !== null;

  const vehicleIcon = useMemo(() => createVehicleIcon(), [hasArrived]);
  const destinationIcon = useMemo(() => createDestinationIcon(), []);

  return (
    <MapContainer
      bounds={bounds}
      className={`delivery-map h-full min-h-[280px] w-full ${useMapbox ? "delivery-map--mapbox" : "delivery-map--minimal"}`}
      zoomControl={false}
      attributionControl={false}
      scrollWheelZoom={false}
      dragging={false}
      doubleClickZoom={false}
      touchZoom={false}
    >
      <TileLayer
        url={useMapbox ? mapboxTileUrl : MINIMAL_TILE_URL}
        maxZoom={useMapbox ? 20 : 19}
        tileSize={512}
        zoomOffset={-1}
        {...(useMapbox ? {} : { subdomains: "abcd" })}
      />

      <Polyline
        positions={ROUTE_WAYPOINTS}
        pathOptions={{
          color: "#0A2540",
          weight: 4,
          opacity: 0.12,
          lineCap: "round",
          lineJoin: "round",
        }}
      />

      <Polyline
        positions={traveledRoute}
        pathOptions={{
          color: "#00D2FF",
          weight: 6,
          opacity: 0.88,
          lineCap: "round",
          lineJoin: "round",
        }}
      />

      <Marker position={DESTINATION_COORDS} icon={destinationIcon} />

      {!hasArrived && (
        <Marker
          position={vehiclePosition}
          icon={vehicleIcon}
          zIndexOffset={1000}
        />
      )}

      <MapViewportSync />

      <div className="map-attribution pointer-events-none absolute bottom-1 right-2 z-[600] rounded bg-white/80 px-1.5 py-0.5 text-[9px] text-brand-navy/45">
        {useMapbox ? "© Mapbox © OpenStreetMap" : MINIMAL_TILE_ATTRIBUTION}
      </div>
    </MapContainer>
  );
}
