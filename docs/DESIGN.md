# Neurogenix design system

The site for Neurogenix, a clinical neurophysiology practice (EEG, nerve
conduction studies, EMG). Its readers are anxious patients preparing for a test
and the clinicians who refer them. The site has to feel calm, exact and
expensive. The identity comes from the practice's logo specification
(`logo - Specifications.pdf`): the NEUROGENIX logo with its blue "NEURO", an
underline that becomes a trace through a line-drawn brain, brand blue and
brand black.

**Design read:** a visual overhaul of an existing wireframe. The content is
preserved exactly; the wireframe's single long page has been split into a
home page and four inner pages (see section 8), and the visual language is
new. Trust first, premium second, motion everywhere but never loud.

**Dials:** variance 6, motion 7, density 3.

## 1. Non-negotiables

1. **Copy comes only from `src/content/site.ts`.** Never retype, shorten or
   "improve" a string. If a component needs a string that is not there, add it
   to `site.ts` in the same register.
2. **Zero em dashes and zero en dashes** in anything a person reads, including
   alt text and aria labels. Use full stops, commas or brackets.
3. **Tokens only.** Colours come from the theme (`bg-paper`, `text-ink`,
   `bg-deep`, `text-signal-ink` ...). No raw hex in components. Dark mode then
   works automatically through the CSS variables in `globals.css`.
4. **Icons: Phosphor only** (`@phosphor-icons/react`). Never hand-draw an
   icon. The only hand-built SVG allowed is the signal trace engine and the
   logo (`layout/Logo.tsx`, the original artwork paths), both already written.
5. **No scroll listeners.** Use Motion (`useScroll`, `useTransform`,
   `whileInView`) or IntersectionObserver. Continuous values never go through
   React state.
6. **Reduced motion:** every animation must collapse to static under
   `prefers-reduced-motion`. The primitives already do this; custom motion must
   check `useReducedMotion()`.
7. **Motion must be motivated.** Every animation answers one of: hierarchy,
   sequence, feedback or state change. No decorative loops other than the live
   signal traces, which are the brand.
8. **Mobile is designed, not collapsed.** Every multi-column layout states its
   below-768px layout explicitly. Test at 390px wide.
9. **Accessibility:** semantic landmarks and headings in order, visible focus,
   44px minimum touch targets, labels above inputs, AA contrast (already true
   for every token pairing).
10. **No eyebrows.** No small uppercase label, kicker, or short rule plus label
   above a heading, anywhere (the client reads it as AI slop). A heading
   stands on its own. Status pills that carry a real state are fine.
11. **Secondary links under a button** start on the same left edge as the
   button's label text, or sit beside the button.

## 2. Colour

