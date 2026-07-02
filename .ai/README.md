# `.ai/` — AI Workspace

This directory is the AI-native operating system of NextBite.

Every AI agent reads from this directory before acting.

Everything an AI agent needs — role definition, context, prompts, and memory — lives here.

---

## Structure

```
.ai/
├── README.md          ← This file
├── agents/            ← Role definitions (who each agent is)
├── context/           ← Shared product context (what the product is)
├── prompts/           ← Prompt templates (how agents should respond)
└── memory/            ← Persistent sprint memory (what happened)
```

## Agent Loop

```
.ai/context
    │  Agents read shared context
    ▼
Hermes → CURRENT_SPRINT.md
    │  Plan the sprint
    ▼
OpenClaw → Implementation → PR
    │  Build & validate
    ▼
ChatGPT → Review
    │  CTO + QA
    ▼
Merge → .ai/memory/Sprint-XXX.md
    │  Record what happened
    ▼
Repeat
```
