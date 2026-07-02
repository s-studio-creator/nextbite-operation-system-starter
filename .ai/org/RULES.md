# S.STUDIO AI Studio — Operating Rules

---

## Rule 1: Fewest Agents Necessary

**Every task should involve the fewest number of AI agents necessary.**

Because every additional agent adds:
- One more handoff
- One more context switch
- One more surface for error

**Default sprint team (3 agents max):**
```
📋 Hermes (Plan)
💻 OpenClaw (Build)
🧠 ChatGPT (Review)
```

**Tier 2+ agents only join when their specific skill is required.**

---

## Rule 2: Scope Protection (Product Critic)

The **Product Critic** (ChatGPT) has veto power over sprint scope.

Before any feature enters a sprint, the Product Critic must answer:
- Does this improve the core exploration loop?
- Is this necessary for the current stage?
- What happens if we don't build this?

If the answer is "no" to any of these, the feature is **rejected or deferred.**

The Product Critic's job is to protect MVP scope — not to add features.

---

## Rule 3: CURRENT_SPRINT.md Is Law

- Hermes writes the sprint scope
- CTO (ChatGPT) approves the scope
- Product Critic (ChatGPT) challenges the scope
- OpenClaw implements only what's in CURRENT_SPRINT.md
- Anything not in CURRENT_SPRINT.md is out of scope

**Out-of-scope work must stop immediately.**

---

## Rule 4: One Agent, One Role Per Task

- ChatGPT as CTO does NOT also act as Research in the same task
- Gemini as Research does NOT also act as Designer in the same task
- Claude as Design does NOT also act as Engineer in the same task

Each agent plays exactly one role per task. No role-stacking.

---

## Rule 5: Handoff Protocol

When an agent completes its work:

1. Clearly state what was done
2. State what the next agent needs to know
3. Tag the next agent explicitly

**Example:**
```
OpenClaw → ChatGPT (QA):
"Implemented restaurant markers. 
Typecheck passes. 
Need review: marker selection state feels inconsistent. 
PR: #42"
```

---

## Rule 6: No Ghost Agents

If an agent is assigned to a task but not needed, remove them.

- Hermes should not be in every GitHub comment thread
- ChatGPT should not review trivial changes
- Codex should not approve PRs that don't touch infrastructure

---

## Rule 7: Founder Decides

All final decisions belong to Sammi.

- ChatGPT can recommend
- Product Critic can reject
- Hermes can propose

But only Sammi approves:
- Feature scope
- Sprint direction
- Merge to main
- Ship to users

---

## Rule 8: Move Fast, Not Perfect

A sprint with clear 80% process is better than a perfect process nobody follows.

- If a process step slows the team more than it helps, skip it
- Document skipped steps — add them back when they become necessary
- Speed comes from small scope, not tight deadlines

---

## Rule 9: Context Preservation

Every AI agent must read the relevant `.ai/` files before acting.

- `.ai/context/` — What the product is
- `.ai/org/` — Who does what
- `.ai/prompts/` — How to respond
- `.ai/memory/` — What happened before

**Do not rely on conversation memory. The repository is the source of truth.**
