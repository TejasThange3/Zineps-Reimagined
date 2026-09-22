# Expanded site verification — 14 September 2026

This record supersedes the initial single-page checks in `qa.md`. The follow-up asked for the wider site, more content and visual depth, multiple active map routes, and a header that scrolls out of view.

## Delivered scope

15 addressable pages: expanded homepage; shipping software; logistics operating system; Shipping AI; integrations; pricing; journal; knowledge base; contact; six complete educational guide pages. Unknown routes show a helpful missing-page view. The production build emits a directory/index shell for every known route, page metadata, and `404.html`; it is not server-side rendering.

The original 53 screenshots and nine current-site screenshots were used for visual comparison. Added product demonstrations cover orders, destination/weight automation, local label preparation, tracking, branded return previews, packing slips, partner customers, services and support. Editorial artwork is code-native, the international globe is geographic SVG, and the supplied logo is unchanged.

## Results

- `npm run build`: passes, including TypeScript and 15 static route shells.
- `npm run typecheck` and `npm run lint`: pass.
- `npm test`: all 10 deterministic recommendation tests pass.
- `npm run test:e2e`: all 18 browser tests pass in installed Chrome against the production build.
- Direct navigation to all 15 pages, missing-page handling, valid local anchors, back navigation and lazy-page deep-link anchors verified.
- Header position measured after scrolling: fully above the viewport. It is not sticky or fixed. The desktop Platform disclosure supports outside click and Escape; mobile navigation retains modal focus behavior.
- Six map lanes update the selected path, origin/destination, example service and estimate. Manual pause/play verified. Ambient motion respects reduced motion, document visibility and intersection visibility.
- Merchant multi-select prepares the corresponding local sample labels. Label preview uses the first prepared order's store, destination, weight and identifier. Rule tests verify one/two/no matching records at different destination/weight boundaries.
- Partner customer selection, service catalogue and support context work. Return reason selection and local return preview/reset work. Packing slip and tracking views are available.
- Integration search/category combination, empty-state recovery, detail dialog and restored focus verified. Directory contains 32 named entries, not a numerical marketing claim.
- Pricing estimator verifies volume boundaries at 200/201, 750, 1,501, 12,001 and above 35,000. Excludes postage and other stated charges. Label costs use the published per-label values and annual subscription equivalents.
- Journal search, full guide content, knowledge search and contact-topic selection work. No contact data is collected or sent.
- `scripts/revision-qa.mjs`: 30 route/viewport checks at 390, 768 and 1440px, with **zero horizontal page overflows, zero automated WCAG A/AA violations, and zero page runtime errors**. Raw results: `revision-qa.json`.
- `scripts/revision-details.mjs`: 36 additional route/viewport checks at 360, 720, 1024 and 1920px, with **zero horizontal page overflows**. Raw results: `revision-breakpoints.json`.
- Additional automated accessibility checks cover all eight merchant/partner workspace states at 360px, post-purchase packing slip, homepage at desktop/mobile widths, and the shipment dialog. These are automated checks, not a full accessibility certification.
- Images were decoded during responsive browser tests; no missing images or failed HTTP responses were detected. Keyboard focus, dialogs, reduced motion and native radio navigation remain covered.

## Visual inspection artifacts

Fresh full-page production captures: `screenshots/revision-{page}-{390|768|1440}.png`.

Detail captures reviewed include `revision-map-390.png`, `revision-workspace-automation-390.png`, `revision-after-returns-1440.png`, `revision-platform-doors-1440.png`, and desktop page introductions for shipping, partners, pricing, integrations, journal, knowledge base and contact. Map labels were repositioned above the details card after the first inspection. Parcel geometry and geographic globe artwork were refined. Low-contrast metadata and animation-opacity contrast issues were fixed and rescanned.

The original screenshot folders are untouched. `reference-sheets/current-site-comparison.jpg` is a derived contact sheet of the nine user-provided implementation captures.

## Performance and deployment boundaries

The old Lighthouse score in `qa.md` is **historical and does not describe this expansion**. Lighthouse was not rerun for the multi-page build. Current build output is approximately 432 KB main JavaScript / 135 KB gzip, 53 KB lazy subpage JavaScript / 14 KB gzip, and 120 KB CSS / 24 KB gzip, plus local fonts and SVGs. Full route changes use ordinary document navigation; existing browser caching applies to shared assets.

No public deployment is configured or performed. Preview the built site at `http://127.0.0.1:4173/`, or develop at `http://127.0.0.1:5173/`. All operational records remain fictional. Account creation and contact actions continue to official Zineps destinations. A real backend, carrier purchase, live AI, customs validation, account integration, message submission, and real return submission are outside this frontend concept. Firefox/Safari, physical devices and assistive-technology sessions were not tested.
