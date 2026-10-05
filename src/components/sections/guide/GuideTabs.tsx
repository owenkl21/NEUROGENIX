"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { AnimatePresence, animate, motion, useInView, useMotionValue, useTransform, type AnimationPlaybackControls, type Variants } from "motion/react";
import { useReducedMotion } from "@/components/motion/useReducedMotion";
import { guides, patientGuide, services, testSlugs, type Guide, type TestSlug } from "@/content/site";
import { EASE } from "@/components/motion/primitives";
import { Button } from "@/components/ui";
import { SignalTrace } from "@/components/signal/SignalTrace";

/** Each test's own page holds its full preparation guide; the tab hands over to it. */
const testLink = Object.fromEntries(services.items.map((item) => [item.slug, item.link])) as Record<TestSlug, string>;

/**
 * Choose your test: a WAI-ARIA tab set with automatic activation. Each panel
 * is a short summary of the test (what it is and what it records) that hands
 * over to the test's own page, where the full preparation guide lives once.
 * A navy pill slides behind the chosen test, the outgoing summary lifts away,
 * the sheet eases to the new summary's height (so the page below never jumps)
 * and the incoming summary settles in while its own signal draws.
 */
export function GuideTabs() {
  const reduce = useReducedMotion() ?? false;
  const [active, setActive] = useState<TestSlug>(testSlugs[0]);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const last = testSlugs.length - 1;
    let next: number;
    switch (event.key) {
      case "ArrowRight":
        next = index === last ? 0 : index + 1;
        break;
      case "ArrowLeft":
        next = index === 0 ? last : index - 1;
        break;
      case "Home":
        next = 0;
        break;
      case "End":
        next = last;
        break;
      default:
        return;
    }
    event.preventDefault();
    setActive(testSlugs[next]);
    tabs.current[next]?.focus();
  };

  return (
    // From 1024px the panel stretches to the essentials card beside it, so both end on one line.
    <div className="flex flex-col lg:flex-1">
      {/* Fits one row at 390px; scrolls sideways only as a last resort. */}
      <div className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div
          role="tablist"
          aria-label={patientGuide.tabsLabel}
          className="flex w-full min-w-max rounded-full border border-line bg-surface p-1.5 sm:inline-flex sm:w-auto"
        >
          {testSlugs.map((slug, index) => {
            const selected = slug === active;
            return (
              <button
                key={slug}
                ref={(el) => {
                  tabs.current[index] = el;
                }}
                id={`tab-${slug}`}
                type="button"
                role="tab"
                aria-selected={selected}
                // Only the chosen panel is rendered, so only its tab may point at it.
                aria-controls={selected ? `guide-${slug}` : undefined}
                tabIndex={selected ? 0 : -1}
                onClick={() => setActive(slug)}
                onKeyDown={(event) => onKeyDown(event, index)}
                className={`relative h-11 flex-auto whitespace-nowrap rounded-full px-4 text-[0.9375rem] font-medium transition-colors duration-500 ease-calm sm:flex-none sm:px-6 ${
                  selected ? "text-on-navy dark:text-paper" : "text-muted hover:text-ink"
                }`}
              >
                {selected && (
                  <motion.span
                    layoutId="guide-tab-indicator"
                    aria-hidden="true"
                    className="absolute inset-0 rounded-full bg-navy dark:bg-ink"
                    transition={reduce ? { duration: 0 } : { duration: 0.55, ease: EASE }}
                  />
                )}
                <span className="relative">{guides[slug].tab}</span>
              </button>
            );
          })}
        </div>
      </div>

      <GuidePanel guide={guides[active]} reduce={reduce} />
    </div>
  );
}

/*
 * Reduced motion changes only timings, never what is rendered: useReducedMotion
 * already knows the preference on the first client render while the server
 * cannot, so any branch in the markup would break hydration.
 */
const INSTANT = { duration: 0 };
const FADE = { duration: 0.3, ease: EASE };

const sheetVariants = (reduce: boolean): Variants => ({
  enter: {},
  show: { transition: reduce ? INSTANT : { staggerChildren: 0.06 } },
  exit: { opacity: 0, y: -10, transition: reduce ? INSTANT : { duration: 0.24, ease: EASE } },
});

const partVariants = (reduce: boolean): Variants => ({
  enter: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: reduce ? INSTANT : { duration: 0.7, ease: EASE } },
});

