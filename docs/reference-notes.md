# Reference notes

Access date: 22 September 2026. Reference: <https://www.zineps.com/>

## How the reference was accessed

The live site was opened and **visually inspected** in a real browser (the
Claude desktop browser pane, Chromium), not only read as HTML. Page text was
extracted with `document.body.innerText`, computed colours and fonts were read
from `getComputedStyle`, and screenshots were taken. The supplied screenshot
sets in `SS/` and `current site ss/` were also reviewed.

Pages visited:

| URL | What it is |
| --- | --- |
| `/` | Homepage, English |
| `/shipping` | Shipping software (served in Dutch) |
| `/logistics-operating-system` | Partner platform |
| `/ai-shipping-intelligence` | Shipping AI (note: `/shipping-ai` returns 404 on the live site) |
| `/integrations` | Integration and carrier directory |
| `/pricing` | Plans, comparison table, FAQ |
| `/blog?lang=en` | Blog index |

## Verified from the live site

**Positioning.** Zineps is one infrastructure layer with a dashboard and an
API, serving two sides: businesses that ship, and the logistics partners that
move their goods. A matching engine pairs merchants with partners who already
hold high-volume carrier deals.

**Audiences.** E-commerce retailers, online stores, dropshippers, wholesale
distributors, factories and B2B suppliers on the demand side. Carriers,
freight forwarders and 3PLs on the supply side.

**Capabilities named on the site.** Automatic carrier selection on price and
speed, label generation, pickup and return management, dynamic checkout
integrations, own contracts or the partner network, branded tracking, branded
packing slips, branded returns portal, address validation, Scan and Go,
automation rules, order status, customs handling, partner rate publication,
contract and margin management per customer group, automatic invoicing,
onboarding and support tooling.

**Figures published by Zineps** (reused in this concept, attributed on the
page where they appear):

| Figure | Where it appears on zineps.com |
| --- | --- |
| 20+ shipping partners, 200+ destination countries, 1,000+ shipping methods | Homepage |
| 300+ million goods moved yearly | Homepage, global scale band |
| 100+ million economic value created annually | Homepage, global scale band |
| 12+ million parcels processed annually | Homepage, global scale band |
| 1,000+ active shippers, 100+ integrations, 5M+ shipments processed | Logistics operating system page |
| 80+ carriers, 100+ integrations | Integrations page |
| 99.9% uptime | Homepage |
| +55% operational efficiency, +40% support efficiency, 10x integration speed | Logistics operating system page |

**Pricing** (annual-billing rate, read from `/pricing`):

| Plan | Per month | Per label | Included shipments |
| --- | --- | --- | --- |
| Free | EUR 0 | EUR 0 | 200 |
| Start-up | EUR 20 | EUR 0.10 | 500 |
| Growth | EUR 55 | EUR 0.09 | 1,500 |
| Scale-up | EUR 127 | EUR 0.07 | 12,000 |
| Enterprise | EUR 239 | EUR 0.06 | 35,000 |

Annual billing is stated to save 20%. The monthly rates shown in this concept
are derived from that (`annual / 0.8`, rounded) and are labelled as such in
`src/data/pricing.ts`, because the live site does not print them.

**Contact details.** info@zineps.com, 020 261 4474, Herikerbergweg 288,
1101 CT Amsterdam.

**Brand values sampled from the live site and the supplied logo.**

| Token | Value | Source |
| --- | --- | --- |
| Mint | `#72C8B9` | `logo.svg` fill, and `rgb(112, 202, 185)` in the live stylesheet |
| Deep teal | `#0F7F75` | Live stylesheet |
| Wordmark grey | `#424242` | `logo.svg` fill |

The live site renders in the browser's default UI sans-serif stack. It has no
custom typeface.

## Visual observations from browser inspection

- Centred hero with a very large grotesque headline over a pale mint wash,
  with a perspective tablet mockup cropped at the bottom of the viewport.
- Pale backgrounds throughout, with one dark section for global scale.
- Rounded cards with light borders, icon-in-a-square feature tiles, and a
  numbered FAQ accordion.
- A carrier and platform logo wall using the same assets supplied in
  `public/assets/partners/`.

## Original redesign decisions

Everything below is this concept's own work, not observed on the reference.

- Art direction, layout system, grid, spacing scale and shadow scale.
- Typeface selection: Geist Variable and Geist Mono, self-hosted.
- Palette construction: brand mint and deep teal extended into a full
  neutral and accent ramp, with light and dark themes.
- All page structures, section order and section composition.
- All headline and body copy, except the factual claims listed above.
- The interactive rate console, shipment rail, audience switch, rule builder,
  pricing estimator and integration directory.
- The six blog guides in `src/data/articles.ts`.

## Illustrative demo content

Clearly labelled on the page wherever it appears:

- Lanes, services, partners, rates and delivery estimates in the rate console.
  Service names (Routewise Standard, Parcelway Economy, Swiftline Express,
  Pickup Point Direct) and partner names (Vinkveld Logistiek, Noordkust
  Parcel, Meridian Cross-border, Alpen Fracht) are invented.
- The example order `#DEMO-0042` and its recipient.
- Carrier on-time percentages in the Shipping AI panel.
- Partner workspace customer groups and margins.
- The example customs document.

Nothing on the site contacts a carrier, an AI service or any backend.

## Uncertain or deliberately omitted

- **Testimonials.** The live site carries named customer quotes. They are not
  reproduced here and no substitutes were invented, because a redesign concept
  should not put words in a real customer's mouth.
- **The `/shipping` page is served in Dutch** on the live site while the rest
  is English. This concept is English throughout.
- **Product screenshots.** The reference shows dashboard mockups. Rather than
  imitate them, this concept builds small working versions of the relevant
  interface, so nothing here is a picture of a product that may have changed.
- **"80+ carriers" vs "20+ shipping partners"** are both published by Zineps
  and refer to different things: carriers reachable through the platform, and
  logistics partners contracted on it. Both are used as published.
