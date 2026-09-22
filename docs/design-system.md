# Design system

The whole visual language lives in `src/styles/tokens.css`. Nothing in the
components hard-codes a colour, a duration or a radius.

## Concept

Zineps is infrastructure. The art direction treats it that way: a calm paper
canvas, hairline structure instead of card borders, monospaced tabular
numerals wherever a number matters, and the brand mint reserved for the one
thing on screen that is live.

The recurring object is the **instrument panel**: an outer tray holding an
inner surface, with concentric radii so the two curves stay parallel. It reads
as a machined thing rather than a floating card, and it is used for every
interactive demonstration on the site.

## Colour

Sampled from the official logo and the live site: mint `#72C8B9`, deep teal
`#0F7F75`.

Mint is too pale to carry text on white, so the ramp splits the job. The
**deep teal carries every interactive and accent role in light mode**, which
clears WCAG AA comfortably, while the **pale mint carries them in dark mode**,
where emission inverts the problem. The brand cue survives in both.

Neutrals are cool with a faint green cast, so they sit under the mint rather
than fighting it.

One accent, used consistently: the active row in the console, the selected
plan, the recommended service, links, primary buttons, and the hairline that
marks progress. Nothing else is coloured.

## Type

`Geist Variable` for everything, `Geist Mono` for data, numerals and micro
labels. Self-hosted through Fontsource, so there is no third-party font
request.

Tracking tightens as size increases, which is how type is actually drawn:

| Role | Size | Tracking |
| --- | --- | --- |
| Display | `clamp(2.375rem, 1.5rem + 2.75vw, 3.625rem)` | `-0.042em` |
| H1 | `clamp(2.25rem, 1.25rem + 3.2vw, 3.75rem)` | `-0.034em` |
| H2 | `clamp(1.75rem, 1.15rem + 1.9vw, 2.75rem)` | `-0.026em` |
| Body | `1rem` | `-0.008em` |
| Micro label | `0.6875rem` | `+0.09em` |

`font-variant-numeric: tabular-nums` is set on `body`, so every column of
figures aligns without per-component effort.

## Shape

One radius scale, applied by role and never mixed arbitrarily:

- Actions are pills (`--r-pill`)
- Panels are `--r-lg`, trays are `--r-xl`, inner cores are `calc(--r-xl - 7px)`
- Inputs and small surfaces are `--r-md`
- Tags and ticks are `--r-sm`

## Elevation

Four shadow steps, all tinted to the background hue and layered from a tight
contact shadow to a wide ambient one. No pure-black drop shadows.

Panels are used only where elevation means something. Most grouping is done
with hairlines and space.

## Motion

| Token | Value | Used for |
| --- | --- | --- |
| `--d-press` | 130ms | Button press feedback |
| `--d-hover` | 180ms | Colour and border changes |
| `--d-pop` | 220ms | Popovers, thumbs, marks |
| `--d-panel` | 320ms | Disclosures, header condense |
| `--ease-out` | `cubic-bezier(0.23, 1, 0.32, 1)` | Anything entering |
| `--ease-soft` | `cubic-bezier(0.16, 1, 0.3, 1)` | Scroll reveals |

Rules the codebase actually follows:

- Only `transform` and `opacity` animate. Nothing animates `all`.
- Every pressable element scales to `0.97` on `:active`.
- Hover effects are gated behind `@media (hover: hover) and (pointer: fine)`.
- Popovers scale from their trigger, not from their own centre.
- Crossfades between two states carry a 3px blur, so the eye reads one object
  changing rather than two objects swapping.
- Scroll reveals use one `IntersectionObserver` per element, disconnected the
  moment it fires. There is no scroll listener anywhere in the app.
- Reading progress uses the CSS scroll timeline, so it runs off the main
  thread and costs no JavaScript at all.
- Everything degrades under `prefers-reduced-motion: reduce`.

## Logo marks

The supplied partner logos are raster PNGs wrapped in SVG, several cropped by
a pattern transform and several sitting on a solid plate.
`scripts/build-marks.mjs` rasterises each one, derives an alpha channel from
its transparency or, where the artwork is plated, from its luminance measured
against the plate's own colour, trims to the ink, and writes a black PNG whose
only content is that alpha. Ten brands where the source was unrecoverable use
the official Simple Icons vector instead.

The site paints these through a CSS mask, so the whole wall takes one ink
colour and dark mode needs no second asset.

Sizing is optical rather than fixed: `height = base / ratio^0.34`. A square
badge keeps full height, a 4:1 wordmark drops to about 62% of it. Sizing them
all to one height makes badges look twice the weight of wordmarks.

## Accessibility

`npm run a11y` runs axe across every route, in both themes, at 1440px and
390px. 44 page checks, zero WCAG 2.1 A or AA violations.

Specific decisions:

- `--text-mute` and `--text-faint` are tuned to clear 4.5:1 against
  `--bg-sunken`, the darkest surface they land on, not just against white.
- Horizontally scrollable tables are focusable, named and show a focus ring.
- The segmented control is keyboard-operable with arrow keys.
- Native `<select>` elements sit invisibly over their styled label, so the
  rate console and rule builder keep full platform behaviour.
- One focus treatment site-wide, never removed.
