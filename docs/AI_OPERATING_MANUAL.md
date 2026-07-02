# AI Operating Manual

## Purpose

This manual defines how human developers and AI agents should work in this repository.

The repository is the source of truth. Agents must read the relevant docs before making product, design, or architecture changes.

## Team Structure

- CEO: owns product priorities and roadmap.
- CTO: owns architecture and technical quality.
- Engineer: implements production code.
- Designer: owns UX consistency and design system alignment.
- QA: verifies behavior, risks, and shipping quality.

Agent role definitions live in [`docs/agents`](agents/).

## Responsibilities

- Product work must align with [`PRODUCT_BIBLE.md`](PRODUCT_BIBLE.md).
- Technical work must align with [`ARCHITECTURE.md`](ARCHITECTURE.md).
- Design work must align with [`DESIGN_SYSTEM.md`](DESIGN_SYSTEM.md).
- Strategic work must update [`ROADMAP.md`](ROADMAP.md) when priorities change.
- Important technical choices must be recorded in [`DECISIONS.md`](DECISIONS.md).

## Communication Flow

1. CEO defines priority and success criteria.
2. CTO confirms architecture constraints and risk.
3. Designer confirms UX principles and design-system impact.
4. Engineer implements the smallest production-ready change.
5. QA verifies behavior, regressions, and Definition of Done.

## Sprint Workflow

1. Define Sprint Goal.
2. List scope and non-goals.
3. Implement only the agreed scope.
4. Run verification.
5. Record completed work, blockers, and demo link in [`SPRINTS.md`](SPRINTS.md).
6. Update decisions or roadmap when scope changes.

## Definition of Done

A task is done when:

- The implementation matches the requested scope.
- Product behavior is not changed outside the task.
- TypeScript passes.
- Relevant Expo export or runtime checks pass when possible.
- Documentation is updated when architecture, process, or product truth changes.
- No unrelated refactors are included.

## Rules

- Do not invent product features.
- Do not redesign the app without explicit instruction.
- Do not introduce backend integration until it is requested.
- Do not hardcode secrets.
- Do not use Expo Go for Mapbox validation; use a development build.
- Keep changes small, reviewable, and scoped.
- Preserve existing user work.

## Engineering Principles

- Prefer Expo Router for navigation.
- Prefer TypeScript types at module boundaries.
- Keep state local and explicit until a backend exists.
- Use Zustand for new shared client state.
- Keep Mapbox behind reusable map components.
- Keep mock data clearly separated from future API boundaries.
- Verify with `npm run typecheck`.

## Design Principles

- Usability over decoration.
- Timeless over trendy.
- Exploration before search.
- Food before interface.
- Every screen has one primary purpose.
- Health should be helpful, not clinical.
- Motion should clarify state or add restrained delight.

## Shipping Process

1. Confirm scope.
2. Implement.
3. Run `npm run typecheck`.
4. Run `npx expo export --platform ios` when dependencies, routing, native modules, or bundling are affected.
5. Update docs if product, architecture, or process changed.
6. Commit with a clear conventional message.
