/**
 * Tool definitions and implementations for Lunch Uncle.
 *
 * Each tool is split in two: a fetch function that talks to the network,
 * and a pure format function that shapes the response for the model.
 * The format functions are the ones covered by tests.
 */

// CT Hub 2, 114 Lavender Street.
export const CT_HUB_2 = { latitude: 1.3115, longitude: 103.8615 };

const SEARCH_RADIUS_METRES = 800;
const MAX_PLACES = 10;
const TOOL_TIMEOUT_MS = 8_000;
const FORECAST_AREA = "Kallang";

const PLACES_URL = "https://places.googleapis.com/v1/places:searchText";
const FORECAST_URL =
  "https://api-open.data.gov.sg/v2/real-time/api/two-hr-forecast";
const BUS_URL = "https://arrivelah2.busrouter.sg/";

// ---------------------------------------------------------------------------
// Definitions sent to the model
// ---------------------------------------------------------------------------

export const toolDefinitions = [
  {
    type: "function",
    function: {
      name: "find_lunch_places",
      description:
        "Search for places to eat near CT Hub 2. Returns name, rating, distance and whether it is open now.",
      parameters: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description:
              'What to search for, e.g. "chicken rice", "japanese", "cheap lunch".',
          },
          open_now: {
            type: "boolean",
            description: "Only return places that are open right now.",
          },
        },
        required: ["query"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_rain_forecast",
      description:
        "Get the two-hour weather forecast for the Kallang area, which covers CT Hub 2.",
      parameters: { type: "object", properties: {} },
    },
  },
  {
    type: "function",
    function: {
      name: "get_bus_arrivals",
      description:
        "Get the next bus arrivals at a Singapore bus stop, by five-digit stop code.",
      parameters: {
        type: "object",
        properties: {
          stop_code: {
            type: "string",
            description: 'Five-digit bus stop code, e.g. "07371".',
          },
        },
        required: ["stop_code"],
      },
    },
  },
];

// ---------------------------------------------------------------------------
// Dispatch
// ---------------------------------------------------------------------------

/**
 * Run one tool call requested by the model and return the result as a string.
 */
export async function executeTool(name, args, env) {
  const safeArgs = args !== null && typeof args === "object" ? args : {};
  try {
    return JSON.stringify(await runTool(name, safeArgs, env));
  } catch (err) {
    // A failed tool must not abort the whole turn. Report it to the model.
    console.error(`tool ${name} failed:`, err);
    const reason = err?.name === "TimeoutError" ? "timed out" : "failed";
    return JSON.stringify({ error: `${name} ${reason}` });
  }
}

async function runTool(name, args, env) {
  switch (name) {
    case "find_lunch_places":
      return findLunchPlaces(args, env);
    case "get_rain_forecast":
      return getRainForecast();
    case "get_bus_arrivals":
      return getBusArrivals(args);
    default:
      return { error: `Unknown tool: ${name}` };
  }
}

// ---------------------------------------------------------------------------
// find_lunch_places
// ---------------------------------------------------------------------------

async function findLunchPlaces({ query, open_now = false }, env) {
  if (!env.GOOGLE_PLACES_API_KEY) {
    return { error: "Places search is not configured" };
  }
  if (typeof query !== "string" || query.trim() === "") {
    return { error: "query is required" };
  }
  const centre = CT_HUB_2;

  const body = {
    textQuery: query,
    includedType: "restaurant",
    openNow: open_now === true,
    pageSize: MAX_PLACES,
    locationBias: {
      circle: { center: centre, radius: SEARCH_RADIUS_METRES },
    },
  };

  const res = await fetch(PLACES_URL, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "X-Goog-Api-Key": env.GOOGLE_PLACES_API_KEY,
      "X-Goog-FieldMask":
        "places.id,places.displayName,places.location,places.rating,places.currentOpeningHours",
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(TOOL_TIMEOUT_MS),
  });

  if (!res.ok) {
    return { error: `Places API returned ${res.status}` };
  }

  const data = await res.json();
  return { places: formatPlaces(data.places ?? [], centre) };
}

