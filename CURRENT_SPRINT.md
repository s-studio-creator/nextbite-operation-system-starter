# Current Sprint

## Sprint 000: Build the AI Operating System

## Goal

Set up the engineering OS — `.ai/` workspace, GitHub templates, CI workflows, and agent documentation — so that every future sprint follows the same repeatable process.

## Definition of Done

- `.ai/` workspace exists with agents, context, prompts, and memory directories
- All four sprint roles defined (Hermes, OpenClaw, ChatGPT, Founder)
- GitHub issue templates created (sprint task, bug report, feature request)
- PR template created with scope validation checklist
- CI workflows configured (typecheck + expo export)
- BACKLOG.md and ICEBOX.md established
- First sprint memory recorded in `.ai/memory/Sprint-000.md`

## Out of Scope

- Application features (Mapbox, maps, location, UI)
- Product design or architecture decisions
- Backend or authentication
- Any user-facing code

## Acceptance Criteria

- Git commit shows all new files: `.ai/`, `.github/`, `BACKLOG.md`, `ICEBOX.md`
- An AI agent reading `.ai/README.md` can understand its role and next action
- A new contributor can open a sprint task issue from the template
- A new PR automatically triggers typecheck validation

## OpenClaw Instruction

Read `.ai/agents/OpenClaw.md` and `.ai/prompts/engineer.md` before implementing. These define your role and process for all future sprints.

## Owner

Hermes planned this sprint. OpenClaw implemented.
Sammi (Founder/CEO) owns final approval.

## Sprint History

This sprint will be recorded in `.ai/memory/Sprint-000.md`.

---

*When Sprint 000 is done, switch to Sprint 001 scope below.*

---

## Sprint 001: Explore Foundation

**Note: Not yet active. Sprint 000 must complete first.**

### Goal

Make the Explore map foundation work on device.

The only user outcome for this sprint:

> The app opens to a Mapbox map, asks for location permission, shows the user's current location, and follows the user smoothly.

### Definition of Done

- App launches successfully in a development build.
- Mapbox map loads.
- User is asked for location permission.
- User grants location permission.
- Current location is displayed.
- Camera follows the user while moving.
- No blocking runtime errors.

### Out of Scope

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

### Acceptance Criteria

- Launch the app on a physical device or simulator using a development build.
- Confirm the map renders with Mapbox tiles.
- Confirm the app requests foreground location permission.
- Confirm the user location puck appears after permission is granted.
- Confirm the camera follows location changes.
- Capture a 15 second screen recording.

### OpenClaw Instruction

Read `CURRENT_SPRINT.md` and implement only this sprint. Stop immediately when all acceptance criteria are complete.

Do not build out-of-scope features.

### Demo Requirement

Deliver a 15 second screen recording showing:

- App launch.
- Map loaded.
- Location permission granted or already granted.
- Current location visible.
- Camera follow behavior.

### Known Constraints

- Mapbox does not run in Expo Go.
- Use a development build.
- `EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN` must be configured.
