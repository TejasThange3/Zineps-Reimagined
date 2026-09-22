# Zineps — Every shipment. A smarter way.

A multi-page independent Zineps redesign built with React, TypeScript and Vite. The original brief and all supplied assets remain in `master prompt.md`, `SS/` and `current site ss/`. The follow-up request expands the original landing page into 15 addressable pages.

## Run locally

Requires Node.js 20.19+ (tested with 20.19.4) and npm.

```sh
npm ci
npm run dev
```

Open http://127.0.0.1:5173/ .

## Build and verify

```sh
npm run typecheck
npm run lint
npm test
npm run build
npm run preview
```

Production preview: http://127.0.0.1:4173/ . Output: `dist/`.

```sh
npm run test:e2e
```

Browser tests use installed Google Chrome via Playwright. If Chrome is unavailable, install it or change `channel` in `playwright.config.ts` to a locally installed supported browser. The test runner starts a production preview when one is not already running. Build first.

## What works

Latest visual updates: stronger centered Start Shipping CTA, original trusted-brand carousel and integration logos, rotating globe with moving routes, source-matched statistics, monthly/annual pricing with a synchronized estimator, and six distinct journal illustrations. See [September 15 refinements and sources](docs/september-15-refinements.md).

- Full destinations: `/shipping`, `/logistics-operating-system`, `/shipping-ai`, `/integrations`, `/pricing`, `/blog`, `/knowledge-base`, `/contact`, plus six `/blog/:slug` guides and the expanded homepage.
- Ordinary-flow navigation: the header scrolls away, with desktop Platform disclosure and an accessible mobile menu.
- Geographic network with six selectable animated routes connecting seven cities, pause/play, offscreen/tab pausing and reduced-motion support.
- Three lanes, three shipping priorities and deterministic recommendations.
- Accessible shipment drawer and explanation dialog.
- Four-stage scroll-driven product narrative, linear on mobile/reduced motion.
- Merchant workspace: select orders, prepare local demo labels, test destination/weight rules, inspect tracking, and open a label preview matching the selected order.
- Post-purchase tracking, local return preview and branded packing-slip views.
- Partner workspace: overview, selectable customers, service catalogue and support context.
- Searchable/filterable 32-entry integration directory with accessible detail dialogs.
- Five verified monthly/annual pricing tiers, a comparison table and a volume-based cost estimator (postage excluded).
- Searchable journal with six original full guides, knowledge-base topics and contact-topic selection.
- Merchant/partner homepage switch, integration diagram, cross-border globe, editorial artwork and FAQ.
- Local fonts, unmodified supplied logo, social preview and example disclosures.

## Demo logic

All shipment services, quotes, delivery estimates and workspace records are illustrative. Pricing plans are separately sourced from the official Zineps pricing page, dated on the page. Nothing calls a carrier or AI backend, purchases a real label, books a shipment, submits a return or collects contact details. Label and return preparation changes local component state only.

Lowest cost minimizes price. Fastest delivery minimizes business days. Balanced minimizes `0.55 × normalized price + 0.45 × normalized days`, normalizing within the selected lane. A zero range contributes zero. Ties resolve by lower price, fewer days, then alphabetical service ID. Logic and edge cases are in `src/lib/recommend.ts` and its unit tests.

## Structure

`src/components/`: hero/header, interactive demo, journey, supporting sections and shared accessible UI.

`src/data/`: official destinations, integration metadata, shipment fixtures and journey content.

`src/styles.css`: tokens, layout, responsive rules and motion accessibility.

`src/site.css`, `src/pages.tsx`, `src/data/site.ts`: multi-page layouts, directory, pricing and editorial content. Subpages are lazy-loaded; standard document links preserve browser history and URL behavior.

`docs/`: research, design system, provenance, QA, walkthrough script, screenshots and reports.

`scripts/prepare-assets.mjs`: regenerates the geographic SVG and original reference contact sheets. `scripts/build-globe.mjs` regenerates the international globe. These assets are already supplied; regeneration is not required to build. `scripts/capture-deliverables.mjs` captures screenshots and the social preview from the production preview on port 4173. `scripts/revision-qa.mjs` and `scripts/revision-details.mjs` capture and check the multi-page expansion. Latest results are in `docs/revision-qa.md`.

## Deploy static assets

No hosting account or deployment project is configured in this workspace. The site has not been published.

1. Run `npm ci` then `npm run build`.
2. On an existing static host (for example your Netlify, Vercel or Cloudflare Pages account), create/import this project with build command `npm run build` and output directory `dist`.
3. For a manual static upload, upload only the contents of `dist/`, preserving its `assets/` directory. Do not upload `SS/`, `node_modules/` or the project root.
   The build emits each route as a directory with an `index.html` shell and its own metadata, so known deep links do not require a catch-all rewrite. React renders the page content in the browser. Configure `404.html` as your host’s missing-page fallback if supported.
4. Serve at the domain root. For subdirectory hosting, configure Vite's `base` and root-relative public asset URLs before building.
5. Once the final domain exists, make `og:image` in `index.html` an absolute URL to `/assets/social-preview.png` on that domain; add the canonical URL, then rebuild.
6. Verify the public URL, assets, mobile navigation, comparison, drawer and official outbound links. No backend environment variables or secrets are needed.

The “Start shipping” and contact CTAs lead to verified official Zineps destinations. This concept does not impersonate an authenticated Zineps service and clearly identifies itself as an independent redesign.
