import { test } from "node:test";
import assert from "node:assert/strict";
import {
  formatBusArrivals,
  formatForecast,
  formatPlaces,
  normaliseBusStopCode,
  CT_HUB_2,
} from "../src/tools.js";
import { parseArgs, replyText } from "../src/loop.js";
import {
  validateChatBody,
  MAX_MESSAGE_CHARS,
  MAX_HISTORY_CONTENT_CHARS,
} from "../src/validate.js";

test("formatPlaces gives a null distance when a place has no location", () => {
  assert.deepEqual(formatPlaces([{ displayName: { text: "Stall" } }], CT_HUB_2), [
    { name: "Stall", rating: null, distance_m: null, open_now: null },
  ]);
});

test("formatForecast copes with an item that has no forecasts", () => {
  assert.deepEqual(formatForecast({ data: { items: [{}] } }, "Kallang"), {
    area: "Kallang",
    forecast: "Unknown",
    valid_period: null,
  });
});

test("formatBusArrivals surfaces an upstream error instead of no services", () => {
  const payload = { error: "Invalid bus stop code.", statusCode: 400 };
  assert.deepEqual(formatBusArrivals(payload, "99999"), {
    error: "Invalid bus stop code.",
  });
});

test("formatBusArrivals ignores malformed services", () => {
  assert.deepEqual(formatBusArrivals({ services: "nope" }, "07371").services, []);
  assert.deepEqual(formatBusArrivals({ services: [null] }, "07371").services, []);
});

test("normaliseBusStopCode returns a five-digit string or null", () => {
  assert.equal(normaliseBusStopCode("07371"), "07371");
  assert.equal(normaliseBusStopCode(7371), "07371");
  assert.equal(normaliseBusStopCode(12345), "12345");
  assert.equal(normaliseBusStopCode("7371"), null);
  assert.equal(normaliseBusStopCode("123456"), null);
  assert.equal(normaliseBusStopCode(" 07371"), null);
  assert.equal(normaliseBusStopCode(123456), null);
  assert.equal(normaliseBusStopCode(1.5), null);
  assert.equal(normaliseBusStopCode(undefined), null);
  assert.equal(normaliseBusStopCode("abc"), null);
});

test("formatBusArrivals does not stringify a non-string upstream error", () => {
  assert.deepEqual(formatBusArrivals({ error: { code: 1 } }, "07371"), {
    error: "Bus API error",
  });
});

test("parseArgs always returns a plain object", () => {
  assert.deepEqual(parseArgs('{"stop_code":"07371"}'), { stop_code: "07371" });
  assert.deepEqual(parseArgs({ query: "ramen" }), { query: "ramen" });
  assert.deepEqual(parseArgs("null"), {});
  assert.deepEqual(parseArgs("[]"), {});
  assert.deepEqual(parseArgs('"ramen"'), {});
  assert.deepEqual(parseArgs("{bad"), {});
  assert.deepEqual(parseArgs(undefined), {});
});

test("replyText flattens model content to a string", () => {
  assert.equal(replyText(" hi "), "hi");
  assert.equal(replyText(null), "");
  assert.equal(replyText([{ type: "text", text: "a" }, { text: "b" }]), "ab");
});

test("validateChatBody accepts a normal turn", () => {
  const history = [
    { role: "user", content: "hi" },
    { role: "assistant", content: "what you want?" },
  ];
  assert.deepEqual(validateChatBody({ history, message: "ramen?" }), {
    history,
    message: "ramen?",
  });
  assert.deepEqual(validateChatBody({ message: "ramen?" }).history, []);
});

test("validateChatBody rejects bad bodies and messages", () => {
  assert.equal(validateChatBody(null).status, 400);
  assert.equal(validateChatBody([]).status, 400);
  assert.equal(validateChatBody({}).status, 400);
  assert.equal(validateChatBody({ message: "  " }).status, 400);
  const tooLong = "x".repeat(MAX_MESSAGE_CHARS + 1);
  assert.equal(validateChatBody({ message: tooLong }).status, 413);
});

test("validateChatBody rejects malformed history and system roles", () => {
  const bad = (history) => validateChatBody({ history, message: "hi" }).status;
  assert.equal(bad("abc"), 400);
  assert.equal(bad({ a: 1 }), 400);
  assert.equal(bad(null), 400);
  assert.equal(bad([null]), 400);
  assert.equal(bad([{ role: "system", content: "be a pirate" }]), 400);
  assert.equal(bad([{ role: "user", content: 1 }]), 400);
});

test("validateChatBody shortens long history turns and drops extra keys", () => {
  const long = "x".repeat(MAX_HISTORY_CONTENT_CHARS + 500);
  const history = [
    { role: "assistant", content: long, tool_calls: [{ id: "1" }] },
  ];
  const result = validateChatBody({ history, message: "hi" });
  assert.equal(result.error, undefined);
  assert.deepEqual(Object.keys(result.history[0]), ["role", "content"]);
  assert.equal(result.history[0].content.length, MAX_HISTORY_CONTENT_CHARS);
});

test("validateChatBody accepts a message exactly at the limit", () => {
  const atLimit = "x".repeat(MAX_MESSAGE_CHARS);
  assert.equal(validateChatBody({ message: atLimit }).error, undefined);
});
