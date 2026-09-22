/* ==========================================================================
   Example shipment data for the rate console.

   Lanes, services and rates are illustrative. Service names are invented so
   nothing here can be mistaken for a live carrier quote.

   Rather than hand-writing four services for each of thirty-six lanes, the
   rates are derived from the distance between the two cities and a seeded
   jitter. That keeps the numbers plausible and, more importantly, stable:
   the same lane always quotes the same price, so the panel never appears to
   invent figures between renders.
   ========================================================================== */

export type Priority = "cost" | "speed" | "balanced";
export type RateSource = "partner" | "own";

export type Service = {
  id: string;
  name: string;
  /** The logistics partner whose contract the rate sits on. */
  partner: string;
  source: RateSource;
  price: number;
  days: number;
  note: string;
};

export type Lane = {
  id: string;
  from: string;
  to: string;
  origin: string;
  destination: string;
  originCountry: string;
  destinationCountry: string;
  services: Service[];
};

export const priorities: { id: Priority; label: string; short: string }[] = [
  { id: "cost", label: "Lowest cost", short: "Cost" },
  { id: "balanced", label: "Balanced", short: "Balanced" },
  { id: "speed", label: "Fastest", short: "Speed" },
];

/* ---- Cities --------------------------------------------------------------
   `key` matches the projected city in worldmap.json so the lane map can draw
   the arc without a second lookup table.                                   */

type City = {
  key: string;
  code: string;
  name: string;
  country: string;
  lat: number;
  lon: number;
  region: "west" | "north" | "central" | "south" | "east" | "intl";
};

const CITIES: Record<string, City> = {
  amsterdam: { key: "amsterdam", code: "AMS", name: "Amsterdam", country: "Netherlands", lat: 52.37, lon: 4.9, region: "west" },
  brussels: { key: "brussels", code: "BRU", name: "Brussels", country: "Belgium", lat: 50.85, lon: 4.35, region: "west" },
  paris: { key: "paris", code: "PAR", name: "Paris", country: "France", lat: 48.86, lon: 2.35, region: "west" },
  london: { key: "london", code: "LON", name: "London", country: "United Kingdom", lat: 51.51, lon: -0.13, region: "west" },
  dublin: { key: "dublin", code: "DUB", name: "Dublin", country: "Ireland", lat: 53.35, lon: -6.26, region: "west" },
  berlin: { key: "berlin", code: "BER", name: "Berlin", country: "Germany", lat: 52.52, lon: 13.41, region: "central" },
  hamburg: { key: "hamburg", code: "HAM", name: "Hamburg", country: "Germany", lat: 53.55, lon: 9.99, region: "central" },
  prague: { key: "prague", code: "PRG", name: "Prague", country: "Czechia", lat: 50.08, lon: 14.44, region: "central" },
  vienna: { key: "vienna", code: "VIE", name: "Vienna", country: "Austria", lat: 48.21, lon: 16.37, region: "central" },
  warsaw: { key: "warsaw", code: "WAW", name: "Warsaw", country: "Poland", lat: 52.23, lon: 21.01, region: "east" },
  copenhagen: { key: "copenhagen", code: "CPH", name: "Copenhagen", country: "Denmark", lat: 55.68, lon: 12.57, region: "north" },
  stockholm: { key: "stockholm", code: "STO", name: "Stockholm", country: "Sweden", lat: 59.33, lon: 18.07, region: "north" },
  madrid: { key: "madrid", code: "MAD", name: "Madrid", country: "Spain", lat: 40.42, lon: -3.7, region: "south" },
  lisbon: { key: "lisbon", code: "LIS", name: "Lisbon", country: "Portugal", lat: 38.72, lon: -9.14, region: "south" },
  milan: { key: "milan", code: "MIL", name: "Milan", country: "Italy", lat: 45.46, lon: 9.19, region: "south" },
  rome: { key: "rome", code: "ROM", name: "Rome", country: "Italy", lat: 41.9, lon: 12.5, region: "south" },
  istanbul: { key: "istanbul", code: "IST", name: "Istanbul", country: "Türkiye", lat: 41.01, lon: 28.98, region: "east" },
  newyork: { key: "newyork", code: "NYC", name: "New York", country: "United States", lat: 40.71, lon: -74.01, region: "intl" },
  toronto: { key: "toronto", code: "YTO", name: "Toronto", country: "Canada", lat: 43.65, lon: -79.38, region: "intl" },
  dubai: { key: "dubai", code: "DXB", name: "Dubai", country: "United Arab Emirates", lat: 25.2, lon: 55.27, region: "intl" },
  singapore: { key: "singapore", code: "SIN", name: "Singapore", country: "Singapore", lat: 1.35, lon: 103.82, region: "intl" },
};

/* ---- Partners ------------------------------------------------------------
   Invented names, assigned by where the lane runs, so a shop shipping to
   Spain does not see a Nordic parcel network quoting the leg.             */

