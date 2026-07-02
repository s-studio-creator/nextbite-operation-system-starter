# NextBite

NextBite is a premium consumer mobile app for real-world food exploration. The product helps users decide what to eat by making nearby restaurants feel discoverable, collectible, and motivating.

## Tech Stack

- Expo SDK 54
- React Native 0.81
- Expo Router
- TypeScript
- NativeWind
- Zustand
- Mapbox via `@rnmapbox/maps`
- Reanimated and Gesture Handler
- AsyncStorage for existing local persistence modules

## Folder Structure

- `app/` - Expo Router routes and tab structure.
- `components/` - New reusable product components.
- `constants/` - Theme, Mapbox, and local mock data.
- `hooks/` - Shared React hooks.
- `stores/` - Zustand state stores.
- `types/` - Shared TypeScript types.
- `src/` - Existing legacy screens, storage, data, and utilities being consolidated over time.
- `docs/` - Product, architecture, design, process, roadmap, and AI-agent operating documentation.
- `workflow/` - AI operating loop and sprint process.
- `prompts/` - Role prompts for Hermes, OpenClaw, and ChatGPT review.

## Development Setup

1. Install dependencies:

```sh
npm install
```

2. Configure Mapbox:

```sh
cp .env.example .env
```

Set `EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN` to a valid Mapbox public token.

3. Run typecheck:

```sh
npm run typecheck
```

4. Start Expo:

```sh
npm run start
```

Mapbox does not run in Expo Go. Use a development build for device testing.

## Documentation

- [Product Bible](docs/PRODUCT_BIBLE.md)
- [AI Operating Manual](docs/AI_OPERATING_MANUAL.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Design System](docs/DESIGN_SYSTEM.md)
- [Roadmap](docs/ROADMAP.md)
- [Decisions](docs/DECISIONS.md)
- [Sprints](docs/SPRINTS.md)
- [Agent Roles](docs/agents/)
- [AI Operating System](workflow/AI_OPERATING_SYSTEM.md)
- [Current Sprint](CURRENT_SPRINT.md)
- [Backlog](BACKLOG.md)
- [Icebox](ICEBOX.md)
