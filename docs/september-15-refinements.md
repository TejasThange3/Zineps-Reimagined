# September 15 website refinements

## Sources

Reviewed all five contact sheets covering the original 53 screenshots, plus the two new screenshots in `current site ss/` (141821 and 142025).

Retrieved the official homepage, pricing, integrations, shipping, partner and AI pages on September 15, 2026. Saved source HTML and relevant public JavaScript in `docs/reference/`.

- https://www.zineps.com/ — trusted brands, original logo assets, 20+ shipping partners, 200+ destination countries, 1,000+ shipping methods, 100+ integrations, 50+ logistics partners in the coverage panel, 99.9% uptime. The different partner counts refer to the separate sections in the source; they have not been merged into one metric.
- Original screenshot 174831 and the live site's public English translation data — 300+ million goods transported annually, 100+ million economic value created annually (no currency specified in the source), 12+ million parcels processed annually.
- Original screenshot 174745 and live homepage — illustrative analytics display 12,847, +1,234 and 750. Trend graphic is illustrative; no raw time-series dataset is published.
- https://www.zineps.com/pricing and its public translation data — monthly Free/Start-up/Growth/Scale-up/Enterprise: €0/€25/€69/€159/€299. Annual monthly equivalents: €0/€20/€55/€127/€239. The source advertises 20% savings and rounds displayed annual equivalents. Label fees and monthly shipment limits remain as published.
- Pricing outcomes: 40% shipping cost savings and 15+ hours saved weekly, 98% customer satisfaction increase, 65% operational efficiency increase and 90% fewer errors, 3x faster growth. Clearly attributed as Zineps-reported results.
- https://www.zineps.com/logistics-operating-system — 1,000+ active shippers, 100+ carrier/logistics integrations, 5M+ shipments processed; +55% operational efficiency, real-time revenue insights, +40% support efficiency, 10x faster integration.
- https://www.zineps.com/integrations — original directory logos. 39 assets downloaded unmodified into `public/assets/partners/`, including the five trusted brands. `src/data/brands.json` maps display names to local files.

## Implementation

- Stronger mint Start Shipping CTA, symmetrical text padding, separate arrow positioning and consistent capitalization.
- Continuous trusted-brand carousel with pause, hover/focus pause, and reduced-motion treatment.
- Canvas globe with actual sphere rotation, geographic land points, illuminated routes and traveling markers. Generated land coordinates from the existing world-atlas dependency. Offscreen and background-tab drawing pauses; reduced-motion preference freezes movement. Hero/section globes expose a pause control; linked journal artwork uses a still rendering to avoid interactive controls inside links.
- Added network, analytics, reliability, global scale, partner and pricing outcome sections using the verified values above. Existing fictional shipment records remain explicitly illustrative, distinct from company performance claims.
- Monthly/annual toggle updates subscription cards, annual/monthly billing text, and the volume estimator together.
- Six unique journal titles and six matching illustrations. Removed the duplicate featured listing; international shipping has its own artwork. Fixed a pre-existing CSS class collision that distorted the workflow illustration.

## Verification

Production build and ESLint pass. Automated visual/interaction checks cover 390px and 1440px layouts on homepage, pricing, integrations, journal and partner pages. Reports and screenshots: `docs/refinement-qa/`. Checks include pricing values, estimator totals, unique article art, globe motion/pause, missing images, page overflow, browser errors and WCAG A/AA checks.

This entry supersedes earlier notes stating that only annual pricing, letter tiles and no source metrics were implemented.

## Follow-up: carousel and CTA alignment

Reviewed the new 145438 and 145556 screenshots. Removed trusted-brand play/pause controls and hover/focus pausing. Removed the header CTA arrow and centered the label with CSS grid. Browser measurements at 390, 768 and 1440 pixels show zero horizontal and vertical difference between the label center and button center. The carousel continues moving while hovered and focused, with no page overflow. Build and lint pass. OS reduced-motion preferences remain supported.

Final checks: all 18 existing browser scenarios passed across the initial run and the targeted rerun after fixing tablet carousel overflow and reduced-motion keyboard access. Responsive checks cover 360, 390, 768, 1024, 1440 and 1920 pixels. Final automated accessibility checks pass on desktop, mobile and the shipment drawer. The original runner's Windows preview-server shutdown stalled after its test cases; the two corrected cases were rerun successfully against the running development server using `playwright.local.config.ts`.
