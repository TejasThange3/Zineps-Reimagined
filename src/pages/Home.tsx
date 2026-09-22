import { Hero } from "../components/home/Hero";
import { CarrierWall } from "../components/home/CarrierWall";
import { PartnerRates } from "../components/home/PartnerRates";
import { Workflow } from "../components/home/Workflow";
import { Audiences } from "../components/home/Audiences";
import { Intelligence } from "../components/home/Intelligence";
import { Developers } from "../components/home/Developers";
import { Scale } from "../components/home/Scale";
import { Faq } from "../components/Faq";
import { Closing } from "../components/Closing";

/* Answers as published by Zineps, condensed. */
const faq = [
  {
    q: "What is Zineps, in one sentence?",
    a: "One platform that connects businesses that ship with the logistics partners that move their goods, so a merchant can ship on partner rates, their own carrier contracts, or both, from a single dashboard and API.",
  },
  {
    q: "Do I need a carrier contract before I start?",
    a: "No. You can ship entirely on rates from partners in the network. If you already have your own contracts with DHL, PostNL, DPD or anyone else, connect them and use both side by side.",
  },
  {
    q: "What does it cost?",
    a: "A monthly platform fee plus a small per-label fee, starting at nothing. The free plan covers up to 200 shipments a month at zero per label. Postage itself is separate and depends on the service you choose.",
  },
  {
    q: "Which systems does it connect to?",
    a: "Shopify, WooCommerce, Magento, Lightspeed, PrestaShop, Wix, Bol, Amazon, Kaufland, Mirakl and Temu on the sales side, and Picqer, GoedGepickt, Odoo, Exact Online, Microsoft Dynamics and more on the operations side. Anything not on the list can go through the API.",
  },
  {
    q: "I am a carrier, not a shop. Is this for me?",
    a: "Yes, and it is a different product. Logistics partners publish rates and conditions, manage contracts, customer groups and margins, invoice automatically, and onboard the merchants they already serve. You keep the commercial relationship.",
  },
  {
    q: "How long does it take to get going?",
    a: "Minutes for a standard shop connection. Connect the store, confirm your sender address, and the first label can be printed the same day.",
  },
];

export function Home() {
  return (
    <>
      <Hero />
      <CarrierWall />
      <PartnerRates />
      <Workflow />
      <Audiences />
      <Intelligence />
      <Developers />
      <Scale />
      <Faq
        items={faq}
        aside={
          <p className="faq-aside">
            Something more specific?{" "}
            <a href="/contact" className="link link-accent">
              Talk to the team
            </a>
            .
          </p>
        }
      />
      <Closing />
    </>
  );
}
