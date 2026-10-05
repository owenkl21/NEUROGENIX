"use client";

import { createRef, useMemo, type CSSProperties, type RefObject } from "react";
import { motion, useScroll, useTransform, type MotionStyle, type Variants } from "motion/react";
import { useLenis } from "lenis/react";
import { useReducedMotion } from "@/components/motion/useReducedMotion";
import { services } from "@/content/site";
import { DURATION, EASE, RevealGroup, RevealItem } from "@/components/motion/primitives";
import { TextLink } from "@/components/ui";
import { SignalTrace } from "@/components/signal/SignalTrace";

type Item = (typeof services.items)[number];
type Marker = RefObject<HTMLSpanElement | null>;

/*
 * Sticky geometry. Each panel parks 32px under the header, and every later
 * panel parks 20px lower than the one before, so the edges of the deck stay
 * visible. HEADER_H mirrors --header-h in globals.css.
 */
const HEADER_H = 72;
const PARK = 32;
const STEP_Y = 20;
const parkTop = (index: number) => HEADER_H + PARK + index * STEP_Y;

/*
 * Panel height. 78svh on ordinary screens, but never taller than the space
 * under the last panel's park line (with a little air below it), so on a short
 * laptop screen the whole parked deck still fits. 480px is the least the
 * panel's copy and readout need.
 */
const panelHeight = (count: number) => `clamp(480px, min(78svh, calc(100svh - ${parkTop(count - 1) + 24}px)), 720px)`;

/* How far a panel recedes for each panel laid over it. */
const SCALE_STEP = 0.035;
const DIM_FIRST = 0.5;
const DIM_SECOND = 0.22;

/* The navy steps so the stack reads as separate sheets. In dark mode navy-3
   is darker than the page itself, so the last sheet goes back to navy there:
   it still differs from the sheet it lands on, and never reads as a hole. */
const tones = ["bg-navy", "bg-navy-2", "bg-navy-3 dark:bg-navy"];

/*
 * The abbreviation rises out of a mask. Both variant sets share the same
 * hidden state so the server markup always matches the first client render;
 * under reduced motion the CSS keeps it in place and the change is instant.
 */
const abbrMask: Variants = { hidden: {}, show: {} };
const abbrRise: Variants = {
  hidden: { y: "105%" },
  show: { y: "0%", transition: { duration: DURATION.slow, ease: EASE, delay: 0.1 } },
};
const abbrStill: Variants = {
  hidden: { y: "105%" },
  show: { y: "0%", transition: { duration: 0 } },
};

/**
 * Three navy panels, one per test. On large screens with motion allowed they
 * are sticky: each one slides up over the last, and the panel underneath
 * steps back (scales down and dims) as it is covered. Progress is read from
 * invisible markers that sit where each panel would be without sticking, so
 * the measurement never moves with the sticky element itself.
 * Small screens and reduced motion get a plain stack with a gap.
 *
 * The list ends in an empty box one stack gap tall, so the last panel has
 * room to park too: the finished deck, all three edges showing, holds for a
 * beat before it leaves together.
 */
export function ServiceStack() {
  const items = services.items;
  const markers = useMemo<Marker[]>(() => items.map(() => createRef<HTMLSpanElement>()), [items]);

  return (
    <div className="relative [--stack-gap:28svh]" style={{ "--panel-h": panelHeight(items.length) } as CSSProperties}>
      {items.map((item, i) => (
        <span
          key={item.slug}
          ref={markers[i]}
          aria-hidden="true"
          className="pointer-events-none absolute left-0 h-px w-px"
          style={{ top: `calc(${i} * (var(--panel-h) + var(--stack-gap)))` }}
        />
      ))}
      <ol className="flex flex-col gap-4 sm:gap-6 lg:motion-safe:gap-(--stack-gap) lg:motion-safe:after:block lg:motion-safe:after:content-['']">
        {items.map((item, i) => (
          <ServicePanel key={item.slug} item={item} index={i} self={markers[i]} next={markers[i + 1]} after={markers[i + 2]} />
        ))}
      </ol>
    </div>
  );
}

/** 0 when the marked panel's top meets the bottom of the viewport, 1 once it has parked. */
function useArrival(target: Marker | undefined, index: number) {
  const { scrollYProgress } = useScroll({
    target,
    offset: ["start end", `start ${parkTop(index)}px` as `start ${number}px`],
  });
  return scrollYProgress;
}

