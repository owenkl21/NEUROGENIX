# NEUROGENIX

The website for Neurogenix, a clinical neurophysiology practice offering EEG,
nerve conduction studies and EMG. It is written for two readers: patients
preparing for a test, and the clinicians who refer them.

This is the premium redesign of the approved wireframe. The wireframe's copy
is kept word for word, reorganised from one long page into dedicated pages.
The visual and motion language is new, built on the practice's logo
specification: the NEUROGENIX logo, brand blue and brand black.

## Pages

| Route | What it is |
| --- | --- |
| `/` | Home: the overview. Hero, focus statement, the three tests, a look inside the practice, and the practice itself |
| `/your-visit` | Your visit: preparation by test, appointment essentials, fees and medical aid, common questions |
| `/for-doctors` | For referring doctors: referral steps, the draft referral form and open questions |
| `/our-team` | The clinical team (profiles awaiting practice approval) |
| `/locations` | Practice locations and how to take the next step |
| `/tests/eeg` | Electroencephalography patient information |
| `/tests/ncs` | Nerve conduction studies patient information |
| `/tests/emg` | Electromyography patient information |

Each section lives on exactly one page. The site also has an appointment
request walkthrough (preview only, nothing is sent), a photo gallery and a
privacy notice; each test page can be printed as a preparation guide.

## Stack

- Next.js 16 (App Router) with React 19 and TypeScript
- Tailwind CSS v4, with design tokens as CSS variables (light and dark)
- Motion for animation, Lenis for smooth scrolling
- Phosphor icons, Instrument Sans and DM Mono via `next/font`

## Getting started

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

```bash
npm run build      # production build
npm run lint       # eslint
STATIC_EXPORT=1 npm run build   # fully static site in ./out
```

## Where things live

- `src/content/site.ts`: every visible string. Edit copy here, not in components.
- `src/app/globals.css`: colour tokens, type scale and utilities.
- `src/components/sections`: one file per page section.
- `src/components/layout/PageIntro.tsx`: the shared opening of every inner page.
- `src/components/test-page`: the test page template.
- `src/components/dialogs`: appointment request, gallery and privacy dialogs.
- `src/components/signal` and `src/lib/signals.ts`: the live signal trace,
  the brand's signature, generated from EEG, nerve conduction and EMG shapes.
- `docs/DESIGN.md`: the design system and the rules every component follows.

## Content status

Practice details (team, locations, contact details, fees, referral channel)
are marked "to be confirmed" in the wireframe and remain so here. The
appointment form is a demonstration only and does not send or store anything.
