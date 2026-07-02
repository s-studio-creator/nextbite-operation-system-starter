# NextBite Engineering Operating System

This is the AI-first engineering operating system for NextBite.

Every sprint follows the same repeatable process. Each role has clear boundaries. The repository is the single source of truth.

---

## The Workflow

```
CEO (Sammi)
  │  Decide WHAT to build
  ▼
Hermes (AI PM)
  │  Decide HOW to organize work
  ▼
CURRENT_SPRINT.md + GitHub Issues
  │  Single source of truth for active sprint
  ▼
OpenClaw (Engineering)
  │  Implement ONLY current sprint
  ▼
Build Validation (Local + CI)
  │  typecheck → export → PR
  ▼
ChatGPT (CTO + QA Review)
  │  Code review + technical review
  ▼
CEO Approval (Sammi)
  │  Final sign-off
  ▼
Merge → Sprint Complete → Next Sprint
```

---

## Roles

| Role | Who | Responsibility |
|------|-----|---------------|
| CEO | Sammi | Vision, roadmap, priorities, final approval |
| PM | Hermes | Sprint planning, issue creation, progress tracking |
| Engineering | OpenClaw | Implement current sprint, validate, PR |
| CTO + QA | ChatGPT | Architecture, code review, QA review |

---

## Files & Templates

| File | Purpose |
|------|---------|
| `CURRENT_SPRINT.md` | Active sprint scope, goal, Definition of Done |
| `BACKLOG.md` | Future sprints queued by Hermes |
| `ICEBOX.md` | Long-term ideas, not yet prioritized |
| `docs/ROADMAP.md` | High-level product milestones |
| `docs/SPRINTS.md` | Sprint history and template |
| `.github/ISSUE_TEMPLATE/` | Sprint task, bug report, feature request templates |
| `.github/PULL_REQUEST_TEMPLATE.md` | PR structure |
| `.github/CODEOWNERS` | File ownership for review workflow |
| `.github/workflows/validate.yml` | CI: typecheck + export on PRs |
| `.github/workflows/sprint-scope-check.yml` | CI: scope reminder on PRs |
| `docs/agents/` | Role definitions (CEO, CTO, Engineer, Designer, QA) |
| `docs/AI_OPERATING_MANUAL.md` | Operating rules for all AI agents |

---

## Principles

1. **One sprint at a time.** OpenClaw never builds future features.
2. **Issues are tasks.** Every PR closes at least one sprint task issue.
3. **Typecheck must pass.** `npm run typecheck` is the gate.
4. **Small PRs.** One logical change per PR. No unrelated refactors.
5. **Docs are truth.** AI agents read docs before acting. Update docs when truth changes.
6. **Human in the loop.** ChatGPT reviews, Sammi approves. No auto-merge.
