# Lunch Uncle requirements

This document describes what Lunch Uncle does today. It is derived from the code, not from plans. Where the code and this document disagree, the code is right and this document needs fixing.

**Baseline.** The behaviour described is commit `3120130` plus the pending bug fixes in the main checkout (see [Pending changes](#pending-changes)). Requirements that depend on those fixes are marked *(pending)*.

**Enforced or requested.** Each requirement is tagged:

- **[code]** the Worker or the page enforces it. It can be tested deterministically.
- **[prompt]** the system prompt asks the model to do it. Nothing in the code checks the reply, so it is not guaranteed.

## 1. Purpose and scope

**Purpose.** A chatbot that recommends where to eat lunch within walking distance of CT Hub 2, 114 Lavender Street, Singapore. It answers in the voice of an opinionated Singaporean uncle and backs its answers with live data on places, rain and bus arrivals.

**Target users.** People working at or visiting CT Hub 2 who want a quick lunch suggestion from a browser. The repository is also a teaching template, so a second audience is course participants who configure, fix and deploy it.

**In scope.**

- A single-page chat UI served by the Worker.
- One JSON endpoint, `POST /chat`, that runs one conversational turn.
- An agentic loop against an OpenAI-compatible chat completions endpoint with three tools: place search, two-hour rain forecast, bus arrivals.

**Out of scope.** None of the following exists in the code.

- Any location other than CT Hub 2. The user cannot set or share their location.
- User accounts, authentication, rate limiting or quotas.
- Server-side storage of conversations, preferences or analytics.
- Streaming replies.
- Bookings, ordering, payments, menus, prices, addresses, photos, maps or directions.
- Walking routes or walking times. Distances are straight-line.
- Languages other than English, and rich text or Markdown rendering in the UI.

## 2. Functional requirements

### 2.1 Chat UI

| ID | Requirement | |
|---|---|---|
| FR-1 | `GET /` returns the chat page as `text/html; charset=utf-8` with status 200. | [code] |
| FR-2 | On load, the page shows a greeting bubble from Uncle: "Eh, what you want to eat? Don't waste my time." The greeting is not added to the conversation history. | [code] |
| FR-3 | The user submits a message with the Send button or the Enter key. The message is trimmed, and an empty message is not sent. | [code] |
| FR-4 | On submit, the page clears the input, shows the user's message as a bubble, shows a placeholder bubble "Uncle thinking...", and disables Send until the request finishes. | [code] |
| FR-5 | The page sends `POST /chat` with JSON `{history, message}`, where `history` is the conversation so far as `{role, content}` objects with roles `user` and `assistant`. | [code] |
| FR-6 | When a JSON response arrives, the placeholder is replaced by `reply` if present, otherwise `error`, otherwise "No reply.". The user message and the displayed text are then appended to the history, whatever the HTTP status. | [code] |
| FR-7 | If the request fails or the response is not JSON, the placeholder is replaced by "Cannot reach Uncle. Try again." and nothing is added to the history. | [code] |
| FR-8 | Replies are rendered as plain text (`textContent`), with line breaks preserved. HTML in a reply is not interpreted. | [code] |
| FR-9 | The chat area scrolls to the newest bubble, and the input regains focus after each turn. | [code] |

### 2.2 `/chat` API contract

Request: `POST /chat`, body is JSON.

| Field | Type | Required | Notes |
|---|---|---|---|
| `message` | string | yes | Must be non-empty after trimming. Passed to the model untrimmed. |
| `history` | array of `{role, content}` | no | Defaults to `[]` when the field is absent. |

Responses, all `application/json`:

| Status | Body | When |
|---|---|---|
| 200 | `{"reply": "<text>"}` | The turn completed, including the fallback and too-many-rounds replies. |
| 400 | `{"error": "Body must be JSON"}` | The body does not parse as JSON. |
| 400 | `{"error": "message is required"}` | `message` is missing, not a string, or blank. |
| 500 | `{"error": "Uncle cannot think right now, try again later."}` | Anything thrown while running the turn. |

| ID | Requirement | |
|---|---|---|
| FR-10 | `POST /chat` accepts the request above and returns 200 with `{reply}` on success. | [code] |
| FR-11 | A body that is not valid JSON returns 400 `{"error": "Body must be JSON"}`. The `Content-Type` request header is not checked. | [code] |
| FR-12 | A missing, non-string or whitespace-only `message` returns 400 `{"error": "message is required"}`. | [code] |
| FR-13 | Any exception during the turn (LLM error, timeout, malformed LLM response, thrown tool fetch) returns 500 with the fixed error message above. The underlying error is logged with `console.error` and is not sent to the client. | [code] |
| FR-14 | Any other method or path returns 404 with the plain-text body "Not found". | [code] |

### 2.3 Agentic loop

| ID | Requirement | |
|---|---|---|
| FR-15 | Each turn sends the model, in order: the system prompt, the client-supplied history, and the new user message. | [code] |
| FR-16 | Only the last 20 history messages are sent. Older messages are dropped. *(pending)* | [code] |
| FR-17 | The model is called at `{LLM_BASE_URL}/chat/completions` with the model name, the messages and the three tool definitions, using `Authorization: Bearer <OPENCODE_API_KEY>`. | [code] |
| FR-18 | Every model call in one turn carries the same `x-opencode-session` header, a UUID generated fresh for that turn. | [code] |
| FR-19 | Each model call is aborted after 20 seconds. The abort fails the turn (FR-13). | [code] |
| FR-20 | A non-2xx response from the model fails the turn (FR-13). There are no retries. | [code] |
| FR-21 | If the model's message has no tool calls, its `content` is returned as the reply, or an empty string if `content` is null. | [code] |
| FR-22 | If the model requests tool calls, each is executed in the order given, one at a time, and its result is appended as a `tool` message with the matching `tool_call_id`. The model is then called again. | [code] |
| FR-23 | Tool arguments that are not valid JSON are treated as `{}`. | [code] |
| FR-24 | A turn makes at most 8 model calls. If the eighth still requests tools, the reply is "Uncle tried too many times already. Ask something simpler." with status 200. *(pending: the committed loop never advances its round counter)* | [code] |
| FR-25 | Each tool call is logged with its round number, tool name and arguments. | [code] |

### 2.4 Fallback

| ID | Requirement | |
|---|---|---|
| FR-26 | If `GOOGLE_PLACES_API_KEY` is not set **and** the new message contains one of the whole words `eat`, `lunch`, `food`, `makan`, `hungry`, `restaurant`, `hawker` (case-insensitive), the reply is exactly "Just go Berseh Food Centre lah." and the model is not called. *(pending)* | [code] |
| FR-27 | In every other case the turn goes to the model, including non-food messages when the Places key is missing. *(pending)* | [code] |

The check looks at the new message only, not the history, and matches whole words only: "eating", "foods" and "dinner" do not trigger it.

### 2.5 Persona and reply rules

All of these are instructions in the system prompt. None is checked in code.

| ID | Requirement | |
|---|---|---|
| FR-28 | Uncle speaks casual Singaporean English in short, direct, opinionated sentences, a little impatient with indecision. | [prompt] |
| FR-29 | Uncle uses particles such as "lah", "leh", "lor", "can", "cannot" naturally and does not spell words in a mock accent. | [prompt] |
| FR-30 | Uncle uses no slurs and does not insult people. | [prompt] |
| FR-31 | Uncle assumes the user is at CT Hub 2 and that lunch means walking distance unless told otherwise. | [prompt] |
| FR-32 | Uncle does not invent restaurants, opening hours, weather or bus timings. He uses the tools for these. | [prompt] |
| FR-33 | Uncle calls `find_lunch_places` for any question about where or what to eat. | [prompt] |
| FR-34 | Uncle calls `get_rain_forecast` when asked about rain, weather or whether to walk. | [prompt] |
| FR-35 | Uncle calls `get_bus_arrivals` only when the user gives a bus stop code or asks about a specific bus. | [prompt] |
| FR-36 | Uncle recommends one or two places, not a long list, and says why. | [prompt] |
| FR-37 | If a place is closed, Uncle says so and picks another. | [prompt] |
| FR-38 | Replies are under 120 words. | [prompt] |

### 2.6 Tool: `find_lunch_places`

| ID | Requirement | |
|---|---|---|
| FR-39 | Inputs: `query` (string, required) and `open_now` (boolean, optional, default `false`). | [code] |
| FR-40 | The tool calls Google Places API (New) Text Search with the query, `includedType: "restaurant"`, `openNow` set from `open_now`, and `GOOGLE_PLACES_API_KEY` from `env`. | [code] |
| FR-41 | The search is biased to a circle of radius 800 m centred on CT Hub 2 (1.3115, 103.8615). *(pending: the committed code centres on Bedok)* | [code] |
| FR-42 | At most 10 places are requested (`pageSize: 10`). | [code] |
| FR-43 | Output is `{places: [...]}`. Each place has `name` ("Unnamed" if missing), `rating` (number or `null`), `distance_m` (straight-line metres from CT Hub 2, rounded) and `open_now` (`true`, `false`, or `null` if unknown). *(`open_now` and the CT Hub 2 origin are pending)* | [code] |
| FR-44 | A non-2xx response from Places returns `{error: "Places API returned <status>"}` to the model. The turn continues. | [code] |

### 2.7 Tool: `get_rain_forecast`

| ID | Requirement | |
|---|---|---|
| FR-45 | The tool takes no inputs and reads the data.gov.sg two-hour forecast. No key is needed. | [code] |
| FR-46 | Output is `{area: "Kallang", forecast, valid_period}` taken from the first item in the payload. `forecast` is "Unknown" if Kallang is not listed, and `valid_period` is `null` if absent. | [code] |
| FR-47 | A payload with no items returns `{error: "No forecast available"}`. A non-2xx response returns `{error: "Forecast API returned <status>"}`. The turn continues in both cases. | [code] |

### 2.8 Tool: `get_bus_arrivals`

| ID | Requirement | |
|---|---|---|
| FR-48 | Input: `stop_code` (string, required), described to the model as a five-digit bus stop code. The value is URL-encoded and is not otherwise validated. | [code] |
| FR-49 | The tool reads live arrivals from arrivelah (`arrivelah2.busrouter.sg`). No key is needed. | [code] |
| FR-50 | Output is `{stop_code, services: [...]}`. Each service has `service` (the service number), `next_min` and `subsequent_min`, in whole minutes, never negative, or `null` when there is no arrival time. | [code] |
| FR-51 | A non-2xx response returns `{error: "Bus API returned <status>"}` to the model. The turn continues. | [code] |

### 2.9 Tool dispatch

| ID | Requirement | |
|---|---|---|
| FR-52 | A tool name the Worker does not know returns `{error: "Unknown tool: <name>"}` to the model. The turn continues. | [code] |
| FR-53 | Tool results are passed to the model as JSON strings. | [code] |

## 3. Non-functional requirements

| ID | Requirement | Enforced by |
|---|---|---|
| NFR-1 | The app runs as a single Cloudflare Worker, with the chat page bundled as a text module. No other infrastructure is used. | `wrangler.toml` |
| NFR-2 | Secrets (`OPENCODE_API_KEY`, `GOOGLE_PLACES_API_KEY`) are read from `env` only. They do not appear in code, `wrangler.toml` or committed files. | Convention (`CLAUDE.md`); `.env` is gitignored |
| NFR-3 | There are no runtime npm dependencies and no build step beyond Wrangler's own bundling. `wrangler` is the only dev dependency. | `package.json` |
| NFR-4 | Each tool is split into a fetch function that does IO and a pure, exported format function. | Convention (`CLAUDE.md`) |
| NFR-5 | The pure functions are covered by tests that run with `npm test` (Node's built-in runner, no install needed): `formatPlaces` *(pending)*, `formatForecast`, `formatBusArrivals`, `haversineMetres`. | `test/formatters.test.js` |
| NFR-6 | The system prompt and tool definitions are byte-identical on every request, so the provider can cache the prompt prefix. No request id or timestamp goes in the prompt. *(pending)* | `buildSystemPrompt` |
| NFR-7 | A single model call takes at most 20 seconds, and a turn makes at most 8 of them. | `LLM_TIMEOUT_MS`, `MAX_ROUNDS` |
| NFR-8 | Internal error details are not returned to clients. | `handleChat` |
| NFR-9 | The LLM provider is any OpenAI-compatible chat completions endpoint that supports tool calls, set by two constants in `src/loop.js`. | `callModel` |
| NFR-10 | `npm test` passes before a pull request is opened. | Convention (`CLAUDE.md`); not enforced by CI |

## 4. Traceability

| Requirements | Source |
|---|---|
| FR-1, FR-14 | `src/index.js` `fetch` |
| FR-2 to FR-9 | `src/ui.html` inline script (`addBubble`, submit handler) |
| FR-10 to FR-13, NFR-8 | `src/index.js` `handleChat`, `json` |
| FR-15, FR-16, FR-18, FR-21, FR-22, FR-24, FR-25 | `src/loop.js` `runLoop` (`MAX_HISTORY_MESSAGES`, `MAX_ROUNDS`) |
| FR-17, FR-19, FR-20, NFR-7, NFR-9 | `src/loop.js` `callModel` (`LLM_BASE_URL`, `LLM_MODEL`, `LLM_TIMEOUT_MS`) |
| FR-23 | `src/loop.js` `parseArgs` |
| FR-26, FR-27 | `src/loop.js` `runLoop` (`FALLBACK_REPLY`, `FOOD_WORDS`) |
| FR-28 to FR-38, NFR-6 | `src/prompt.js` `PERSONA`, `buildSystemPrompt` |
| FR-39 | `src/tools.js` `toolDefinitions` |
| FR-40 to FR-42, FR-44 | `src/tools.js` `findLunchPlaces` (`CT_HUB_2`, `SEARCH_RADIUS_METRES`, `MAX_PLACES`) |
| FR-43 | `src/tools.js` `formatPlaces`, `haversineMetres` |
| FR-45, FR-47 | `src/tools.js` `getRainForecast`, `formatForecast` (`FORECAST_AREA`) |
| FR-46 | `src/tools.js` `formatForecast` |
| FR-48, FR-49, FR-51 | `src/tools.js` `toolDefinitions`, `getBusArrivals` |
| FR-50 | `src/tools.js` `formatBusArrivals`, `minutesFromNow` |
| FR-52, FR-53 | `src/tools.js` `executeTool` |
| NFR-1 | `wrangler.toml`, `src/index.js` |
| NFR-2 | `CLAUDE.md`, `.gitignore`, `.env.example`, `wrangler.toml` |
| NFR-3, NFR-10 | `package.json`, `CLAUDE.md` |
| NFR-4, NFR-5 | `src/tools.js`, `test/formatters.test.js` |

## 5. Pending changes

The main checkout holds uncommitted fixes that this document treats as the intended behaviour. They resolve the two drafted issues:

| Issue draft | Cause | Fixed by |
|---|---|---|
| `.github/ISSUE_DRAFTS/always-berseh.md` | The fallback fired when the Places key was missing **or** the message contained a food word, so nearly every question got the Berseh reply. | FR-26, FR-27 |
| `.github/ISSUE_DRAFTS/everything-in-bedok.md` | The search centre and distance origin were hard-coded to coordinates in Bedok. | FR-41, FR-43 |

The same change set also:

- caps history at 20 messages (FR-16);
- makes the round limit effective (FR-24). In the committed code the round counter is never incremented, so a model that keeps requesting tools would loop without limit;
- makes the system prompt static (NFR-6);
- adds `open_now` to each place (FR-43), without which FR-37 has no data to act on;
- adds a `formatPlaces` test (NFR-5).

## 6. Known limitations

Each of these was checked against the code.

**Configuration**

1. `LLM_BASE_URL` and `LLM_MODEL` in `src/loop.js` are still the placeholder `"TODO"`. Until they are set, every turn that reaches the model fails with a 500. Only the fallback reply (FR-26) works.
2. If the Places key is missing and the message has no food word, the model can still call `find_lunch_places`. Places rejects the request and the model receives an error object (FR-44).

**Location and search**

3. The location is hard-coded to CT Hub 2. The forecast area (Kallang) is hard-coded too.
4. `locationBias` biases results towards the 800 m circle. It does not restrict them, so places further away can be returned. Staying within walking distance relies on the model reading `distance_m` (FR-31).
5. `distance_m` is straight-line distance, not walking distance.
6. `includedType: "restaurant"` is sent without strict type filtering, so it is a preference, not a filter. Whether hawker centres and food courts are returned depends on how Google classifies them.
7. Only name, rating, distance and open-now status reach the model. Address, price level, cuisine and opening hours are not requested, so the model cannot state them truthfully.
8. No bus stop near CT Hub 2 is known to the app. Bus arrivals are only useful if the user supplies a stop code.

**Conversation state**

9. History lives only in the page's memory. It is lost on reload and is not shared between tabs or devices.
10. The server trusts the client-supplied history. A caller can send any roles and content, including `system` messages. Only its length is limited, and only by message count, not size.
11. Tool calls and tool results from earlier turns are not kept in the history, so the model sees only its earlier prose.
12. Error text shown in the UI after a 400 or 500 is stored in the history as if Uncle had said it (FR-6), and is sent to the model on later turns.
13. An empty model reply (FR-21) shows as an empty bubble.

**Robustness**

14. Only the LLM call has a timeout. The Places, forecast and bus fetches have none.
15. A tool fetch that throws (network failure, non-JSON body) fails the whole turn with a 500. Only non-2xx statuses are turned into an error object for the model. The same applies to a Places result with no `location`, or a forecast item with no `forecasts` array.
16. There are no retries anywhere.
17. Worst case, a turn can run for 8 model calls of up to 20 seconds each, plus tool time. There is no overall deadline.
18. A JSON body that is not an object, for example `null`, throws before the error handling in `handleChat`, so the client gets the platform's error page, not the JSON 500. A `history` that is present but not an array gives a 500 or undefined behaviour, not a 400.
19. There is no limit on message length or request body size beyond the platform's.

**Security and operations**

20. There is no authentication, rate limiting or CORS policy. Anyone who can reach the Worker can spend the LLM and Places quotas.
21. Tool arguments, which contain the user's search terms, are written to the Worker logs (FR-25).
22. Replies are not streamed. The user sees "Uncle thinking..." until the whole turn finishes.

**Testing**

23. Only the pure formatters are tested. The routing, the loop, the fallback and the UI have no automated tests. There is no CI job that runs `npm test`.
24. None of the [prompt] requirements (FR-28 to FR-38) is verified. A reply can exceed 120 words, list more than two places or state a fact that no tool returned.

## 7. Open questions

1. **Local secrets file.** `README.md`, `wrangler.toml` and `.gitignore` use `.env`. `CLAUDE.md` says `.dev.vars` is gitignored, but it is not listed in `.gitignore`. Which is the intended file?
2. **Session id scope.** `x-opencode-session` is new on every turn (FR-18). Should it be stable for a whole conversation so that caching works across turns as well as within one?
3. **Fallback with a key but no model.** Should there be a safe reply when the LLM is unreachable, as there is when the Places key is missing?
4. **Fallback word list.** Is matching seven whole words on the latest message the intended test for "a food question"?
5. **Bus stops.** Should the stops nearest CT Hub 2 be built in, so that "when is the next bus?" works without a stop code?
6. **History validation.** Should the server reject roles other than `user` and `assistant`, and bound message size?
7. **Error turns in history.** Should the page keep failed turns out of the history?
