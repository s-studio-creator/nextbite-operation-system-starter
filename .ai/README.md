# `.ai/` — AI Workspace

This directory is the AI-native operating system of NextBite.

Every AI agent reads from this directory before acting.

Everything an AI agent needs — role definition, context, prompts, memory, and team structure — lives here.

---

## Structure

```
.ai/
├── README.md          ← This file
├── agents/            ← Role process definitions (Hermes, OpenClaw, ChatGPT)
├── context/           ← Shared product context (vision, architecture, design, roadmap)
├── prompts/           ← Prompt templates (planner, engineer, reviewer, qa)
├── memory/            ← Persistent sprint memory (Sprint-XXX.md)
└── org/               ← Organization structure (CHART, ROLES, TIERS, RULES, AGENT_SELECTOR)
```

## Organization (`org/`)

| File | Purpose |
|------|---------|
| `CHART.md` | Full org chart — who reports to who |
| `ROLES.md` | Job descriptions for every role |
| `TIERS.md` | Priority tiers — who to activate when |
| `RULES.md` | Operating rules — fewest agents, scope protection, handoffs |
| `AGENT_SELECTOR.md` | Decision guide — which agents for which task |

## Agent Loop

```
.ai/context + .ai/org
    │  Agents read shared context + team structure
    ▼
📋 Hermes → CURRENT_SPRINT.md
    │  Plan the sprint
    ▼
💻 OpenClaw → Implementation → PR
    │  Build & validate
    ▼
🧠 ChatGPT → Review (CTO + QA + Product Critic)
    │  Challenge, verify, approve
    ▼
👩🏻 Sammi → Final Approval
    │  Founder decides
    ▼
🚀 Merge → .ai/memory/Sprint-XXX.md
    │  Record what happened
    ▼
Repeat
```

## Core Rules

1. **Fewest agents necessary** — every additional agent adds a handoff cost
2. **CURRENT_SPRINT.md is law** — nothing outside scope
3. **Repository is source of truth** — never rely on conversation memory
4. **Founder decides** — all final decisions belong to Sammi

See `.ai/org/RULES.md` for the full rule set.
