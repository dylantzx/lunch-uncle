// Pure validation for the POST /chat request body, kept apart from index.js
// so it can be tested without the Worker runtime.

export const MAX_MESSAGE_CHARS = 2000;
export const MAX_HISTORY_CONTENT_CHARS = 4000;

const HISTORY_ROLES = new Set(["user", "assistant"]);

/**
 * Check a parsed /chat body.
 *
 * Returns { history, message } when the body is usable, or
 * { error, status } describing why it is not.
 */
export function validateChatBody(body) {
  if (body === null || typeof body !== "object" || Array.isArray(body)) {
    return { error: "Body must be a JSON object", status: 400 };
  }

  const { history = [], message } = body;

  if (typeof message !== "string" || message.trim() === "") {
    return { error: "message is required", status: 400 };
  }
  if (message.length > MAX_MESSAGE_CHARS) {
    return {
      error: `message must be at most ${MAX_MESSAGE_CHARS} characters`,
      status: 413,
    };
  }

  if (!Array.isArray(history)) {
    return { error: "history must be an array", status: 400 };
  }
  for (const turn of history) {
    // Only user and assistant turns come from the browser. Anything else,
    // such as a client-supplied system message, is rejected.
    const ok =
      turn !== null &&
      typeof turn === "object" &&
      HISTORY_ROLES.has(turn.role) &&
      typeof turn.content === "string";
    if (!ok) {
      return {
        error: "history entries must be user or assistant text messages",
        status: 400,
      };
    }
  }

  return {
    // Long turns are shortened rather than rejected, so one long reply from
    // Uncle cannot block the rest of the conversation.
    history: history.map(({ role, content }) => ({
      role,
      content: content.slice(0, MAX_HISTORY_CONTENT_CHARS),
    })),
    message,
  };
}
