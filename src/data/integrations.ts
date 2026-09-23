import type { MarkId } from "../components/Mark";

/* ==========================================================================
   The integration directory, as listed on zineps.com/integrations.
   Descriptions are written for this concept; the roster is theirs.
   ========================================================================== */

export type Category = "Stores" | "Marketplaces" | "Operations" | "Carriers";

export type Integration = {
  name: string;
  category: Category;
  mark?: MarkId;
  blurb: string;
};

export const categories: Category[] = [
  "Stores",
  "Marketplaces",
  "Operations",
  "Carriers",
];

export const integrations: Integration[] = [
  // ---- Stores -------------------------------------------------------------
  {
    name: "Shopify",
    category: "Stores",
    mark: "shopify",
    blurb: "Orders sync in, tracking syncs back, and fulfilment closes itself.",
  },
  {
    name: "WooCommerce",
    category: "Stores",
    mark: "woocommerce",
    blurb: "The WordPress store plugin, connected without touching PHP.",
  },
  {
    name: "Magento",
    category: "Stores",
    mark: "magento",
    blurb: "Open-source commerce at scale, with labels and statuses automated.",
  },
  {
    name: "Lightspeed",
    category: "Stores",
    mark: "lightspeed",
    blurb: "Shop floor and online store shipping from one queue.",
  },
  {
    name: "PrestaShop",
    category: "Stores",
    mark: "prestashop",
    blurb: "Orders, labels and delivery updates handled end to end.",
  },
  {
    name: "Wix",
    category: "Stores",
    mark: "wix",
    blurb: "Site-builder stores plugged into a real shipping workflow.",
  },
  {
    name: "CCV Shop",
    category: "Stores",
    mark: "ccvshop",
    blurb: "Dutch commerce platform, connected in a few minutes.",
  },
  {
    name: "MijnWebwinkel",
    category: "Stores",
    mark: "mijnwebwinkel",
    blurb: "Small Dutch stores shipping on partner rates from day one.",
  },

  // ---- Marketplaces -------------------------------------------------------
  {
    name: "Bol",
    category: "Marketplaces",
    mark: "bol",
    blurb: "The Dutch marketplace, with its delivery promises respected.",
  },
  {
    name: "Amazon",
    category: "Marketplaces",
    mark: "amazon",
    blurb: "Seller-fulfilled orders alongside every other channel.",
  },
  {
    name: "Kaufland",
    category: "Marketplaces",
    mark: "kaufland",
    blurb: "German marketplace volume in the same queue as your own store.",
  },
  {
    name: "Mirakl",
    category: "Marketplaces",
    mark: "mirakl",
    blurb: "Enterprise marketplace operator, connected once for every seller.",
  },
  {
    name: "Temu",
    category: "Marketplaces",
    mark: "temu",
    blurb: "Marketplace orders routed through your existing carrier mix.",
  },

  // ---- Operations ---------------------------------------------------------
  {
    name: "Picqer",
    category: "Operations",
    mark: "picqer",
    blurb: "Warehouse software that picks, packs and hands off to shipping.",
  },
  {
    name: "GoedGepickt",
    category: "Operations",
    mark: "goedgepickt",
    blurb: "Stock, orders and returns kept in step with dispatch.",
  },
  {
    name: "Lyra WMS",
    category: "Operations",
    mark: "lyrawms",
    blurb: "Scalable warehouse management wired straight into label creation.",
  },
  {
    name: "ChannelDock",
    category: "Operations",
    mark: "channeldock",
    blurb: "Multichannel order management feeding one shipping workflow.",
  },
  {
    name: "Odoo",
    category: "Operations",
    mark: "odoo",
    blurb: "ERP, commerce and inventory, with shipping on the same records.",
  },
  {
    name: "Exact Online",
    category: "Operations",
    mark: "exactonline",
    blurb: "Accounting and invoicing aligned with what you actually shipped.",
  },
  {
    name: "Microsoft Dynamics",
    category: "Operations",
    mark: "microsoftdynamics",
    blurb: "Enterprise ERP connected to orders, stock and dispatch.",
  },
  {
    name: "SnelStart",
    category: "Operations",
    mark: "snelstart",
    blurb: "Dutch bookkeeping kept in sync with shipment costs.",
  },
  {
    name: "Moneybird",
    category: "Operations",
    mark: "moneybird",
    blurb: "Invoicing that reconciles against the labels you bought.",
  },
  {
    name: "StockitUP",
    category: "Operations",
    mark: "stockitup",
    blurb: "Inventory and warehouse management for growing stores.",
  },

  // ---- Carriers -----------------------------------------------------------
  {
    name: "DHL",
    category: "Carriers",
    mark: "dhl",
    blurb: "Domestic and cross-border parcels, on partner or own contract.",
  },
  {
    name: "PostNL",
    category: "Carriers",
    mark: "postnl",
    blurb: "The Dutch postal network, including parcel lockers.",
  },
  {
    name: "DPD",
    category: "Carriers",
    mark: "dpd",
    blurb: "European road network with predictable transit times.",
  },
  {
    name: "UPS",
    category: "Carriers",
    mark: "ups",
    blurb: "Express and standard services worldwide.",
  },
  {
    name: "FedEx",
    category: "Carriers",
    mark: "fedex",
    blurb: "International express, with customs paperwork prepared.",
  },
  {
    name: "GLS",
    category: "Carriers",
    mark: "gls",
    blurb: "European parcel delivery with a dense drop-off network.",
  },
  {
    name: "Bpost",
    category: "Carriers",
    mark: "bpost",
    blurb: "Belgian postal and parcel services.",
  },
  {
    name: "Correos",
    category: "Carriers",
    mark: "correos",
    blurb: "Spanish postal network for Iberian destinations.",
  },
  {
    name: "DB Schenker",
    category: "Carriers",
    mark: "dbschenker",
    blurb: "Freight and pallet movements for heavier B2B shipments.",
  },
];

export const integrationsFaq = [
  {
    q: "What if the carrier I use is not listed?",
    a: "Tell Zineps which one. If you ship enough volume through it, they build the connection, usually within a week and at no extra cost.",
  },
  {
    q: "Do I need to build something for each carrier?",
    a: "No. That is the point of the platform. One Zineps integration covers every carrier behind it, with the same request shape, the same label handling and the same tracking events.",
  },
  {
    q: "Can I connect more than one store to one account?",
    a: "Yes. Multiple stores, marketplaces and warehouses feed the same shipping queue, and your plan sets how many connections you can run at once.",
  },
  {
    q: "Can I keep my own carrier contracts?",
    a: "Yes, from the Start-up plan upward. Your contracts sit next to partner rates in the same comparison, and a rule can prefer whichever you want.",
  },
];
