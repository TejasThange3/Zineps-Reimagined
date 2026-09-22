# Verification record

**This document records the initial one-page build. For the current 15-page expansion, revised header behavior, new interactions and latest results, see [revision-qa.md](revision-qa.md). The Lighthouse figures below are historical, not scores for the expanded site.**

Date: 14 September 2026. Environment: Windows, Node.js 20.19.4, installed Google Chrome through Playwright. The live reference's connected browser was unavailable; local headless Chrome was available and used successfully.

## Completed checks

- Production build: `npm run build` passes (TypeScript plus Vite).
- Explicit type check and ESLint pass.
- Vitest: 10 tests pass. All three lanes choose economy for cost, express for speed and standard for balanced. Edge cases cover ties, zero normalization ranges, identical rates/times, singleton input, empty input and non-mutation.
- Playwright: 7 end-to-end tests pass against the production build. All nine lane/priority combinations, explanation dialog, selected shipment details, drawer keyboard focus cycling and restoration, mobile navigation, partner mode and CTA destinations, integration filters, FAQ, anchor validity and all four scroll states are exercised.
- axe WCAG 2 A/AA and 2.1 AA: no automated violations at 1440px, 390px, or inside the open shipment drawer. This is an automated scan, not a claim of exhaustive accessibility certification.
- Runtime checks detected no page errors, failed HTTP responses or missing rendered image assets during responsive tests.
- No horizontal document overflow at 360, 390, 768, 1024, 1440 and 1920px. An additional 720px reflow check passed (equivalent available CSS width to a 1440px viewport at 200% zoom). Actual browser chrome zoom and assistive-technology sessions were not tested.
- Final first-fold screenshots visually reviewed at mobile, tablet, laptop and wide desktop sizes. Entire page, demo, merchant workspace and mobile drawer also inspected. Full-page images are saved under `docs/screenshots/`.
- Keyboard arrow keys change native priority radios. Escape closes dialogs; focus returns to their triggers. Repeated Tab remains in the open drawer/menu. Scroll locking is restored after close.
- Anchor alignment was measured at approximately 104px below the viewport top, below the sticky header.
- Reduced motion stops ambient parcel animation and smooth scrolling, removes the sticky product story and exposes four linear product states. No forced scrolling or wheel interception.
- Supplied logo and local brand copy are byte-identical (SHA-256 checked). Original user assets remain untouched.
- Social preview generated from the actual built design and visually inspected. Font licenses included locally.
- Final dependency install audit reports **0 vulnerabilities**. The one-off Lighthouse dependency was removed after saving reports; it is not required to build, test or run the site.

## Measured performance

One Lighthouse mobile lab run against the local production preview, using Lighthouse 12.8.2, recorded:

| Measure | Result |
| --- | --- |
| Performance | 94 |
| Accessibility | 100 |
| Best practices | 96 |
| SEO | 92 |
| First contentful paint | 2.0 s |
| Largest contentful paint | 2.4 s |
| Speed index | 2.0 s |
| Total blocking time | 160 ms |
| Cumulative layout shift | 0.004 |

Reports: `lighthouse-mobile.report.html` and `.json`. The initial sandboxed Lighthouse attempt could not connect to its browser; the authorized retry succeeded. These scores describe the measured build, before the final robots.txt addition and mobile text-size refinements; those final changes passed the production/browser checks but Lighthouse was not repeated. Lighthouse flagged small metadata text, render-blocking CSS, unused JavaScript and the large decorative/product DOM. Some compact labels remain intentionally small, with readable primary content and accessible contrast. Missing robots.txt was fixed. No performance or SEO score is claimed for a public deployment.

The lab result is not real-user field data. Total blocking time is not INP; real-user INP has not been measured. Performance depends on deployment, cache, device and network. The production JavaScript bundle is approximately 410 KB (127 KB gzip), CSS approximately 52 KB (11 KB gzip). Only the Latin font subsets are served for this English page.

## Fixes found through verification

- Added explicit modal focus cycling for a drawer containing a single focusable control.
- Corrected the recommendation checkmark's accessible text semantics.
- Increased small interface copy and darkened metadata on pale backgrounds after contrast failures.
- Prevented initial reveal opacity from hiding the hero's core message.
- Restricted the map to its scene, preventing it from bleeding into adjacent content.
- Reduced font payload to the required Latin subsets.
- Added a valid robots.txt and updated the unit-test dependency to its security-fixed version.

## Deployment and remaining limits

- Ready-to-deploy static output is in `dist/`. Local development preview: http://127.0.0.1:5173/ . Production preview: http://127.0.0.1:4173/ while that process remains running.
- No public deployment was attempted because the workspace has no configured hosting project or account choice. Exact deployment steps are in `README.md`.
- Set an absolute Open Graph image URL and canonical URL once a real deployment domain exists. A relative image path is included for local/static preview only.
- No backend, real shipment purchase, real carrier quote, login flow or real AI request was implemented or tested; all demo data is explicitly illustrative.
- Official outbound destinations were verified by web retrieval. Registration redirects to `https://app.zineps.com/register`. External services' actual onboarding availability remains under Zineps's control.
- Cross-browser Firefox/Safari, screen-reader reading order with actual assistive technology, and physical mobile devices were not tested.

## Representative artifacts

- `screenshots/desktop-hero.png`, `screenshots/mobile-hero.png`
- `screenshots/desktop-1440.png`, `screenshots/desktop-390.png` (full-page production browser-test captures; filename prefix is shared across widths)
- `screenshots/mobile-drawer.png`
- `layout-checks.json`
- `../public/assets/social-preview.png`

The source screenshots in `SS/` are reference inputs, not screenshots of the redesign. Intermediate captures retain their descriptive filenames; the production test captures reflect the final verified layout.
