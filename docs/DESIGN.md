# Neurogenix design system

The site for Neurogenix, a clinical neurophysiology practice (EEG, nerve
conduction studies, EMG). Its readers are anxious patients preparing for a test
and the clinicians who refer them. The site has to feel calm, exact and
expensive, the way the practice itself looks: a deep navy feature wall, brass
signage, linen chairs, warm light.

**Design read:** a visual overhaul of an existing wireframe. Content and
information architecture are preserved exactly; the visual language is new.
Trust first, premium second, motion everywhere but never loud.

**Dials:** variance 6, motion 7, density 3.

## 1. Non-negotiables

1. **Copy comes only from `src/content/site.ts`.** Never retype, shorten or
   "improve" a string. If a component needs a string that is not there, add it
   to `site.ts` in the same register.
2. **Zero em dashes and zero en dashes** in anything a person reads, including
   alt text and aria labels. Use full stops, commas or brackets.
3. **Tokens only.** Colours come from the theme (`bg-paper`, `text-ink`,
   `bg-navy`, `text-brass-ink` ...). No raw hex in components. Dark mode then
   works automatically through the CSS variables in `globals.css`.
4. **Icons: Phosphor only** (`@phosphor-icons/react`). Never hand-draw an
   icon. The only hand-built SVG allowed is the signal trace engine and the
   wordmark mark, both already written.
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

## 2. Colour

| Token | Light | Use |
| --- | --- | --- |
| `paper` | #f1f1ec | page background (cool linen, not cream) |
| `paper-2` | #e7e8e2 | quiet alternate band |
| `surface` | #f9f9f6 | raised panels, cards, dialogs |
| `ink` | #12262f | text (navy-black) |
| `ink-2` | #3b5260 | soft italic second line of headlines |
| `muted` | #56656c | secondary text |
| `line`, `line-strong` | | hairlines, borders |
| `navy`, `navy-2`, `navy-3` | #132a35 ... | the brand blocks (feature wall) |
| `on-navy`, `on-navy-muted`, `on-navy-line` | | text and lines on navy |
| `brass` | #c4a56e | the single accent, on navy only |
| `brass-ink` | #77592b | brass for text and lines on light |

Brass has one job: it is the colour of signal (traces, the write head, active
states, small labels). It is never a large fill on light backgrounds, apart from
the brass button on navy.

Navy blocks: add the class `on-navy` to any navy container so focus rings and
soft headlines adapt.

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
| `label` | mono uppercase label (rationed, see eyebrows) |
| `numeral` | mono tabular numerals (01, 02, 03) |
| `headline-soft` | italic second sentence of a two-part headline |

Every section headline in the content is two sentences
(`["Different tests.", "One clearer picture."]`). Render them with
`<SectionTitle lines={...} />`: first sentence plain, second sentence the soft
italic of the same family. Never a different typeface.

Body copy: `text-muted`, `max-w-[60ch]` or tighter, 1rem to 1.125rem.

## 4. Shape, space, depth

- **Radius rule:** buttons, tabs and chips are full pills; surfaces (cards,
  panels, images, dialogs) use `rounded-surface` (24px, 18px below md); inputs
  use `rounded-[12px]`. Nothing else.
- Containers: `container-x` (1320px max, 20/32/48px gutters).
- Section rhythm: `section-y` (104px mobile, 144px desktop). Use it on every
  home section unless the layout is deliberately full-bleed.
- Prefer hairlines (`border-line`) and space over cards. A card exists only when
  elevation means something (a panel you act on, a navy feature block).
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
- `color` defaults to `var(--brass)`. On light backgrounds use
  `color="var(--brass-ink)"` or `color="var(--ink)"`.
- Use traces where a signal means something (a test, a transition between
  sections). Never as wallpaper behind text.

## 7. Building blocks (all in `src/components`)

- `ui`: `Button` (variants `primary`, `brass`, `outline`, `outline-light`;
  `href` or `onClick`; `icon` `arrow` | `external` | `download` | null),
  `BookButton` (opens the appointment dialog, optional `test`), `TextLink`
  (`tone` `ink` | `light`), `SmartLink` (internal links glide to same-page
  anchors), `Eyebrow`, `SectionTitle`.
- `dialogs`: `useDialogs()` gives `openBooking(test?)`, `openGallery(index?)`,
  `openPrivacy()`. `Modal` + `CloseButton` are the only dialog shell.
- `layout`: header, footer, preview bar, smooth scroll (Lenis).

The single booking label everywhere is `site.bookLabel`
("Request an appointment"). Do not invent another label for the same intent.

## 8. Home page plan

Layout families must not repeat. Eyebrows are rationed to four, never on
neighbouring sections.

| # | Section (id) | Layout family | Eyebrow |
| --- | --- | --- | --- |
| 1 | Hero | full-width type over a wide image, live EEG between | yes |
| 2 | Focus statement | scroll-lit statement | no (plain label) |
| 3 | Services (`services`) | sticky stacking navy panels with live traces | no |
| 4 | Referring doctors (`referring-doctors`) | sticky aside + steps with scroll-filled line | yes |
| 5 | Team (`clinical-team`) | editorial statement + awaiting-approval profile | no |
| 6 | Practice (`practice`) | image-led split with values | no |
| 7 | Patient guide (`patient-guide`) | tabs + sticky navy essentials card | yes |
| 8 | A look inside | full-bleed navy, image expands on scroll | no |
| 9 | Questions (`questions`) | offset accordion | no |
| 10 | Fees (`fees`) | horizontal timeline drawn on scroll | yes |
| 11 | Locations (`locations`) | wide image with overlapping detail panel | no |
| 12 | Contact (`contact`) | closing statement + info panel | no |

## 9. Verifying your work

- `npx tsc --noEmit -p .` and `npx eslint <your files>` must pass.
- Do not run `next build` while the dev server runs; it shares `.next`.
- Look at it: a headless screenshot helper exists (see the build brief), use it
  at 1440x900 and 390x844, in light and dark, before you call anything done.