/**
 * Shape Places API results into the fields Uncle needs.
 */
export function formatPlaces(places, origin) {
  return places.map(
    ({ displayName, rating, location, currentOpeningHours }) => ({
      name: displayName?.text ?? "Unnamed",
      rating: rating ?? null,
      distance_m: hasCoordinates(location)
        ? Math.round(haversineMetres(origin, location))
        : null,
      open_now: currentOpeningHours?.openNow ?? null,
    }),
  );
}

function hasCoordinates(location) {
  return (
    typeof location?.latitude === "number" &&
    typeof location?.longitude === "number"
  );
}

/**
 * Great-circle distance between two {latitude, longitude} points, in metres.
 */
export function haversineMetres(a, b) {
  const R = 6371000;
  const toRad = (deg) => (deg * Math.PI) / 180;
  const dLat = toRad(b.latitude - a.latitude);
  const dLon = toRad(b.longitude - a.longitude);
  const lat1 = toRad(a.latitude);
  const lat2 = toRad(b.latitude);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

// ---------------------------------------------------------------------------
// get_rain_forecast
// ---------------------------------------------------------------------------

async function getRainForecast() {
  const res = await fetch(FORECAST_URL, {
    signal: AbortSignal.timeout(TOOL_TIMEOUT_MS),
  });
  if (!res.ok) {
    return { error: `Forecast API returned ${res.status}` };
  }
  return formatForecast(await res.json(), FORECAST_AREA);
}

/**
 * Pull one area's forecast out of the data.gov.sg two-hour forecast payload.
 */
export function formatForecast(payload, area) {
  const item = payload?.data?.items?.[0];
  if (!item) {
    return { error: "No forecast available" };
  }
  const entry = item.forecasts?.find?.((f) => f.area === area);
  return {
    area,
    forecast: entry?.forecast ?? "Unknown",
    valid_period: item.valid_period?.text ?? null,
  };
}

// ---------------------------------------------------------------------------
// get_bus_arrivals
// ---------------------------------------------------------------------------

async function getBusArrivals({ stop_code }) {
  const stopCode = normaliseBusStopCode(stop_code);
  if (!stopCode) {
    return { error: "stop_code must be a five-digit string, e.g. 07371" };
  }
  const url = `${BUS_URL}?id=${encodeURIComponent(stopCode)}`;
  const res = await fetch(url, {
    signal: AbortSignal.timeout(TOOL_TIMEOUT_MS),
  });
  if (!res.ok) {
    return { error: `Bus API returned ${res.status}` };
  }
  return formatBusArrivals(await res.json(), stopCode);
}

/**
 * Reduce an arrivelah response to service numbers and minutes to arrival.
 */
export function formatBusArrivals(payload, stopCode) {
  // arrivelah reports problems such as an unknown stop with HTTP 200 and an
  // error field, so check for it rather than reporting "no services".
  if (payload?.error) {
    const detail = payload.error;
    return { error: typeof detail === "string" ? detail : "Bus API error" };
  }
  const services = Array.isArray(payload?.services) ? payload.services : [];
  return {
    stop_code: stopCode,
    services: services.filter(Boolean).map((s) => ({
      service: s.no,
      next_min: minutesFromNow(s.next),
      subsequent_min: minutesFromNow(s.subsequent),
    })),
  };
}

/**
 * Singapore bus stop codes are five digits and may start with zero.
 *
 * Returns the code as a five-digit string, or null when it is not one.
 * A model sometimes sends the code as a number, which drops the leading
 * zero, so whole numbers are padded back to five digits.
 */
export function normaliseBusStopCode(value) {
  if (typeof value === "string") {
    return /^\d{5}$/.test(value) ? value : null;
  }
  if (Number.isInteger(value) && value >= 0 && value <= 99999) {
    return String(value).padStart(5, "0");
  }
  return null;
}

function minutesFromNow(arrival) {
  if (!arrival || typeof arrival.duration_ms !== "number") {
    return null;
  }
  return Math.max(0, Math.round(arrival.duration_ms / 60000));
}