const SHEET = { motion: sheetVariants(false), still: sheetVariants(true) };
const PART = { motion: partVariants(false), still: partVariants(true) };

function GuidePanel({ guide, reduce }: { guide: Guide; reduce: boolean }) {
  const inner = useRef<HTMLDivElement>(null);
  const switching = useRef(false);
  const shown = useRef(guide.slug);
  // -1 means "not measured yet", rendered as height: auto (also on the server).
  const measured = useMotionValue(-1);
  const height = useTransform(measured, (h) => (h < 0 ? "auto" : h));

  // A tab change arms the height animation; resizes and font swaps snap.
  useEffect(() => {
    if (shown.current === guide.slug) return;
    shown.current = guide.slug;
    switching.current = true;
    const t = window.setTimeout(() => (switching.current = false), 1400);
    return () => window.clearTimeout(t);
  }, [guide.slug]);

  useEffect(() => {
    const el = inner.current;
    if (!el) return;
    let running: AnimationPlaybackControls | undefined;
    const observer = new ResizeObserver(() => {
      const next = el.offsetHeight;
      // Zero means the page is hidden (printing, display: none); keep the last height.
      if (next === 0) return;
      running?.stop();
      if (reduce || !switching.current || measured.get() < 0) measured.jump(next);
      else running = animate(measured, next, { duration: 0.65, ease: EASE });
    });
    observer.observe(el);
    return () => {
      observer.disconnect();
      running?.stop();
    };
  }, [measured, reduce]);

  return (
    <div
      role="tabpanel"
      id={`guide-${guide.slug}`}
      aria-labelledby={`tab-${guide.slug}`}
      tabIndex={0}
      className="mt-5 flex flex-col rounded-surface border border-line bg-surface md:mt-6 lg:flex-1"
    >
      <motion.div style={{ height }} className="overflow-hidden">
        <div ref={inner} className="px-6 pt-8 sm:px-10 sm:pt-11 xl:px-12 xl:pt-12">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={guide.slug} variants={reduce ? SHEET.still : SHEET.motion} initial="enter" animate="show" exit="exit">
              <GuideContent guide={guide} reduce={reduce} />
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>

      {/*
       * The foot of the panel: the test's own signal, written like a recording
       * strip, then the way on to the full guide. From 1024px it rests on the
       * panel's bottom edge, level with the essentials card's button.
       */}
      <div className="mt-auto px-6 pb-7 sm:px-10 sm:pb-9 xl:px-12">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={guide.slug} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={reduce ? INSTANT : FADE}>
            <p className="label mt-10 text-brass-ink">{guide.meta}</p>
            <TraceWrite slug={guide.slug} reduce={reduce} />
          </motion.div>
        </AnimatePresence>
        <div className="mt-7 border-t border-line pt-7">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={guide.slug} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={reduce ? INSTANT : FADE}>
              <Button variant="outline" href={`/tests/${guide.slug}`}>
                {testLink[guide.slug]}
              </Button>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function GuideContent({ guide, reduce }: { guide: Guide; reduce: boolean }) {
  const v = reduce ? PART.still : PART.motion;
  return (
    <>
      <motion.h2 variants={v} className="display-3">
        {guide.title}
      </motion.h2>
      <motion.p variants={v} className="lede mt-6 max-w-[56ch] text-ink-2">
        {guide.intro}
      </motion.p>
    </>
  );
}

/**
 * The test's own signal, written left to right like a chart recorder each time
 * its tab opens. A still trace revealed by a clip keeps the full line exact
 * at any width.
 */
const HIDDEN = "inset(-20% 100% -20% 0%)";
const SHOWN = "inset(-20% 0% -20% 0%)";

function TraceWrite({ slug, reduce }: { slug: TestSlug; reduce: boolean }) {
  // Visibility is read from the unclipped wrapper: a fully clipped element
  // never counts as intersecting, so it could not trigger its own reveal.
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  return (
    <div ref={ref} className="mt-4">
      <motion.div
        initial={{ clipPath: HIDDEN }}
        animate={{ clipPath: inView ? SHOWN : HIDDEN }}
        transition={reduce ? INSTANT : { duration: 1.8, delay: 0.15, ease: [0.65, 0, 0.35, 1] }}
      >
        <SignalTrace kind={slug} mode="still" height={72} color="var(--brass-ink)" strokeWidth={1.25} />
      </motion.div>
    </div>
  );
}
