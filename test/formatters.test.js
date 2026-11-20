import { test } from "node:test";
import assert from "node:assert/strict";
import {
  formatForecast,
  formatBusArrivals,
  formatPlaces,
  haversineMetres,
  CT_HUB_2,
} from "../src/tools.js";

test("formatPlaces reports distance from the origin and open-now status", () => {
  const places = [
    {
      displayName: { text: "Open Stall" },
      rating: 4.5,
      location: CT_HUB_2,
      currentOpeningHours: { openNow: true },
    },
    {
      displayName: { text: "Closed Stall" },
      location: { latitude: 1.3073, longitude: 103.8631 },
      currentOpeningHours: { openNow: false },
    },
    { location: CT_HUB_2 },
  ];

  const result = formatPlaces(places, CT_HUB_2);

  assert.deepEqual(result[0], {
    name: "Open Stall",
    rating: 4.5,
    distance_m: 0,
    open_now: true,
  });
  assert.equal(result[1].open_now, false);
  assert.ok(result[1].distance_m > 400 && result[1].distance_m < 550);
  assert.deepEqual(result[2], {
    name: "Unnamed",
    rating: null,
    distance_m: 0,
    open_now: null,
  });
});

test("formatForecast picks the requested area", () => {
  const payload = {
    data: {
      items: [
        {
          valid_period: { text: "12 pm to 2 pm" },
          forecasts: [
            { area: "Geylang", forecast: "Fair" },
            { area: "Kallang", forecast: "Light Rain" },
          ],
        },
      ],
    },
  };

  assert.deepEqual(formatForecast(payload, "Kallang"), {
    area: "Kallang",
    forecast: "Light Rain",
    valid_period: "12 pm to 2 pm",
  });
});

test("formatBusArrivals converts durations to whole minutes", () => {
  const payload = {
    services: [
      {
        no: "13",
        next: { duration_ms: 100_798 },
        subsequent: { duration_ms: 1_210_000 },
      },
      { no: "107M", next: { duration_ms: 30_000 }, subsequent: null },
    ],
  };

  assert.deepEqual(formatBusArrivals(payload, "07371"), {
    stop_code: "07371",
    services: [
      { service: "13", next_min: 2, subsequent_min: 20 },
      { service: "107M", next_min: 1, subsequent_min: null },
    ],
  });
});

test("haversineMetres measures CT Hub 2 to Lavender MRT at under 600 m", () => {
  const ctHub2 = { latitude: 1.3115, longitude: 103.8615 };
  const lavenderMrt = { latitude: 1.3073, longitude: 103.8631 };
  const distance = haversineMetres(ctHub2, lavenderMrt);
  assert.ok(distance > 400 && distance < 550, `got ${distance}`);
});