const PARTNERS: Record<City["region"], string[]> = {
  west: ["Vinkveld Logistiek", "Noordkust Parcel"],
  north: ["Bergstrand Frakt", "Noordkust Parcel"],
  central: ["Alpen Fracht", "Vinkveld Logistiek"],
  south: ["Meridian Cross-border", "Aurelia Trasporti"],
  east: ["Karpat Lojistik", "Alpen Fracht"],
  intl: ["Meridian Cross-border", "Longhaul Freight Union"],
};

const OWN_CARRIER: Record<City["region"], string> = {
  west: "DHL",
  north: "PostNL",
  central: "DPD",
  south: "GLS",
  east: "UPS",
  intl: "FedEx",
};

/** Great-circle distance in kilometres. */
function distance(a: City, b: City) {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lon - a.lon);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

/** A small deterministic wobble, so lanes are not perfectly proportional. */
function jitter(seed: string, spread: number) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (((h >>> 0) % 1000) / 1000 - 0.5) * 2 * spread;
}

const round = (n: number) => Math.round(n * 20) / 20; // to the nearest 5 cents

function buildLane(fromKey: string, toKey: string): Lane {
  const a = CITIES[fromKey];
  const b = CITIES[toKey];
  const km = distance(a, b);
  const crossBorder = a.country !== b.country;
  const intl = a.region === "intl" || b.region === "intl";

  const id = `${a.code}-${b.code}`.toLowerCase();
  const pool = PARTNERS[b.region];

  /* Base rate: a floor plus a distance component that flattens out, because
     carrier pricing is banded rather than linear. */
  const base = 4.6 + Math.pow(km, 0.46) * (intl ? 0.62 : 0.33);
  const border = crossBorder ? 1.1 : 0;

  const economy = round(base + border + jitter(id + "e", 0.5));
  const standard = round(economy * 1.22 + 0.4 + jitter(id + "s", 0.4));
  const locker = round(economy * 1.06 + jitter(id + "l", 0.35));
  const express = round(standard * 1.85 + (intl ? 6 : 1.4) + jitter(id + "x", 0.9));

  const baseDays = intl
    ? Math.max(3, Math.round(km / 3400) + 3)
    : Math.max(1, Math.round(km / 620) + 1);

  return {
    id,
    from: a.code,
    to: b.code,
    origin: a.name,
    destination: b.name,
    originCountry: a.country,
    destinationCountry: b.country,
    services: [
      {
        id: "economy",
        name: "Parcelway Economy",
        partner: pool[0],
        source: "partner",
        price: economy,
        days: baseDays + 2,
        note: "Tracked, no signature",
      },
      {
        id: "standard",
        name: "Routewise Standard",
        partner: pool[0],
        source: "partner",
        price: standard,
        days: baseDays,
        note: "Tracking and delivery updates",
      },
      {
        id: "locker",
        name: "Pickup Point Direct",
        partner: pool[1],
        source: "partner",
        price: locker,
        days: baseDays + 1,
        note: "Delivered to a collection point",
      },
      {
        id: "express",
        name: "Swiftline Express",
        partner: `Your ${OWN_CARRIER[b.region]} contract`,
        source: "own",
        price: express,
        days: Math.max(1, baseDays - 1),
        note: "Priority handling, signature",
      },
    ],
  };
}

/* Thirty-six lanes: the dense western core, the German and Nordic runs, the
   southern and eastern legs, and six intercontinental routes. */
const PAIRS: [string, string][] = [
  ["amsterdam", "berlin"],
  ["amsterdam", "paris"],
  ["amsterdam", "london"],
  ["amsterdam", "brussels"],
  ["amsterdam", "madrid"],
  ["amsterdam", "milan"],
  ["amsterdam", "copenhagen"],
  ["amsterdam", "warsaw"],
  ["amsterdam", "vienna"],
  ["amsterdam", "dublin"],
  ["amsterdam", "newyork"],
  ["amsterdam", "dubai"],
  ["paris", "brussels"],
  ["paris", "madrid"],
  ["paris", "milan"],
  ["paris", "berlin"],
  ["paris", "lisbon"],
  ["london", "dublin"],
  ["london", "paris"],
  ["london", "hamburg"],
  ["london", "newyork"],
  ["berlin", "vienna"],
  ["berlin", "warsaw"],
  ["berlin", "prague"],
  ["berlin", "copenhagen"],
  ["hamburg", "stockholm"],
  ["copenhagen", "stockholm"],
  ["madrid", "lisbon"],
  ["madrid", "milan"],
  ["milan", "rome"],
  ["milan", "vienna"],
  ["vienna", "warsaw"],
  ["warsaw", "istanbul"],
  ["prague", "istanbul"],
  ["madrid", "toronto"],
  ["milan", "singapore"],
];

export const lanes: Lane[] = PAIRS.map(([a, b]) => buildLane(a, b));

/** Look up the worldmap key for a city name, for the lane map. */
export const cityKey = (name: string) =>
  Object.values(CITIES).find((c) => c.name === name)?.key ?? "amsterdam";

export const euro = (value: number) =>
  new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
  }).format(value);
