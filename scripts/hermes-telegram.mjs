#!/usr/bin/env node

import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const ROOT = process.cwd();
const DEFAULT_MODEL = "deepseek-v4-flash";
const DEEPSEEK_BASE_URL = "https://api.deepseek.com";
const TELEGRAM_BASE_URL = "https://api.telegram.org";
const POLL_TIMEOUT_SECONDS = 25;
const MAX_TELEGRAM_MESSAGE_LENGTH = 3800;

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

function buildHermesPayload(userMessage) {
  return {
    model: process.env.DEEPSEEK_MODEL || DEFAULT_MODEL,
    temperature: 0.2,
    messages: [
      {
        role: "system",
        content: [
          "You are Hermes, the AI Project Manager for NextBite.",
          "You help Sammi organize sprint work from the repository source of truth.",
          "You may recommend sprint scope, summarize status, draft issue plans, and identify blockers.",
          "You never write production code.",
          "You never redesign the product.",
          "You never decide product direction without Founder approval.",
          "Keep Telegram replies concise, practical, and easy to act on.",
        ].join("\n"),
      },
      {
        role: "user",
        content: JSON.stringify(
          {
            user_message: userMessage,
            repository_context: readContext(),
          },
          null,
          2,
        ),
      },
    ],
  };
}

function helpText() {
  return [
    "Hermes is online.",
    "",
    "Try:",
    "/status - sprint status",
    "/recommend - recommend next sprint candidate",
    "/help - commands",
    "",
    "You can also ask:",
    "Read CURRENT_SPRINT.md and tell me what OpenClaw should do next.",
  ].join("\n");
}

function normalizeMessage(text) {
  if (text === "/start" || text === "/help") {
    return { local: true, reply: helpText() };
  }

  if (text === "/status") {
    return { local: false, prompt: "Give me today's concise sprint status from the repository context." };
  }

  if (text === "/recommend") {
    return {
      local: false,
      prompt: "Recommend the next sprint candidate. Hermes recommends; Founder approves. Do not write code.",
    };
  }

  return { local: false, prompt: text };
}

async function deepSeekChat(userMessage) {
  const apiKey = process.env.DEEPSEEK_API_KEY;

  if (!apiKey) {
    throw new Error("Missing DEEPSEEK_API_KEY in .env or shell environment.");
  }

  const response = await fetch(`${DEEPSEEK_BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(buildHermesPayload(userMessage)),
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

async function telegramRequest(method, body) {
  const token = process.env.TELEGRAM_BOT_TOKEN;

  if (!token) {
    throw new Error("Missing TELEGRAM_BOT_TOKEN in .env or shell environment.");
  }

  const response = await fetch(`${TELEGRAM_BASE_URL}/bot${token}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await response.json();

  if (!data.ok) {
    throw new Error(`Telegram ${method} failed: ${JSON.stringify(data)}`);
  }

  return data.result;
}

async function sendMessage(chatId, text) {
  const chunks = [];

  for (let i = 0; i < text.length; i += MAX_TELEGRAM_MESSAGE_LENGTH) {
    chunks.push(text.slice(i, i + MAX_TELEGRAM_MESSAGE_LENGTH));
  }

  for (const chunk of chunks) {
    await telegramRequest("sendMessage", {
      chat_id: chatId,
      text: chunk,
      disable_web_page_preview: true,
    });
  }
}

async function handleUpdate(update) {
  const message = update.message;
  const chatId = message?.chat?.id;
  const text = message?.text?.trim();

  if (!chatId || !text) {
    return;
  }

  const normalized = normalizeMessage(text);

  if (normalized.local) {
    await sendMessage(chatId, normalized.reply);
    return;
  }

  await telegramRequest("sendChatAction", {
    chat_id: chatId,
    action: "typing",
  });

  try {
    const reply = await deepSeekChat(normalized.prompt);
    await sendMessage(chatId, reply);
  } catch (error) {
    console.error(`[Hermes Telegram] ${error.message}`);
    await sendMessage(
      chatId,
      "The model provider failed. I kept raw provider details out of Telegram; check your Terminal logs for diagnostics.",
    );
  }
}

function printHelp() {
  console.log(`
Hermes Telegram Runner

Usage:
  node scripts/hermes-telegram.mjs
  node scripts/hermes-telegram.mjs --check

Environment:
  TELEGRAM_BOT_TOKEN    Required
  DEEPSEEK_API_KEY      Required
  DEEPSEEK_MODEL        Optional. Defaults to ${DEFAULT_MODEL}
`);
}

async function checkConfig() {
  loadEnvFile();

  const missing = ["TELEGRAM_BOT_TOKEN", "DEEPSEEK_API_KEY"].filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
  }

  const bot = await telegramRequest("getMe", {});
  console.log(`Telegram bot connected: @${bot.username}`);
  console.log(`DeepSeek model: ${process.env.DEEPSEEK_MODEL || DEFAULT_MODEL}`);
}

async function runBot() {
  await checkConfig();

  let offset = 0;

  console.log("Hermes Telegram is running. Press Ctrl+C to stop.");

  while (true) {
    try {
      const updates = await telegramRequest("getUpdates", {
        offset,
        timeout: POLL_TIMEOUT_SECONDS,
        allowed_updates: ["message"],
      });

      for (const update of updates) {
        offset = update.update_id + 1;
        await handleUpdate(update);
      }
    } catch (error) {
      console.error(`[Hermes Telegram] ${error.message}`);
      await new Promise((resolveDelay) => setTimeout(resolveDelay, 3000));
    }
  }
}

async function main() {
  if (process.argv.includes("--help") || process.argv.includes("-h")) {
    printHelp();
    return;
  }

  if (process.argv.includes("--check")) {
    await checkConfig();
    return;
  }

  await runBot();
}

main().catch((error) => {
  console.error(`Hermes Telegram failed: ${error.message}`);
  process.exitCode = 1;
});
