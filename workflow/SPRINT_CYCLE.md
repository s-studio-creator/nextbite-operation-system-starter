# Sprint Cycle

The full lifecycle of one NextBite sprint.

---

## 1. Sprint Planning (Hermes)

**Inputs:**
- CEO priorities from Sammi
- ROADMAP.md
- BACKLOG.md
- Previous sprint results from SPRINTS.md

**Outputs:**
- CURRENT_SPRINT.md (updated with new sprint scope)
- GitHub Issues created, one per task
- Labels applied: `sprint`, `sprint-000`

**Checklist:**
- [ ] Sprint goal is one clear sentence
- [ ] Scope is explicit — what's in AND what's out
- [ ] Definition of Done is measurable
- [ ] Each task has acceptance criteria
- [ ] Non-goals are documented to prevent scope creep

---

## 2. Implementation (OpenClaw)

**Inputs:**
- CURRENT_SPRINT.md
- GitHub Issues
- docs/AI_OPERATING_MANUAL.md
- docs/ARCHITECTURE.md
- docs/DESIGN_SYSTEM.md

**Outputs:**
- Code changes
- Pull Request

**Checklist:**
- [ ] Implements only current sprint scope
- [ ] Follows AI Operating Manual rules
- [ ] `npm run typecheck` passes
- [ ] `npx expo export --platform ios` passes (when needed)
- [ ] No unrelated refactors
- [ ] Docs updated if truth changed

---

## 3. Validation (CI)

**Inputs:**
- Pull Request

**Outputs:**
- CI check results (typecheck, export)

**Checks:**
- GitHub Actions: validate.yml (typecheck + export)
- GitHub Actions: sprint-scope-check.yml (scope reminder)

---

## 4. Review (ChatGPT — CTO + QA)

**Inputs:**
- Pull Request
- Acceptance criteria from issue
- Definition of Done from CURRENT_SPRINT.md
- Architecture and design docs

**Outputs:**
- Review comments
- Approve / Request Changes

**Checklist:**
- [ ] Architecture is sound
- [ ] Implementation matches scope
- [ ] No regressions introduced
- [ ] Edge cases handled
- [ ] Documentation matches implementation
- [ ] TypeScript quality is acceptable
- [ ] No future features leaked in

---

## 5. Approval (CEO — Sammi)

**Inputs:**
- PR with green CI
- ChatGPT approval

**Decision:**
- Approve merge
- OR request changes
- OR reject (return to backlog)

---

## 6. Merge & Close

**Actions:**
- Merge PR to main
- Close sprint task issues
- Update SPRINTS.md with completed work
- Move unfinished items back to BACKLOG.md

---

## 7. Retrospective

- What went well?
- What was blocked?
- What should change for next sprint?
- Record in SPRINTS.md

---

## Sprint Cadence

NextBite sprints are **outcome-based, not time-based**.

A sprint is complete when:
- All tasks in CURRENT_SPRINT.md meet their Definition of Done
- PRs are merged
- SPRINTS.md is updated

There is no fixed sprint length. Speed comes from small scope, not short deadlines.
