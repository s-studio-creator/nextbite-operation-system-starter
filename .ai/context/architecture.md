# Architecture Context

Source of truth: `docs/ARCHITECTURE.md`

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Expo SDK 54 |
| UI | React Native 0.81 + NativeWind |
| Navigation | Expo Router |
| State | Zustand |
| Map | Mapbox (`@rnmapbox/maps`) — long-term; current sprint may vary |
| Animation | Reanimated + Gesture Handler |
| Persistence | AsyncStorage (temporary until backend) |
| Data | Local mock data (no backend yet) |

## Key Constraints

- **Mapbox does not run in Expo Go** — development builds required
- **No backend yet** — all data is local mock data
- **No authentication yet** — no user accounts
- **TypeScript at module boundaries** — prefer explicit types

## Architecture Principles

- Keep Mapbox behind reusable map components
- Keep mock data clearly separated from future API boundaries
- Keep state local and explicit until a backend exists
- Prefer Expo Router for all navigation
- One primary purpose per screen

## Future Backend

Not planned until later sprints. When it arrives:
- Serverless (Supabase or Firebase likely)
- Restaurant data source integration
- User accounts + sync
- Recommendation services
