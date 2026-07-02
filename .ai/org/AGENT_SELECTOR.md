# Agent Selector

When starting a task, use this guide to decide which agents to involve.

**Principle:** Involve the fewest agents necessary.

---

## Feature Implementation

**Example:** Restaurant markers, bottom sheet, detail page

```
📋 Hermes → Plan sprint, create issues
💻 OpenClaw → Implement
🧠 ChatGPT → QA + Code Review
👩🏻 Sammi → Approve
```

**No one else needed.** Claude, Gemini, Codex stay out.

---

## Bug Fix

**Example:** Map not loading, crash on permission deny

```
💻 OpenClaw → Fix bug
🧠 ChatGPT → Quick QA review
```

Hermes just tracks it. No planning needed.

---

## Architecture Decision

**Example:** Should we switch from Mapbox to Google Maps?

```
🔍 Gemini → Research both SDKs (performance, pricing, DX)
🧠 ChatGPT (CTO) → Make recommendation with tradeoffs
👩🏻 Sammi → Approve
💻 OpenClaw → Implement if approved
```

---

## UI / Design Task

**Example:** New restaurant card design, explore screen layout

```
🎨 Claude → Design direction + mockups
🧠 ChatGPT → Technical feasibility review
👩🏻 Sammi → Approve direction
💻 OpenClaw → Implement
🧠 ChatGPT → QA screen match
```

---

## Infrastructure Change

**Example:** New GitHub Action, repo restructuring, CI optimization

```
🏗 Codex → Plan + implement
🧠 ChatGPT → Review infra impact
💻 OpenClaw → Confirm dev workflow not broken
```

---

## Research Task

**Example:** Find latest Mapbox Expo SDK version, compare routing APIs

```
🔍 Gemini → Deep research + summary
🧠 ChatGPT → Evaluate findings + recommendation
👩🏻 Sammi → Decide
```

---

## Landing Page / Marketing

**Example:** NextBite landing page, product copy

```
🎨 Claude → Copy + design direction
🧠 ChatGPT → Review
💻 OpenClaw → Implement (if code)
```

---

## New Feature Exploration (Pre-Sprint)

**Example:** Should we add Draw (Discovery Card) in Sprint 003?

```
🔍 Gemini → Research competitive discovery card patterns
🎨 Claude → UX mockup
🧠 ChatGPT (CTO) → Feasibility + tradeoffs
🧠 ChatGPT (Product Critic) → Challenge: does this improve core loop?
👩🏻 Sammi → Final go/no-go
📋 Hermes → If approved, plan sprint
```

---

## Quick Reference

| Task Type | Agents Needed | Max |
|-----------|--------------|-----|
| Feature work | Hermes → OpenClaw → ChatGPT QA | 3 |
| Bug fix | OpenClaw → ChatGPT QA | 2 |
| Design | Claude → ChatGPT → OpenClaw | 3 |
| Research | Gemini → ChatGPT → Sammi | 3 |
| Infra | Codex → ChatGPT → OpenClaw | 3 |
| Landing page | Claude → ChatGPT → OpenClaw | 3 |
| Architecture decision | Gemini + ChatGPT → Sammi → OpenClaw | 4 |
| Pre-sprint exploration | Gemini + Claude + ChatGPT (CTO + Critic) → Sammi → Hermes | 6 max |
