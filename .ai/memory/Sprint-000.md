# Sprint 000 — Build the AI Operating System

## Goal

Set up the engineering OS that makes all future sprints repeatable.

## Completed

- [x] `.ai/` workspace — agents, context, prompts, memory
- [x] `.github/` templates — issue templates, PR template
- [x] CI workflows — typecheck + export validation
- [x] `BACKLOG.md` — sprint-queued tasks (Founder-owned)
- [x] `ICEBOX.md` — long-term ideas
- [x] `CURRENT_SPRINT.md` — Sprint 001 scope defined
- [x] Workflow documentation — agent roles, sprint cycle

## Decisions

- BACKLOG.md is Founder-owned; Hermes only suggests
- CODEOWNERS removed — not useful until team grows
- Sprint scope check workflow removed — CURRENT_SPRINT.md is the gate
- `.ai/` is the AI-native workspace — all agents read from here

## Lessons

- The `.ai/` directory pattern works as the AI equivalent of `.github/`
- Sprint 000 is worth doing before Sprint 001 — sets the foundation
- CTO review caught 3 structural improvements before they became tech debt

## Next

Sprint 001: Explore Foundation — Mapbox map + location + camera follow
