export type LatLng = [number, number];

/** Simulated depot → 142 Elmwood Dr route (Palo Alto area). */
export const ROUTE_WAYPOINTS: LatLng[] = [
  [37.4284, -122.1628],
  [37.4312, -122.1586],
  [37.4348, -122.1542],
  [37.4376, -122.1498],
  [37.4398, -122.1464],
  [37.4419, -122.143],
];

export const DEPOT_COORDS = ROUTE_WAYPOINTS[0];
export const DESTINATION_COORDS = ROUTE_WAYPOINTS[ROUTE_WAYPOINTS.length - 1];

export function interpolateRoute(progress: number): LatLng {
  const clamped = Math.max(0, Math.min(1, progress));
  const scaled = clamped * (ROUTE_WAYPOINTS.length - 1);
  const index = Math.floor(scaled);
  const fraction = scaled - index;

  if (index >= ROUTE_WAYPOINTS.length - 1) {
    return ROUTE_WAYPOINTS[ROUTE_WAYPOINTS.length - 1];
  }

  const [latA, lngA] = ROUTE_WAYPOINTS[index];
  const [latB, lngB] = ROUTE_WAYPOINTS[index + 1];

  return [latA + (latB - latA) * fraction, lngA + (lngB - lngA) * fraction];
}

export function routeBounds(): [[number, number], [number, number]] {
  const lats = ROUTE_WAYPOINTS.map(([lat]) => lat);
  const lngs = ROUTE_WAYPOINTS.map(([, lng]) => lng);
  const padding = 0.004;

  return [
    [Math.min(...lats) - padding, Math.min(...lngs) - padding],
    [Math.max(...lats) + padding, Math.max(...lngs) + padding],
  ];
}

export function completedRoute(progress: number): LatLng[] {
  const clamped = Math.max(0, Math.min(1, progress));
  const scaled = clamped * (ROUTE_WAYPOINTS.length - 1);
  const index = Math.floor(scaled);
  const fraction = scaled - index;

  const points: LatLng[] = ROUTE_WAYPOINTS.slice(0, index + 1);

  if (fraction > 0 && index < ROUTE_WAYPOINTS.length - 1) {
    points.push(interpolateRoute(clamped));
  }

  return points.length >= 2 ? points : [ROUTE_WAYPOINTS[0], interpolateRoute(clamped)];
}
