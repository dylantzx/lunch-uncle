import ui from "./ui.html";
import { runLoop } from "./loop.js";
import { validateChatBody } from "./validate.js";

// Methods each known path accepts.
const ROUTES = { "/": ["GET", "HEAD"], "/chat": ["POST"] };

export default {
  async fetch(request, env) {
    const { pathname } = new URL(request.url);
    const { method } = request;

    const allowed = ROUTES[pathname];
    if (!allowed) {
      return new Response("Not found", { status: 404 });
    }
    if (!allowed.includes(method)) {
      return new Response("Method not allowed", {
        status: 405,
        headers: { allow: allowed.join(", ") },
      });
    }

    if (pathname === "/chat") {
      return handleChat(request, env);
    }

    // GET or HEAD on the chat page. HEAD gets the same headers with no body.
    return new Response(method === "HEAD" ? null : ui, {
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  },
};

async function handleChat(request, env) {
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Body must be JSON" }, 400);
  }

  const checked = validateChatBody(body);
  if (checked.error) {
    return json({ error: checked.error }, checked.status);
  }
  const { history, message } = checked;

  try {
    const reply = await runLoop(history, message, env);
    return json({ reply });
  } catch (err) {
    console.error("chat failed:", err);
    return json({ error: "Uncle cannot think right now, try again later." }, 500);
  }
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json" },
  });
}
