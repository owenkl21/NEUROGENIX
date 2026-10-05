# NEUROGENIX

The website for Neurogenix, a clinical neurophysiology practice offering EEG,
nerve conduction studies and EMG. It is written for two readers: patients
preparing for a test, and the clinicians who refer them.

This is the premium redesign of the approved wireframe. The content and page
structure match the wireframe exactly. The visual and motion language is new,
taken from the practice itself: a navy feature wall, brass signage and calm,
warm rooms.

## Pages

| Route | What it is |
| --- | --- |
| `/` | Home: services, referring doctors, team, the practice, patient guide, a look inside, questions, fees, locations, contact |
| `/tests/eeg` | Electroencephalography patient information |
| `/tests/ncs` | Nerve conduction studies patient information |
| `/tests/emg` | Electromyography patient information |

The home page also has an appointment request walkthrough (preview only,
nothing is sent), a photo gallery, a privacy notice and a printable patient
preparation guide.

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
- `src/components/sections`: one file per home page section.
- `src/components/test-page`: the test page template.
- `src/components/dialogs`: appointment request, gallery and privacy dialogs.
- `src/components/signal` and `src/lib/signals.ts`: the live signal trace,
  the brand's signature, generated from EEG, nerve conduction and EMG shapes.
- `docs/DESIGN.md`: the design system and the rules every component follows.

## Content status

Practice details (team, locations, contact details, fees, referral channel)
are marked "to be confirmed" in the wireframe and remain so here. The
appointment form is a demonstration only and does not send or store anything.
