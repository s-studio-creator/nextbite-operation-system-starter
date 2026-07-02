# Current Sprint

## Sprint 001: Explore Foundation

## Goal

Make the Explore map foundation work on device.

The only user outcome for this sprint:

> The app opens to a Mapbox map, asks for location permission, shows the user's current location, and follows the user smoothly.

## Definition of Done

- App launches successfully in a development build.
- Mapbox map loads.
- User is asked for location permission.
- User grants location permission.
- Current location is displayed.
- Camera follows the user while moving.
- No blocking runtime errors.

## Out of Scope

- Restaurant markers.
- Restaurant bottom sheet.
- Draw.
- Saved.
- Social.
- Profile.
- Backend.
- Authentication.
- Search.
- New design system work.
- New product features.

## Acceptance Criteria

- Launch the app on a physical device or simulator using a development build.
- Confirm the map renders with Mapbox tiles.
- Confirm the app requests foreground location permission.
- Confirm the user location puck appears after permission is granted.
- Confirm the camera follows location changes.
- Capture a 15 second screen recording.

## OpenClaw Instruction

Read `CURRENT_SPRINT.md` and implement only this sprint. Stop immediately when all acceptance criteria are complete.

Do not build out-of-scope features.

## Demo Requirement

Deliver a 15 second screen recording showing:

- App launch.
- Map loaded.
- Location permission granted or already granted.
- Current location visible.
- Camera follow behavior.

## Known Constraints

- Mapbox does not run in Expo Go.
- Use a development build.
- `EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN` must be configured.
