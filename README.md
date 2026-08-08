# AuraCash — Autonomous Banking Concierge

High-fidelity mobile-first prototype for autonomous cash delivery banking.

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Mapbox setup (optional but recommended)

The live transit tracker uses **OpenStreetMap by default**. For polished Mapbox styling, you need one thing from Mapbox:

### What to provide

| Variable | Required? | Where to get it |
|---|---|---|
| `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN` | Yes, for Mapbox | [mapbox.com/account/access-tokens](https://account.mapbox.com/access-tokens/) |

### Setup steps

1. Create a free account at [mapbox.com](https://www.mapbox.com/)
2. Go to **Account → Access tokens**
3. Copy your **Default public token** (starts with `pk.`)
4. Create `.env.local` in the project root:

```bash
cp env.example .env.local
```

5. Paste your token:

```env
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=pk.your_token_here
```

6. Restart the dev server: `npm run dev`

### Optional: custom map style

Change the style in `.env.local`:

```env
NEXT_PUBLIC_MAPBOX_STYLE=mapbox/navigation-day-v1
```

Without a token, the app falls back to OpenStreetMap tiles automatically.

## Features

- **4-screen flow:** Dashboard → Assistant → Live Tracker → Delivery Complete
- **Framer Motion** spring transitions between screens
- **Haptic feedback** via Vibration API + visual press states
- **54×54px touch targets** for motor accessibility
- **Leaflet map** with Mapbox or OSM tiles
- **Confetti burst** on delivery complete (respects reduced motion)

## Tech stack

Next.js (App Router) · TypeScript · Tailwind CSS · Lucide React · Framer Motion · Leaflet · canvas-confetti
