export type Priority = "cost" | "speed" | "balanced";
export type Service = {
  id: string;
  name: string;
  price: number;
  days: number;
  feature: string;
};
export type Lane = {
  id: string;
  origin: string;
  destination: string;
  from: string;
  to: string;
  countryFrom: string;
  countryTo: string;
  services: Service[];
};
export const priorities: { id: Priority; label: string }[] = [
  { id: "cost", label: "Lowest cost" },
  { id: "speed", label: "Fastest delivery" },
  { id: "balanced", label: "Balanced" },
];
export const lanes: Lane[] = [
  {
    id: "ams-ber",
    origin: "Amsterdam",
    destination: "Berlin",
    from: "AMS",
    to: "BER",
    countryFrom: "Netherlands",
    countryTo: "Germany",
    services: [
      {
        id: "economy",
        name: "Parcelway Economy",
        price: 6.4,
        days: 4,
        feature: "Tracked delivery",
      },
      {
        id: "standard",
        name: "Routewise Standard",
        price: 7.9,
        days: 2,
        feature: "Tracking + delivery updates",
      },
      {
        id: "express",
        name: "Swiftline Express",
        price: 14.5,
        days: 1,
        feature: "Priority handling",
      },
    ],
  },
  {
    id: "par-bru",
    origin: "Paris",
    destination: "Brussels",
    from: "PAR",
    to: "BRU",
    countryFrom: "France",
    countryTo: "Belgium",
    services: [
      {
        id: "economy",
        name: "Parcelway Economy",
        price: 5.2,
        days: 3,
        feature: "Tracked delivery",
      },
      {
        id: "standard",
        name: "Routewise Standard",
        price: 6.1,
        days: 2,
        feature: "Tracking + delivery updates",
      },
      {
        id: "express",
        name: "Swiftline Express",
        price: 12.8,
        days: 1,
        feature: "Priority handling",
      },
    ],
  },
  {
    id: "ber-vie",
    origin: "Berlin",
    destination: "Vienna",
    from: "BER",
    to: "VIE",
    countryFrom: "Germany",
    countryTo: "Austria",
    services: [
      {
        id: "economy",
        name: "Parcelway Economy",
        price: 8.1,
        days: 5,
        feature: "Tracked delivery",
      },
      {
        id: "standard",
        name: "Routewise Standard",
        price: 9.3,
        days: 2,
        feature: "Tracking + delivery updates",
      },
      {
        id: "express",
        name: "Swiftline Express",
        price: 18.9,
        days: 1,
        feature: "Priority handling",
      },
    ],
  },
];
export const money = (value: number) =>
  new Intl.NumberFormat("en-IE", { style: "currency", currency: "EUR" }).format(
    value,
  );
