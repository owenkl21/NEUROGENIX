"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { AnimatePresence, animate, motion, useInView, useMotionValue, useTransform, type AnimationPlaybackControls, type Variants } from "motion/react";
import { useReducedMotion } from "@/components/motion/useReducedMotion";
import { CheckCircle, Info, Printer } from "@phosphor-icons/react";
import { guides, patientGuide, testSlugs, type Guide, type TestSlug } from "@/content/site";
import { EASE } from "@/components/motion/primitives";
import { SignalTrace } from "@/components/signal/SignalTrace";
import { printGuide } from "./printGuide";

/**
 * The test preparation guide: a WAI-ARIA tab set with automatic activation.
 * A navy pill slides behind the chosen test, the outgoing guide lifts away,
 * the sheet eases to the new guide's height (so the page below never jumps)
 * and the incoming guide settles in while its own signal draws.
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
    <div>
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
                aria-controls={`guide-${slug}`}
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
      className="@container mt-5 rounded-surface border border-line bg-surface md:mt-6"
    >
      <motion.div style={{ height }} className="overflow-hidden">
        <div ref={inner} className="px-6 pb-7 pt-8 sm:px-10 sm:pb-9 sm:pt-11 xl:px-12 xl:pt-12">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={guide.slug} variants={reduce ? SHEET.still : SHEET.motion} initial="enter" animate="show" exit="exit">
              <GuideContent guide={guide} reduce={reduce} />
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

/* Columns follow the sheet's own width (container queries), not the viewport,
   so the 528px sheet beside the card at 1024px stays a single column. */
function GuideContent({ guide, reduce }: { guide: Guide; reduce: boolean }) {
  const v = reduce ? PART.still : PART.motion;
  return (
    <>
      <motion.h3 variants={v} className="display-3">
        {guide.title}
      </motion.h3>

      <motion.div variants={v} className="mt-7">
        <p className="label text-brass-ink">{guide.meta}</p>
        <TraceWrite slug={guide.slug} reduce={reduce} />
      </motion.div>

      <motion.p variants={v} className="lede mt-7 max-w-[56ch] text-ink-2">
        {guide.intro}
      </motion.p>

      <motion.div variants={v} className="mt-11 grid gap-10 @2xl:grid-cols-2 @2xl:gap-12">
        <div>
          <h4 className="title-3">{patientGuide.beforeHeading}</h4>
          <ul className="mt-5 space-y-4">
            {guide.before.map((item) => (
              <li key={item} className="flex gap-3.5">
                <CheckCircle size={20} aria-hidden="true" className="mt-[0.18em] shrink-0 text-brass-ink" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="title-3">{patientGuide.duringHeading}</h4>
          <div className="mt-5 space-y-4 text-muted">
            {guide.during.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </motion.div>

      <motion.div variants={v} className="mt-11 flex flex-col gap-6 border-t border-line pt-7 @xl:flex-row @xl:items-center @xl:justify-between @xl:gap-10">
        <p className="flex max-w-[52ch] gap-3 text-[0.9375rem] leading-relaxed text-muted">
          <Info size={20} aria-hidden="true" className="mt-[0.12em] shrink-0 text-brass-ink" />
          <span>{guide.bottom}</span>
        </p>
        <PrintButton onClick={() => printGuide(guide)} />
      </motion.div>
    </>
  );
}

/**
 * The test's own signal, written left to right like a chart recorder each time
 * its guide opens. A still trace revealed by a clip keeps the full line exact
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
        <SignalTrace kind={slug} mode="still" height={44} color="var(--brass-ink)" strokeWidth={1.25} />
      </motion.div>
    </div>
  );
}

/** Mirrors the house outline Button (rolling label, icon disc) with a printer icon. */
function PrintButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative inline-flex h-12 shrink-0 items-center justify-center gap-3 self-start whitespace-nowrap rounded-full border border-line-strong pl-6 pr-2 text-[0.9375rem] font-medium text-ink transition-[border-color,transform] duration-300 ease-calm hover:border-ink active:translate-y-px @xl:self-auto"
    >
      <span className="relative block overflow-hidden leading-none">
        <span className="block py-1 transition-transform duration-500 ease-calm group-hover:-translate-y-full motion-reduce:group-hover:translate-y-0">
          {patientGuide.printLabel}
        </span>
        <span aria-hidden="true" className="absolute inset-0 block translate-y-full py-1 transition-transform duration-500 ease-calm group-hover:translate-y-0 motion-reduce:hidden">
          {patientGuide.printLabel}
        </span>
      </span>
      <span className="grid size-8 shrink-0 place-items-center rounded-full bg-ink/5 transition-transform duration-500 ease-calm group-hover:-translate-y-0.5 motion-reduce:group-hover:translate-y-0">
        <Printer size={16} aria-hidden="true" />
      </span>
    </button>
  );
}
