# NextBite AI Operating System v1

## Purpose

This workflow defines how NextBite is built.

GitHub is the single source of truth. Agents must not rely on chat memory when repository documents disagree with conversation.

## Operating Model

```text
Sammi Founder / CEO
  -> Hermes Project Manager recommends sprint
  -> Sammi approves sprint
  -> GitHub Repository
  -> CURRENT_SPRINT.md + Issues + Backlog
  -> OpenClaw Engineering
  -> Local Build + Typecheck
  -> GitHub Pull Request
  -> ChatGPT CTO + QA Review
  -> Sammi Approves Merge
  -> Sprint Complete
  -> Hermes Recommends Next Sprint
  -> Sammi Approves Next Sprint
```

## Roles

### Sammi: Founder / CEO

Owns:

- Vision.
- Roadmap.
- Priority.
- Sprint approval.
- Final product decisions.
- PR approval.
- Shipping decision.

Does not:

- Micromanage engineering.
- Need to write code.

### Hermes: Project Manager

Owns:

- Reading the roadmap and backlog.
- Recommending sprint candidates.
- Creating and updating `CURRENT_SPRINT.md`.
- Creating GitHub Issues.
- Tracking progress.
- Generating daily reports.

Cannot:

- Write code.
- Decide product direction.
- Decide the next sprint.
- Expand sprint scope without CEO approval.

### OpenClaw: Engineer

Owns:

- Reading `CURRENT_SPRINT.md`.
- Implementing only the current sprint.
- Running typecheck and required verification.
- Fixing implementation issues.
- Opening a pull request.

Cannot:

- Decide product direction.
- Add features outside the sprint.
- Redesign UX.
- Modify roadmap priorities.

### ChatGPT: CTO + QA Review

Owns:

- Architecture review.
- Code review.
- UX consistency review.
- Performance and risk review.
- Approve or reject recommendation.

Cannot:

- Merge without Sammi approval.
- Quietly expand product scope.

## Daily Workflow

### Morning

Hermes:

1. Read `ROADMAP.md`.
2. Read `BACKLOG.md`.
3. Recommend the next sprint.
4. Wait for Founder approval.
5. Create or update `CURRENT_SPRINT.md`.
6. Create or update GitHub Issues.
7. Confirm the sprint has one goal, completion criteria, and non-goals.

### Day

OpenClaw:

1. Read `CURRENT_SPRINT.md`.
2. Implement only the sprint.
3. Run typecheck.
4. Run required tests or build checks.
5. Fix issues.
6. Open a PR.

### Evening

Sammi:

1. Run the app.
2. Test the sprint outcome.
3. Record demo evidence when required.

ChatGPT:

1. Review architecture.
2. Review code.
3. Review UX.
4. Call out blockers.

### Night

1. Sammi approves or rejects merge.
2. If merged, the sprint is marked complete.
3. Hermes recommends the next sprint.
4. Sammi approves the next sprint.

## Sprint Lifecycle

```text
Backlog
  -> Current Sprint
  -> Engineering
  -> Testing
  -> Review
  -> Merge
  -> Release
  -> Next Sprint
```

## Sprint Start Questions

Every sprint starts with exactly three questions:

1. What is today's only goal?
2. What counts as complete?
3. What is not allowed?

## Release Notes Habit

Every completed sprint should create a GitHub release note.

Release note format:

```md
# Sprint 001

## Completed

- 

## Known Issues

- 

## Demo

- 
```

## Hard Rules

- AI agents do not decide product direction.
- Hermes recommends the next sprint; the Founder approves it.
- Agents read GitHub documents before acting.
- `CURRENT_SPRINT.md` controls engineering scope.
- Out-of-scope work must stop immediately.
- A sprint with clear 80 percent process is better than a perfect process nobody follows.
- Do not introduce automation before the manual loop is stable.
