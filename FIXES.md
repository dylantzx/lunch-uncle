# Bug fixes

This records every defect found and fixed in the Lunch Uncle template on 20 November 2026, starting from commit `3120130`.

The bugs came from three sources: a code scan, behavioural testing with a stubbed model, and a requirements check. Six were seeded on purpose (they match the facilitator list deleted in commit `5f2bd77`). The rest were incidental. A second independent review and re-test followed the fixes and turned up six more issues, which are also fixed here.

## How the fixes were verified

- `npm test` passes 17 of 17. The tests cover the pure functions only, as the project convention requires.
- Each bug was reproduced with a standalone script before the fix and re-run after it.
- A second set of tests, written from scratch by a separate reviewer, checks all 17 original issues (about 390 checks).
- The running app was exercised with a real model: food questions, a rain question, a bus question, a bad bus stop code, and a multi-turn chat in the browser.

## Seeded bugs

| # | Symptom | Cause | Fix |
|---|---|---|---|
| S1 | Any message containing eat, lunch, food, makan, hungry, restaurant or hawker got "Just go Berseh Food Centre lah." and never reached the model | `runLoop` in `src/loop.js` used `\|\|` in the fallback guard | Changed to `&&`. The canned reply is now used only for a food question when the Places key is missing. |
| S2 | All recommendations were in Bedok, 7.4 km away, and distances were measured from Bedok | `findLunchPlaces` in `src/tools.js` used a hard-coded centre instead of `CT_HUB_2` | The search centre and the distance origin are now `CT_HUB_2`. |
| S3 | A model that kept asking for tools looped until the platform killed the request | `round` was never incremented in `runLoop`, so `MAX_ROUNDS` was never reached | The loop is now a `for` loop. It stops after 8 model calls with the "tried too many times" reply. |
| S4 | Uncle could recommend closed places | `formatPlaces` dropped `currentOpeningHours` although the tool description promised open-now status | `formatPlaces` returns `open_now` as true, false, or null when unknown. |
| S5 | Long conversations grew slower and costlier every turn | `runLoop` sent the whole client history | Only the last 20 history messages are sent (`MAX_HISTORY_MESSAGES`). |
| S6 | Prompt caching could never hit | `buildSystemPrompt` in `src/prompt.js` started the prompt with a fresh UUID and timestamp | The system prompt is now the static persona text, identical on every request. |

## Other bugs found in the first scan

| # | Symptom | Fix |
|---|---|---|
| E1 | A tool failure (network error, non-JSON body, missing field) aborted the whole turn with a 500 | `executeTool` in `src/tools.js` catches failures and returns an `{error}` result to the model. `formatPlaces`, `formatForecast` and `formatBusArrivals` tolerate missing fields. |
| E2 | Client `history` was not validated. A string was spread into characters, an object caused a 500, and `role: "system"` entries were forwarded to the model | New `validateChatBody` in `src/validate.js`. History must be an array of user or assistant text messages; anything else gets a 400. Extra keys are stripped. |
| E3 | A JSON body of `null` threw an uncaught exception and returned a stack trace | Non-object bodies return a 400. |
| E4 | Tool fetches had no timeout, so a stalled API hung `/chat` | All three tool fetches use `AbortSignal.timeout` with `TOOL_TIMEOUT_MS` (8 seconds). A timeout becomes a tool error. |
| E5 | The page stored error messages and empty replies as Uncle's turns and replayed them to the model | `src/ui.html` adds a turn to history only when the response is OK and has a non-empty reply. Errors are shown but not kept. |
| E6 | Tool arguments of `null` caused a 500, and arguments sent as an object were silently replaced by `{}` | `parseArgs` in `src/loop.js` accepts an object as given and turns anything that is not a plain object into `{}`. |
| E7 | An invalid bus stop code was reported as "no services", and a missing code was fetched as `?id=undefined` | Stop codes are validated before any request. arrivelah's HTTP 200 error payload is returned as an error. |
| E8 | The model's response shape was trusted. Empty content gave a blank reply, array content gave a non-string reply, and a 200 error body threw an opaque `TypeError` | `replyText` flattens content to a string, with a fallback line for empty content. A response with no message throws an error that names the upstream detail. A missing `OPENCODE_API_KEY` fails before any request is sent. |
| E9 | With no Places key, rain and bus questions also got the canned reply | Fixed by S1. |
| E10 | No size limit on `message`; a 2 MB message was forwarded to the model | Messages over 2,000 characters (`MAX_MESSAGE_CHARS`) get a 413. |
| E11 | `HEAD /` returned 404, and wrong methods returned 404 instead of 405 | `HEAD /` returns 200 with no body. Wrong methods on `/` and `/chat` return 405 with an `Allow` header. |

## Issues found by the second review

| # | Symptom | Fix |
|---|---|---|
| R1 | A reply over 4,000 characters made every later turn fail with a 400 until the page was reloaded. This was a side effect of the first E2 fix, which rejected long history entries | Long history entries are now shortened to `MAX_HISTORY_CONTENT_CHARS` (4,000) instead of rejected. |
| R2 | A malformed `tool_calls` value from the model (an object, `true`, or a `null` entry) caused a 500 | `runLoop` treats a non-array as no tool calls and skips non-object entries. |
| R3 | With no Places key, a food question without one of the seven keywords still reached Google with an `undefined` key header | `findLunchPlaces` returns "Places search is not configured" when the key is missing. |
| R4 | A bus stop code sent as a number (7371) was rejected, costing a model round. This was a side effect of the first E7 fix | `normaliseBusStopCode` pads whole numbers back to five digits. Strings must still be exactly five digits. |
| R5 | `open_now` was forwarded to Places without checking its type | Only a real `true` turns the filter on. |
| R6 | One model reply could trigger an unlimited number of tool calls | Only the first 5 tool calls in a round are run (`MAX_TOOL_CALLS_PER_ROUND`). The rest get an error result. |

A non-string `error` value from the bus API is also now reported as "Bus API error" rather than `[object Object]`.

## Configuration and housekeeping

- `LLM_BASE_URL` in `src/loop.js` is set to `https://opencode.ai/inference/go/openai/v1` and `LLM_MODEL` to `glm-5.3-flash`. Both come from OpenCode's documentation and its public model list. README step 4 was updated to match.
- `.dev.vars` is now in `.gitignore`, as `CLAUDE.md` already claimed.

## Files changed

- `src/loop.js`, `src/tools.js`, `src/prompt.js`, `src/index.js`, `src/ui.html`
- `src/validate.js` (new)
- `test/formatters.test.js`, `test/hardening.test.js` (new)
- `.gitignore`, `README.md`

## Known limits, not fixed

- A turn has no overall time budget. In the worst case it can run 8 model calls of up to 20 seconds each, plus tool time.
- On the final round, tools are run and their results discarded before the "tried too many times" reply.
- The number of history entries a client may send is not capped, though only the last 20 are forwarded. A client other than the bundled page can send turns in an order a strict provider rejects, which surfaces as a 500.
- The 120-word limit and "one or two places" rule exist only in the prompt and are not enforced in code.
- `includedType: "restaurant"` in the Places query may rank hawker centres and food courts lower. This was not tested.
- The message input has no `maxlength`, so an over-long message is cleared from the box and then rejected.