From the logo specification: brand blue (the logo artwork's #3f86ce; nominal
#0080ff, Pantone Process Blue C) and brand black (#231f20).

| Token | Light | Dark | Use |
| --- | --- | --- | --- |
| `paper` | #f5f5f3 | #121011 | page background |
| `paper-2` | #ebebe8 | #181516 | quiet alternate band |
| `surface` | #fcfcfb | #1e1a1b | raised panels, cards, dialogs |
| `ink` | #231f20 | #f2f0ee | text (brand black) |
| `ink-2` | #4d4748 | #c4bebc | secondary emphasis, "to be confirmed" values |
| `muted` | #66605e | #a09997 | secondary text |
| `line`, `line-strong` | | | hairlines, borders |
| `deep`, `deep-2`, `deep-3` | #231f20 ... | #2a2526 ... | brand-black blocks, primary buttons, footer |
| `on-deep`, `on-deep-muted`, `on-deep-line` | | | text and lines on deep blocks |
| `signal` | #5a9be0 | #6aa7e8 | the accent on deep blocks (traces, buttons) |
| `signal-ink` | #2a6cb2 | #7fb4ec | accent for small text and lines on light |
| `signal-logo` | #3f86ce | #6aa7e8 | the exact logo blue: logo, large display type |

Blue is the colour of signal: traces, the write head, active states, map
pins, and the italic second line of two-part headlines (echoing NEURO and
GENIX in the logo). The exact logo blue is only 3.5:1 on paper, so it is used
for large type and graphics only; small text uses `signal-ink`.

Deep blocks: add the class `on-deep` to any deep container so focus rings and
the headline accent adapt. The logo keeps NEURO and the line through the brain
in brand blue everywhere; the rest is brand black on light grounds and white
on dark ones (`Wordmark` handles it).

## 3. Type

Instrument Sans for everything (it has a width axis and a true italic), DM Mono
for small instrument labels and numerals.

| Class | Use |
| --- | --- |
| `display-1` | page H1 only |
| `display-2` | section H2 |
| `display-3` | panel and dialog titles |
| `title-3` | card titles, H3 |
| `lede` | the paragraph directly under a section headline |
| `label` | mono uppercase caption for metadata only, never above a heading |
| `numeral` | mono tabular numerals (01, 02, 03) |
| `headline-soft` | italic second sentence of a two-sentence headline |

Headlines are stored as arrays of whole sentences, one sentence per entry.
Most are two sentences (`["Different tests.", "One clearer picture."]`).
Render them with `<SectionTitle lines={...} />`: first sentence plain, second
sentence the soft italic of the same family. Never a different typeface.

A one-sentence headline is a single entry (`["It’s okay to ask."]`) and is
set plain, wrapping on its own. Never split one sentence across entries to
force a break or to get the italic on its tail.

Display classes balance their lines (`text-wrap: balance`), so a short last
word does not sit alone.

Body copy: `text-muted`, `max-w-[60ch]` or tighter, 1rem to 1.125rem.

## 4. Shape, space, depth

- **Radius rule:** buttons, tabs and chips are full pills; surfaces (cards,
  panels, images, dialogs) use `rounded-surface` (24px, 18px below md); inputs
  use `rounded-[12px]`. Nothing else.
- Containers: `container-x` (1320px max, 20/32/48px gutters).
- Section rhythm: `section-y` (104px mobile, 144px desktop). Use it on every
  section unless the layout is deliberately full-bleed or follows a page intro.
- Prefer hairlines (`border-line`) and space over cards. A card exists only when
  elevation means something (a panel you act on, a brand-black feature block).
- Shadow: `shadow-soft` only, tinted, used rarely.

## 5. Motion grammar

One easing (`EASE = [0.22, 1, 0.36, 1]`, the CSS `ease-calm`), base duration
0.9s, slow 1.2s, stagger 0.08s.

| Primitive | Where it comes from | Use |
| --- | --- | --- |
| `Reveal` | `@/components/motion/primitives` | content rises 28px and fades in once |
| `RevealGroup` + `RevealItem` | same | staggered lists and grids |
| `MaskLines` / `SectionTitle` | same / `@/components/ui` | headline sentences slide out of masks |
| `ParallaxImage` | same | images unclip from a soft inset, then drift with scroll |
| `Magnetic` | same | primary CTAs lean toward the pointer (mouse only) |
| `SignalTrace` | `@/components/signal/SignalTrace` | the brand motif, see below |

Reduced motion changes timing, never structure. Keep the same `initial` and
target props on the server and on every client render, and under reduced
motion make the transition instant (`duration: 0`). Never drop `initial` or
`variants` once `useReducedMotion()` turns true after hydration: Motion then
leaves the server's hidden state in place and the content stays invisible.
The route template only animates client side navigations, so the first page
is painted straight from the server HTML.

Anchors: sections stop clear of the sticky header through
`scroll-margin-top` on everything in `main` and `footer` (globals.css). Do not
pass an offset to Lenis and do not add `scroll-padding` to `html`; Lenis
already reads the margin, and html padding makes focusing a header control
scroll the page.

Scroll-linked moments (pinning, stacking, filling a progress line) use Motion's
`useScroll({ target, offset })` + `useTransform` with CSS `position: sticky`.
GSAP is not used in this project.

Hover and press: buttons roll their label and nudge the icon (built in); links
draw an underline from the left (built in); press settles 1px.

## 6. The signal motif

The practice is about electrical signals, so the brand's one decorative device
is a real-looking trace, generated from physiology (`src/lib/signals.ts`):

- `eeg`: brain rhythm (hero, footer, EEG page)
- `ncs`: stimulus then compound response, distal then proximal (NCS)
- `emg`: motor unit potentials recruited as a muscle contracts (EMG)
- `calm`: slow quiet line

`<SignalTrace kind="eeg" mode="live" height={96} />`

- `mode="live"` sweeps like a monitor (only while on screen),
  `mode="draw"` draws once on entering view, `mode="still"` is static.
- `color` defaults to `var(--signal)`. On light backgrounds use
  `color="var(--signal-ink)"` or `color="var(--ink)"`.
- Use traces where a signal means something (a test, a transition between
  sections). Never as wallpaper behind text.

## 7. Building blocks (all in `src/components`)

- `ui`: `Button` (variants `primary`, `signal`, `outline`, `outline-light`;
  `href` or `onClick`; `icon` `arrow` | `external` | `download` | null),
  `BookButton` (opens the appointment dialog, optional `test`), `TextLink`
  (`tone` `ink` | `light`), `SmartLink` (internal links glide to same-page
  anchors), `SectionTitle`.
- `dialogs`: `useDialogs()` gives `openBooking(test?)`, `openGallery(index?)`,
  `openPrivacy()`. `Modal` + `CloseButton` are the only dialog shell.
- `layout`: header, footer, preview bar, smooth scroll (Lenis).

The single booking label everywhere is `site.bookLabel`
("Request an appointment"). Do not invent another label for the same intent.

## 8. Site map

**Every section has exactly one home.** The home page is the overview: it
links to the inner pages and never re-renders their sections. Do not copy a
section from an inner page onto the home page (or between inner pages) to
"fill it out"; link to it instead. Navigation (header, footer, menu) is built
from the one `nav` list in `site.ts`, so every menu lists the same pages in
the same order.

| Route | Sections, in order (id) |
| --- | --- |
| `/` | Hero, Focus statement, Services (`services`), A look inside (`look-inside`), Practice (`practice`) |
| `/your-visit` | Page intro, Patient guide (`patient-guide`), Fees (`fees`), Questions (`questions`) |
| `/for-doctors` | Page intro, Referral (`referring-doctors`) |
| `/our-team` | Page intro, Team (`clinical-team`) |
| `/locations` | Page intro, Locations (`locations`), Contact (`contact`) |
| `/tests/eeg`, `/tests/ncs`, `/tests/emg` | Test intro, preparation guide, after your test, before your visit |

The preparation guides live on the test pages. `/your-visit` shows a short
summary per test that hands over to each test page, so nothing is repeated.

### Home page

Layout families must not repeat.

| # | Section (id) | Layout family |
| --- | --- | --- |
| 1 | Hero | full-width type over a wide image, live EEG between |
| 2 | Focus statement | scroll-lit statement beside an EEG, NCS and EMG readout that wakes with its words |
| 3 | Services (`services`) | sticky stacking brand-black panels with live traces, each opening its test page |
| 4 | A look inside (`look-inside`) | full-bleed brand black, image expands on scroll |
| 5 | Practice (`practice`) | editorial text split with values, handing over to Your visit |

### Inner pages

Each opens with `PageIntro` (breadcrumb, H1, lede). The section directly
beneath it takes `labelledBy` (the page H1 id) and drops its own headline, so
the page never states its title twice.

| Page | Section | Layout family |
| --- | --- | --- |
| Your visit | Patient guide | test tabs with summaries + brand-black essentials card |
| Your visit | Fees | horizontal timeline drawn on scroll |
| Your visit | Questions | offset accordion |
| For doctors | Referral | sticky aside + steps with scroll-filled line |
| Our team | Team | editorial statement + awaiting-approval profile |
| Locations | Locations | themed Leaflet map with a practice list that flies the map, plus the detail panel |
| Locations | Contact | closing statement + info panel |

## 9. Verifying your work

- `npx tsc --noEmit -p .` and `npx eslint <your files>` must pass.
- Do not run `next build` while the dev server runs; it shares `.next`.
- Look at it: a headless screenshot helper exists (see the build brief), use it
  at 1440x900 and 390x844, in light and dark, before you call anything done.
