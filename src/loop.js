import { buildSystemPrompt } from "./prompt.js";
import { toolDefinitions, executeTool } from "./tools.js";

// OpenCode Go, OpenAI-compatible chat completions API.
// Model ids: https://opencode.ai/inference/go/v1/models
const LLM_BASE_URL = "https://opencode.ai/inference/go/openai/v1";
const LLM_MODEL = "glm-5.3-flash";

const LLM_TIMEOUT_MS = 20_000;
const MAX_ROUNDS = 8;
const MAX_HISTORY_MESSAGES = 20;
const MAX_TOOL_CALLS_PER_ROUND = 5;

const EMPTY_REPLY = "Uncle got nothing to say. Ask again.";
const FALLBACK_REPLY = "Just go Berseh Food Centre lah.";
const FOOD_WORDS = /\b(eat|lunch|food|makan|hungry|restaurant|hawker)\b/i;

/**
 * Run the agentic loop for one user turn and return Uncle's reply.
 *
 * history is the prior conversation as OpenAI-style {role, content} messages.
 */
export async function runLoop(history, message, env) {
  // If the Places key is missing, Uncle cannot search for food, so give a safe
  // answer to food questions. Everything else still goes to the model.
  if (!env.GOOGLE_PLACES_API_KEY && FOOD_WORDS.test(message)) {
    return FALLBACK_REPLY;
  }

  const messages = [
    { role: "system", content: buildSystemPrompt() },
    // Keep only the most recent turns so long chats do not grow every request.
    ...history.slice(-MAX_HISTORY_MESSAGES),
    { role: "user", content: message },
  ];

  // One session id per turn, shared by every model call in this loop run,
  // so the OpenCode Go endpoint can route and cache consistently.
  const sessionId = crypto.randomUUID();

  for (let round = 0; round < MAX_ROUNDS; round++) {
    const assistant = await callModel(messages, env, sessionId);
    messages.push(assistant);

    // Ignore a malformed tool_calls value rather than crash on it.
    const toolCalls = Array.isArray(assistant.tool_calls)
      ? assistant.tool_calls.filter((c) => c !== null && typeof c === "object")
      : [];
    if (toolCalls.length === 0) {
      return replyText(assistant.content) || EMPTY_REPLY;
    }

    for (const [index, call] of toolCalls.entries()) {
      const name = call.function?.name;
      const args = parseArgs(call.function?.arguments);
      console.log(`round ${round}: ${name}`, args);
      // Every tool call needs a result, but only the first few are run, so
      // one model reply cannot trigger an unbounded number of requests.
      // executeTool never throws: failures come back as an {error} result
      // so the model can tell the user or try something else.
      const result =
        index < MAX_TOOL_CALLS_PER_ROUND
          ? await executeTool(name, args, env)
          : JSON.stringify({ error: "Too many tool calls in one turn" });
      messages.push({
        role: "tool",
        tool_call_id: call.id,
        content: result,
      });
    }
  }

  return "Uncle tried too many times already. Ask something simpler.";
}

async function callModel(messages, env, sessionId) {
  if (!env.OPENCODE_API_KEY) {
    throw new Error("OPENCODE_API_KEY is not set");
  }

  const res = await fetch(`${LLM_BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${env.OPENCODE_API_KEY}`,
      "x-opencode-session": sessionId,
    },
    body: JSON.stringify({
      model: LLM_MODEL,
      messages,
      tools: toolDefinitions,
    }),
    signal: AbortSignal.timeout(LLM_TIMEOUT_MS),
  });

  if (!res.ok) {
    throw new Error(`LLM returned ${res.status}: ${await res.text()}`);
  }

  const data = await res.json();
  const message = data?.choices?.[0]?.message;
  if (!message || typeof message !== "object") {
    const detail = data?.error?.message ?? JSON.stringify(data).slice(0, 300);
    throw new Error(`LLM response had no message: ${detail}`);
  }
  return message;
}

/**
 * Turn a model message's content into plain text.
 *
 * Content is usually a string, but can be null or an array of text parts.
 */
export function replyText(content) {
  if (typeof content === "string") {
    return content.trim();
  }
  if (Array.isArray(content)) {
    return content
      .map((part) => (typeof part?.text === "string" ? part.text : ""))
      .join("")
      .trim();
  }
  return "";
}

/**
 * Read a tool call's arguments as a plain object.
 *
 * Providers normally send a JSON string, but some send an object. Anything
 * that is not a plain object, or does not parse, becomes {}.
 */
export function parseArgs(raw) {
  let value = raw;
  if (typeof raw === "string") {
    try {
      value = JSON.parse(raw || "{}");
    } catch {
      return {};
    }
  }
  const isPlainObject =
    value !== null && typeof value === "object" && !Array.isArray(value);
  return isPlainObject ? value : {};
}
