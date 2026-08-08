/** Mapbox tile configuration — requires NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN. */

export const MAPBOX_ACCESS_TOKEN =
  process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN ?? "";

/** Light, low-detail style — Instacart-like muted delivery map aesthetic. */
export const MAPBOX_STYLE =
  process.env.NEXT_PUBLIC_MAPBOX_STYLE ?? "mapbox/light-v11";

export function getMapboxTileUrl(): string | null {
  if (!MAPBOX_ACCESS_TOKEN) return null;

  return `https://api.mapbox.com/styles/v1/${MAPBOX_STYLE}/tiles/512/{z}/{x}/{y}@2x?access_token=${MAPBOX_ACCESS_TOKEN}`;
}

export function isMapboxEnabled(): boolean {
  return MAPBOX_ACCESS_TOKEN.length > 0;
}

/** Carto Positron — minimal line detail, no labels; good OSM fallback. */
export const MINIMAL_TILE_URL =
  "https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png";

export const MINIMAL_TILE_ATTRIBUTION = "© CARTO © OpenStreetMap";
