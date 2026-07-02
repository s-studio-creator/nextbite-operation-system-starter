#!/usr/bin/env node

import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const ROOT = process.cwd();
const DEFAULT_MODEL = "deepseek-v4-flash";
const API_BASE_URL = "https://api.deepseek.com";

const CONTEXT_FILES = [
  "docs/PRODUCT_BIBLE.md",
  "docs/ROADMAP.md",
  "docs/AI_OPERATING_MANUAL.md",
  "workflow/PROJECT_DECISIONS.md",
  "workflow/AI_OPERATING_SYSTEM.md",
  "prompts/HERMES.md",
  "CURRENT_SPRINT.md",
  "BACKLOG.md",
  "ICEBOX.md",
];

const COMMANDS = new Set(["recommend", "daily-report"]);

function loadEnvFile() {
  const envPath = resolve(ROOT, ".env");

  if (!existsSync(envPath)) {
    return;
  }

  const lines = readFileSync(envPath, "utf8").split(/\r?\n/);

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const index = trimmed.indexOf("=");

    if (index === -1) {
      continue;
    }

    const key = trimmed.slice(0, index).trim();
    const rawValue = trimmed.slice(index + 1).trim();
    const value = rawValue.replace(/^["']|["']$/g, "");

    if (key && process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

function readContext() {
  return CONTEXT_FILES.map((file) => {
    const path = resolve(ROOT, file);

    if (!existsSync(path)) {
      return `# ${file}\n\nMissing.`;
    }

    return `# ${file}\n\n${readFileSync(path, "utf8").trim()}`;
  }).join("\n\n---\n\n");
}

function parseArgs(argv) {
  const args = argv.slice(2);
  const command = args.find((arg) => !arg.startsWith("-")) ?? "recommend";

  return {
    command,
    dryRun: args.includes("--dry-run"),
    help: args.includes("--help") || args.includes("-h"),
  };
}

function printHelp() {
  console.log(`
Hermes DeepSeek CLI

Usage:
  node scripts/hermes.mjs recommend
  node scripts/hermes.mjs daily-report
  node scripts/hermes.mjs recommend --dry-run

Environment:
  DEEPSEEK_API_KEY      Required unless using --dry-run
  DEEPSEEK_MODEL        Optional. Defaults to ${DEFAULT_MODEL}

Rules:
  - Hermes may recommend and organize work.
  - Hermes may not write production code.
  - Hermes may not decide product direction without Founder approval.
`);
}

function getTask(command) {
  if (command === "daily-report") {
    return {
      title: "Generate a concise daily project management report.",
      outputShape: {
        summary: "One short paragraph about current sprint status.",
        current_sprint_status: "Not started | In progress | Blocked | Ready for review | Complete",
        completed: ["Concrete completed items from the context only."],
        blockers: ["Known blockers from the context only."],
        risks: ["Execution risks to watch."],
        next_actions: ["Project management actions Hermes should take next."],
        founder_decisions_needed: ["Decisions only Sammi should make."],
      },
    };
  }

  return {
    title: "Recommend the next Founder-approved sprint candidate.",
    outputShape: {
      recommendation: "Short sprint recommendation.",
      rationale: "Why this sprint should be considered now.",
      sprint_goal: "One goal only.",
      definition_of_done: ["Acceptance criteria."],
      out_of_scope: ["Items explicitly not allowed."],
      suggested_issues: [
        {
          title: "Issue title",
          type: "feature | chore | bug | docs",
          description: "One concise issue description.",
          acceptance_criteria: ["Clear criteria."],
        },
      ],
      risks: ["Risks or dependencies."],
      founder_approval_required: true,
    },
  };
}

function buildPayload(command) {
  const task = getTask(command);

  return {
    model: process.env.DEEPSEEK_MODEL || DEFAULT_MODEL,
    temperature: 0.2,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: [
          "You are Hermes, the AI Project Manager for NextBite.",
          "You organize work, recommend sprint scope, draft issue plans, and report status.",
          "You never write production code.",
          "You never redesign the product.",
          "You never decide product direction without Founder approval.",
          "You must preserve the NextBite product vision.",
          "Return valid JSON only.",
        ].join("\n"),
      },
      {
        role: "user",
        content: JSON.stringify(
          {
            task: task.title,
            required_output_shape: task.outputShape,
            repository_context: readContext(),
          },
          null,
          2,
        ),
      },
    ],
  };
}

async function callDeepSeek(payload) {
  const apiKey = process.env.DEEPSEEK_API_KEY;

  if (!apiKey) {
    throw new Error("Missing DEEPSEEK_API_KEY. Add it to .env or your shell environment.");
  }

  const response = await fetch(`${API_BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`DeepSeek API failed with ${response.status}: ${body}`);
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error("DeepSeek API returned no message content.");
  }

  return content;
}

async function main() {
  loadEnvFile();

  const { command, dryRun, help } = parseArgs(process.argv);

  if (help) {
    printHelp();
    return;
  }

  if (!COMMANDS.has(command)) {
    printHelp();
    process.exitCode = 1;
    return;
  }

  const payload = buildPayload(command);

  if (dryRun) {
    console.log(JSON.stringify(payload, null, 2));
    return;
  }

  const content = await callDeepSeek(payload);

  try {
    console.log(JSON.stringify(JSON.parse(content), null, 2));
  } catch {
    console.log(content);
  }
}

main().catch((error) => {
  console.error(`Hermes failed: ${error.message}`);
  process.exitCode = 1;
});
