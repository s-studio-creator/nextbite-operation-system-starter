# Architecture Decision Records

Each decision should use this format:

```md
## ADR-000: Title

**Decision**

**Reason**

**Alternatives Considered**

**Tradeoffs**

**Status**
```

## ADR-001: Use Expo Router

**Decision**

Use Expo Router as the navigation and routing foundation.

**Reason**

The app is organized around product surfaces such as Explore, Saved, Draw, Social, and Profile. File-based routing gives a clear structure for humans and AI agents.

**Alternatives Considered**

- Manual route state in `App.tsx`.
- React Navigation without Expo Router.

**Tradeoffs**

- Requires route files and Expo Router conventions.
- Improves scalability and keeps product screens discoverable.

**Status**

Accepted.

## ADR-002: Use TypeScript

**Decision**

Use TypeScript across the application.

**Reason**

The product needs clear contracts for restaurants, map coordinates, stores, and components. TypeScript helps AI agents make safer changes.

**Alternatives Considered**

- JavaScript-only implementation.

**Tradeoffs**

- Requires type maintenance.
- Reduces ambiguity in future refactors.

**Status**

Accepted.

## ADR-003: Use NativeWind Infrastructure

**Decision**

Install and configure NativeWind for future styling work.

**Reason**

NativeWind can improve styling consistency and speed for new components while preserving existing StyleSheet code.

**Alternatives Considered**

- StyleSheet only.
- A full component UI library.

**Tradeoffs**

- The repo currently uses a mixed styling model.
- New work should avoid inconsistency by following documented tokens.

**Status**

Accepted.

## ADR-004: Use Zustand for New Shared Client State

**Decision**

Use Zustand for new shared app state.

**Reason**

Zustand is lightweight and suitable for client-side product state such as selected restaurant and discovery data.

**Alternatives Considered**

- React Context.
- Redux.
- Keeping all state in route components.

**Tradeoffs**

- Store boundaries must stay disciplined.
- It avoids heavy state infrastructure before backend scope exists.

**Status**

Accepted.

## ADR-005: Use Mapbox as the Long-Term Map Engine

**Decision**

Use `@rnmapbox/maps` as the permanent map engine.

**Reason**

NextBite is map-first. Mapbox gives stronger long-term control over map styling, markers, camera behavior, and future exploration mechanics.

**Alternatives Considered**

- `react-native-maps`.
- Web map embedded views.

**Tradeoffs**

- Requires a Mapbox token.
- Does not run in Expo Go.
- Requires a development build.
- Provides better long-term product control.

**Status**

Accepted.

## ADR-006: Use Expo Project Structure

**Decision**

Keep the app inside an Expo-managed project structure with Expo config plugins for native modules.

**Reason**

Expo supports faster iteration while still allowing native modules such as Mapbox through development builds.

**Alternatives Considered**

- Bare React Native project.

**Tradeoffs**

- Native module changes require rebuilds.
- Expo tooling simplifies routing, config, and builds.

**Status**

Accepted.

## ADR-007: Use a Token-Based Design System Approach

**Decision**

Centralize product colors, spacing, radius, and elevation in `constants/theme.ts` and document the design system in `docs/DESIGN_SYSTEM.md`.

**Reason**

NextBite needs a consistent premium consumer design language. Tokens reduce visual drift and help AI agents avoid one-off styling.

**Alternatives Considered**

- Hardcoded styles in every component.
- Full external design-system package.

**Tradeoffs**

- Current implementation still contains legacy styles.
- Future work should migrate active surfaces gradually.

**Status**

Accepted.
