# Project Decisions

## Project

- Project name: NextBite.
- Purpose: location-first food discovery through exploration instead of endless scrolling.
- Stage: early MVP.
- Execution principle: build one working feature at a time.

## Tech Stack

### Frontend

- Expo.
- React Native.
- TypeScript.
- Expo Router.
- NativeWind.
- Zustand.
- React Native Reanimated.
- React Native Gesture Handler.

### Map

- Long-term map engine: Mapbox.
- Current sprint: use whichever map setup is already configured. Do not block workflow setup because of map implementation state.

### Backend

- No backend yet.
- Restaurant data is local mock data.

## Repository

- GitHub repository already exists.
- Do not create another repository.
- Everything should happen inside this repository.

## Build Commands

Use these commands whenever validating work:

```sh
npm install
npm run typecheck
npx expo export --platform ios
```

If lint or test commands become available later, include them automatically.

## Role Decisions

### Founder

Sammi is CEO.

Owns:

- Vision.
- Roadmap.
- Product priorities.
- Final approval.
- Release approval.

The Founder is not responsible for technical architecture.

### Hermes

Hermes is the AI Project Manager.

Owns:

- Read roadmap.
- Read backlog.
- Recommend the next sprint.
- Update `CURRENT_SPRINT.md` after Founder approval.
- Break approved work into GitHub Issues.
- Track sprint progress.
- Generate daily reports.

Hermes must never:

- Write production code.
- Redesign the product.
- Decide the next sprint without Founder approval.

### OpenClaw

OpenClaw is the engineering agent.

Owns:

- Read `CURRENT_SPRINT.md`.
- Implement only the current sprint.
- Run validation.
- Fix implementation issues.
- Open pull requests.

OpenClaw must never:

- Change product direction.
- Start future features.

### ChatGPT

ChatGPT acts as virtual CTO.

Owns:

- Architecture.
- Product decisions.
- Code review.
- Technical review.
- QA review.
- Engineering guidance.

ChatGPT is currently human-in-the-loop.

Do not automate ChatGPT.

All final architectural decisions remain human approved.

## Workflow

```text
CEO
  -> Hermes recommends sprint
  -> Founder approves sprint
  -> CURRENT_SPRINT.md
  -> GitHub Issues
  -> OpenClaw
  -> Pull Request
  -> Build Validation
  -> ChatGPT Review
  -> Founder Approval
  -> Merge
  -> Next Sprint
```