function ServicePanel({ item, index, self, next, after }: { item: Item; index: number; self: Marker; next?: Marker; after?: Marker }) {
  const reduce = useReducedMotion();
  const lenis = useLenis();
  const titleId = `service-${item.slug}-title`;

  const covered = useArrival(next, index + 1);
  const buried = useArrival(after, index + 2);
  const hasNext = next ? 1 : 0;
  const hasAfter = after ? 1 : 0;
  const scale = useTransform(() => 1 - SCALE_STEP * (covered.get() * hasNext + buried.get() * hasAfter));
  const dim = useTransform(() => DIM_FIRST * covered.get() * hasNext + DIM_SECOND * buried.get() * hasAfter);

  /*
   * Keyboard users tabbing backwards could land on a link that a later panel
   * is covering. Bring the focused panel back to the moment it parked, where
   * nothing sits on top of it.
   */
  const onFocus = () => {
    if (reduce || !window.matchMedia("(min-width: 1024px)").matches) return;
    const marker = self.current;
    if (!marker) return;
    const target = marker.getBoundingClientRect().top + window.scrollY - parkTop(index);
    if (window.scrollY <= target + 2) return;
    if (lenis) lenis.scrollTo(target, { duration: 0.6 });
    else window.scrollTo({ top: target });
  };

  return (
    <li className="lg:motion-safe:sticky" style={{ top: `calc(var(--header-h) + ${PARK + index * STEP_Y}px)` }} onFocus={onFocus}>
      <motion.article
        aria-labelledby={titleId}
        className={`on-navy relative flex flex-col overflow-hidden rounded-surface border border-on-navy-line text-on-navy ${tones[index % tones.length]} p-6 sm:p-10 lg:grid lg:h-(--panel-h) lg:origin-top lg:grid-cols-12 lg:grid-rows-[auto_1fr_auto] lg:gap-x-8 lg:p-12 xl:px-14 lg:motion-safe:[scale:var(--deck-scale,1)]`}
        style={{ "--deck-scale": scale, "--deck-dim": dim } as MotionStyle}
      >
        {/* The tests are not a sequence, so the label is the type alone, led
            in by a short brass rule like the focus band's label. */}
        <p className="flex items-center gap-3 font-mono text-[0.8125rem] leading-none text-on-navy-muted lg:col-span-6 lg:col-start-1 lg:row-start-1">
          <span aria-hidden="true" className="h-px w-6 bg-brass" />
          {item.type}
        </p>

        <motion.span
          aria-hidden="true"
          className="mt-10 block select-none overflow-hidden lg:col-span-6 lg:col-start-7 lg:row-span-2 lg:row-start-1 lg:mt-0 lg:self-start lg:justify-self-end"
          variants={abbrMask}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.6 }}
        >
          <motion.span
            className="block whitespace-nowrap text-[6rem] font-medium leading-[0.8] tracking-[-0.02em] text-on-navy/[0.13] [font-variation-settings:'wdth'_75] sm:text-[7.5rem] lg:text-[clamp(7rem,min(16vw,26svh),15rem)] motion-reduce:transform-none!"
            variants={reduce ? abbrStill : abbrRise}
          >
            {item.abbr}
          </motion.span>
        </motion.span>

        {/* Both the gap above the title and the readout's height follow the
            panel's own height, so a short panel (a short laptop screen) gives
            up air first and its copy never runs under the readout. */}
        <RevealGroup className="mt-8 lg:col-span-6 lg:col-start-1 lg:row-start-2 lg:mt-0 lg:self-end lg:pt-[clamp(8px,calc(var(--panel-h)_-_510px),40px)]">
          <RevealItem>
            <h3 id={titleId} className="display-3 max-sm:text-[clamp(1.375rem,6.6vw,1.75rem)]">
              {item.name}
            </h3>
          </RevealItem>
          <RevealItem as="p" className="mt-4 max-w-[44ch] text-on-navy-muted">
            {item.body}
          </RevealItem>
          <RevealItem className="mt-5">
            <TextLink tone="light" href={`/tests/${item.slug}`} className="min-h-11">
              {item.link}
            </TextLink>
          </RevealItem>
        </RevealGroup>

        <div className="mt-8 h-24 lg:col-span-12 lg:row-start-3 lg:mt-10 lg:h-[clamp(96px,calc(var(--panel-h)_*_0.245),172px)]">
          <SignalTrace kind={item.slug} mode="live" height={96} baseline className="h-full!" />
        </div>

        <span aria-hidden="true" className="pointer-events-none absolute inset-0 bg-navy-3 opacity-0 lg:motion-safe:[opacity:var(--deck-dim,0)]" />
      </motion.article>
    </li>
  );
}
