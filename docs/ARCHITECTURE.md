# Architecture

## Current Implementation

NextBite is an Expo React Native application using Expo Router and TypeScript.

The repository is in a transition state:

- New product architecture lives in root-level `app/`, `components/`, `constants/`, `hooks/`, `stores/`, and `types/`.
- Existing legacy implementation remains in `src/` and includes older screens, storage modules, data, and utilities.
- Explore is the current product foundation and uses Mapbox.

## Expo Router

Current route structure:

- `app/_layout.tsx` - root stack layout.
- `app/index.tsx` - redirects to Explore.
- `app/(tabs)/_layout.tsx` - tab layout.
- `app/(tabs)/explore.tsx` - current Explore foundation.
- `app/(tabs)/saved.tsx` - placeholder route shell.
- `app/(tabs)/draw.tsx` - placeholder route shell.
- `app/(tabs)/social.tsx` - placeholder route shell.
- `app/(tabs)/profile.tsx` - placeholder route shell.

Explore currently hides the tab bar so the map owns the screen.

## Folder Structure

- `app/` - route files.
- `components/map/` - Mapbox map abstraction and restaurant markers.
- `components/restaurant/` - restaurant cards and bottom sheet.
- `components/draw/` - discovery card.
- `components/common/` - route shell and placeholder cards.
- `constants/` - theme tokens, Mapbox config, and mock restaurant data.
- `hooks/` - shared hooks such as `useRestaurants`.
- `stores/` - Zustand stores.
- `types/` - shared TypeScript types.
- `src/` - legacy implementation from the previous product iteration.

## State Management

Current new state:

- `stores/useDiscoveryStore.ts` uses Zustand.
- It stores local mock restaurants and selected restaurant state.

Existing legacy state:

- `src/storage/` contains AsyncStorage-backed modules for auth, profile, meals, saved restaurants, wellness, dialogue, and memories.

Planned consolidation:

- Move active product state into focused Zustand stores.
- Keep persistence modules modular.
- Avoid backend coupling until backend scope is explicitly approved.

## NativeWind

NativeWind is installed and configured:

- `tailwind.config.js`
- `global.css`
- `metro.config.js`
- `nativewind-env.d.ts`

Current UI still uses a mix of StyleSheet and NativeWind-ready infrastructure. New components may use NativeWind where it improves consistency.

## Map Integration

Mapbox is the long-term map engine.

Current files:

- `constants/mapbox.ts`
- `components/map/Map.tsx`
- `components/map/RestaurantMarker.tsx`
- `app/(tabs)/explore.tsx`

Mapbox setup:

- Package: `@rnmapbox/maps`.
- Expo config plugin is configured in `app.json`.
- Runtime token uses `EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN`.
- Mapbox requires a development build and does not run in Expo Go.

Current behavior:

- Full-screen map.
- Location permission request.
- User location puck.
- Camera follows user.
- Five mock restaurant markers.
- Marker tap opens restaurant bottom sheet.

## Components

Current new components:

- `Map`
- `RestaurantMarker`
- `RestaurantBottomSheet`
- `RestaurantCard`
- `DiscoveryCard`
- `ScreenShell`
- `PlaceholderCard`

Component direction:

- Keep product components reusable.
- Prefer props over hidden global assumptions.
- Keep Mapbox-specific details inside map components.

## Hooks

Current hook:

- `hooks/useRestaurants.ts` reads restaurant data from the discovery store.

Planned hook direction:

- Use hooks for composed state and view-specific data derivation.
- Avoid duplicating backend or persistence logic in route files.

## Data Flow

Current Explore flow:

1. `useDiscoveryStore` exposes mock restaurant data and selected restaurant state.
2. `useRestaurants` returns restaurant list.
3. `ExploreRoute` requests location permission and manages follow state.
4. `Map` renders Mapbox map, location puck, and markers.
5. Marker selection updates selected restaurant.
6. `RestaurantBottomSheet` renders decision details and Walk There action.

## Future Backend

No backend exists today.

Future backend plans should be added only when approved. Likely future areas:

- Restaurant source and enrichment.
- Saved/imported restaurant extraction.
- User accounts.
- Social challenges.
- Collections and achievements.
- Recommendation and Draw logic.

Backend work must preserve local-first development until scope changes.
